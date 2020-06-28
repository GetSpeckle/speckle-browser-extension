import * as React from 'react'
import t from '../../services/i18n'
import Progress from './Progress'
import { IAppState } from '../../background/store/all'
import { withRouter, RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import { Message, List, Button, Icon, Form, Grid } from 'semantic-ui-react'
import { cancelAccountSetup, createAccount, unlockWallet } from '../../services/keyring-vault-proxy'
import {
  Button as StyledButton,
  ContentContainer,
  Section,
  BasicSection,
  TimerText
} from '../basic-components'
import { CREATE_PASSWORD_ROUTE, HOME_ROUTE, SELECT_CHAIN_ROUTE } from '../../constants/routes'
import { KeyringPair$Json } from '@polkadot/keyring/types'
import { setLocked, setCreated, setNewPhrase, setAccountName, setNewPassword } from '../../background/store/wallet'
import { setError } from '../../background/store/error'
import { saveSettings } from '../../background/store/settings'
import { colorSchemes } from '../styles/themes'
import { parseTimeLeft } from '../../constants/utils'

interface IConfirmPhraseProps extends StateProps, DispatchProps, RouteComponentProps {}

interface IConfirmPhraseState {
  candidateList: Array<string>
  confirmList: Array<string>
  keyringPair: KeyringPair$Json | null
  isCancelled: boolean
  isConfirming: boolean
}

type ListType = 'candidateList' | 'confirmList'

class ConfirmPhrase extends React.Component<IConfirmPhraseProps, IConfirmPhraseState> {

  state: IConfirmPhraseState = {
    candidateList: [],
    confirmList: [],
    keyringPair: null,
    isCancelled: false,
    isConfirming: false
  }

  componentDidMount () {
    // split the new phrase to be a list
    if (this.props.wallet.newPhrase) {
      this.setState({ candidateList: this.shuffle(this.props.wallet.newPhrase.split(/\s+/)) })
    }
  }

  componentDidUpdate (prevProps) {
    // Check for timer expiry and skip if the user is trying to create account
    if (
      !this.state.isConfirming &&
      this.props.wallet.accountSetupTimeout === 0 &&
      prevProps.wallet.accountSetupTimeout !== 0
    ) {
      // Clear wallet state defaults
      this.props.setNewPassword('')
      this.props.setNewPhrase('')
      this.props.setAccountName('')

      // If wallet is created, redirect to Dashboard. If not, Create Password page
      if (this.props.wallet.created) {
        this.props.history.push(HOME_ROUTE)
      } else {
        this.props.history.push({
          pathname: CREATE_PASSWORD_ROUTE,
          state: { error: this.state.isCancelled ? null : 'Account creation timer has elapsed' }
        })
      }
    }
  }

  /**
   * Shuffles array in place.
   * @param {Array} a items An array containing the items.
   */
  private shuffle = (a: Array<string>): Array<string> => {
    let i
    for (i = a.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1))
      let x = a[i]
      a[i] = a[j]
      a[j] = x
    }
    return a
  }

  isPhraseConfirmed = (): boolean => {
    return !!this.props.wallet && !!this.props.wallet.newPhrase
        && this.props.wallet.newPhrase === this.state.confirmList.join(' ')
  }

  createAccount = (phrase: string, name?: string | undefined) => {
    // tslint:disable-next-line:max-line-length
    const { wallet, saveSettings, settings, setNewPhrase, setCreated, setError, setAccountName } = this.props

    createAccount(phrase, name).then(keyringPair => {
      this.setState({ keyringPair })
      // use new created account as the selected account
      saveSettings(
        { ...settings, selectedAccount:
            { name: keyringPair.meta.name as string, address: keyringPair.address }
        }
      )
      setNewPhrase('')
      setAccountName('')
      if (!wallet.created) {
        setCreated(true)
      }
    }).catch(err => {
      setError(err)
    })
  }

  create = () => {
    const { wallet, setError, setLocked } = this.props
    setError(null)

    if (!wallet.newPhrase) {
      setError(t('passwordError'))
      return
    }

    // add a new account using the same pass
    if (!wallet.locked && wallet.created) {
      this.setState({ isConfirming: true }, () => {
        this.createAccount(wallet.newPhrase as string, wallet.newAccountName)
      })
      return
    }

    // create wallet with the first account
    unlockWallet(wallet.newPassword!!).then(kp => {
      // update redux store state
      setLocked(false)
      console.assert(kp.length === 0, 'Should be an empty array')
      if (wallet.newPhrase) {
        this.setState({ isConfirming: true }, () => {
          this.createAccount(wallet.newPhrase as string, wallet.newAccountName)
        })
      }
    }).catch(err => {
      setError(err)
      this.setState({ isConfirming: false })
    })
  }

  downloadKeyPair = () => {
    let element = document.createElement('a')
    element.setAttribute('href',
        'data:text/plain;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(this.state.keyringPair)))
    element.setAttribute('download', 'key-pair.json')

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()
    document.body.removeChild(element)
  }

  handleCancel = () => {
    this.setState({ isCancelled: true }, () => cancelAccountSetup())
  }

  handleClick = () => {
    this.props.history.push(SELECT_CHAIN_ROUTE)
  }

  render () {
    return (
      <div>
        <Progress step={2} />

        {this.state.keyringPair ? this.renderBackupScreen() : this.renderConfirmScreen()}

      </div>
    )
  }

  renderConfirmScreen () {
    const confirmListItems = this.state.confirmList.map((item, index) =>
      this.renderItem('confirmList', item, index))
    const candidateListItems = this.state.candidateList.map((item, index) =>
      this.renderItem('candidateList', item, index))
    const { accountSetupTimeout } = this.props.wallet

    return(
      <ContentContainer>
        <Form>
          <BasicSection>
            <div className='custom-label'>{t('phraseConfirmTitle')}</div>
            <List horizontal={true} className='confirm-list'>
              {confirmListItems}
            </List>
          </BasicSection>

          <BasicSection>
            <List horizontal={true} className='candidate-list'>
              {candidateListItems}
            </List>
          </BasicSection>

          <Message negative={true} hidden={this.isPhraseConfirmed()}>
            {t('phraseMismatch')}
          </Message>

          <Grid columns='equal'>
            <Grid.Column>
              <Button fluid={true} onClick={this.handleCancel}>Cancel</Button>
            </Grid.Column>
            <Grid.Column>
              <StyledButton onClick={this.create} disabled={!this.isPhraseConfirmed()}>
                {t('confirmPhraseButton')}
              </StyledButton>
            </Grid.Column>
          </Grid>
        </Form>
        {/* tslint:disable-next-line:max-line-length */}
        {accountSetupTimeout > 0 && <TimerText>{parseTimeLeft(accountSetupTimeout)} left</TimerText>}
      </ContentContainer>
    )
  }

  renderItem (type: ListType, item: string, index: number) {
    const itemStyle = {
      backgroundColor: colorSchemes[this.props.settings.color].backgroundColor,
      color: 'white'
    }

    return(
      <List.Item key={index}>
        <Button onClick={this.handleClickItem.bind(this, type, index)} style={itemStyle}>
          {item}
        </Button>
      </List.Item>
    )
  }

  handleClickItem = (type: ListType, index: number) => {
    const fromList = this.state[type]
    const toType: ListType = type === 'candidateList' ? 'confirmList' : 'candidateList'
    const toList = this.state[toType]
    const newFromList = fromList.slice(0, index).concat(fromList.slice(index + 1, fromList.length))
    const newToList = [...toList, fromList[index]]
    if (type === 'candidateList') {
      this.setState({ candidateList: newFromList, confirmList: newToList })
    } else {
      this.setState({ confirmList: newFromList, candidateList: newToList })
    }
  }

  renderBackupScreen () {
    const { color } = this.props.settings
    const proceedButtonStyle = {
      backgroundColor: colorSchemes[color].backgroundColor,
      color: 'white'
    }
    return(
      <ContentContainer>
        <Section>
          <Message info={true} color={color}>
            {t('backupKeypairMessage')}
          </Message>
        </Section>

        <Section>
          <Button onClick={this.downloadKeyPair} fluid={true}>
            <Icon name='download' />
            {t('downloadKeyPairButton')}
          </Button>
        </Section>

        <Section>
          <Button onClick={this.handleClick} style={proceedButtonStyle} fluid={true}>
            <Icon name='play' />
            {t('proceedButton')}
          </Button>
        </Section>
      </ContentContainer>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings,
    wallet: state.wallet
  }
}

const mapDispatchToProps = {
  saveSettings,
  setLocked,
  setCreated,
  setError,
  setNewPhrase,
  setAccountName,
  setNewPassword
}

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ConfirmPhrase))

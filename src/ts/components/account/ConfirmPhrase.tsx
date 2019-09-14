import * as React from 'react'
import t from '../../services/i18n'
import Progress from './Progress'
import { IAppState } from '../../background/store/all'
import { withRouter, RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import { Message, List, Button, Icon, Form } from 'semantic-ui-react'
import { createAccount, unlockWallet } from '../../services/keyring-vault-proxy'
import {
  Button as StyledButton,
  ContentContainer,
  Section,
  BasicSection
} from '../basic-components'
import { SELECT_NETWORK_ROUTE } from '../../constants/routes'
import { KeyringPair$Json } from '@polkadot/keyring/types'
import { setLocked, setCreated, setNewPhrase } from '../../background/store/wallet'
import { setError } from '../../background/store/error'
import { saveSettings } from '../../background/store/settings'
import { colorSchemes } from '../styles/themes'

interface IConfirmPhraseProps extends StateProps, DispatchProps, RouteComponentProps {}

interface IConfirmPhraseState {
  candidateList: Array<string>
  confirmList: Array<string>
  keyringPair: KeyringPair$Json | null
}

type ListType = 'candidateList' | 'confirmList'

class ConfirmPhrase extends React.Component<IConfirmPhraseProps, IConfirmPhraseState> {

  state: IConfirmPhraseState = {
    candidateList: [],
    confirmList: [],
    keyringPair: null
  }

  componentDidMount () {
    // split the new phrase to be a list
    if (this.props.wallet.newPhrase) {
      this.setState({ candidateList: this.shuffle(this.props.wallet.newPhrase.split(/\s+/)) })
    }
  }

  /**
   * Shuffles array in place.
   * @param {Array} a items An array containing the items.
   */
  private shuffle = (a: Array<string>): Array<string> => {
    let i = 0
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

  createAccount = (phrase: string, name?: string) => {
    const { wallet, saveSettings, settings, setNewPhrase, setCreated, setError } = this.props
    createAccount(phrase, name).then(keyringPair => {
      this.setState({ keyringPair })
      // use new created account as the selected account
      saveSettings(
        { ...settings, selectedAccount:
            { name: keyringPair.meta.name, address: keyringPair.address }
        }
      )
      setNewPhrase('', '')
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
      this.createAccount(wallet.newPhrase, wallet.newAccountName)
      return
    }

    // create wallet with the first account
    unlockWallet(wallet.newPassword!!).then(kp => {
      // update redux store state
      setLocked(false)
      console.assert(kp.length === 0, 'Should be an empty array')
      if (wallet.newPhrase) {
        this.createAccount(wallet.newPhrase, wallet.newAccountName)
      }
    }).catch(err => { setError(err) })
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

  handleClick = () => {
    this.props.history.push(SELECT_NETWORK_ROUTE)
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
          <Section>
            <StyledButton onClick={this.create} disabled={!this.isPhraseConfirmed()}>
              {t('confirmPhraseButton')}
            </StyledButton>
          </Section>
        </Form>
      </ContentContainer>
    )
  }

  renderItem (type: ListType, item: string, index: number) {
    const itemStyle = {
      backgroundColor: colorSchemes[this.props.settings.color].backgroundColor,
      color: 'white'
    }

    return(
      <List.Item>
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
    return(
      <ContentContainer>
        <Section>
          <Message info={true}>
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
          <Button onClick={this.handleClick} primary={true} fluid={true}>
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

const mapDispatchToProps = { saveSettings, setLocked, setCreated, setError, setNewPhrase }

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ConfirmPhrase))

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
  Section
} from '../basic-components'
import { HOME_ROUTE } from '../../constants/routes'
import { KeyringPair$Json } from '@polkadot/keyring/types'
import { setLocked, setCreated, setNewPhrase } from '../../background/store/wallet'
import { setError } from '../../background/store/error'
import { saveSettings } from '../../background/store/settings'

interface IConfirmPhraseProps extends StateProps, DispatchProps, RouteComponentProps {}

interface IConfirmPhraseState {
  inputPhrase: string,
  wordList: Array<string>,
  confirmList: Array<string>,
  keyringPair: KeyringPair$Json | null
}

type ListType = 'candidate' | 'confirm'

class ConfirmPhrase extends React.Component<IConfirmPhraseProps, IConfirmPhraseState> {

  state: IConfirmPhraseState = {
    inputPhrase: '',
    wordList: [],
    confirmList: [],
    keyringPair: null
  }

  componentDidMount () {
    // split the new phrase to be a list
    if (this.props.wallet.newPhrase) {
      this.setState({ wordList: this.shuffle(this.props.wallet.newPhrase.split(/\s+/)) })
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

  changePhrase = event => {
    const val = event.target.value
    let formatted = val.trim().split(/\s+/).join(' ')
    if (val.endsWith(' ')) {
      formatted = formatted + ' '
    }
    this.setState({ inputPhrase: formatted })
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

  gotoDashboard = () => {
    this.props.history.push(HOME_ROUTE)
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
    return(
      <ContentContainer>
        <Form>
          <Form.TextArea
            className='mnemonic'
            label={t('phraseConfirmTitle')}
            value={this.state.inputPhrase}
            onChange={this.changePhrase}
          />

          <Section>
            <List horizontal={true}>
              {this.state.confirmList.map((item, index) => this.renderItem('confirm', item, index))}
            </List>
          </Section>

          <Section>
            <List horizontal={true}>
              {this.state.wordList.map((item, index) => this.renderItem('candidate', item, index))}
            </List>
          </Section>
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
    return(
      <List.Item>
        <Button onClick={this.handleClickItem.bind(this, type, index)}>{item}</Button>
      </List.Item>
    )
  }

  handleClickItem = (type: ListType, index: number) => {
    if (type === 'candidate') {
      const wordList = this.state.wordList
      const newList = wordList.slice(0, index).concat(wordList.slice(index + 1, wordList.length))
      this.setState({ wordList: newList })
    } else if (type === 'confirm') {
      const wordList = this.state.confirmList
      const newList = wordList.slice(0, index).concat(wordList.slice(index + 1, wordList.length))
      this.setState({ confirmList: newList })
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
          <Button onClick={this.gotoDashboard} primary={true} fluid={true}>
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

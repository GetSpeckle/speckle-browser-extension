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
  keyringPair: KeyringPair$Json | null
}

class ConfirmPhrase extends React.Component<IConfirmPhraseProps, IConfirmPhraseState> {

  state: IConfirmPhraseState = {
    inputPhrase: '',
    wordList: [],
    keyringPair: null
  }

  componentDidMount () {
    // split the new phrase to be a list
    if (this.props.wallet.newPhrase) {
      this.setState({ wordList: this.props.wallet.newPhrase.split(/\s+/) })
    }
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
        && this.props.wallet.newPhrase === this.state.inputPhrase
  }

  createAccount = (phrase: string, name?: string) => {
    createAccount(phrase, name).then(keyringPair => {
      this.setState({ keyringPair })
      // use new created account as the selected account
      this.props.saveSettings(
        { ...this.props.settings, selectedAccount:
            { name: keyringPair.meta.name, address: keyringPair.address }
        }
      )
      this.props.setNewPhrase('', '')
    }).catch(err => {
      this.props.setError(err)
    })
  }

  create = () => {
    this.props.setError(null)
    const { wallet } = this.props
    // add a new wallet using the same pass
    if (!wallet.locked && wallet.created) {
      if (wallet.newPhrase) {
        this.createAccount(wallet.newPhrase, wallet.newAccountName)
      }
    }
    if (wallet.newPassword) {
      unlockWallet(wallet.newPassword).then(kp => {
        // update redux store state
        this.props.setLocked(false)
        console.assert(kp.length === 0, 'Should be an empty array')
        if (wallet.newPhrase) {
          this.createAccount(wallet.newPhrase, wallet.newAccountName)
        }
      }).catch(err => { this.props.setError(err) })
    }
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
        <Progress color={this.props.settings.color} progress={2} />

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
            <List horizontal={true} items={this.state.wordList} />
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

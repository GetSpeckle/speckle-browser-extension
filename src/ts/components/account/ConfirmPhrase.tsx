import * as React from 'react'
import t from '../../services/i18n'
import Progress from './Progress'
import { IAppState } from '../../background/store/all'
import { withRouter, RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import { Message, List, Button, Icon } from 'semantic-ui-react'
import { createAccount, unlockWallet } from '../../services/keyring-vault-proxy'
import { Button as StyledButton, Section, MnemonicPad } from '../basic-components'
import { HOME_ROUTE } from '../../constants/routes'
import { KeyringPair$Json } from '@polkadot/keyring/types'
import { setLocked, setCreated } from '../../background/store/account'
import { setError } from '../../background/store/error'

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

  constructor (props) {
    super(props)
  }

  componentDidMount () {
    // split the new phrase to be a list
    if (this.props.accountStatus.newPhrase) {
      this.setState({ wordList: this.props.accountStatus.newPhrase.split(/\s+/) })
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
    return !!this.props.accountStatus && !!this.props.accountStatus.newPhrase
        && this.props.accountStatus.newPhrase === this.state.inputPhrase
  }

  createAccount = () => {
    this.props.setError(null)
    const { accountStatus } = this.props
    if (accountStatus.newPassword) {
      unlockWallet(accountStatus.newPassword).then(kp => {
        console.log('wallet unlocked')
        // update redux store state
        this.props.setLocked(false)
        console.assert(kp.length === 0, 'Should be an empty array')
        if (accountStatus.newPhrase) {
          createAccount(accountStatus.newPhrase, '').then(keyringPair => {
            console.log('Account created! ', keyringPair)
            this.props.setCreated(true)
            this.setState({ keyringPair: keyringPair })
          }).catch(err => { this.props.setError(err) })
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
      <div>
        <Section>
          <div>{t('phraseConfirmTitle')}</div>
          <MnemonicPad value={this.state.inputPhrase} onChange={this.changePhrase}/>
        </Section>

        <Section>
          <List horizontal={true} items={this.state.wordList} />
        </Section>

        <Message negative={true} hidden={this.isPhraseConfirmed()} style={alignMiddle}>
          {t('phraseMismatch')}
        </Message>

        <Section>
          <StyledButton
            onClick={this.createAccount}
            disabled={!this.isPhraseConfirmed()}
          >
            {t('confirmPhraseButton')}
          </StyledButton>
        </Section>
      </div>
    )
  }

  renderBackupScreen () {
    return(
      <div>
        <Message info={true} style={alignMiddle}>
          {t('backupKeypairMessage')}
        </Message>

        <Section>
          <Button onClick={this.downloadKeyPair}>
            <Icon name='download' />
            {t('downloadKeyPairButton')}
          </Button>
        </Section>

        <Section>
          <Button onClick={this.gotoDashboard} primary={true}>
            <Icon name='play' />
            {t('proceedButton')}
          </Button>
        </Section>
      </div>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings,
    accountStatus: state.account
  }
}

const alignMiddle = {
  width: 311,
  margin: 'auto'
}

const mapDispatchToProps = { setLocked, setCreated, setError }

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ConfirmPhrase))

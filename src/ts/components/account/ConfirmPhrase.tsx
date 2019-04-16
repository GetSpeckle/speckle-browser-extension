import * as React from 'react'
import styled from 'styled-components'
import t from '../../services/i18n'
import Progress from './Progress'
import { IAppState } from '../../background/store/all'
import { withRouter, RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import { Message, List, Button, Icon } from 'semantic-ui-react'
import { createAccount, unlockWallet } from '../../services/keyring-vault-proxy'
import { DEFAULT_ROUTE } from '../../constants/routes'
import { KeyringPair$Json } from '@polkadot/keyring/types'
import { setLocked, setCreated } from '../../background/store/account'

interface IConfirmPhraseProps extends StateProps, DispatchProps, RouteComponentProps {}

interface IConfirmPhraseState {
  inputPhrase: string,
  wordList: Array<string>,
  keyringPair: KeyringPair$Json | null,
  errorMessage: string
}

class ConfirmPhrase extends React.Component<IConfirmPhraseProps, IConfirmPhraseState> {

  state: IConfirmPhraseState = {
    inputPhrase: '',
    wordList: [],
    keyringPair: null,
    errorMessage: ''
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
    this.setState({ errorMessage: '' })
    const { accountStatus } = this.props
    if (accountStatus.newPassword) {
      unlockWallet(accountStatus.newPassword).then (kp => {
        console.log('wallet unlocked')
        // update redux store state
        this.props.setLocked(false)
        console.assert(kp.length==0, 'Should be an empty array')
        if (accountStatus.newPhrase) {
          createAccount(accountStatus.newPhrase, '').then(keyringPair => {
            console.log('Account created! ', keyringPair)
            this.props.setCreated(true)
            this.setState({ keyringPair: keyringPair })
          })
        }
      })
    }
  }

  downloadKeyPair = () => {
    var element = document.createElement('a');
    element.setAttribute('href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.state.keyringPair)))
    element.setAttribute('download', 'key-pair.json')

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()
    document.body.removeChild(element)
  }

  gotoDashboard = () => {
    this.props.history.push(DEFAULT_ROUTE)
  }

  render () {
    return (
      <div>
        <Progress color={this.props.settings.color} progress={2} />

        {this.state.keyringPair ? this.renderBackupScreen() : this.renderConfirmScreen()}

      </div>
    )
  }

  renderConfirmScreen() {
    return(
      <div>
        <Text>
          <div>{t('phraseConfirmTitle')}</div>
          <MnemonicPad value={this.state.inputPhrase} onChange={this.changePhrase}/>
        </Text>

        <Text>
          <List horizontal={true} items={this.state.wordList} />
        </Text>

        <Message negative={true} hidden={!this.state.errorMessage} style={alignMiddle}>
          {this.state.errorMessage}
        </Message>

        <Text>
          <StyledButton onClick={this.createAccount} disabled={!this.isPhraseConfirmed()}>
            {t('confirmPhraseButton')}
          </StyledButton>
        </Text>
      </div>
    )
  }

  renderBackupScreen() {
    return(
      <div>
        <Message info={true} style={alignMiddle}>
          {t('backupKeypairMessage')}
        </Message>

        <Text>
          <Button onClick={this.downloadKeyPair}>
            <Icon name='download' />
            {t('downloadKeyPairButton')}
          </Button>
        </Text>

        <Text>
          <Button onClick={this.gotoDashboard} primary>
            <Icon name='play' />
            {t('proceedButton')}
          </Button>
        </Text>


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

const mapDispatchToProps = { setLocked, setCreated }


type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

const Text = styled.div`
    width: 327px;
    margin:18px auto;
    opacity: 0.6;
    font-family: Nunito;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #3e5860;
`
const MnemonicPad = styled.textarea`
  width: 311px;
  height: 125px;
  font-family: Nunito;
  padding: 10px;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.57;
  letter-spacing: normal;
  color: #30383b;
`
const StyledButton = styled.button`
  width: 311px;
  height: 45px;
  border-radius: 4px;
  box-shadow: 0 3px 10px 0 rgba(72, 178, 228, 0.21);
  background-color: #24b6e8;
  font-family: Nunito;
  font-size: 16px;
  font-weight: 800;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.31;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
`
const alignMiddle = {
  width: 311,
  margin: 'auto'
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ConfirmPhrase))

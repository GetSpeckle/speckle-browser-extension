import * as React from 'react'
import styled from 'styled-components'
import t from '../../services/i18n'
import Progress from './Progress'
import { IAppState } from '../../background/store/all'
import { withRouter, RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import { Message, List } from 'semantic-ui-react'
import { createAccount } from '../../services/keyring-vault-proxy'
import { DEFAULT_ROUTE } from '../../constants/routes'
import { Button } from '../basic-components'

interface IConfirmPhraseProps extends StateProps, RouteComponentProps {}

interface IConfirmPhraseState {
  inputPhrase: string,
  wordList: Array<string>,
  errorMessage?: string
}

class ConfirmPhrase extends React.Component<IConfirmPhraseProps, IConfirmPhraseState> {

  state: IConfirmPhraseState = {
    inputPhrase: '',
    wordList: []
  }

  constructor (props) {
    super(props)
    this.changePhrase = this.changePhrase.bind(this)
    this.isPhraseConfirmed = this.isPhraseConfirmed.bind(this)
    this.createAccount = this.createAccount.bind(this)
  }

  componentDidMount () {
    // split the new phrase to be a list
    if (this.props.accountStatus.newPhrase) {
      this.setState({ wordList: this.props.accountStatus.newPhrase.split(/\s+/) })
    }
  }

  changePhrase (event) {
    const val = event.target.value
    let formatted = val.trim().split(/\s+/).join(' ')
    if (val.endsWith(' ')) {
      formatted = formatted + ' '
    }
    this.setState({ inputPhrase: formatted })
  }

  isPhraseConfirmed (): boolean {
    return !!this.props.accountStatus && !!this.props.accountStatus.newPhrase
        && this.props.accountStatus.newPhrase === this.state.inputPhrase
  }

  createAccount () {
    this.setState({ errorMessage: '' })
    if (this.props.accountStatus.newPhrase) {
      createAccount(this.props.accountStatus.newPhrase, '').then(keyringPair => {
        console.log('Account created! ', keyringPair)
        this.props.history.push(DEFAULT_ROUTE)
      })
    }
  }

  render () {
    return (
        <div>
          <Progress color={this.props.settings.color} progress={2} />

          <Text>
            <div>{t('phraseConfirmTitle')}</div>
            <MnemonicPad value={this.state.inputPhrase} onChange={this.changePhrase}/>
          </Text>

          <Text>
            <List horizontal={true} items={this.state.wordList} />
          </Text>

          <Message negative={true} hidden={!this.state.errorMessage} style={error}>
            {this.state.errorMessage}
          </Message>

          <Text>
            <Button onClick={this.createAccount} disabled={!this.isPhraseConfirmed()}>
              {t('confirmPhraseButton')}
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

type StateProps = ReturnType<typeof mapStateToProps>

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
const error = {
  width: 311,
  margin: 'auto'
}

export default withRouter(connect(mapStateToProps)(ConfirmPhrase))

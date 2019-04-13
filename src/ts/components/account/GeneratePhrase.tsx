import * as React from 'react'
import styled from 'styled-components'
import t from '../../services/i18n'
import Progress from './Progress'
import { IAppState } from '../../background/store/all'
import { withRouter, RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import { Message } from 'semantic-ui-react'
import { generateMnemonic } from '../../services/keyring-vault-proxy'
import { setNewPhrase } from '../../background/store/account'
import { CONFIRM_PHRASE_ROUTE } from '../../constants/routes';

interface IGeneratePhraseProps extends StateProps, DispatchProps, RouteComponentProps {}

interface IGeneratePhraseState {
  mnemonic: string,
  errorMessage?: string
}

class GeneratePhrase extends React.Component<IGeneratePhraseProps, IGeneratePhraseState> {

  state: IGeneratePhraseState = {
    mnemonic: ''
  }

  constructor(props) {
    super(props)

    this.selectAll = this.selectAll.bind(this)
    this.handleClick = this.handleClick.bind(this)

    // generate the mnemonic
    generateMnemonic().then(phrase => {
      this.setState({mnemonic: phrase})
    })
  }

  handleClick () {
    this.setState({errorMessage: ''})
    this.props.setNewPhrase(this.state.mnemonic)
    this.props.history.push(CONFIRM_PHRASE_ROUTE)
  }

  selectAll (event) {
    event.target.select()
  }

  render () {
    return (
        <div>
          <Progress color={this.props.settings.color} progress={2} />
          <Text>
            {t('phraseDescription')}
          </Text>

          <Text>
            <div>{t('phraseTitle')}</div>
            <MnemonicPad value={this.state.mnemonic} readOnly onClick={this.selectAll}/>
          </Text>

          <Message negative hidden={!this.state.errorMessage} style={error}>
            {this.state.errorMessage}
          </Message>

          <Text>
            <StyledButton onClick={this.handleClick}>
              {t('Create Account')}
            </StyledButton>
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

const mapDispatchToProps = { setNewPhrase }

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
const error = {
  width: 311,
  margin: 'auto'
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GeneratePhrase))

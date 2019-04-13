import * as React from 'react'
import styled from 'styled-components'
import t from '../../services/i18n'
import Progress from './Progress'
import { IAppState } from '../../background/store/all'
import { withRouter, RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import { Message } from 'semantic-ui-react'
import { unlockWallet } from '../../services/keyring-vault-proxy';
import { GENERATE_PHRASE_ROUTE } from '../../constants/routes';
import { setLocked } from '../../background/store/account'

interface ICreatePasswordProps extends StateProps, DispatchProps, RouteComponentProps {}

interface ICreatePasswordState {
  newPassword: string,
  confirmPassword: string,
  errorMessage?: string
}

class CreatePassword extends React.Component<ICreatePasswordProps, ICreatePasswordState> {

  state: ICreatePasswordState = {
    newPassword: '',
    confirmPassword: ''
  }

  handleClick () {
    this.setState({errorMessage: ''})

    if (this.state.newPassword !== this.state.confirmPassword) {
      this.setState({errorMessage: t('Password mismatch')})
      return
    }
    if (this.state.newPassword.length<8) {
      this.setState({errorMessage: t('Password minimum length is 8')})
      return
    }

    unlockWallet(this.state.newPassword).then(
      keyringPairs => {
        console.log('Should have empty keyring pairs ', keyringPairs)
        this.props.setLocked(false)
        this.props.history.push(GENERATE_PHRASE_ROUTE)

      }
    )
  }

  render () {
    return (
        <div>
          <Progress color={this.props.settings.color} progress={1} />
          <Text>
            {t('passwordDescription')}
          </Text>
          <Text>
            <StyledPassword
              type='password'
              placeholder={t('Create new password')}
              value={this.state.newPassword}
              onChange={evt => this.setState({newPassword: evt.target.value})}/>
          </Text>

          <Text>
            <StyledPassword
              type='password'
              placeholder={t('Repeat password')}
              value={this.state.confirmPassword}
              onChange={evt => this.setState({confirmPassword: evt.target.value})}
              />
          </Text>

          <Message negative hidden={!this.state.errorMessage}>
            {this.state.errorMessage}
          </Message>

          <Text>
            <StyledButton onClick={this.handleClick.bind(this)}>
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

const mapDispatchToProps = { setLocked }

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps


const Text = styled.p`
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

const StyledPassword = styled.input`
  width: 311px;
  height: 42px;
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreatePassword))

import * as React from 'react'
import styled from 'styled-components'
import { RouteComponentProps, withRouter } from 'react-router'
import { IAppState } from '../../background/store/all'
import keyringVault from '../../services/keyring-vault'
import { connect } from 'react-redux'
import { CREATE_PASSWORD_ROUTE } from '../../constants/routes'

type StateProps = ReturnType<typeof mapStateToProps>

interface ILoginProps extends StateProps, RouteComponentProps {
  history: any
}

interface ILoginState {
  password: string,
  errorMessage?: string
}

class Login extends React.Component<ILoginProps, ILoginState> {

  state: ILoginState = {
    password: ''
  }

  handleLogin () {
    this.setState({ errorMessage: '' })
    // for testing only
    keyringVault.unlock(this.state.password).then(
      keyringPairs => {
        console.log('Should have empty keyring pairs ', keyringPairs)
      }
    )
  }

  handleSignUp () {
    this.setState({ errorMessage: '' })
    this.props.history.push(CREATE_PASSWORD_ROUTE)
  }

  render () {
    return (
      <div>
        <Title>
          login here
        </Title>
        <Text>
          <StyledPassword
            type='password'
            value={this.state.password}
            onChange={evt => this.setState({ password: evt.target.value })}
          />
        </Text>
        <Text>
          <StyledButton onClick={this.handleLogin.bind(this)}>
            login
          </StyledButton>
          <StyledButton onClick={this.handleSignUp.bind(this)}>
            Sign up
          </StyledButton>
        </Text>
      </div>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings
  }
}

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
    text-align: center;
    color: #3e5860;
`

const Title = styled(Text)`
    width: 311px;
    height: 26px;
    font-size: 19px;
    font-weight: bold;
    color: #30383B;
`

export default withRouter(connect(mapStateToProps)(Login))

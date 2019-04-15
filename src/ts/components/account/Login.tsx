import * as React from 'react'
import styled from 'styled-components'
import { RouteComponentProps, withRouter } from 'react-router'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import { unlockWallet } from '../../services/keyring-vault-proxy'
import { DEFAULT_ROUTE } from '../../constants/routes'
import { setLocked } from '../../background/store/account'
import { Button } from '../basic-components'

type StateProps = ReturnType<typeof mapStateToProps>

interface ILoginProps extends StateProps, DispatchProps, RouteComponentProps {}

interface ILoginState {
  password: string,
  errorMessage?: string
}

class Login extends React.Component<ILoginProps, ILoginState> {

  constructor (props: Readonly<ILoginProps>) {
    super(props)
    this.handleLogin = this.handleLogin.bind(this)
  }

  state: ILoginState = {
    password: ''
  }

  handleLogin () {
    this.setState({ errorMessage: '' })
    // for testing only
    unlockWallet(this.state.password).then(
      keyringPairs => {
        if (keyringPairs.length && keyringPairs.length > 0) {
          this.props.setLocked(false).then(
            this.props.history.push(DEFAULT_ROUTE)
          )
        }
      }
    )
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
          <Button onClick={this.handleLogin}>
            login
          </Button>
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

const mapDispatchToProps = { setLocked }

type DispatchProps = typeof mapDispatchToProps

const StyledPassword = styled.input`
  width: 311px;
  height: 42px;
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))

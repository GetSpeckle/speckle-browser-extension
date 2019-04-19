import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import { unlockWallet } from '../../services/keyring-vault-proxy'
import { HOME_ROUTE } from '../../constants/routes'
import { setLocked } from '../../background/store/account'
import { Button, Section, Title, StyledPassword } from '../basic-components'
import { colorSchemes } from '../styles/themes'

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
    this.setPassword = this.setPassword.bind(this)
  }

  state: ILoginState = {
    password: ''
  }

  setPassword (event) {
    this.setState({ password: event.target.value })
  }

  handleLogin () {
    this.setState({ errorMessage: '' })
    // for testing only
    unlockWallet(this.state.password).then(
      keyringPairs => {
        if (keyringPairs.length && keyringPairs.length > 0) {
          this.props.setLocked(false).then(
            this.props.history.push(HOME_ROUTE)
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
        <Section>
          <StyledPassword
            type='password'
            value={this.state.password}
            onChange={this.setPassword}
          />
        </Section>
        <Section>
          <Button
            onClick={this.handleLogin}
            colorScheme={colorSchemes[this.props.settings.color]}
          >
            login
          </Button>
        </Section>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))

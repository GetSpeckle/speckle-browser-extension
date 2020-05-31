import * as React from 'react'
import t from '../../services/i18n'
import { RouteComponentProps, withRouter } from 'react-router'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import { unlockWallet } from '../../services/keyring-vault-proxy'
import { HOME_ROUTE } from '../../constants/routes'
import { setLocked } from '../../background/store/wallet'
import {
  Button,
  ContentContainer,
  Section,
  TopSection,
  Title,
  StyledPassword
} from '../basic-components'
import { setError } from '../../background/store/error'

type StateProps = ReturnType<typeof mapStateToProps>

interface ILoginProps extends StateProps, DispatchProps, RouteComponentProps {}

interface ILoginState {
  password: string,
  errorMessage?: string
}

class Login extends React.Component<ILoginProps, ILoginState> {

  state: ILoginState = {
    password: ''
  }

  setPassword = (event) => {
    this.setState({ password: event.target.value })
  }

  handleLogin = () => {
    this.props.setError(null)
    unlockWallet(this.state.password).then(
      keyringPairs => {
        if (keyringPairs.length && keyringPairs.length > 0) {
          this.props.setLocked(false)
          this.props.history.push(HOME_ROUTE)
        }
      }
    ).catch(err => { this.props.setError(err) })
  }

  render () {
    return (
      <ContentContainer>
        <TopSection>
          <Title>
            {t('loginHere')}
          </Title>
        </TopSection>

        <Section>
          <StyledPassword
            type='password'
            value={this.state.password}
            placeholder={t('password')}
            onChange={this.setPassword}
          />
        </Section>

        <Section>
          <Button onClick={this.handleLogin}>
            {t('login')}
          </Button>
        </Section>
      </ContentContainer>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings
  }
}

const mapDispatchToProps = { setLocked, setError }

type DispatchProps = typeof mapDispatchToProps

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))

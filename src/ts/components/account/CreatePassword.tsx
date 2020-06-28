import * as React from 'react'
import t from '../../services/i18n'
import Progress from './Progress'
import { withRouter, RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import { Message } from 'semantic-ui-react'
import { GENERATE_PHRASE_ROUTE } from '../../constants/routes'
import {
  Button,
  ContentContainer,
  Section,
  TopSection,
  SecondaryText,
  StyledPassword,
  TimerText
} from '../basic-components'
import { setNewPassword } from '../../background/store/wallet'
import { setError } from '../../background/store/error'
import { setTempPassword } from '../../services/keyring-vault-proxy'
import { parseTimeLeft } from '../../constants/utils'
import { IAppState } from '../../background/store/all'

interface ICreatePasswordProps extends StateProps, DispatchProps, RouteComponentProps {}

interface ICreatePasswordState {
  newPassword: string,
  confirmPassword: string,
  errorMessage?: string,
  showNewPassword: boolean,
  showConfirmNewPassword: boolean
}

class CreatePassword extends React.Component<ICreatePasswordProps, ICreatePasswordState> {

  state: ICreatePasswordState = {
    newPassword: this.props.wallet.newPassword || '',
    confirmPassword: this.props.wallet.newPassword || '',
    showNewPassword: false,
    showConfirmNewPassword: false
  }

  componentDidUpdate (prevProps) {
    if (prevProps.wallet.accountSetupTimeout !== 0 && this.props.wallet.accountSetupTimeout === 0) {
      this.props.setError(t('timerElapsed'))
      this.setState({
        newPassword: '',
        confirmPassword: ''
      })
    }
  }

  setNewPassword = (event) => {
    this.setState({ ...this.state, newPassword: event.target.value })
  }

  setConfirmPassword = (event) => {
    this.setState({ ...this.state, confirmPassword: event.target.value })
  }

  handleClick = () => {
    this.props.setError(null)

    if (this.state.newPassword !== this.state.confirmPassword) {
      this.props.setError(t('passwordMismatch'))
      return
    }
    if (this.state.newPassword.length < 8) {
      this.props.setError(t('passwordLength'))
      return
    }

    // set the new password to the store for later use
    this.props.setNewPassword(this.state.newPassword)
    setTempPassword(this.state.newPassword)

    // Move to step 2
    this.props.history.push(GENERATE_PHRASE_ROUTE)
  }

  handleShowPassword = () => {
    this.setState({ showNewPassword: !this.state.showNewPassword })
  }

  handleShowConfirmPassword = () => {
    this.setState({ showConfirmNewPassword: !this.state.showConfirmNewPassword })
  }

  render () {
    const { showNewPassword, showConfirmNewPassword } = this.state
    const { accountSetupTimeout } = this.props.wallet
    const iconClassName = `eye ${showNewPassword ? '' : 'slash'} link icon`

    return (
      <ContentContainer>
        <TopSection>
          <Progress step={1}/>
          <SecondaryText style={{ textAlign: 'left' }}>
            {t('passwordDescription')}
          </SecondaryText>
        </TopSection>

        <Section>
          <StyledPassword
            type={showNewPassword ? 'text' : 'password'}
            icon={<i className={iconClassName} onClick={this.handleShowPassword}/>}
            placeholder={t('newPassword')}
            value={this.state.newPassword}
            onChange={this.setNewPassword}
          />
        </Section>

        <Section>
          <StyledPassword
            type={showConfirmNewPassword ? 'text' : 'password'}
            icon={<i className={iconClassName} onClick={this.handleShowConfirmPassword}/>}
            placeholder={t('repeatPassword')}
            value={this.state.confirmPassword}
            onChange={this.setConfirmPassword}
          />
        </Section>

        <Section>
          <Message negative={true} hidden={!this.state.errorMessage}>
            {this.state.errorMessage}
          </Message>
        </Section>

        <Section>
          <Button onClick={this.handleClick}>
            {t('createAccount')}
          </Button>
        </Section>
        {accountSetupTimeout > 0 && <TimerText>{parseTimeLeft(accountSetupTimeout)}</TimerText>}
      </ContentContainer>
    )
  }
}
const mapStateToProps = (state: IAppState) => {
  return {
    wallet: state.wallet
  }
}

const mapDispatchToProps = { setNewPassword, setError }

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreatePassword))

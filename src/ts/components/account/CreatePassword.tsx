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
  StyledPassword
} from '../basic-components'
import { setNewPassword } from '../../background/store/wallet'
import { setError } from '../../background/store/error'

interface ICreatePasswordProps extends DispatchProps, RouteComponentProps {}

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

  setNewPassword = (event) => {
    this.setState({ ...this.state, newPassword: event.target.value })
  }

  setConfirmPassword = (event) => {
    this.setState({ ...this.state, confirmPassword: event.target.value })
  }

  handleClick = () => {
    this.props.setError(null)

    if (this.state.newPassword !== this.state.confirmPassword) {
      this.props.setError(t('Password mismatch'))
      return
    }
    if (this.state.newPassword.length < 8) {
      this.props.setError(t('Password minimum length is 8'))
      return
    }

    // set the new password to the store for later use
    this.props.setNewPassword(this.state.newPassword)
    this.props.history.push(GENERATE_PHRASE_ROUTE)

  }

  render () {
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
            type='password'
            placeholder={t('Create new password')}
            value={this.state.newPassword}
            onChange={this.setNewPassword}
          />
        </Section>

        <Section>
          <StyledPassword
            type='password'
            placeholder={t('Repeat password')}
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
            {t('Create Account')}
          </Button>
        </Section>
      </ContentContainer>
    )
  }
}

const mapDispatchToProps = { setNewPassword, setError }

type DispatchProps = typeof mapDispatchToProps

export default withRouter(connect(null, mapDispatchToProps)(CreatePassword))

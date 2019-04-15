import * as React from 'react'
import styled from 'styled-components'
import t from '../../services/i18n'
import Progress from './Progress'
import { IAppState } from '../../background/store/all'
import { withRouter, RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import { Message } from 'semantic-ui-react'
import { unlockWallet } from '../../services/keyring-vault-proxy'
import { GENERATE_PHRASE_ROUTE } from '../../constants/routes'
import { setLocked } from '../../background/store/account'
import { Button, Section } from '../basic-components'

interface ICreatePasswordProps extends StateProps, DispatchProps, RouteComponentProps {}

interface ICreatePasswordState {
  newPassword: string,
  confirmPassword: string,
  errorMessage?: string
}

class CreatePassword extends React.Component<ICreatePasswordProps, ICreatePasswordState> {

  constructor (props: ICreatePasswordProps) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  state: ICreatePasswordState = {
    newPassword: '',
    confirmPassword: ''
  }

  handleClick () {
    this.setState({ errorMessage: '' })

    if (this.state.newPassword !== this.state.confirmPassword) {
      this.setState({ errorMessage: t('Password mismatch') })
      return
    }
    if (this.state.newPassword.length < 8) {
      this.setState({ errorMessage: t('Password minimum length is 8') })
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
          <Section>
            {t('passwordDescription')}
          </Section>
          <Section>
            <StyledPassword
              type='password'
              placeholder={t('Create new password')}
              value={this.state.newPassword}
              onChange={evt => this.setState({ newPassword: evt.target.value })}/>
          </Section>

          <Section>
            <StyledPassword
              type='password'
              placeholder={t('Repeat password')}
              value={this.state.confirmPassword}
              onChange={evt => this.setState({ confirmPassword: evt.target.value })}
              />
          </Section>

          <Message negative={true} hidden={!this.state.errorMessage}>
            {this.state.errorMessage}
          </Message>

          <Section>
            <Button onClick={this.handleClick}>
              {t('Create Account')}
            </Button>
          </Section>

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

const StyledPassword = styled.input`
  width: 311px;
  height: 42px;
`

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreatePassword))

import * as React from 'react'
import styled from 'styled-components'
import t from '../../services/i18n'
import Progress from './Progress'
import { IAppState } from '../../background/store/all'
import keyringVault from '../../services/keyring-vault'
import { withRouter, RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'

interface ICreatePasswordProps extends StateProps, RouteComponentProps {}

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
    if (this.state.newPassword !== this.state.confirmPassword) {
      this.setState({errorMessage: t('Password mismatch')})
      return
    }
    if (this.state.newPassword.length<8) {
      this.setState({errorMessage: t('Password minimum length is 8')})
      return
    }

    keyringVault.unlock(this.state.newPassword).then(
      keyringPairs => {
        console.log('Should have empty keyring pairs ', keyringPairs)
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

          <div className={'ui negative message '+this.state.errorMessage?'':'hidden'}>
            <i className='close icon'></i>
            <p>{this.state.errorMessage}</p>
          </div>

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
    settings: state.settings
  }
}

type StateProps = ReturnType<typeof mapStateToProps>

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

export default withRouter(connect(mapStateToProps)(CreatePassword))

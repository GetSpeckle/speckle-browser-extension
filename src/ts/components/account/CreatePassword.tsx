import * as React from 'react'
import styled from 'styled-components'
import t from '../../services/i18n'
import Progress from './Progress'

class CreatePassword extends React.Component {

  handleClick () {
    // TODO: create account
  }

  render () {
    return (
        <div>
          <Progress color={'blue'} progress={1} />
          <Text>
            {t('passwordDescription')}
          </Text>
          <Text>
            <StyledPassword type='password' placeholder={t('Create new password')} />
          </Text>

          <Text>
            <StyledPassword type='password' placeholder={t('Repeat password')} />
          </Text>

          <Text>
            <StyledButton onClick={this.handleClick}>
              {t('Create Account')}
            </StyledButton>
          </Text>

        </div>
    )
  }
}

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

export default CreatePassword

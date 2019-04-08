import * as React from 'react'
import styled from 'styled-components'
import t from '../../services/i18n'
import Progress from './Progress'

class CreatePassword extends React.Component {

  render () {
    return (
        <div>
          <Progress color={'blue'} progress={1} />
          <Text>
            {t('passwordDescription')}
          </Text>
          <div className='ui input'>
            <input type='password' placeholder='Create new password' />
          </div>

          <div className='ui input'>
            <input type='password' placeholder='Repeat password' />
          </div>

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
    text-align: center;
    color: #3e5860;
`
export default CreatePassword

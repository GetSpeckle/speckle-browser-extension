import * as React from 'react'
import styled from 'styled-components'
import t from '../../services/i18n'

class Term extends React.Component {

  render () {
    return (
        <div>
          <Title>
            {t('termTitle')}
          </Title>
          <Text>
            {t('termDescription')}
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

export default Term

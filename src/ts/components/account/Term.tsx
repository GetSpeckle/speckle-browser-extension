import * as React from 'react'
import styled from 'styled-components'
import t from '../../services/i18n'
import { CREATE_PASSWORD_ROUTE } from '../../constants/routes';

interface ITermProp {
  history: any
}

class Term extends React.Component<ITermProp> {

  handleClick = () => {
    this.props.history.push(CREATE_PASSWORD_ROUTE)
  }

  render () {
    return (
        <div>
          <Title>
            {t('termTitle')}
          </Title>
          <TermText>
            {t('termDescription')}
          </TermText>
          <Text>
            <StyledButton onClick={this.handleClick}>
              {t('termAcceptButton')}
            </StyledButton>
          </Text>
        </div>
    )
  }
}

const Text = styled.p`
    width: 311px;
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

const Title = styled(Text)`
    width: 311px;
    height: 26px;
    font-size: 19px;
    font-weight: bold;
    color: #30383B;
`
const TermText = styled(Text)`
  height: 347px;
  overflow-y: auto;

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
export default Term

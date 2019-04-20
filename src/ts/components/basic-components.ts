import styled from 'styled-components'
import { colorSchemes } from './styles/themes'
import { IAppState } from '../background/store/all'
import { connect } from 'react-redux'
import { Form, Button as SemanticButton } from 'semantic-ui-react';

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings
  }
}

type StateProps = ReturnType<typeof mapStateToProps>

export const LayoutContainer = styled('div')`
    width: 375px;
    height: 667px;
    border-radius: 4px;
    box-shadow: 0 6px 30px 0 ${props => props.theme['shadowColor']};
    border: solid 1px ${props => props.theme['borderColor']};
    background-color: ${props => props.theme['backgroundColor']};
`

const StyledButton = styled(SemanticButton).attrs({fluid: true})`
  box-shadow: 0 3px 10px 0 ${(p: StateProps) => colorSchemes[p.settings.color].shadowColor};
  background-color: ${(p: StateProps) => colorSchemes[p.settings.color].backgroundColor};
  font-family: Nunito;
  font-size: 16px;
  font-weight: 800;
  line-height: 1.31;
  color: #ffffff;
`

export const Button = connect(mapStateToProps)(StyledButton)

export const Section = styled.div`
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

export const Title = styled(Section)`
    width: 311px;
    height: 26px;
    font-size: 19px;
    font-weight: bold;
    color: #30383B;
`

export const MnemonicPad = styled.textarea`
  width: 311px;
  height: 125px;
  font-family: Nunito;
  padding: 10px;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.57;
  letter-spacing: normal;
  color: #30383b;
`

export const StyledPassword = styled.input`
  width: 311px;
  height: 42px;
`

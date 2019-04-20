import styled from 'styled-components'
import { colorSchemes } from './styles/themes'
import { IAppState } from '../background/store/all'
import { connect } from 'react-redux'
import { Button as SemanticButton, Input } from 'semantic-ui-react'

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings
  }
}

type P = ReturnType<typeof mapStateToProps>

export const LayoutContainer = styled('div')`
    width: 375px;
    height: 600px;
    border-radius: 4px;
    box-shadow: 0 6px 30px 0 ${props => props.theme['shadowColor']};
    border: solid 1px ${props => props.theme['borderColor']};
    background-color: ${props => props.theme['backgroundColor']};
`

const StyledButton = styled(SemanticButton).attrs({ fluid: true })`
  box-shadow: 0 3px 10px 0 ${(p: P) => colorSchemes[p.settings.color].shadowColor} !important;
  background-color: ${(p: P) => colorSchemes[p.settings.color].backgroundColor} !important;
  color: #ffffff !important;
`

export const Button = connect(mapStateToProps)(StyledButton)

export const ContentContainer = styled.div`
  width: 311px;
  margin: 0 auto;
`

export const Section = styled.div`
  width: 100%;
  margin: 18px 0;
`

export const PrimaryText = styled.div`
  color: #30383B;
`

export const SecondaryText = styled.div`
  opacity: 0.6;
  color: #3e5860;
`

export const Title = styled.div`
  font-size: 19px;
  font-weight: bold;
  color: #30383B;
  text-align: center;
`

export const MnemonicPad = styled.textarea`
  height: 125px;
  line-height: 1.57;
  color: #30383b;
`

export const StyledPassword = styled(Input).attrs({ fluid: true })`
  height: 42px;
`

export const LoginFooter = styled.div`
  position: absolute;
  bottom: 0;
  width: 40%;
  height: 25px;
  font-size: 11px;
  margin: 0 120px;
  display: flex;
  justify-content: space-around
`

const StyledLink = styled.a`
  color: ${(p: P) => colorSchemes[p.settings.color].backgroundColor} !important
`

export const FooterLink = connect(mapStateToProps)(StyledLink)

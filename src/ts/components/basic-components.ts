import styled from 'styled-components'
import { colorSchemes } from './styles/themes'
import { IAppState } from '../background/store/all'
import { connect } from 'react-redux'
import { Input } from 'semantic-ui-react'

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings,
    selection: true
  }
}

type P = ReturnType<typeof mapStateToProps>

export const LayoutContainer = styled.div`
  width: 375px;
  height: 600px;
  border-width: 0;
  box-shadow: 0 6px 30px 0 ${props => props.theme['shadowColor']};
  background-color: ${props => props.theme['backgroundColor']};
`

const StyledButton = styled.button`
  box-shadow: 0 3px 10px 0 ${(p: P) => colorSchemes[p.settings.color].shadowColor};
  background-color: ${(p: P) => colorSchemes[p.settings.color].backgroundColor};
  color: white;
  width: 100%;
  display: block;
  font-size: 1rem;
  text-transform: none;
  text-shadow: none;
  font-weight: 700;
  line-height: 1em;
  font-style: normal;
  text-align: center;
  text-decoration: none;
  border-radius: .28571429rem;
  margin: 0 .25em 0 0;
  padding: .78571429em 1.5em .78571429em;
  min-height: 1em;
  outline: 0;
  border: none;
  vertical-align: baseline;
  :disabled {
    opacity: 0.5
  };
  :disabled
  :hover:enabled {
    filter: brightness(1.05);
  }
`

export const Button = connect(mapStateToProps)(StyledButton)

export const ContentContainer = styled.div`
  width: 311px;
  margin: 0 auto;
`

export const BasicSection = styled.div`
  width: 100%;
  margin: 18px 0;
  word-wrap: break-word;
`

export const Section = styled(BasicSection)`
  text-align: center;
`

export const TopSection = styled(Section)`
  margin-top: 0;
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

export const WhiteTitle = styled(Title)`
  color: white;
`

export const StyledPassword = styled(Input).attrs({ fluid: true })`
  height: 42px;
`

export const AccountAddress = styled.span`
  height: 14px;
  font-size: 12px;
  text-align: center;
  color: #fff;
`

export const LoginFooter = styled.div`
  position: absolute;
  bottom: 0;
  width: 40%;
  height: 25px;
  font-size: 11px;
  margin: 0 120px;
  display: flex;
  justify-content: space-around;
`

const StyledLink = styled.a`
  color: ${(p: P) => colorSchemes[p.settings.color].backgroundColor} !important;
`

export const FooterLink = connect(mapStateToProps)(StyledLink)

export const ErrorMessage = styled.div`
  color: #f55;
  font-size: 12px;
`

const Timer = styled.div`
  color: ${(p: P) => colorSchemes[p.settings.color].backgroundColor} !important;
  background-color: ${(p: P) => colorSchemes[p.settings.color].shadowColor} !important;
  padding: 8px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 12px;
  position: fixed;
  top: 135px;
  right: 42px;
`

export const TimerText = connect(mapStateToProps)(Timer)

import styled from 'styled-components'
import { colorSchemes } from './styles/themes'
import { IAppState } from '../background/store/all'
import { connect } from 'react-redux'
import { Button as SemanticButton, Dropdown, Input, Image, Header } from 'semantic-ui-react'
import Identicon from 'polkadot-identicon'

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings
  }
}

type P = ReturnType<typeof mapStateToProps>

export const LayoutContainer = styled('div')`
    width: 375px
    height: 600px
    border-radius: 4px
    box-shadow: 0 6px 30px 0 ${props => props.theme['shadowColor']}
    border: 0
    background-color: ${props => props.theme['backgroundColor']}
`

const StyledButton = styled(SemanticButton).attrs({ fluid: true })`
  box-shadow: 0 3px 10px 0 ${(p: P) => colorSchemes[p.settings.color].shadowColor} !important
  background-color: ${(p: P) => colorSchemes[p.settings.color].backgroundColor} !important
  color: #ffffff !important
`

export const Button = connect(mapStateToProps)(StyledButton)

export const ContentContainer = styled.div`
  width: 311px
  margin: 0 auto
`

export const Section = styled.div`
  width: 100%
  margin: 18px 0
  text-align: center
  word-wrap: break-word
`

export const TopSection = styled(Section)`
  margin-top: 0
`

export const PrimaryText = styled.div`
  color: #30383B
`

export const SecondaryText = styled.div`
  opacity: 0.6
  color: #3e5860
`

export const Title = styled.div`
  font-size: 19px
  font-weight: bold
  color: #30383B
  text-align: center
`

export const WhiteTitle = styled(Title)`
  color: white
`

export const StyledPassword = styled(Input).attrs({ fluid: true })`
  height: 42px
`
export const AccountAddress = styled.span`
  cursor: copy
  height: 14px
  font-family: Nunito
  font-size: 10px
  font-weight: normal
  font-style: normal
  font-stretch: normal
  line-height: normal
  letter-spacing: normal
  text-align: center
  color: #ffffff
`

export const StyledChainDropdown = styled(Dropdown)`
    & .menu {
      background-color: ${(p: P) => colorSchemes[p.settings.color].backgroundColor} !important
    }
`

export const ChainDropdown = connect(mapStateToProps)(StyledChainDropdown)

export const LoginFooter = styled.div`
  position: absolute
  bottom: 0
  width: 40%
  height: 25px
  font-size: 11px
  margin: 0 120px
  display: flex
  justify-content: space-around
`

const StyledLink = styled.a`
  color: ${(p: P) => colorSchemes[p.settings.color].backgroundColor} !important
`

export const FooterLink = connect(mapStateToProps)(StyledLink)

export const Center = styled.div`
  text-align: center
`

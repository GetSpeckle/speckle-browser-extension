import * as React from 'react'
// import { TweenLite, TimelineLite, CSSPlugin } from 'gsap/all'
import styled from 'styled-components'
import { Image } from 'semantic-ui-react'
import {
  LOGIN_ROUTE
} from '../../constants/routes'
import { lockWallet } from '../../services/keyring-vault-proxy'

interface ISettingsMenuProps {
  parentProps: any
}

interface ISettingsMenuState {
  menuItems: {},
  currentMenuItem: string
}

// this is the dump component for displaying the menu items and doing the animations
export default class SettingsMenu extends React.Component<ISettingsMenuProps, ISettingsMenuState > {
  state = {
    menuItems: {
      'main': [{ item: <Image src='/assets/icon-profile.svg' centered={true}/> },
               { item: 'Log Out' },
               { item: 'Settings', childMenu: 'settings' }],
      'settings': [{ item: 'Settings' },
                   { item: 'Color', childMenu: 'color' }],
      'color': [
                { item: 'Color' },
                { item: '#D396FF', color: 'purple' },
                { item: '#FF7396', color: 'red' },
                { item: '#FFC10B', color: 'orange' },
                { item: '#51DFB0', color: 'green' },
                { item: '#44C5EE', color: 'blue' }]
    },
    currentMenuItem: 'main' // default menu item
  }

  renderMenuItems = (menuName: string) => {
    const menuItems = this.state.menuItems[menuName]
    let key = 0
    return menuItems.map((menu) => {
      return (
            <MenuOption
              key={key}
              onClick={this.handleMenuClick.bind(this, menu)}
              color={menu.color !== undefined ? menu.item : undefined}
            >
              {menu.color !== undefined ? '' : menu.item}
            </MenuOption>
      )
      key++
    })
  }

  handleMenuClick = (menu: any) => {
    if (menu.item === 'Log Out') {
      this.handleClickLogout()
    } else {
      if (menu.childMenu !== undefined) {
        this.setState({ currentMenuItem: menu.childMenu })
      }
    }
  }

  handleClickLogout = () => {
    const { history } = this.props.parentProps
    lockWallet().then(() => {
      history.push(LOGIN_ROUTE)
    })
  }

  render () {
    return (
      <MenuOptionsContainer>
        {this.renderMenuItems(this.state.currentMenuItem)}
      </MenuOptionsContainer>
    )
  }
}

const MenuOptionsContainer = styled.div`
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -moz-flex;
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: column;
  flex-direction: column;
  z-index: 999999;
  align-items: center;
  position: absolute;
  top: 15px;
  left: 320px;
`
const MenuOption = styled.div`
  font-size: 11px;
  font-weight: bolder;
  padding-left: 2px;
  padding-right: 2px;
  border: 2px solid #FFFFFF;
  border-radius: 7px;
  color: #FFFFFF;
  width: 50px;
  height: 25px;
  text-align: center;
  background-color: ${props => props.color ? props.color : props.theme.shadowColor };
  :nth-child(n+2) {
    margin-top: 15px;
    padding-top: 2px;
  }
  &:hover:nth-child(n+2) {
    -webkit-box-shadow: 1px 1px 8px -1px rgba(0,0,0,0.75);
    -moz-box-shadow: 1px 1px 8px -1px rgba(0,0,0,0.75);
    box-shadow: 1px 1px 8px -1px rgba(0,0,0,0.75);
    cursor: pointer;
  }
`

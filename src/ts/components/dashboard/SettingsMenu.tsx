import * as React from 'react'
import { TweenMax } from 'gsap/all'
import styled from 'styled-components'
import { Image } from 'semantic-ui-react'
import { LOGIN_ROUTE } from '../../constants/routes'
import { lockWallet } from '../../services/keyring-vault-proxy'
import { colorSchemes } from '../styles/themes'

interface ISettingsMenuProps {
  topMenuProps: any,
  closeSettingsMenu: Function
}

interface ISettingsMenuState {
  menuItems: {},
  currentMenuItem: string,
  previousMenuItems: Array<string>
}

const settingsMenuRef = React.createRef<HTMLDivElement>()
let myMenuElements: Array<HTMLDivElement | null>

// this is the component for displaying the menu items and doing the animations
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
                { color: 'purple' },
                { color: 'red' },
                { color: 'orange' },
                { color: 'green' },
                { color: 'blue' }]
    },
    currentMenuItem: 'main', // default menu item
    previousMenuItems: ['']
  }

  componentWillMount = () => {
    document.addEventListener('mousedown', this.handleClick)
  }

  componentWillUnMount = () => {
    document.removeEventListener('mousedown', this.handleClick)
  }

  componentDidMount = () => {
    this.animateMenuOpen()
  }

  componentDidUpdate = (prevState) => {
    if (prevState.currentMenuItem !== this.state.currentMenuItem
      && this.state.currentMenuItem !== 'main') {
      this.animateMenuOpen()
    }
  }

  // animate menu open
  animateMenuOpen = () => {
    TweenMax.to(myMenuElements, 0, { alpha: 0 })
    TweenMax.staggerTo(myMenuElements, 1, { alpha: 1 }, 0.09)
  }
  // close menu on outside click
  handleClick = (e) => {
    if (settingsMenuRef.current !== null) {
      if (settingsMenuRef.current.contains(e.target)) {
        // inside click
        return
      }
      // outside click
      this.closeMenu()
    }
  }

  getColor = (colorName: string) => colorSchemes[colorName].backgroundColor

  getDefaultColor = () => colorSchemes[this.props.topMenuProps.settings.color].shadowColor

  goBack = () => {
    let previousMenuItems = Object.assign([], this.state.previousMenuItems)
    const len = previousMenuItems.length

    if (len > 1) {
      // get the previous menu item
      const currentMenuItem = this.state.previousMenuItems[len - 1]
      // then set it as the current menu item
      this.setState({ currentMenuItem })
      // then remove it from the previous menu items
      previousMenuItems.pop()
      // finally update the previous menu items array
      this.setState({ previousMenuItems })
    }
  }

  closeMenu = () => {
    const { closeSettingsMenu } = this.props
    closeSettingsMenu()
  }

  setRef = (menuRef: HTMLDivElement | null, index: number) => {
    if (menuRef !== null) { // make sure ref is not null
      if (menuRef.className !== 'current-color') {
        myMenuElements[index] = menuRef
      }
    }
  }

  renderMenuItems = (menuName: string) => {

    const menuItems = this.state.menuItems[menuName]
    myMenuElements = []
    return menuItems.map((menu, index) => {
      const currentColor = this.props.topMenuProps.settings.color
      let menuOption = <div/>
      if (currentColor !== '') {
        menuOption = (
          <MenuOption
            ref={div => this.setRef(div, index)}
            key={index}
            onClick={this.handleMenuClick.bind(this, menu)}
            // the menu item background color
            color={menu.color !== undefined ? this.getColor(menu.color) : this.getDefaultColor()}
          >
            {menu.color !== undefined ? '' : menu.item}
          </MenuOption>
        )
      }
      return menuOption
    })
  }

  renderMenuNavs = () => {
    let menuNavs = <span/>
    const currentColorHex = this.getColor(this.props.topMenuProps.settings.color)
    if (this.state.previousMenuItems.length > 1) {
      menuNavs = (
        <MenuNavsContainer>
          <MenuNavs color={currentColorHex} onClick={this.goBack}>
            <Image src='/assets/left-arrow.svg' centered={true}/>
          </MenuNavs>
          <MenuNavs color={currentColorHex} onClick={this.closeMenu}>
            <Image src='/assets/multiply.svg' centered={true}/>
          </MenuNavs>
        </MenuNavsContainer>
      )
    }
    return menuNavs
  }

  handleMenuClick = (menu: any) => {
    // handle menu selections
    if (menu.childMenu !== undefined) {
      // update the previous menu items
      let previousMenuItems = Object.assign([], this.state.previousMenuItems)
      previousMenuItems.push(this.state.currentMenuItem)
      this.setState({ previousMenuItems })
      // then set the current item
      this.setState({ currentMenuItem: menu.childMenu })
      return
    }

    // handle color selection
    if (menu.color !== undefined) {
      this.handleColorChange(menu.color)
      return
    }

    if (typeof menu.item === 'string') {
      // handle log out
      if (menu.item === 'Log Out') {
        this.handleClickLogout()
        return
      }
    }
  }
  // save the color selected
  handleColorChange = (color: string) => {
    this.props.topMenuProps.saveSettings({ ...this.props.topMenuProps.settings, color: color })
    // close the menu after selecting a color
    this.closeMenu()
  }

  handleClickLogout = () => {
    const { history } = this.props.topMenuProps
    lockWallet().then(() => {
      history.push(LOGIN_ROUTE)
    })
  }

  render () {
    return (
      <MenuOptionsContainer ref={settingsMenuRef}>
        {this.renderMenuItems(this.state.currentMenuItem)}
        {this.renderMenuNavs()}
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
  line-height: 21px;
  text-align: center;
  vertical-align: middle;
  background-color: ${props => props.color };
  :nth-child(n+2) {
    margin-top: 12px;
  }
  &:hover:nth-child(n+2) {
    -webkit-box-shadow: 1px 1px 8px -1px rgba(0,0,0,0.75);
    -moz-box-shadow: 1px 1px 8px -1px rgba(0,0,0,0.75);
    box-shadow: 1px 1px 8px -1px rgba(0,0,0,0.75);
    cursor: pointer;
  }
`
const MenuNavsContainer = styled.div`
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -moz-flex;
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: row;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
  width: 50px;
`
const MenuNavs = styled.span`
  border: 2px solid #FFFFFF;
  border-radius: 20px;
  padding: 3px;
  width: 20px;
  background-color: ${props => props.color };
  &:hover {
    -webkit-box-shadow: 1px 1px 8px -1px rgba(0,0,0,0.75);
    -moz-box-shadow: 1px 1px 8px -1px rgba(0,0,0,0.75);
    box-shadow: 1px 1px 8px -1px rgba(0,0,0,0.75);
    cursor: pointer;
  }
`

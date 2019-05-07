import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { Menu, Icon, MenuItemProps } from 'semantic-ui-react'
import t from '../../services/i18n'
import { HOME_ROUTE } from '../../constants/routes'

interface IBottomMenuProps extends RouteComponentProps {
}

const NAME_MAP = {
  home: HOME_ROUTE,
  stake: '/stake',
  democracy: '/democracy',
  send: '/send'
}

/**
 * The bottom menu bar on the dashboard
 */
class BottomMenu extends React.Component<IBottomMenuProps> {

  handleItemClick = (e, data) => {
    const name = data.name || 'home'
    console.log('Going to route: ' + NAME_MAP[name])
    // use history to go to the path
    this.props.history.push(NAME_MAP[name])
  }

  render () {

    const { pathname } = this.props.location

    return (
      <div className='bottom-menu'>
        <Menu fluid={true} widths={4} icon='labeled' borderless={true} size='mini'>
          <Menu.Item
            name='home'
            active={pathname === NAME_MAP.home}
            onClick={this.handleItemClick}
          >
            <Icon name='home' />
            {t('menuHome')}
          </Menu.Item>

          <Menu.Item
            name='stake'
            active={pathname === NAME_MAP.stake}
            onClick={this.handleItemClick}
          >
            <Icon name='chart pie' />
            {t('menuStake')}
          </Menu.Item>

          <Menu.Item
            name='democracy'
            active={pathname === NAME_MAP.democracy}
            onClick={this.handleItemClick}
          >
            <Icon name='thumbs up outline' />
            {t('menuDemocracy')}
          </Menu.Item>

          <Menu.Item
            name='send'
            active={pathname === NAME_MAP.send}
            onClick={this.handleItemClick}
          >
            <Icon name='send' />
            {t('menuSend')}
          </Menu.Item>

        </Menu>

      </div>
    )
  }
}

export default withRouter(BottomMenu)

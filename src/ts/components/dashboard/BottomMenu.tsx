import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { Menu, Icon } from 'semantic-ui-react'
import t from '../../services/i18n'

interface IBottomMenuProps extends RouteComponentProps {
}

const NAME_MAP = {
  home: '/',
  stake: '/stake',
  democracy: '/democracy',
  send: '/send'
}

/**
 * The bottom menu bar on the dashboard
 */
class BottomMenu extends React.Component<IBottomMenuProps> {

  handleItemClick = (name: string) => {
    console.log('Going to route: ' + NAME_MAP[name])
    // TODO: use history to go to the path
    // this.props.history.push(NAME_MAP[data.name])
  }

  render () {

    const { pathname } = this.props.location

    return (
      <div className='bottom-menu'>
        <Menu fluid={true} widths={4} icon='labeled' borderless={true} size='mini'>
          <Menu.Item
            name='home'
            active={pathname === NAME_MAP.home}
            onClick={this.handleItemClick.bind(this, name)}
          >
            <Icon name='home' />
            {t('menuHome')}
          </Menu.Item>

          <Menu.Item
            name='stake'
            active={pathname === NAME_MAP.stake}
            onClick={this.handleItemClick.bind(this, name)}
          >
            <Icon name='chart pie' />
            {t('menuStake')}
          </Menu.Item>

          <Menu.Item
            name='democracy'
            active={pathname === NAME_MAP.democracy}
            onClick={this.handleItemClick.bind(this, name)}
          >
            <Icon name='thumbs up outline' />
            {t('menuDemocracy')}
          </Menu.Item>

          <Menu.Item
            name='send'
            active={pathname === NAME_MAP.send}
            onClick={this.handleItemClick.bind(this, name)}
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

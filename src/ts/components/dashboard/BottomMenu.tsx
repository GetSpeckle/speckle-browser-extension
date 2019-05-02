import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { Image, Dropdown, Grid, Menu, Icon } from 'semantic-ui-react'
import t from '../../services/i18n'

interface IBottomMenuProps extends RouteComponentProps {
}

/**
 * The bottom menu bar on the dashboard
 */
class BottomMenu extends React.Component<IBottomMenuProps> {

  handleItemClick = (e, data) => {
    this.setState({ activeItem: data.name })
  }

  render () {

    const { pathname } = this.props.location

    return (
      <div className='bottom-menu'>
        <Menu fluid={true} widths={4} icon='labeled' borderless={true} size='mini'>
          <Menu.Item
            name='home'
            active={pathname === 'home'}
            onClick={this.handleItemClick}
          >
            <Icon name='home' />
            {t('menuHome')}
          </Menu.Item>

          <Menu.Item
            name='chart pie'
            active={pathname === 'chart pie'}
            onClick={this.handleItemClick}
          >
            <Icon name='chart pie' />
            {t('menuStake')}
          </Menu.Item>

          <Menu.Item
            name='thumbs up outline'
            active={pathname === 'thumbs up outline'}
            onClick={this.handleItemClick}
          >
            <Icon name='thumbs up outline' />
            {t('menuDemocracy')}
          </Menu.Item>

          <Menu.Item
            name='send'
            active={pathname === 'send'}
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

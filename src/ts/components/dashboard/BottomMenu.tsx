import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { Menu, Icon } from 'semantic-ui-react'
import t from '../../services/i18n'
import {GOVERNANCE_ROUTE, HOME_ROUTE, SEND_ROUTE} from '../../constants/routes'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import { SemanticCOLORS } from 'semantic-ui-react/dist/commonjs/generic'

type StateProps = ReturnType<typeof mapStateToProps>

interface IBottomMenuProps extends StateProps, RouteComponentProps {}

const NAME_MAP = {
  home: HOME_ROUTE,
  stake: '/stake',
  governance: GOVERNANCE_ROUTE,
  send: SEND_ROUTE
}

/**
 * The bottom menu bar on the dashboard
 */
class BottomMenu extends React.Component<IBottomMenuProps> {

  handleItemClick = (name: string) => {
    // use history to go to the path
    this.props.history.push(NAME_MAP[name])
  }

  render () {

    const { pathname } = this.props.location
    const { color } = this.props.settings

    return (
      <div className='bottom-menu'>
        <Menu fluid={true} widths={4} icon='labeled' borderless={true} size='mini'>
          <Menu.Item
            color={color as SemanticCOLORS}
            name='home'
            active={pathname === NAME_MAP.home}
            onClick={this.handleItemClick.bind(this, 'home')}
          >
            <Icon name='home' />
            {t('menuHome')}
          </Menu.Item>

          <Menu.Item
            disabled={true}
            color={color as SemanticCOLORS}
            name='stake'
            active={pathname === NAME_MAP.stake}
            onClick={this.handleItemClick.bind(this, 'stake')}
          >
            <Icon name='chart pie' />
            {t('menuStake')}
          </Menu.Item>

          <Menu.Item
            disabled={false}
            color={color as SemanticCOLORS}
            name='governance'
            active={pathname === NAME_MAP.governance}
            onClick={this.handleItemClick.bind(this, 'governance')}
          >
            <Icon name='thumbs up outline' />
            {t('menuGovernance')}
          </Menu.Item>

          <Menu.Item
            color={color as SemanticCOLORS}
            name='send'
            active={pathname === NAME_MAP.send}
            onClick={this.handleItemClick.bind(this, 'send')}
          >
            <Icon name='send' />
            {t('menuSend')}
          </Menu.Item>

        </Menu>

      </div>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings
  }
}

export default withRouter(connect(mapStateToProps)(BottomMenu))

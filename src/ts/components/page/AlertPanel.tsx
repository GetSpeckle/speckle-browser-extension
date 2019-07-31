import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { Menu, Icon, Message } from 'semantic-ui-react'
import t from '../../services/i18n'
import { HOME_ROUTE, SEND_ROUTE } from '../../constants/routes'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import { SemanticCOLORS } from 'semantic-ui-react/dist/commonjs/generic'

type StateProps = ReturnType<typeof mapStateToProps>

interface IAlertPanelProps extends StateProps, RouteComponentProps {
  message: string
  icon: 'linkify' | 'exclamation'
  color: string
}

/**
 * The alert panel component
 */
class AlertPanel extends React.Component<IAlertPanelProps> {

  render () {
    return (
      <div>
        <Message icon={true}>
          <Icon name={this.props.icon} />
          <Message.Content>
            {this.props.message}
          </Message.Content>
        </Message>
      </div>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings
  }
}

export default withRouter(connect(mapStateToProps)(AlertPanel))

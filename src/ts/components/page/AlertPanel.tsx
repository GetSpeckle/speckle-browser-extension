import * as React from 'react'
import { Icon, Message } from 'semantic-ui-react'

interface IAlertPanelProps {
  message: string
  icon: 'linkify' | 'exclamation'
  color: string
}

/**
 * The alert panel component
 */
class AlertPanel extends React.Component<IAlertPanelProps> {

  render () {
    const borderStyle = {
      borderLeftColor: this.props.color,
      borderLeftWidth: '2px',
      borderLeftStyle: 'solid',
      borderRadius: '2px'
    }

    return (
      <div>
        <Message icon={true} className='alert' style={borderStyle}>
          <Icon name={this.props.icon} />
          <Message.Content>
            {this.props.message}
          </Message.Content>
        </Message>
      </div>
    )
  }
}

export default AlertPanel

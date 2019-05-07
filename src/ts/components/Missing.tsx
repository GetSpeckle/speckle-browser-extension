import t from '../services/i18n'
import * as React from 'react'
import { Button, Icon, Message } from 'semantic-ui-react'
import { withRouter, RouteComponentProps } from 'react-router'

interface IMissingProps extends RouteComponentProps {
}

class Missing extends React.Component<IMissingProps> {

  handleClick = () => {
    this.props.history.goBack()
  }

  render () {
    return (
      <div style={{ margin: '20px' }}>
        <Message negative={true} floating={true} >
          <p>{t('errorMissingPage')}</p>
        </Message>

        <Button onClick={this.handleClick} fluid={true}>
          <Icon name='redo' /> {t('goBack')}
        </Button>
      </div>
    )
  }
}

export default withRouter(Missing)

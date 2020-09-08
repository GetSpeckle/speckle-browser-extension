import React, { Component } from 'react'

import { Message } from 'semantic-ui-react'

interface ErrorMessageProp {
  message: String
}

class ErrorMessage extends Component<ErrorMessageProp> {

  render () {
    const { message } = this.props

    if (!message) {
      return null
    }

    return (
      <Message
        id='notif'
        negative={true}
        floating={true}
        onClick={() => document.getElementById('notif')!.remove()}>
        <p>{message}</p>
      </Message>
    )
  }
}

export default ErrorMessage

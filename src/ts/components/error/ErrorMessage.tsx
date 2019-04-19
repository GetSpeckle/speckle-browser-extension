import React, { Component } from 'react'

import { Message } from 'semantic-ui-react'

interface ErrorMessageProp {
  message: String,
  style: object
}

class ErrorMessage extends Component<ErrorMessageProp> {

  render () {
    const { message, style } = this.props

    if (!message) {
      return null
    }

    return (
      <Message negative={true} floating={true} style={style}>
        <p>{message}</p>
      </Message>
    )
  }
}

export default ErrorMessage

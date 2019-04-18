import * as React from 'react'

interface ErrorMessageProp {
  message: String
}

class ErrorMessage extends React.Component<ErrorMessageProp> {

  render () {
    const { message } = this.props

    return (
      <div>
        ${message}
      </div>
    )
  }
}

export default ErrorMessage

import React, { Component } from 'react'
import { Route, RouteProps } from 'react-router-dom'
import { Image } from 'semantic-ui-react'

const LoginLayout = ({ children }) => (
  <div>
    <Image src='/assets/header_blue.svg' size='tiny' />
    {children}
  </div>
)

const LoginLayoutRoute = ({ component, ...rest }) => {
  const renderFn = (Component?: Component) => (props: RouteProps) => {
    if (!Component) {
      return null
    }
    return <LoginLayout><Component {...props} /></LoginLayout>
  }

  return (
    <Route
      {...rest}
      render={renderFn(component)}
    />
  )
}

export default LoginLayoutRoute

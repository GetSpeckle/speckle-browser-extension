import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import App from '../containers/App'
import Term from '../components/account/Term'

export class Routes extends React.Component {
  renderRoutes () {
    return (
      <Switch>
        <Route path='/' component={App} exact={true} />
        <Route path='/term' component={Term} exact={true} />
      </Switch>
    )
  }

  render () {
    return (
      this.renderRoutes()
    )
  }
}

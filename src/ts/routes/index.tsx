import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import Term from '../components/account/Term'
import Login from '../components/account/Login'
import {
  HOME_ROUTE,
  TERM_SERVICE_ROUTE,
  CREATE_PASSWORD_ROUTE,
  IMPORT_OPTIONS_ROUTE,
  IMPORT_MNEMONIC_ROUTE,
  IMPORT_JSON_ROUTE,
  GENERATE_PHRASE_ROUTE,
  CONFIRM_PHRASE_ROUTE,
  SELECT_NETWORK_ROUTE,
  LOGIN_ROUTE,
  INITIALIZE_ROUTE,
  SEND_ROUTE,
  QR_ROUTE
} from '../constants/routes'
import { RouteWithLayout } from './RouteWithLayout'
import LoginLayout from '../layouts/LoginLayout'
import CreatePassword from '../components/account/CreatePassword'
import ImportOptions from '../components/account/ImportOptions'
import ImportMnemonic from '../components/account/ImportMnemonic'
import ImportJson from '../components/account/ImportJson'
import ConfirmPhrase from '../components/account/ConfirmPhrase'
import GeneratePhrase from '../components/account/GeneratePhrase'
import Authenticated from './authenticated/index'
import DashboardLayout from '../layouts/DashboardLayout'
import Dashboard from '../components/dashboard/Dashboard'
import Welcome from '../components/Welcome'
import ActionLayout from '../layouts/ActionLayout'
import ExtrinsicLayout from '../layouts/ExtrinsicLayout'
import Missing from '../components/Missing'
import Send from '../components/transaction/Send'
import SelectNetwork from '../components/account/SelectNetwork'
import QR from '../components/account/QR'

export class Routes extends React.Component {
  renderRoutes () {
    return (
      <Switch>
        <Authenticated
          layout={DashboardLayout}
          path={HOME_ROUTE}
          component={Dashboard}
          exact={true}
        />
        <Authenticated
          layout={ExtrinsicLayout}
          path={SEND_ROUTE}
          component={Send}
          exact={true}
        />
        <Authenticated
          layout={ExtrinsicLayout}
          path={QR_ROUTE}
          component={QR}
          exact={true}
        />
        <Authenticated
          layout={ActionLayout}
          path={IMPORT_MNEMONIC_ROUTE}
          component={ImportMnemonic}
          exact={true}
        />
        <Authenticated
          layout={ActionLayout}
          path={IMPORT_JSON_ROUTE}
          component={ImportJson}
          exact={true}
        />
        <Authenticated
          layout={ActionLayout}
          path={IMPORT_OPTIONS_ROUTE}
          component={ImportOptions}
          exact={true}
        />
        <RouteWithLayout
          layout={LoginLayout}
          path={TERM_SERVICE_ROUTE}
          component={Term}
          exact={true}
        />
        <RouteWithLayout
          layout={LoginLayout}
          path={CREATE_PASSWORD_ROUTE}
          component={CreatePassword}
          exact={true}
        />
        <RouteWithLayout
          layout={LoginLayout}
          path={GENERATE_PHRASE_ROUTE}
          component={GeneratePhrase}
          exact={true}
        />
        <RouteWithLayout
          layout={LoginLayout}
          path={CONFIRM_PHRASE_ROUTE}
          component={ConfirmPhrase}
          exact={true}
        />
        <RouteWithLayout
          layout={LoginLayout}
          path={SELECT_NETWORK_ROUTE}
          component={SelectNetwork}
          exact={true}
        />
        <RouteWithLayout
          layout={LoginLayout}
          path={LOGIN_ROUTE}
          component={Login}
          exact={true}
        />
        <Route
          path={INITIALIZE_ROUTE}
          component={Welcome}
          exact={true}
        />
        <Route
          component={Missing}
        />
      </Switch>
    )
  }

  render () {
    return (
      this.renderRoutes()
    )
  }
}

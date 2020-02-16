import React from 'react'
import { Route as ReactRoute, RouteProps } from 'react-router'
import * as PropTypes from 'prop-types'

export interface IRouteProps {
  layout?: React.ComponentType<RouteProps> | React.ComponentType<any>
  component: React.ComponentType<RouteProps> | React.ComponentType<any>
}

export class RouteWithLayout extends React.Component<IRouteProps & RouteProps, {}> {

  static propTypes = {
    component: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node
    ]).isRequired
  }

  render () {
    const { component, layout, ...rest } = this.props
    let routeComponent: (props) => React.ReactElement<RouteProps> = (props: any) =>
      React.createElement(component, props)

    if (layout) {
      routeComponent = props =>
        React.createElement(layout, props, React.createElement(component, props))
    }

    return <ReactRoute {...rest} render={routeComponent} />
  }
}

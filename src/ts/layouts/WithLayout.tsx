import React from 'react'
import { RouteProps } from 'react-router'
import * as PropTypes from 'prop-types'

export interface IWithLayoutProps {
  layout: React.ComponentType<any>
  component: React.ComponentType<any>
}

export class WithLayout extends React.Component<IWithLayoutProps, {}> {

  static propTypes = {
    layout: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node
    ]).isRequired,
    component: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node
    ]).isRequired
  }

  render () {
    const { component, layout } = this.props

    const routeComponent: (props) => React.ReactElement<RouteProps> = props =>
        React.createElement(layout, props, React.createElement(component, props))

    return routeComponent
  }
}

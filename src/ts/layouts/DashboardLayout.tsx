import React, { Component } from 'react'
import { connect } from 'react-redux'
import { IAppState } from '../background/store/all'
import { LayoutContainer } from '../components/basic-components'
import { Color } from '../components/styles/themes'
import TopMenu from '../components/dashboard/TopMenu'

interface IDashboardProps extends StateProps, DispatchProps {}

interface IDashboardState {
  color: Color
}

class DashboardLayout extends Component<IDashboardProps, IDashboardState> {

  getBackgroundImageUrl = () => {
    return `/assets/background/color-bg-${this.props.settings.color}.svg`
  }

  render () {

    const layoutStyle = {
      backgroundImage: `url(/assets/background/color-bg-${this.props.settings.color}.svg)`,
      backgroundRepeat: 'no-repeat'
    }

    return (
      <LayoutContainer style={layoutStyle}>
        <TopMenu />
        {this.props.children}
      </LayoutContainer>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings
  }
}

const mapDispatchToProps = {}
type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = typeof mapDispatchToProps

export default connect(mapStateToProps, mapDispatchToProps)(DashboardLayout)

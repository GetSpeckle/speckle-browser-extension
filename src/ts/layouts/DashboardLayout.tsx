import React, { Component } from 'react'
import { connect } from 'react-redux'
import { IAppState } from '../background/store/all'
import { LayoutContainer } from '../components/basic-components'
import TopMenu from '../components/dashboard/TopMenu'
import BottomMenu from '../components/dashboard/BottomMenu';

interface IDashboardProps extends StateProps, DispatchProps {}

class DashboardLayout extends Component<IDashboardProps> {

  render () {

    const layoutStyle = {
      backgroundImage: `url(/assets/background/color-bg-${this.props.settings.color}.svg)`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 375
    }

    return (
      <LayoutContainer style={layoutStyle}>
        <TopMenu />
        {this.props.children}
        <BottomMenu />
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

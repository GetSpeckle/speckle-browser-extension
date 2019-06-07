import React, { Component } from 'react'
import { connect } from 'react-redux'
import { IAppState } from '../background/store/all'
import { LayoutContainer } from '../components/basic-components'
import TopMenu from '../components/dashboard/TopMenu'
import BottomMenu from '../components/dashboard/BottomMenu'
import AccountDropdown from '../components/account/AccountDropdown'

interface IDashboardProps extends StateProps {}

class DashboardLayout extends Component<IDashboardProps> {

  render () {

    const layoutStyle = {
      backgroundImage: `url(/assets/background/color-bg-ext-${this.props.settings.color}.svg)`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 375
    }

    return (
      <LayoutContainer style={layoutStyle}>
        <TopMenu />
        <AccountDropdown/>
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

type StateProps = ReturnType<typeof mapStateToProps>

export default connect(mapStateToProps)(DashboardLayout)

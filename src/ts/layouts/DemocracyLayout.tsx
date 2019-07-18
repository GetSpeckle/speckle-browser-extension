import React, { Component } from 'react'
import { connect } from 'react-redux'
import { IAppState } from '../background/store/all'
import { LayoutContainer } from '../components/basic-components'
import TopMenu from '../components/dashboard/TopMenu'
import BottomMenu from '../components/dashboard/BottomMenu'
import '../../assets/app.css'
import ErrorMessage from '../components/error/ErrorMessage'

interface IDemocracyProps extends StateProps {}

class DemocracyLayout extends Component<IDemocracyProps> {

  render () {

    const layoutStyle = {
      backgroundImage: `url(/assets/background/color-bg-ext-${this.props.settings.color}.svg)`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 375
    }

    return (
      <LayoutContainer style={layoutStyle}>
        <TopMenu />
        <ErrorMessage message={this.props.error} style={alignMiddle}/>
        {this.props.children}
        <BottomMenu />
      </LayoutContainer>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings,
    error: state.error.message
  }
}

const alignMiddle = {
  width: 311,
  margin: 'auto'
}

type StateProps = ReturnType<typeof mapStateToProps>

export default connect(mapStateToProps)(DemocracyLayout)

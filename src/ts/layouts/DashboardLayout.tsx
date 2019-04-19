import React, { Component } from 'react'
import { connect } from 'react-redux'
import Image from 'semantic-ui-react/dist/commonjs/elements/Image/Image'
import { IAppState } from '../background/store/all'
import { LayoutContainer } from '../components/basic-components'
import { Color } from '../components/styles/themes'

interface ILoginLayoutProp extends StateProps, DispatchProps {}

interface ILoginLayoutState {
  color: Color
}

class DashboardLayout extends Component<ILoginLayoutProp, ILoginLayoutState> {

  getBackgroundImageUrl = () => {
    return `/assets/background/color-bg-${this.props.settings.color}.svg`
  }

  render () {
    return (
      <LayoutContainer>
        <Image src={this.getBackgroundImageUrl()} />
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

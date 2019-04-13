import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Image from 'semantic-ui-react/dist/commonjs/elements/Image/Image'
import { IAppState } from '../background/store/all'

interface ILoginLayoutProp extends StateProps, DispatchProps {}

interface ILoginLayoutState {
  color: string
}

class DashboardLayout extends Component<ILoginLayoutProp, ILoginLayoutState> {

  getBackgroundImageUrl = () => {
    return `/assets/background/color-bg-${this.props.settings.color}.svg`
  }

  render () {
    return (
      <DashboardStyleContainer>
        <Image src={this.getBackgroundImageUrl()} />
        {this.props.children}
      </DashboardStyleContainer>
    )
  }
}

const DashboardStyleContainer = styled('div')`
    width: 375px;
    height: 667px;
    border-radius: 4px;
    box-shadow: 0 6px 30px 0 rgba(0, 0, 0, 0.08);
    border: solid 1px #e7e7e7;
    background-color: #ffffff;
`

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings
  }
}

const mapDispatchToProps = {}
type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = typeof mapDispatchToProps

export default connect(mapStateToProps, mapDispatchToProps)(DashboardLayout)

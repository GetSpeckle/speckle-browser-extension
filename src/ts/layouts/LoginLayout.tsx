import React, { Component } from 'react'
import { connect } from 'react-redux'
import Image from 'semantic-ui-react/dist/commonjs/elements/Image/Image'
import { IAppState } from '../background/store/all'
import { LayoutContainer } from '../components/basic-components'

interface ILoginLayoutProp extends StateProps, DispatchProps {}

class LoginLayout extends Component<ILoginLayoutProp> {

  getHeaderImageUrl = () => {
    return `/assets/header/header_${this.props.settings.color}.svg`
  }

  render () {
    return (
    <LayoutContainer>
      <Image src={this.getHeaderImageUrl()} />
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginLayout)

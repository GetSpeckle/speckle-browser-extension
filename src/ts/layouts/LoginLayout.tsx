import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Image from 'semantic-ui-react/dist/commonjs/elements/Image/Image'
import { IAppState } from '../background/store/all'

interface ILoginLayoutProp extends StateProps, DispatchProps {}

interface ILoginLayoutState {
  color: string
}

class LoginLayout extends Component<ILoginLayoutProp, ILoginLayoutState> {

  getHeaderImageUrl = () => {
    return `/assets/header/header_${this.props.settings.color}.svg`
  }

  render () {
    return (
    <LoginStyleContainer>
      <Image src={this.getHeaderImageUrl()} size='tiny'/>
      {this.props.children}
    </LoginStyleContainer>
    )
  }
}

const LoginStyleContainer = styled('div')`
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginLayout)

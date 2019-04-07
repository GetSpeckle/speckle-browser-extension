import React, { Component } from 'react'
import styled from 'styled-components'
import Image from 'semantic-ui-react/dist/commonjs/elements/Image/Image'

export class LoginLayout extends Component {
  render () {
    return (
    <LoginStyleContainer>
      <Image src='/assets/header_blue.svg' size='tiny'/>
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

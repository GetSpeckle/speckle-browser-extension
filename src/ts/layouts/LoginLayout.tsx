import React, { Component } from 'react'
import { connect } from 'react-redux'
import { IAppState } from '../background/store/all'
import { LayoutContainer } from '../components/basic-components'
import ErrorMessage from '../components/error/ErrorMessage'
import LoginFooter from '../components/account/LoginFooter'
import Header from './Header'
import { colorSchemes } from '../components/styles/themes'

interface ILoginLayoutProps extends StateProps, DispatchProps {
}

class LoginLayout extends Component<ILoginLayoutProps> {
  render () {
    return (
      <LayoutContainer>
        <Header colorScheme={colorSchemes[this.props.settings.color]}/>
        <ErrorMessage message={this.props.error} style={alignMiddle}/>
        {this.props.children}
        <LoginFooter/>
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

const mapDispatchToProps = {}
type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = typeof mapDispatchToProps

const alignMiddle = {
  width: 311,
  margin: 'auto'
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginLayout)

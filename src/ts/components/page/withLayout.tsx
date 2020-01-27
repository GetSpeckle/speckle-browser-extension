import * as React from 'react'
import { LayoutContainer } from '../basic-components'
import Header from '../../layouts/Header'

const withLayout = (WrappedComponent) => {

  const HOC = (props) => {
    const { settings } = props
    return (
        <LayoutContainer>
          <Header color={settings.color}/>
          <WrappedComponent
            {...props}
          />
        </LayoutContainer>
    )
  }
  return HOC
}

export default withLayout

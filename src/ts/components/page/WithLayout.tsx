import * as React from 'react'
import { LayoutContainer } from '../basic-components'
import Header from '../../layouts/Header'

const WithLayout = (WrappedComponent) => {

  const HOC = (props) => {
    return (
        <LayoutContainer>
          <Header/>
          <WrappedComponent
            {...props}
          />
        </LayoutContainer>
    )
  }
  return HOC
}

export default WithLayout

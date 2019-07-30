import * as React from 'react'
import { LayoutContainer } from '../basic-components'
import { colorSchemes } from '../styles/themes'
import Header from '../../layouts/Header'

const WithLayout = (WrappedComponent) => {

  const HOC = (props) => {
    const { settings } = props
    return (
        <LayoutContainer>
          <Header colorScheme={colorSchemes[settings.color]}/>
          <WrappedComponent
            {...props}
          />
        </LayoutContainer>
    )
  }
  return HOC
}

export default WithLayout

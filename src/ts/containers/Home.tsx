import { browser } from 'webextension-polyfill-ts'
import * as React from 'react'
import styled from 'styled-components'

class Home extends React.Component {

  render () {
    let hello = browser.i18n.getMessage('welcome')
    return (
      <HomeContainer>
        <div>{hello} </div>
      </HomeContainer>
    )
  }
}

export default Home

const HomeContainer = styled('div')`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    min-width: 100px;
    padding: 5px;
    margin: 5px;
    background-color: ${p => p.theme.backgroundColor};
`

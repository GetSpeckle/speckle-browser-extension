import t from '../services/i18n'
import * as React from 'react'
import { Image } from 'semantic-ui-react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

class Home extends React.Component {

  render () {
    return (
       <LandingContainer>
          <Image src='/assets/logo-3-x.svg' size='tiny' />
          <Image src='/assets/icon-dots.svg' size='small' />
          <div>
            {t('welcome')}
          </div>
          <Link to='/term'>Term</Link>
        </LandingContainer>
    )
  }
}

const LandingContainer = styled('div')`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
    margin: 5px;
    background-color: ${p => p.theme.backgroundColor};
`

export default Home

import t from '../services/i18n'
import * as React from 'react'
import { Image, Button } from 'semantic-ui-react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { TERM_SERVICE_ROUTE } from '../constants/routes'

interface IHomeProp {
  changeColor: (color: string) => any,
  color: string
}

interface IHomeState {
  color: string
}

export default class App extends React.Component<IHomeProp, IHomeState> {
  state: IHomeState = {
    color: 'red'
  }

  handleChangeColor = () => {
    console.log('Color is changed to %s', this.state.color)
    this.props.changeColor(this.state.color)
  }

  render () {
    return (
       <LandingContainer>
          <Image src='/assets/logo-3-x.svg' size='tiny' />
          <Image src='/assets/icon-dots.svg' size='small' />
          <div>
            {t('welcome')}
            <div>Current color: {this.props.color}</div>
            <Button onClick={this.handleChangeColor}>Change color to red</Button>
          </div>
          <Link to={TERM_SERVICE_ROUTE}>Term</Link>
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

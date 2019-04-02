import t from '../services/i18n'
import * as React from 'react'
import { Image, Button } from 'semantic-ui-react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { IAppState } from '../background/store/all'
import { connect } from 'react-redux'
import { changeColor } from '../background/store/settings'

interface IHomeProp extends StateProps, DispatchProps {}

interface IHomeState {
  color: string
}

class Home extends React.Component<IHomeProp, IHomeState> {

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
            <Button onClick={this.handleChangeColor}>Chage color to red</Button>
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
const mapStateToProps = (state: IAppState) => {
  return {
    color: state.settings.color
  }
}

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = typeof mapDispatchToProps

const mapDispatchToProps = { changeColor }

export default connect(mapStateToProps, mapDispatchToProps)(Home)

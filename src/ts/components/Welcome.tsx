import t from '../services/i18n'
import * as React from 'react'
import { Image, Button } from 'semantic-ui-react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { TERM_SERVICE_ROUTE } from '../constants/routes'
import { IAppState } from '../background/store/all'
import { connect } from 'react-redux'
import { saveSettings } from '../background/store/settings'
import { ThemeTypes } from './styles/themes'
import ImageMapper from 'react-image-mapper'

interface IWelcomeProp extends StateProps, DispatchProps {}

interface IWelcomeState {
  color: string,
  theme: ThemeTypes
}

class Welcome extends React.Component<IWelcomeProp, IWelcomeState> {

  state: IWelcomeState = {
    color: 'red',
    theme: 'light'
  }

  imageMap = {
    name: "image-map",
    areas: [
      { name: "blue", shape: "circle", coords: [94, 94, 40 ], preFillColor: "blue", fillColor: "blue"  },
      { name: "red", shape: "circle", coords: [170, 100, 25 ], preFillColor: "red", fillColor: "red" },
      { name: "purple", shape: "circle", coords: [170, 100, 25 ], preFillColor: "purple", fillColor: "purple" },
      { name: "orange", shape: "circle", coords: [170, 100, 25 ], preFillColor: "orange", fillColor: "orange"  },
      { name: "green", shape: "circle", coords: [170, 100, 25 ], preFillColor: "green", fillColor: "green" },
    ]
  }

  handleChangeColor = () => {
    console.log('Color is changed to %s', this.state.color)
    this.props.saveSettings({ ...this.props.settings, color: this.state.color })
  }

  handleChangeTheme = () => {
    this.props.saveSettings({ ...this.props.settings, theme: this.state.theme })
  }

  render () {
    return (
       <WelcomeContainer>
          <Image src='/assets/logo-3-x.svg' size='tiny' />
          <Image src='/assets/icon-dots.svg' size='small' />
          <ImageMapper src={'/assets/icon-doWhileStatement.svg'} map={this.imageMap} width={208}></ImageMapper>
          <div>
            {t('welcome')}
            <div>Current color: {this.props.settings.color}</div>
            <Button onClick={this.handleChangeColor}>Change color to red</Button>

            <div>Current theme: {this.props.settings.theme}</div>
            <Button onClick={this.handleChangeTheme}>Change them to light</Button>

          </div>
          <Link to={TERM_SERVICE_ROUTE}>Term</Link>
        </WelcomeContainer>
    )
  }
}

const WelcomeContainer = styled('div')`
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
    settings: state.settings
  }
}

const mapDispatchToProps = { saveSettings }

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = typeof mapDispatchToProps

export default connect(mapStateToProps, mapDispatchToProps)(Welcome)

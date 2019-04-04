import t from '../services/i18n'
import * as React from 'react'
import { Image } from 'semantic-ui-react'
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
    name: 'image-map',
    areas: [
      { name: 'blue', shape: 'circle', coords: [103, 104, 40 ], fillColor: '#44C5EE' },
      { name: 'purple', shape: 'circle', coords: [173, 36, 25 ], fillColor: '#D396FF' },
      { name: 'orange', shape: 'circle', coords: [170, 173, 25 ], fillColor: 'FFC10B' },
      { name: 'green', shape: 'circle', coords: [33, 172, 25 ], fillColor: '51DFB0' },
      { name: 'red', shape: 'circle', coords: [34, 35, 25 ], fillColor: '#FF7396' }
    ]
  }

  handleChangeColor = (area: any) => {
    console.log('Color is changed to %s', area.name)
    this.props.saveSettings({ ...this.props.settings, color: area.name })
  }

  handleChangeTheme = () => {
    this.props.saveSettings({ ...this.props.settings, theme: this.state.theme })
  }

  render () {
    return (
       <WelcomeContainer>
          <Image src='/assets/logo-3-x.svg' size='tiny' />
          <ImageMapper
            src={'/assets/icon-dots.svg'}
            map={this.imageMap}
            width={208}
            imgWidth={208}
            onClick={this.handleChangeColor}
          />
          <div>
            {t('pickColorTitle')}
          </div>

          <div>
            {t('pickColorDescription')}
          </div>

          <div>Click above to change color. Current color: {this.props.settings.color}</div>

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

import t from '../services/i18n'
import * as React from 'react'
import { Image } from 'semantic-ui-react'
import styled from 'styled-components'
import { TERM_SERVICE_ROUTE } from '../constants/routes'
import { IAppState } from '../background/store/all'
import { connect } from 'react-redux'
import { saveSettings } from '../background/store/settings'
import { ThemeTypes } from './styles/themes'
import ImageMapper from 'react-image-mapper'
import { withRouter, RouteComponentProps } from 'react-router'

interface IWelcomeProp extends StateProps, DispatchProps, RouteComponentProps {}

interface IWelcomeState {
  color: string,
  theme: ThemeTypes
}

class Welcome extends React.Component<IWelcomeProp, IWelcomeState> {

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
    const { history } = this.props
    this.props.saveSettings({ ...this.props.settings, color: area.name })
    history.push(TERM_SERVICE_ROUTE)
  }

  render () {
    return (
       <WelcomeContainer>
         <LogoContainer><Image src='/assets/logo-3-x.svg' /></LogoContainer>
         <ColorPickerContainer><ImageMapper
            src={'/assets/icon-dots.svg'}
            map={this.imageMap}
            width={208}
            imgWidth={208}
            onClick={this.handleChangeColor}
         /></ColorPickerContainer>
          <Title>
            {t('pickColorTitle')}
          </Title>

          <Text>
            {t('pickColorDescription')}
          </Text>

          <Text>Click above to change color. Current color: {this.props.settings.color}</Text>

          <Text>{t('speckleIntroduction')}</Text>

        </WelcomeContainer>
    )
  }
}

const WelcomeContainer = styled('div')`
    text-align: center;
    width: 375px;
    height: 667px;
    border-radius: 4px;
    box-shadow: 0 6px 30px 0 rgba(0, 0, 0, 0.08);
    border: solid 1px #e7e7e7;
    background-color: #ffffff;
`
const LogoContainer = styled(Image)`
    margin: 36px auto 68px;
    width: 150px;
    height: 65px;
    object-fit: contain;
`
const ColorPickerContainer = styled('div')`
    width:208px;
    height: 208px;
    margin: 0 auto 68px;
`
const Text = styled.p`
    width: 327px;
    margin:18px auto;
    opacity: 0.6;
    font-family: Nunito;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #3e5860;
`
const Title = styled(Text)`
    width: 311px;
    height: 26px;
    font-size: 19px;
    font-weight: bold;
    color: #30383B;
`

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings
  }
}

const mapDispatchToProps = { saveSettings }

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = typeof mapDispatchToProps

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Welcome))

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
import { LayoutContainer, Section, Title } from './basic-components'

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
       <LayoutContainer>
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
          <Section>
            {t('pickColorDescription')}
          </Section>
          <Section>Click above to change color. Current color: {this.props.settings.color}</Section>
          <Section>{t('speckleIntroduction')}</Section>
        </LayoutContainer>
    )
  }
}

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

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings
  }
}

const mapDispatchToProps = { saveSettings }

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = typeof mapDispatchToProps

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Welcome))

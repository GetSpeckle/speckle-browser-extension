import t from '../services/i18n'
import * as React from 'react'
import { Image } from 'semantic-ui-react'
import styled from 'styled-components'
import { TERM_SERVICE_ROUTE } from '../constants/routes'
import { IAppState } from '../background/store/all'
import { connect } from 'react-redux'
import { saveSettings } from '../background/store/settings'
import { colorSchemes } from './styles/themes'
import ImageMapper from 'react-image-mapper'
import { withRouter, RouteComponentProps } from 'react-router'
import {
  LayoutContainer,
  SecondaryText,
  ContentContainer,
  Section,
  Title
} from './basic-components'
import LoginFooter from './account/LoginFooter'

interface IWelcomeProps extends StateProps, DispatchProps, RouteComponentProps {
}

interface IWelcomeState {
  color: string
}

class Welcome extends React.Component<IWelcomeProps, IWelcomeState> {

  state = {
    color: colorSchemes[this.props.settings.color].backgroundColor
  }

  imageMap = {
    name: 'image-map',
    areas: [
      {
        name: 'blue',
        shape: 'circle',
        coords: [103, 104, 40],
        fillColor: '#44C5EE'
      },
      {
        name: 'purple',
        shape: 'circle',
        coords: [172, 36, 25],
        fillColor: '#D396FF'
      },
      {
        name: 'orange',
        shape: 'circle',
        coords: [170, 173, 25],
        fillColor: '#FFC10B'
      },
      {
        name: 'green',
        shape: 'circle',
        coords: [33, 172, 25],
        fillColor: '#51DFB0'
      },
      {
        name: 'red',
        shape: 'circle',
        coords: [34, 35, 25],
        fillColor: '#FF7396'
      }
    ]
  }

  handleChangeColor = (area: any) => {
    const { history } = this.props
    this.props.saveSettings({ ...this.props.settings, color: area.name })
    history.push(TERM_SERVICE_ROUTE)
  }

  // TODO investigate why this is not triggered
  handleMouseover = (area: any) => {
    console.log(area.name)
    this.setState({ color: colorSchemes[area.name].backgroundColor })
  }

  render () {
    return (
      <LayoutContainer>
        <div><Image src='/assets/logo-3-x.svg' style={logo}/></div>
        <ColorPickerContainer><ImageMapper
          src={'/assets/icon-dots.svg'}
          map={this.imageMap}
          onMouseover={this.handleMouseover}
          onClick={this.handleChangeColor}
        /></ColorPickerContainer>
        <ContentContainer>
          <Section>
            <Title>
              {t('pickColorTitle')}
            </Title>
          </Section>
          <Section>
            <SecondaryText style={{ textAlign: 'center' }}>
              {t('pickColorDescription')}
            </SecondaryText>
          </Section>
          <Section>
            <OvalContainer>
              <Oval color={this.state.color}/>
              <Oval color={this.state.color}/>
              <Oval color={this.state.color}/>
            </OvalContainer>
          </Section>
          <Section>
            <SecondaryText style={{ textAlign: 'center' }}>
              {t('speckleIntroduction')}
            </SecondaryText>
          </Section>
        </ContentContainer>
        <LoginFooter />
      </LayoutContainer>
    )
  }
}

const logo = {
  marginTop: 36,
  marginBottom: 36,
  marginLeft: 'auto',
  marginRight: 'auto',
  width: 150,
  height: 65
}

const ColorPickerContainer = styled.div`
  width:208px;
  height: 208px;
  margin: 0 auto 36px;
`

type OvalProp = {
  color: string
}

const Oval = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: ${(p: OvalProp) => p.color};
`

const OvalContainer = styled.div`
  width: 100px;
  display: flex;
  margin: auto;
  justify-content: space-around;
  align-items: center;
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

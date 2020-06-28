import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import { Dropdown, Image, DropdownProps, Dimmer, Loader } from 'semantic-ui-react'
import { chains } from '../../constants/chains'
import { IAppState } from '../../background/store/all'
import { saveSettings } from '../../background/store/settings'
import styled from 'styled-components'
import SettingsMenu from './SettingsMenu'
import { createApi, destroyApi } from '../../background/store/api-context'
import { colorSchemes } from '../styles/themes'
import { ApiOptions } from '@polkadot/api/types'
import { WsProvider } from '@polkadot/rpc-provider'
import t from '../../services/i18n'

interface ITopMenuProps extends StateProps, DispatchProps, RouteComponentProps {}

interface ITopMenuState {
  chainIconUrl: string,
  profileIconClicked: boolean
}

class TopMenu extends React.Component<ITopMenuProps, ITopMenuState> {

  state = {
    chainIconUrl: chains[this.props.settings.chain].iconUrl,
    profileIconClicked: false
  }

  componentDidMount () {
    const { apiContext } = this.props
    if (!apiContext || !apiContext.apiReady) {
      this.createApi()
    }
  }

  componentDidUpdate (prevProps: Readonly<ITopMenuProps>) {
    if (this.props.settings.chain !== prevProps.settings.chain) {
      this.createApi()
    }
  }

  createApi = () => {
    const { settings } = this.props
    const chain = chains[settings.chain]
    const provider = new WsProvider(chain.rpcServer)
    let apiOptions: ApiOptions = { provider, types: chain.definition.types }
    this.props.createApi(apiOptions)
  }

  destroyApi = () => {
    const { provider } = this.props.apiContext
    provider && provider.isConnected() && provider.disconnect()
    this.props.destroyApi()
  }

  changeChain = (_e: any, { value }: DropdownProps) => {
    if (value) {
      const chain = value.toString()
      this.setState({
        chainIconUrl: chains[chain].iconUrl
      })

      this.destroyApi()
      this.props.saveSettings({ ...this.props.settings, chain })
    }
  }

  handleProfileIconClick = () => {
    this.setState({ profileIconClicked: !this.state.profileIconClicked })
  }

  closeSettingsMenu = () => {
    this.setState({ profileIconClicked: false })
  }

  renderSettingsMenu = () => {
    const profileIconClicked = this.state.profileIconClicked
    let settingsMenu = <span/>

    if (profileIconClicked) {
      settingsMenu = (
        <SettingsMenu
          topMenuProps={this.props}
          closeSettingsMenu={this.closeSettingsMenu}
        />
      )
    }
    return settingsMenu
  }

  render () {
    const chainOptions = Object.keys(chains).map(n => {
      const chain = chains[n]
      return {
        key: chain.name,
        text: chain.name,
        value: chain.name,
        image: { src: chain.iconUrl }
      }
    })

    const dropdownMenuStyle = {
      backgroundColor: colorSchemes[this.props.settings.color].backgroundColor
    }

    const { apiContext } = this.props

    return (
      <div>
        <Dimmer active={!apiContext.apiReady && !apiContext.failed}>
          <Loader indeterminate={true}>{t('connecting')}</Loader>
        </Dimmer>
        <div className='top-menu'>
          <Grid>
            <div style={{ width: 70 }}>
              <Image src='/assets/logo-s.svg' centered={true} />
            </div>

            <div style={{ width: 190 }}>
              <Dropdown
                style={dropdownMenuStyle}
                className='selection chain'
                fluid={true}
                value={this.props.settings.chain}
                onChange={this.changeChain}
                icon={<img src={this.state.chainIconUrl} alt='Chain logo'/>}
                options={chainOptions}
              />
            </div>

            <div style={{ width: 50 }}>
              <MenuOption
                onClick={this.handleProfileIconClick}
                data-click={this.state.profileIconClicked}
              >
                <Image
                    src='/assets/icon-profile.svg'
                    centered={true}
                    hidden={this.state.profileIconClicked}
                />
              </MenuOption>
            </div>
          </Grid>
        </div>
        {this.renderSettingsMenu()}
      </div>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings,
    apiContext: state.apiContext
  }
}

const MenuOption = styled.div`
  border: ${props => props['data-click'] ? '0px' : '2px solid #FFFFFF'};
  border-radius: 7px;
  width: 50px;
  height: 25px;
  line-height: 21px;
  margin-left: 2px;
  cursor: pointer;
`

const Grid = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%
`

type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = { saveSettings, createApi, destroyApi }

type DispatchProps = typeof mapDispatchToProps

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TopMenu))

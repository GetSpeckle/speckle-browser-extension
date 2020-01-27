import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import { Image, Grid, Dimmer, Loader } from 'semantic-ui-react'
import { networks } from '../../constants/networks'
import t from '../../services/i18n'
import { WsProvider } from '@polkadot/rpc-provider'
import { IAppState } from '../../background/store/all'
import { saveSettings } from '../../background/store/settings'
import { getTransactions } from '../../background/store/transaction'
import { ChainDropdown } from '../basic-components'
import styled from 'styled-components'
import SettingsMenu from './SettingsMenu'
import { ApiOptions } from "@polkadot/api/types"
import { createApi, destroyApi } from "../../background/store/api-context"
import {setError} from "../../background/store/error";

interface ITopMenuProps extends StateProps, DispatchProps, RouteComponentProps {}

interface ITopMenuState {
  network: string,
  tries: number,
  chainIconUrl: string,
  profileIconClicked: boolean
}

class TopMenu extends React.Component<ITopMenuProps, ITopMenuState> {

  state = {
    network: this.props.settings.network,
    chainIconUrl: networks[this.props.settings.network].chain.iconUrl,
    profileIconClicked: false,
    tries: 0
  }

  componentDidUpdate (prevProps, _prevState) {
    if(!this.props.apiContext.apiReady
        && prevProps.settings.network !== this.props.settings.network){
      this.recreateApi()
    }
  }

  changeNetwork = (_e: any, data: { value: string; }) => {
    this.setState({
      network: data.value,
      chainIconUrl: networks[data.value].chain.iconUrl
    })

    const { apiContext } = this.props
    apiContext.provider && this.props.destroyApi(apiContext.provider)

    this.props.saveSettings({ ...this.props.settings, network: data.value })
    // load transactions for the selected network
    if (this.props.settings.selectedAccount) {
      this.props.getTransactions(this.props.settings.selectedAccount.address, data.value)
    }
  }

  recreateApi = () => {
    const { apiContext, settings } = this.props
    if (apiContext.apiReady) {
      // api is ready
      return
    }

    this.setState({ ...this.state, tries: this.state.tries++ })
    const network = networks[settings.network]
    const provider = new WsProvider(network.rpcServer)
    let apiOptions: ApiOptions = { provider, types: network.types }
    this.props.createApi(apiOptions)
    if (this.state.tries <= 5) {
      // try to connect in 3 seconds
      setTimeout(this.recreateApi, 3000)
      return
    }

    // network error handling, prompt user an error
    this.props.setError(t('networkError'))
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

  componentWillUnmount () {
    this.props.setError(null)
  }

  render () {
    const networkOptions = Object.keys(networks).map(n => {
      const network = networks[n]
      return {
        key: network.name,
        text: network.name,
        value: network.name,
        image: { src: network.chain.iconUrl }
      }
    })

    return (
      <div>
        <Dimmer active={!this.props.apiContext.apiReady && (this.state.tries > 0 && this.state.tries <= 5) }>
          <Loader indeterminate={true}> Connecting to network, please wait ...</Loader>
        </Dimmer>
        <div className='top-menu'>
          <Grid centered={true} textAlign='center'>
            <Grid.Column width={4} verticalAlign='middle'>
              <Image src='/assets/logo-s.svg' centered={true} />
            </Grid.Column>

            <Grid.Column width={8} >
              <ChainDropdown
                className='chain'
                fluid={true}
                value={this.props.settings.network}
                onChange={this.changeNetwork}
                icon={<img src={this.state.chainIconUrl} alt='Chain logo'/>}
                options={networkOptions}
              />
            </Grid.Column>

            <Grid.Column width={1} verticalAlign='middle'>
              <Image src='/assets/icon-dots-s.svg' centered={true} />
            </Grid.Column>

            <Grid.Column width={2} verticalAlign='middle'>
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
            </Grid.Column>
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
  border:  ${props => props['data-click'] ? '0px' : '2px solid #FFFFFF'};
  border-radius: 7px;
  width: 50px;
  height: 25px;
  line-height: 21px;
  margin-left: 2px;
  cursor: pointer;
`

type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = { saveSettings, getTransactions, createApi, destroyApi, setError}

type DispatchProps = typeof mapDispatchToProps

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TopMenu))

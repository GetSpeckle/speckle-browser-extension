import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import { Image, Grid } from 'semantic-ui-react'
import { networks } from '../../constants/networks'
import { IAppState } from '../../background/store/all'
import { saveSettings } from '../../background/store/settings'
import { getTransactions } from '../../background/store/transaction'
import { ChainDropdown } from '../basic-components'
import styled from 'styled-components'
import SettingsMenu from './SettingsMenu'
import { destroyApi } from '../../background/store/api-context'

interface ITopMenuProps extends StateProps, DispatchProps, RouteComponentProps {}

interface ITopMenuState {
  chainIconUrl: string,
  profileIconClicked: boolean
}

class TopMenu extends React.Component<ITopMenuProps, ITopMenuState> {

  state = {
    chainIconUrl: networks[this.props.settings.network].chain.iconUrl,
    profileIconClicked: false
  }

  changeNetwork = (_e: any, data: { value: string; }) => {
    this.setState({
      chainIconUrl: networks[data.value].chain.iconUrl
    })

    const { provider } = this.props.apiContext
    provider && provider.isConnected() && provider.disconnect()
    this.props.destroyApi()

    this.props.saveSettings({ ...this.props.settings, network: data.value })
    // load transactions for the selected network
    if (this.props.settings.selectedAccount) {
      this.props.getTransactions(this.props.settings.selectedAccount.address, data.value)
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

const mapDispatchToProps = { saveSettings, getTransactions, destroyApi }

type DispatchProps = typeof mapDispatchToProps

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TopMenu))

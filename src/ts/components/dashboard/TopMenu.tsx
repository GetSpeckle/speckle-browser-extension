import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import { Image, Grid } from 'semantic-ui-react'
import { networks } from '../../constants/networks'
import { IAppState } from '../../background/store/all'
import { saveSettings } from '../../background/store/settings'
import { ChainDropdown } from '../basic-components'
import SettingsMenu from './SettingsMenu'

interface ITopMenuProps extends StateProps, DispatchProps, RouteComponentProps {}

interface ITopMenuState {
  network: string,
  chainIconUrl: string,
  profileIconClicked: boolean
}

class TopMenu extends React.Component<ITopMenuProps, ITopMenuState> {

  state = {
    network: this.props.settings.network,
    chainIconUrl: networks[this.props.settings.network].chain.iconUrl,
    profileIconClicked: false
  }

  changeNetwork = (_e: any, data: { value: string; }) => {
    console.log(_e)
    this.setState({
      network: data.value,
      chainIconUrl: networks[data.value].chain.iconUrl
    })
    this.props.saveSettings({ ...this.props.settings, network: data.value })
  }

  handleProfileClick = () => {
    this.setState({ profileIconClicked: !this.state.profileIconClicked })
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
            <Grid.Column width={3} verticalAlign='middle'>
              <Image src='/assets/logo-s.svg' centered={true} />
            </Grid.Column>

            <Grid.Column width={8} >
              <ChainDropdown
                className='chain'
                fluid={true}
                value={this.state.network}
                onChange={this.changeNetwork}
                icon={<img src={this.state.chainIconUrl} alt='Chain logo'/>}
                options={networkOptions}
              />
            </Grid.Column>

            <Grid.Column width={2} verticalAlign='middle'>
              <Image src='/assets/icon-dots-s.svg' centered={true} />
            </Grid.Column>

            <Grid.Column width={2} verticalAlign='middle'>
              <Image
                  src='/assets/icon-profile.svg'
                  centered={true}
                  hidden={this.state.profileIconClicked}
                  onClick={this.handleProfileClick}
              />
            </Grid.Column>
          </Grid>
        </div>
        {this.state.profileIconClicked ? <SettingsMenu parentProps={this.props} /> : null}
      </div>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings
  }
}

type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = { saveSettings }

type DispatchProps = typeof mapDispatchToProps

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TopMenu))

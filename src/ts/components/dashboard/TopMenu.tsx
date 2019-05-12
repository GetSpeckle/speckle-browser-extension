import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import { Image, Grid } from 'semantic-ui-react'
import { ChainDropdown } from '../basic-components'
import { networks } from '../../constants/networks'
import { IAppState } from '../../background/store/all'

interface ITopMenuProps extends StateProps, RouteComponentProps {}

class TopMenu extends React.Component<ITopMenuProps> {

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
      <div className='top-menu'>
        <Grid centered={true} textAlign='center'>
            <Grid.Column width={3} verticalAlign='middle'>
              <Image src='/assets/logo-s.svg' centered={true} />
            </Grid.Column>

            <Grid.Column width={9} >
              <ChainDropdown
                className='chain'
                placeholder='Select Chain'
                fluid={true}
                selection={true}
                value={this.props.settings.network}
                icon={<img src={networks[this.props.settings.network].chain.iconUrl} alt='Chain Icon'/>}
                options={networkOptions}
              />
            </Grid.Column>

            <Grid.Column width={2} verticalAlign='middle'>
              <Image src='/assets/icon-dots-s.svg' centered={true} />
            </Grid.Column>

            <Grid.Column width={2} verticalAlign='middle'>
              <Image src='/assets/icon-profile.svg' centered={true} />
            </Grid.Column>
        </Grid>
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

export default withRouter(connect(mapStateToProps)(TopMenu))

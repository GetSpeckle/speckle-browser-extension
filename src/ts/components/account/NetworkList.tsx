import * as React from 'react'
import { connect } from 'react-redux'
import { Tab } from 'semantic-ui-react'
import { IAppState } from '../../background/store/all'
import { getTransactions } from '../../background/store/transaction'
import t from '../../services/i18n'
import styled from 'styled-components'

interface INetworkListProps extends StateProps {}

class NetworkList extends React.Component<INetworkListProps> {

  render () {

    const panes = [
      { menuItem: t('popular'), render: () => this.renderWithFilter('Popular') },
      { menuItem: t('recommended'), render: () => this.renderWithFilter('Recommended') },
      { menuItem: t('games'), render: () => this.renderWithFilter('Games') },
      { menuItem: t('trade'), render: () => this.renderWithFilter('Trade') }
    ]

    const color = this.props.color

    return (
      <div style={{ 'width': '224px' }}>
        <Tab
          menu={{ color: color, secondary: true, pointing: true }}
          panes={panes}
        />
      </div>
    )
  }

  renderWithFilter = (/*type: NetworkType | ''*/ type) => {

    // TODO: filter network with the network type
    console.log('prepare to render Networks ... ', type)

    return (

      <CardPane>
          <NetworkCard>
            <NetworkImage src={'assets/chain-logo/polkadot.png'} alt={'chain-logo'}/>
            <NetworkName>Alexander</NetworkName>
          </NetworkCard>
          <NetworkCard>
            <NetworkImage src={'assets/chain-logo/substrate.png'} alt={'chain-logo'}/>
            <NetworkName>Charred Cherry</NetworkName>
          </NetworkCard>
          <NetworkCard>
            <NetworkImage src={'assets/chain-logo/kusama.png'} alt={'chain-logo'}/>
            <NetworkName>Kusama(coming soon)</NetworkName>
          </NetworkCard>
      </CardPane>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    color: state.settings.color
  }
}

type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = { getTransactions }

export default (connect(mapStateToProps, mapDispatchToProps)(NetworkList))

const NetworkCard = styled.div`
width: 100px
height: 100px
border-radius: 4px
box-shadow: 0 2px 8px 0 rgba(62, 88, 96, 0.1);
justify-content: center
background-color: #ffffff
margin-left: 12px
`
const NetworkImage = styled.img`
  margin-top: 12px
  width: 48px
  height: 48px
  object-fit: contain
`

const NetworkName = styled.p`
width: 70px
margin-top: 12px
font-size: 12px
color: #3e5860
font-weight: bold
font-family: Nunito
`

const CardPane = styled(Tab.Pane)`
width: 500px !important
display: flex !important
justify-content: center
margin: 12px
`

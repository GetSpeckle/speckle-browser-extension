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
      <div>
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

      <CardTabPane>
        <CarouselWrapper>
        <CardCarousel>
          <NetworkCard>
            <NetworkDetail>
              <NetworkImage src={'assets/chain-logo/polkadot.png'} alt={'chain-logo'}/>
              <NetworkName><p>Alexander</p></NetworkName>
            </NetworkDetail>
          </NetworkCard>
          <NetworkCard>
            <NetworkDetail>
              <NetworkImage src={'assets/chain-logo/substrate.png'} alt={'chain-logo'}/>
              <NetworkName><p>Charred Cherry</p></NetworkName>
            </NetworkDetail>
          </NetworkCard>
          <NetworkCard>
            <NetworkDetail>
              <NetworkImage src={'assets/chain-logo/kusama.png'} alt={'chain-logo'}/>
              <NetworkName>
                <ComingSoon>Kusama<br/><span>(coming soon)</span></ComingSoon>
              </NetworkName>
            </NetworkDetail>
          </NetworkCard>
        <NetworkCard>
          <NetworkDetail>
            <NetworkImage src={'assets/chain-logo/bitcoin.png'} alt={'chain-logo'}/>
            <NetworkName>
              <p>Bitcoin</p>
            </NetworkName>
          </NetworkDetail>
        </NetworkCard>
        <NetworkCard>
          <NetworkDetail>
            <NetworkImage src={'assets/chain-logo/ethereum.png'} alt={'chain-logo'}/>
            <NetworkName>
              <p>Ethereum</p>
            </NetworkName>
          </NetworkDetail>
        </NetworkCard>
        </CardCarousel>
        </CarouselWrapper>
      </CardTabPane>
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
min-width: 100px
height: 100px
border-radius: 4px;
display: flex
align-items: center
justify-content: center
box-shadow: 0 2px 8px 0 rgba(62, 88, 96, 0.1);
background-color: #ffffff
`
const NetworkDetail = styled.div`
flex-direction: column
justify-content: space-around
text-align: center
align-self: center
`
const NetworkImage = styled.img`
  width: 48px
  height: 48px
  object-fit: contain
`

const NetworkName = styled.div`
width: 70px
font-size: 12px
color: #3e5860
font-weight: bold
font-family: Nunito
`

const CardTabPane = styled(Tab.Pane)`
min-width: 319px !important
height: 150px
display: flex
align-items: center
`

const CardCarousel = styled.div`
display: flex !important
flex-direction: row
align-items: center
margin: 12px
overflow-x: hidden
`

const CarouselWrapper = styled.div`
box-sizing: border-box
transform-style: preserve-3d
`

const ComingSoon = styled.p`
{
width: 70px
margin-top: 6px
font-size: 12px
color: #3e5860
font-weight: bold
font-family: Nunito
}
> span {
font-size: 10px
}
`

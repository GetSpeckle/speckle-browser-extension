import * as React from 'react'
import { connect } from 'react-redux'
import { Tab } from 'semantic-ui-react'
import { IAppState } from '../../background/store/all'
import { getTransactions } from '../../background/store/transaction'
import t from '../../services/i18n'
import styled from 'styled-components'
import NetworkCard from './NetworkCard'
import { ScrollButton } from './ScrollButton'
import { colorSchemes } from '../styles/themes'

interface INetworkListProps extends StateProps {}

class NetworkList extends React.Component<INetworkListProps> {

  next () {
    let networkConttainer = document.getElementById('scroll-menu')
    networkConttainer!.scrollLeft += 100
  }

  prev () {
    let networkConttainer = document.getElementById('scroll-menu')
    networkConttainer!.scrollLeft -= 100
  }

  render () {

    const panes = [
      { menuItem: t('recommended'), render: () => this.renderWithFilter('Recommended') },
      { menuItem: t('popular'), render: () => this.renderWithFilter('Popular') }
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

    // TODO: filter network with the network type and search
    console.log('prepare to render Networks ... ', type)

    return (
      <CardTabPane>
        <Networks id={'scroll-menu'}>
          <NetworkCard imgPath={'assets/chain-logo/polkadot.png'} name={'Alexander'} supported={true}/>
          <NetworkCard imgPath={'assets/chain-logo/kusama.png'} name={'Kusama'} supported={false} />
          <NetworkCard imgPath={'assets/chain-logo/edgeware.png'} name={'Edgeware'} supported={false} />
         </Networks>
        <PrevButton onMouseDown={this.prev} colorScheme={colorSchemes[this.props.color]}/>
        <NextButton onMouseDown={this.next} colorScheme={colorSchemes[this.props.color]}/>
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

const CardTabPane = styled(Tab.Pane)`
{
width: 319px !important
overflow-x: hidden
}
`

const PrevButton = styled(ScrollButton)`
  position: absolute
  top: 40%
  left: 3%
  transform: rotate(180deg)
`

const NextButton = styled(ScrollButton)`
  position: absolute
  top: 40%
  right: 3%
`
const Networks = styled.div`
{
min-width: 320px !important
height: 120px
overflow-x: scroll
display: flex !important
flex-direction: row
align-items: center
}
&::-webkit-scrollbar {
display: none
}
>* {
margin: 0 6px
}
`

import * as React from 'react'
import { connect } from 'react-redux'
import { Tab } from 'semantic-ui-react'
import { IAppState } from '../../background/store/all'
import t from '../../services/i18n'
import styled from 'styled-components'
import ChainCard from './ChainCard'
import { ScrollButton } from './ScrollButton'
import { colorSchemes } from '../styles/themes'
import { chains } from '../../constants/chains'

interface IChainListProps extends StateProps {
  search: string
}

class ChainList extends React.Component<IChainListProps> {

  next () {
    let chainContainer = document.getElementById('scroll-menu')
    chainContainer!.scrollLeft += 100
  }

  prev () {
    let chainContainer = document.getElementById('scroll-menu')
    chainContainer!.scrollLeft -= 100
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

  renderWithFilter = (type) => {

    // TODO: filter chain with the chain type and search from SelectChain
    console.log('preparing to render chains ... ', type)

    return (
      <CardTabPane>
        <Chains id={'scroll-menu'}>
          {/* tslint:disable-next-line:jsx-no-multiline-js */}
          {Object.keys(chains).map((key, index) => (
              <ChainCard
                key={index}
                imgPath={chains[key].iconUrl}
                colorScheme={colorSchemes[this.props.color]}
                supported={true}
                name={key}
              />
            )
          )}
         </Chains>
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

// TODO: Get chains
const mapDispatchToProps = { /* getchains */ }

export default connect(mapStateToProps, mapDispatchToProps)(ChainList)

const CardTabPane = styled(Tab.Pane)`
  width: 319px !important;
  overflow-x: hidden;
`

const PrevButton = styled(ScrollButton)`
  position: absolute;
  top: 40%;
  left: 3%;
  transform: rotate(180deg);
`

const NextButton = styled(ScrollButton)`
  position: absolute;
  top: 40%;
  right: 3%;
`
const Chains = styled.div`
  min-width: 320px !important;
  height: 120px;
  overflow-x: scroll;
  display: flex !important;
  flex-direction: row;
  align-items: center;
  &::-webkit-scrollbar {
    display: none;
  };
  >* {
    margin: 0 6px;
  };
`

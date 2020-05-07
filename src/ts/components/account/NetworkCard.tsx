import * as React from 'react'
import styled from 'styled-components'
import { ColorScheme } from '../styles/themes'
import { Selected } from './Selected'

type Selected = true | false

interface INetworkCardProps {
  imgPath: string
  name: string
  supported: boolean
  colorScheme: ColorScheme
  selected: Selected
}

interface INetworkCardState {
  selected: Selected
}

export default class NetworkCard extends React.Component<INetworkCardProps, INetworkCardState> {

  static defaultProps = {
    selected: false
  }

  state = {
    selected: this.props.selected
  }

  toggleSelected = () => {
    this.setState((prevState) => {
      return {
        selected: prevState.selected === false /* if false true if true false */
      }
    })
  }

  render () {
    return this.state.selected ? this.renderSelected() : this.renderDefault()
  }

  renderDefault () {
    return (
      <div style={{ 'position': 'relative' }}>
        <Card onClick={this.toggleSelected}>
          <NetworkDetail>
            <NetworkImage src={this.props.imgPath} alt={'chain-logo'}/>
                <NetworkName>
                {this.props.name}<br/><span>{!this.props.supported ? '(coming soon)' : ''}</span>
                </NetworkName>
            </NetworkDetail>
          </Card>
      </div>
    )
  }

  renderSelected () {
    return (
      <div style={{ 'position': 'relative' }}>
        <SelectedCard color={this.props.colorScheme.stopColorOne} onClick={this.toggleSelected}>
          <NetworkDetail>
            <NetworkImage src={this.props.imgPath} alt={'chain-logo'}/>
            <NetworkName>
              {this.props.name}<br/><span>{!this.props.supported ? '(coming soon)' : ''}</span>
            </NetworkName>
          </NetworkDetail>
        </SelectedCard>
        <Check colorScheme={this.props.colorScheme}/>
      </div>
    )
  }
}

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

const Card = styled.div`
  min-width: 100px
  height: 100px
  border-radius: 4px;
  display: flex
  align-items: center
  justify-content: center
  box-shadow: 0 2px 8px 0 rgba(62, 88, 96, 0.1);
  background-color: #ffffff
  :hover {
    box-shadow: 0 0 11px rgba(33,33,33,.2)
  }
`

const SelectedCard = styled.div`
  min-width: 100px
  height: 100px
  border-radius: 4px;
  display: flex
  align-items: center
  justify-content: center
  border: solid 1px ${props => props.color}
  background-color: #ffffff
`

const NetworkName = styled.p`
  width: 70px
  margin-top: 6px
  font-size: 12px
  color: #3e5860
  font-weight: bold
  font-family: Nunito
  > span {
    font-size: 8px
  }
`

const Check = styled(Selected)`
  position: absolute
  top: 5px
  left: 5px
  z-index: 3000
`

import * as React from 'react'
import styled from 'styled-components'

interface INetworkCardProps {
  imgPath: string
  name: string
  supported: boolean
}

interface INetworkCardState {
  selected: boolean
}

export default class NetworkCard extends React.Component<INetworkCardProps, INetworkCardState> {

  state = {
    selected: false
  }

  render () {
    return this.state.selected ? this.renderClicked() : this.renderDefault()
  }

  renderDefault () {
    return (
      <Card onClick={this.toggleSelected}>
        <NetworkDetail>
          <NetworkImage src={this.props.imgPath} alt={'chain-logo'}/>
          <div>
            <NetworkName>
              {this.props.name}<br/><span>{!this.props.supported ? '(comming soon)' : ''}</span>
            </NetworkName>
          </div>
        </NetworkDetail>
      </Card>
    )
  }

  renderClicked () {
    return (
      <Card onClick={this.toggleSelected}>
        <NetworkDetail>
          <NetworkImage src={this.props.imgPath} alt={'chain-logo'}/>
          <div>
            <NetworkName>
              {this.props.name}<br/><span>{!this.props.supported ? '(coming soon)' : ''}</span>
            </NetworkName>
          </div>
        </NetworkDetail>
      </Card>
    )
  }

  toggleSelected () {
    this.setState({ selected: !this.state.selected })
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
{
min-width: 100px
height: 100px
border-radius: 4px;
display: flex
align-items: center
justify-content: center
box-shadow: 0 2px 8px 0 rgba(62, 88, 96, 0.1);
background-color: #ffffff
}
:hover {
box-shadow: 0 0 11px rgba(33,33,33,.2)
}
`

const NetworkName = styled.p`
{
width: 70px
margin-top: 6px
font-size: 12px
color: #3e5860
font-weight: bold
font-family: Nunito
}
> span {
font-size: 8px
}
`

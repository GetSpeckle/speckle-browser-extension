import * as React from 'react'
import { Icon, Grid } from 'semantic-ui-react'
import { IAccount } from '../../background/store/wallet';
import Identicon from 'polkadot-identicon';

interface IRequestPanelProps {
  origin: string
  color: string
  account: IAccount
}

/**
 * The request access panel component
 */
class RequestPanel extends React.Component<IRequestPanelProps> {

  render () {
    const iconStyle = {
      color: this.props.color,
      fontSize: '6em',
      lineHeight: 1,
      verticalAlign: 'middle'
    }

    const dotStyle = {
      color: this.props.color
    }

    const destStyle = {
      backgroundColor: this.props.color,
      color: 'white'
    }

    return (
      <div>
        <Grid verticalAlign='middle'>
          <Grid.Column width='7'>
            <div className='request-box'>
              <div><Icon name='question circle outline' style={iconStyle}/></div>
              <div>{this.props.origin}</div>
            </div>
          </Grid.Column>
          <Grid.Column width='2'>
            <Icon name='ellipsis horizontal' style={dotStyle} />
          </Grid.Column>
          <Grid.Column width='7'>
            <div className='request-box' style={destStyle}>
              <div>
                <Identicon
                  account={this.props.account.address}
                  size={80}
                  className='identicon'
                />
              </div>
              <div>
                {this.props.account.name}
              </div>
            </div>

          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

export default RequestPanel

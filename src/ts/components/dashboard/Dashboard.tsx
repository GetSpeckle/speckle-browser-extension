import * as React from 'react'
import styled from 'styled-components'
import { lockWallet } from '../../services/keyring-vault-proxy'
import { UNLOCK_ROUTE } from '../../constants/routes'
import { RouteComponentProps, withRouter } from 'react-router'
import { Button } from '../basic-components'

interface IDashboardProp extends RouteComponentProps {}

class Dashboard extends React.Component<IDashboardProp> {

  handleClick = () => {
    const { history } = this.props
    lockWallet().then(result => {
      console.log(result)
      history.push(UNLOCK_ROUTE)
    })
  }

  render () {
    return (
      <div>
        <Title>
          Dashboard goes here
        </Title>
        <Text>
          <Button onClick={this.handleClick}>
            Logout
          </Button>
        </Text>
      </div>
    )
  }
}

const Text = styled.p`
    width: 311px;
    margin:18px auto;
    opacity: 0.6;
    font-family: Nunito;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #3e5860;
`

const Title = styled(Text)`
    width: 311px;
    height: 26px;
    font-size: 19px;
    font-weight: bold;
    color: #30383B;
`

export default withRouter(Dashboard)

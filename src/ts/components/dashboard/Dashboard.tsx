import * as React from 'react'
import styled from 'styled-components'
import { lockWallet } from '../../services/keyring-vault-proxy'
import { UNLOCK_ROUTE } from '../../constants/routes'
import { RouteComponentProps, withRouter } from 'react-router'

interface IDashboardProp extends RouteComponentProps {
  history: any
}

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
          <StyledButton onClick={this.handleClick}>
            Logout
          </StyledButton>
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
const StyledButton = styled.button`
  width: 311px;
  height: 45px;
  border-radius: 4px;
  box-shadow: 0 3px 10px 0 rgba(72, 178, 228, 0.21);
  background-color: #24b6e8;
  font-family: Nunito;
  font-size: 16px;
  font-weight: 800;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.31;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
`
export default withRouter(Dashboard)

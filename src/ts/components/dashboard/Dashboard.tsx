import * as React from 'react'
import styled from 'styled-components'
import { lockWallet } from '../../services/keyring-vault-proxy'
import { LOGIN_ROUTE } from '../../constants/routes'
import { RouteComponentProps, withRouter } from 'react-router'
import { Button, Section } from '../basic-components'
import { colorSchemes } from '../styles/themes'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'

interface IDashboardProps extends StateProps, RouteComponentProps {}

class Dashboard extends React.Component<IDashboardProps> {

  handleClick = () => {
    const { history } = this.props
    lockWallet().then(result => {
      console.log(result)
      debugger
      history.push(LOGIN_ROUTE)
    })
  }

  render () {
    return (
      <div>
        <Title>
          Dashboard goes here
        </Title>
        <Section>
          <Button
            onClick={this.handleClick}
            colorScheme={colorSchemes[this.props.settings.color]}
          >
            Logout
          </Button>
        </Section>
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

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings
  }
}

type StateProps = ReturnType<typeof mapStateToProps>

export default withRouter(connect(mapStateToProps)(Dashboard))

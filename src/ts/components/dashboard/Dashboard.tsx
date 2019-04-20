import * as React from 'react'
import { lockWallet } from '../../services/keyring-vault-proxy'
import { LOGIN_ROUTE } from '../../constants/routes'
import { RouteComponentProps, withRouter } from 'react-router'
import { Button, ContentContainer, Section, Title } from '../basic-components'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'

interface IDashboardProps extends StateProps, RouteComponentProps {}

class Dashboard extends React.Component<IDashboardProps> {

  handleClick = () => {
    const { history } = this.props
    lockWallet().then(result => {
      console.log(result)
      history.push(LOGIN_ROUTE)
    })
  }

  render () {
    return (
      <ContentContainer>
        <Section>
          <Title>
            Dashboard goes here
          </Title>
        </Section>

        <Section>
          <Button onClick={this.handleClick}>
            Logout
          </Button>
        </Section>
      </ContentContainer>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings
  }
}

type StateProps = ReturnType<typeof mapStateToProps>

export default withRouter(connect(mapStateToProps)(Dashboard))

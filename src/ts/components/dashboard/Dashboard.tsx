import * as React from 'react'
import {
   QR_ROUTE
} from '../../constants/routes'
import { RouteComponentProps, withRouter } from 'react-router'
import {
  ContentContainer
} from '../basic-components'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import Balance from '../account/Balance'
import Identicon from '@polkadot/react-identicon'
import { saveSettings } from '../../background/store/settings'
import 'react-tippy/dist/tippy.css'
import styled from 'styled-components'
import TransactionList from './TransactionList'
import AccountDropdown from '../account/AccountDropdown'
import { networks } from '../../constants/networks'

interface IDashboardProps extends StateProps, RouteComponentProps, DispatchProps {
}

class Dashboard extends React.Component<IDashboardProps> {
  render () {
    if (!this.props.settings.selectedAccount) {
      return null
    }
    const network = networks[this.props.settings.network]
    const identiconTheme = network.identiconTheme
    return (
      <ContentContainer>
        <AccountDropdown qrDestination={QR_ROUTE} />
        <AccountSection>
          <Identicon
            value={this.props.settings.selectedAccount.address}
            size={80}
            theme={identiconTheme}
            className='image'
          />
        </AccountSection>
        <AccountSection>
          <Balance address={this.props.settings.selectedAccount.address}/>
        </AccountSection>
        <AccountSection>
          <TransactionList />
        </AccountSection>
      </ContentContainer>
    )
  }
}

export const AccountSection = styled.div`
  width: 100%
  margin: 8px 0 9px
  text-align: center
`

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings
  }
}

const mapDispatchToProps = { saveSettings }
type DispatchProps = typeof mapDispatchToProps

type StateProps = ReturnType<typeof mapStateToProps>

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard))

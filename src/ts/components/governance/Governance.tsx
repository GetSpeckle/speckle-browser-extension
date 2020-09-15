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
import { saveSettings } from '../../background/store/settings'
import 'react-tippy/dist/tippy.css'
import styled from 'styled-components'
import AccountDropdown from '../account/AccountDropdown'
// import { chains } from '../../constants/chains'
import GovernanceList from './GovernanceList'
import ApiPromise from '@polkadot/api/promise'
import t from '../../services/i18n'

interface IDashboardProps extends StateProps, RouteComponentProps, DispatchProps {
}

class Governance extends React.Component<IDashboardProps> {
  get api (): ApiPromise {
    const api = this.props.apiContext.api
    if (api) return api
    throw new Error(t('apiError'))
  }

  render () {
    if (!this.props.settings.selectedAccount) {
      return null
    }
    // const chain = chains[this.props.settings.chain]
    return (
      <ContentContainer>
        <AccountDropdown qrDestination={QR_ROUTE} />
        <AccountSection>
          <Balance address={this.props.settings.selectedAccount.address}/>
        </AccountSection>
          <GovernanceList/>
        <AccountSection/>

      </ContentContainer>
    )
  }
}

export const AccountSection = styled.div`
  width: 100%;
  margin: 8px 0 9px;
  text-align: center;
`

const mapStateToProps = (state: IAppState) => {
  return {
    apiContext: state.apiContext,
    settings: state.settings
  }
}

const mapDispatchToProps = { saveSettings }
type DispatchProps = typeof mapDispatchToProps

type StateProps = ReturnType<typeof mapStateToProps>

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Governance))

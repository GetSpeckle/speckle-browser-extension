import React from 'react'
import { connect } from 'react-redux'
import t from '../../../services/i18n'
import { IAppState } from '../../../background/store/all'
import ApiPromise from '@polkadot/api/promise'

class Vote extends React.Component<StateProps> {

  get api (): ApiPromise {
    const api = this.props.apiContext.api
    if (api) return api
    throw new Error(t('apiError'))
  }

  render () {
    return (
      <h1>fasdfsfs</h1>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings,
    wallet: state.wallet,
    apiContext: state.apiContext,
    error: state.error,
    transactions: state.transactions
  }
}

type StateProps = ReturnType<typeof mapStateToProps>

export default connect(mapStateToProps)(Vote)

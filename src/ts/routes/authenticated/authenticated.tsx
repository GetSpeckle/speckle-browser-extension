import { connect } from 'react-redux'
import * as React from 'react'
import { Redirect } from 'react-router'
import { RouteWithLayout } from '../withLayout'
import { IAppState } from '../../background/store/all'
import keyringVault from '../../services/keyring-vault'
import { UNLOCK_ROUTE } from '../../constants/routes'

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings
  }
}

export function Authenticated (props) {
  const isUnlocked: boolean = keyringVault.isUnlocked()

  if (isUnlocked) {
    return <RouteWithLayout {...props} />
  } else {
    return <Redirect to={{ pathname: UNLOCK_ROUTE }} />
  }
}

export default connect(mapStateToProps)(Authenticated)

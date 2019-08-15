// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react'
import { approveAuthRequest, rejectAuthRequest } from '../../services/messaging'
import { Button } from '../basic-components'
import AlertPanel from './AlertPanel'
import { Grid, Button as BasicButton } from 'semantic-ui-react'
import RequestPanel from './RequestPanel'

const AuthorizingRequest = (props) => {
  const [ authId, { origin }, url ] = [...props.request]
  const onApprove = () =>
    approveAuthRequest(authId)
      .catch(console.error)
  const onReject = () =>
    rejectAuthRequest(authId)
      .catch(console.error)

  return (
    <div>

      <div className='auth-description'>
        {origin} is requesting access to your account
      </div>

      {/* TODO: use the real value */}
      <RequestPanel
        origin={origin}
      />

      <AlertPanel
        color='red'
        message={'The request is made from ' + url}
        icon='linkify'
      />

      <AlertPanel
        color='red'
        message='Approving gives access to the address of your accounts'
        icon='exclamation'
      />

      <Grid columns='equal'>
        <Grid.Column>
          <BasicButton fluid={true} onClick={onReject} className='minor'>
            Reject
          </BasicButton>
        </Grid.Column>
        <Grid.Column>
          <Button onClick={onApprove} className='narrow'>
            Approve Access
          </Button>
        </Grid.Column>
      </Grid>

    </div>
  )
}

export default AuthorizingRequest

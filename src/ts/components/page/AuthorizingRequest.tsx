// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react'
import { approveAuthRequest, rejectAuthRequest } from '../../services/messaging'
import { Button } from '../basic-components'

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
      <div>
        An application, self-identifying as
        <span>{origin}</span> is requesting access from <span>{url}</span>.
      </div>
      <Button onClick={onReject}>Reject</Button>
      <div>
        Only approve this request if you trust the application.
        Approving gives the application access to the addresses of your
        accounts.
      </div>
      <Button
        label='Yes, allow this application access'
        onClick={onApprove}
      />
    </div>
  )
}

export default AuthorizingRequest

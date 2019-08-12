import React from 'react'

import { approveSignRequest, cancelSignRequest } from '../../services/messaging'
import { Button } from '../basic-components'
import Details from './Details'
import Unlock from './Unlock'
import { createType } from '@polkadot/types'

const SigningRequest = (props) => {
  const {
    isFirst,
    extrinsic,
    signId,
    url
  } = props
  const onCancel = () =>
    cancelSignRequest(signId)
      .catch(console.error)
  const onSign = (password: string) =>
    approveSignRequest(signId, password)
  const blockNumber = createType('BlockNumber', extrinsic.blockNumber)
  const payload = createType('ExtrinsicPayload', extrinsic, { version: extrinsic.version })
  return (
    <div>
      <div>{extrinsic.address}</div>
      <Details
        blockNumber={blockNumber}
        genesisHash={extrinsic.genesisHash}
        isDecoded={isFirst}
        method={extrinsic.method}
        payload={payload}
        url={url}
      />
      <Button onClick={onCancel}>Cancel</Button>
      {isFirst && <Unlock onSign={onSign} />}
    </div>
  )
}

export default SigningRequest

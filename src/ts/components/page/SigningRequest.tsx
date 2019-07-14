import React from 'react'

import { approveSignRequest, cancelSignRequest } from '../../services/messaging'
import { Button } from '../basic-components'
import Details from './Details'
import Unlock from './Unlock'

const SigningRequest = (props) => {
  const {
    isFirst,
    extrinsic: { address, blockNumber, era, genesisHash, method, nonce },
    signId,
    url
  } = props
  const onCancel = () =>
    cancelSignRequest(signId)
      .catch(console.error)
  const onSign = (password: string) =>
    approveSignRequest(signId, password)

  return (
    <div>
      <div>{address}</div>
      <Details
        blockNumber={blockNumber}
        era={era}
        genesisHash={genesisHash}
        isDecoded={isFirst}
        method={method}
        nonce={nonce}
        url={url}
      />
      <Button onClick={onCancel}>Cancel</Button>
      {isFirst && <Unlock onSign={onSign} />}
    </div>
  )
}

export default SigningRequest

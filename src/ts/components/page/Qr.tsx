// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ExtrinsicPayload } from '@polkadot/types/interfaces'
import { SignerPayloadJSON } from '@polkadot/types/types'

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { QrDisplayPayload, QrScanSignature } from '@polkadot/react-qr'
import { Button } from '../basic-components'

interface Props {
  children?: React.ReactNode
  className?: string
  onSignature: ({ signature }: { signature: string }) => void
  payload: ExtrinsicPayload
  request: SignerPayloadJSON
}

const CMD_MORTAL = 2

function Qr ({ className, onSignature, payload, request }: Props): React.ReactElement<Props> {
  const [isScanning, setIsScanning] = useState(false)
  const [payloadU8a, setPayloadU8a] = useState(new Uint8Array())

  useEffect((): void => setPayloadU8a(payload.toU8a()), [payload])

  const _onShowQr = (): void => setIsScanning(true)

  return (
    <div className={className}>
      {isScanning
        ? <QrScanSignature onScan={onSignature} />
        : <QrDisplayPayload
          address={request.address}
          cmd={CMD_MORTAL}
          payload={payloadU8a}
        />
      }
      {!isScanning && (<Button onClick={_onShowQr}>Scan signature via camera</Button>)}
    </div>
  )
}

export default styled(Qr)`
  padding: 0.75rem 1.5rem 0 1.5rem
`

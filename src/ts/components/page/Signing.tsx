import React, { useEffect, useState } from 'react'
import {
  Button,
  ContentContainer,
  Section,
  Title
} from '../basic-components'
import t from '../../services/i18n'
import withLayout from './withLayout'
import Extrinsic from './Extrinsic'
import SignBy from './SignBy'
import { SigningRequest } from '../../background/types'
import { approveSignPassword, approveSignSignature, cancelSignRequest } from '../../services/messaging'
import Unlock from './Unlock'
import { TypeRegistry } from '@polkadot/types'
import Qr from './Qr'
import { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types'
import { ExtrinsicPayload } from '@polkadot/types/interfaces'

interface Data {
  hexBytes: string | null
  payload: ExtrinsicPayload | null
}

const registry = new TypeRegistry()

function isRawPayload (payload: SignerPayloadJSON | SignerPayloadRaw): payload is SignerPayloadRaw {
  return !!(payload as SignerPayloadRaw).data
}

const Signing = (props) => {
  const { requests } = props
  // handle one request at a time
  const signingRequest: SigningRequest = requests[0]
  const { account, id, request } = signingRequest
  const { isExternal } = account
  const [{ hexBytes, payload }, setData] = useState<Data>({ hexBytes: null, payload: null })

  useEffect((): void => {
    const payload = request.payload
    if (isRawPayload(payload)) {
      setData({
        hexBytes: payload.data,
        payload: null
      })
    } else {
      registry.setSignedExtensions(payload.signedExtensions)
      setData({
        hexBytes: null,
        payload: registry.createType('ExtrinsicPayload', payload, { version: payload.version })
      })
    }
  }, [request])

  const onCancel = () =>
    cancelSignRequest(id)
      .catch(console.error)
  const onSign = (password: string) =>
    approveSignPassword(id, password)
      .catch(console.error)
  const onSignature = ({ signature }: { signature: string }) =>
    approveSignSignature(id, signature)
      .catch(console.error)

  if (payload != null) {
    const signerPayload = request.payload as SignerPayloadJSON
    return (
      <ContentContainer>
        <Section>
          <Title>
            {t('signing')}
          </Title>
        </Section>
        {/* tslint:disable-next-line:max-line-length */}
        {!isExternal && <Section><Extrinsic signerPayload={signerPayload} extrinsicPayload={payload} isDecoded={true}/></Section>}
        {!isExternal && <Section><SignBy address={request.payload.address} /></Section>}
        {!isExternal && <Unlock onSign={onSign} onCancel={onCancel} />}
        {isExternal && <Qr payload={payload} request={signerPayload} onSignature={onSignature}/>}
        {isExternal && <Button onClick={onCancel}>{t('cancel')}</Button>}
      </ContentContainer>
    )
  } else if (hexBytes != null) {
    const payload = request.payload as SignerPayloadRaw
    return (
      <ContentContainer>
        <Section>
          <Title>
            {t('signing')}
          </Title>
        </Section>
        {!isExternal && <Section>{payload.data}</Section>}
        {!isExternal && <Section><SignBy address={request.payload.address} /></Section>}
        {!isExternal && <Unlock onSign={onSign} onCancel={onCancel} />}
        {isExternal && <Button onClick={onCancel}>{t('cancel')}</Button>}
      </ContentContainer>
    )
  }
  return null
}

export default withLayout(Signing)

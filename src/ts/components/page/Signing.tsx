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
import { createType, TypeRegistry } from '@polkadot/types'
import { ExtrinsicPayload } from '@polkadot/types/interfaces'
import Qr from './Qr'
import { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types'

const registry = new TypeRegistry()

const Signing = (props) => {
  const { requests } = props
  // handle one request at a time
  const signingRequest: SigningRequest = requests[0]
  const { account, id, request } = signingRequest
  const { isExternal } = account
  const [hexBytes, setHexBytes] = useState<string | null>(null)
  const [extrinsic, setExtrinsic] = useState<ExtrinsicPayload | null>(null)

  useEffect((): void => {
    const inner = request.inner
    if ((inner as SignerPayloadRaw).data) {
      setHexBytes((inner as SignerPayloadRaw).data)
    } else {
      const signerPayload = (inner as SignerPayloadJSON)
      const params = { version: signerPayload.version }
      setExtrinsic(createType(registry, 'ExtrinsicPayload', inner, params))
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

  if (extrinsic != null) {
    const signerPayload = request.inner as SignerPayloadJSON
    return (
      <ContentContainer>
        <Section>
          <Title>
            {t('signing')}
          </Title>
        </Section>
        {/* tslint:disable-next-line:max-line-length */}
        {!isExternal && <Section><Extrinsic signerPayload={signerPayload} extrinsicPayload={extrinsic} isDecoded={true}/></Section>}
        {!isExternal && <Section><SignBy address={request.inner.address} /></Section>}
        {!isExternal && <Unlock onSign={onSign} onCancel={onCancel} />}
        {isExternal && <Qr payload={extrinsic} request={signerPayload} onSignature={onSignature}/>}
        {isExternal && <Button onClick={onCancel}>{t('cancel')}</Button>}
      </ContentContainer>
    )
  } else if (hexBytes != null) {
    const payload = request.inner as SignerPayloadRaw
    return (
      <ContentContainer>
        <Section>
          <Title>
            {t('signing')}
          </Title>
        </Section>
        {!isExternal && <Section>{payload.data}</Section>}
        {!isExternal && <Section><SignBy address={request.inner.address} /></Section>}
        {!isExternal && <Unlock onSign={onSign} onCancel={onCancel} />}
        {isExternal && <Button onClick={onCancel}>{t('cancel')}</Button>}
      </ContentContainer>
    )
  }
  return null
}

export default withLayout(Signing)

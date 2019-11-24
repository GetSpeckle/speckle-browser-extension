import React, { useEffect, useState } from 'react'
import {
  Button,
  ContentContainer,
  Section,
  Title
} from '../basic-components'
import t from '../../services/i18n'
import WithLayout from './WithLayout'
import SignMessage from './SignMessage'
import SignBy from './SignBy'
import { SigningRequest } from '../../background/types'
import { approveSignPassword, approveSignSignature, cancelSignRequest } from '../../services/messaging'
import Unlock from './Unlock'
import { createType } from '@polkadot/types'
import { ExtrinsicPayload } from '@polkadot/types/interfaces'
import Qr from './Qr'

const Signing = (props) => {
  const { requests } = props
  // handle one request at a time
  const signingRequest: SigningRequest = requests[0]
  const { account, id, request } = signingRequest
  const { isExternal } = account
  const [payload, setPayload] = useState<ExtrinsicPayload | null>(null)

  useEffect((): void => {
    setPayload(createType('ExtrinsicPayload', request, { version: request.version }))
  }, [request])

  if (!payload) {
    return null
  }

  const onCancel = () =>
    cancelSignRequest(id)
      .catch(console.error)
  const onSign = (password: string) =>
    approveSignPassword(id, password)
      .catch(console.error)
  const onSignature = ({ signature }: { signature: string }) =>
    approveSignSignature(id, signature)
      .catch(console.error)

  const signBody = (
  <div>
    <Section><SignMessage request={request} isDecoded={true}/></Section>
    <Section><SignBy address={request.address} /></Section>
  </div>
  )

  return (
      <ContentContainer>
        <Section>
          <Title>
            {t('signing')}
          </Title>
        </Section>
        {!isExternal && signBody}
        {!isExternal && <Unlock onSign={onSign} onCancel={onCancel} />}
        {isExternal && <Qr payload={payload} request={request} onSignature={onSignature}/>}
        {isExternal && <Button onclick={onCancel}>{t('cancel')}</Button>}
      </ContentContainer>
  )
}

export default WithLayout(Signing)

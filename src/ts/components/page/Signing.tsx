import React from 'react'
import {
  ContentContainer,
  Section,
  Title
} from '../basic-components'
import t from '../../services/i18n'
import WithLayout from './WithLayout'
import SignMessage from './SignMessage'
import SignBy from './SignBy'
import { SigningRequest } from '../../background/types'
import { approveSignRequest, cancelSignRequest } from '../../services/messaging'
import Unlock from './Unlock'
import { GenericCall } from '@polkadot/types'
import fromMetadata from '@polkadot/api-metadata/extrinsics/fromMetadata'
import { findNetwork } from '../../constants/networks'

type MethodJson = {
  args: { [index: string]: any }
}

const Signing = (props) => {
  const { requests } = props
  // handle one request at a time
  const request: SigningRequest = requests[0]
  const extrinsic = request[1]
  const signId = request[0]

  const network = findNetwork(extrinsic.genesisHash)
  if (network && network.meta) {
    GenericCall.injectMethods(fromMetadata(network.meta))
  }
  const method = new GenericCall(extrinsic.method)
  const methodData = method.toJSON() as MethodJson
  const payload = JSON.stringify(methodData.args, null, 2)

  const onCancel = () =>
    cancelSignRequest(signId)
      .catch(console.error)
  const onSign = (password: string) =>
    approveSignRequest(signId, password)

  return (
      <ContentContainer>
        <Section>
          <Title>
            {t('signing')}
          </Title>
        </Section>
        <Section>
          <SignMessage payload={payload}/>
        </Section>
        <Section>
          <SignBy address={extrinsic.address} />
        </Section>
        <Unlock onSign={onSign} onCancel={onCancel} />
      </ContentContainer>
  )
}

export default WithLayout(Signing)

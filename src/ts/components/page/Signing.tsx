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

const Signing = (props) => {
  const { requests } = props
  // handle one request at a time
  const request: SigningRequest = requests[0]
  const signId = request[0]
  const extrinsic = request[1]
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
        <SignMessage/>
        <SignBy address={extrinsic.address} />
        <Unlock onSign={onSign} onCancel={onCancel} />
      </ContentContainer>
  )
}

export default WithLayout(Signing)

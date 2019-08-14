import React from 'react'
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
        <Section>
          <SignMessage/>
        </Section>
        <Section>
          <SignBy address={extrinsic.address} />
        </Section>
        <Button onClick={onCancel}>Cancel</Button>
        <Unlock onSign={onSign} />
      </ContentContainer>
  )
}

export default WithLayout(Signing)

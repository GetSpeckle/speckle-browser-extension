import React from 'react'

import SigningRequest from './SigningRequest'
import { ContentContainer, Section, Title } from '../basic-components'
import t from '../../services/i18n'
import WithLayout from './WithLayout'

const Signing = (props) => {
  const { requests } = props
  const signingRequests = requests.map(([id, extrinsic, url], index) => (
    <SigningRequest
      isFirst={index === 0}
      key={id}
      extrinsic={extrinsic}
      signId={id}
      url={url}
    />
  ))
  return (
      <ContentContainer>
        <Section>
          <Title>
            {t('signing')}
          </Title>
        </Section>
        {signingRequests}
      </ContentContainer>
  )
}

export default WithLayout(Signing)

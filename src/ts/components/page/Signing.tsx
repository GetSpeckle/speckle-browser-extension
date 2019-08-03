import React from 'react'

import SigningRequest from './SigningRequest'
import { Image } from 'semantic-ui-react'
import { ContentContainer, Section, Title } from '../basic-components'
import t from '../../services/i18n'

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
    <div>
      <div><Image src='/assets/logo-3-x.svg' style={logo}/></div>
      <ContentContainer>
        <Section>
          <Title>
            {t('signing')}
          </Title>
        </Section>
        {signingRequests}
      </ContentContainer>
    </div>
  )
}

const logo = {
  marginTop: 36,
  marginBottom: 36,
  marginLeft: 'auto',
  marginRight: 'auto',
  width: 150,
  height: 65
}

export default Signing

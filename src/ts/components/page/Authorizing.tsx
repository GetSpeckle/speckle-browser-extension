import React from 'react'
import AuthorizingRequest from './AuthorizingRequest'
import {
  ContentContainer,
  Section,
  Title
} from '../basic-components'
import t from '../../services/i18n'
import withLayout from './withLayout'

const Authorizing = (props) => {
  const { requests } = props
  return (
      <ContentContainer>
        <Section>
          <Title>
            {t('authorization')}
          </Title>
        </Section>
        {requests.map((request, index) => <AuthorizingRequest request={request} key={index}/>)}
      </ContentContainer>
  )
}

export default withLayout(Authorizing)

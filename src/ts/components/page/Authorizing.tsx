import React from 'react'
import AuthorizingRequest from './AuthorizingRequest'
import { Image } from 'semantic-ui-react'
import {
  ContentContainer,
  Section,
  Title
} from '../basic-components'
import t from '../../services/i18n'

const Authorizing = (props) => {
  const { requests } = props
  return (
    <div>
      <div><Image src='/assets/logo-3-x.svg' style={logo}/></div>
      <ContentContainer>
        <Section>
          <Title>
            {t('authorization')}
          </Title>
        </Section>
        {requests.map((request, index) => <AuthorizingRequest request={request} key={index}/>)}
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

export default Authorizing

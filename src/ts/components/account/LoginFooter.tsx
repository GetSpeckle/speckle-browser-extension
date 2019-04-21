import React from 'react'
import t from '../../services/i18n'
import { LoginFooter, FooterLink } from '../basic-components'

export default () => {
  const year = new Date().getFullYear()
  return (
    <LoginFooter>
        <span>
          <FooterLink href='https://speckleos.github.io/speckle-docs/' target='_blank'>
            {t('help')}
          </FooterLink>
        </span>
      <span>Speckle {year > 2019 ? `2019 - ${year}` : year}</span>
    </LoginFooter>
  )
}

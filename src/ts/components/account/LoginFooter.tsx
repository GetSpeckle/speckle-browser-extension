import React from 'react'
import t from '../../services/i18n'
import { Footer, FooterLink } from '../basic-components'

export default () => {
  const loginFooter = {
    width: '40%',
    height: 25,
    fontSize: 11,
    margin: 'auto',
    display: 'flex',
    justifyContent: 'space-around'
  }
  const year = new Date().getFullYear()
  return (
    <Footer>
      <div style={loginFooter}>
        <span>
          <FooterLink href='https://speckleos.github.io/speckle-docs/' target='_blank'>
            {t('help')}
          </FooterLink>
        </span>
        <span>Speckle {year > 2019 ? `2019 - ${year}` : year}</span>
      </div>
    </Footer>
  )
}

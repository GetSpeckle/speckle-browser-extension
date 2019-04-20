import React from 'react'
import t from '../../services/i18n'
import { Footer } from '../basic-components'
import { colorSchemes } from '../styles/themes'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'

const LoginFooter = (props) => {
  const styles = {
    loginFooter: {
      width: '40%',
      height: 25,
      fontSize: 11,
      margin: 'auto',
      display: 'flex',
      justifyContent: 'space-around'
    },
    link: {
      color: colorSchemes[props.settings.color].backgroundColor
    }
  }
  const year = new Date().getFullYear()
  return (
    <Footer>
      <div style={styles.loginFooter}>
        <span>
          <a href='https://speckleos.github.io/speckle-docs/' target='_blank' style={styles.link}>
            {t('help')}
          </a></span>
        <span>Speckle {year > 2019 ? `2019 - ${year}` : year}</span>
      </div>
    </Footer>
  )
}

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings
  }
}

export default connect(mapStateToProps)(LoginFooter)

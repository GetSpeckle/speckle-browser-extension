import * as React from 'react'
import t from '../../services/i18n'
import {
  getSimpleAccounts,
  importAccountFromMnemonic
} from '../../services/keyring-vault-proxy'
import { RouteComponentProps, withRouter } from 'react-router'
import { KeyringPair$Json } from '@polkadot/keyring/types'
import { Form, Message } from 'semantic-ui-react'
import {
  Button,
  ContentContainer,
  Section,
  SecondaryText,
  WhiteTitle
} from '../basic-components'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import { HOME_ROUTE } from '../../constants/routes'
import { saveSettings } from '../../background/store/settings'

interface IImportMnemonicProps extends StateProps, DispatchProps, RouteComponentProps {}

interface IImportMnemonicState {
  mnemonic: string,
  accountName: string,
  errorMessage?: string
}

class ImportMnemonic extends React.Component<IImportMnemonicProps, IImportMnemonicState> {

  state: IImportMnemonicState = {
    mnemonic: '',
    accountName: ''
  }

  componentDidMount () {
    getSimpleAccounts().then(result => {
      this.setState({ accountName: 'Account ' + (result.length + 1) })
    })
  }

  handleImport = () => {

    importAccountFromMnemonic(this.state.mnemonic, this.state.accountName)
      .then((json: KeyringPair$Json) => {
        this.props.saveSettings({ ...this.props.settings, selectedAccount: {
          address: json.address,
          name: json.meta.name as string
        } })
        this.props.history.push(HOME_ROUTE)
      }).catch((reason) => {
        this.setState({ ...this.state, errorMessage: reason })
      })
  }

  changeMnemonic = (event) => {
    this.setState({ ...this.state, mnemonic: event.target.value, errorMessage: '' })
  }

  changeAccountName = (event) => {
    this.setState({ ...this.state, accountName: event.target.value })
  }

  isMnemonicComplete = () => {
    return this.state.mnemonic && this.state.mnemonic.split(' ').length === 12
  }

  render () {
    return (
      <ContentContainer>
        <Section>
          <WhiteTitle>{t('importAccount')}</WhiteTitle>
        </Section>
        <Section className='action-start'>
          <SecondaryText>
            {t('phraseOptionDesc')}
          </SecondaryText>
        </Section>
        <Form>
          <Form.Input
            label={t('accountNameTitle')}
            type='input'
            value={this.state.accountName}
            maxLength={32}
            onChange={this.changeAccountName}
            placeholder={t('accountName')}
          />
          <Form.TextArea
            className='mnemonic'
            label={t('phraseTitle')}
            value={this.state.mnemonic}
            onChange={this.changeMnemonic}
          />
          <Message negative={true} hidden={!this.state.errorMessage}>
            {this.state.errorMessage}
          </Message>
          <Button onClick={this.handleImport} disabled={!this.isMnemonicComplete()}>
            {t('import')}
          </Button>
        </Form>
      </ContentContainer>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings
  }
}

type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = { saveSettings }

type DispatchProps = typeof mapDispatchToProps

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ImportMnemonic))

import * as React from 'react'
import t from '../../services/i18n'
import { importAccountFromMnemonic } from '../../services/keyring-vault-proxy'
import { RouteComponentProps, withRouter } from 'react-router'
import { KeyringPair$Json } from '@polkadot/keyring/types'
import { Form, Message } from 'semantic-ui-react'
import {
  Button,
  ContentContainer,
  Section,
  SecondaryText,
  Header
} from '../basic-components'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import { HOME_ROUTE } from '../../constants/routes'

interface IImportMnemonicProps extends StateProps, RouteComponentProps {}

interface IImportMnemonicState {
  mnemonic: string,
  accountName: string,
  errorMessage?: string
}

class ImportMnemonic extends React.Component<IImportMnemonicProps, IImportMnemonicState> {

  constructor (props) {
    super(props)
    this.changeMnemonic = this.changeMnemonic.bind(this)
    this.changeAccountName = this.changeAccountName.bind(this)
    this.handleImport = this.handleImport.bind(this)
    this.isMnemonicComplete = this.isMnemonicComplete.bind(this)
  }

  state: IImportMnemonicState = {
    mnemonic: '',
    accountName: t('importedAccount')
  }

  handleImport () {

    importAccountFromMnemonic(this.state.mnemonic, this.state.accountName)
      .then((json: KeyringPair$Json) => {
        console.log('Imported account ', json)
        this.props.history.push(HOME_ROUTE)
      }).catch((reason) => {
        this.setState({ ...this.state, errorMessage: reason })
      })
  }

  changeMnemonic (event) {
    this.setState({ ...this.state, mnemonic: event.target.value, errorMessage: '' })
  }

  changeAccountName (event) {
    this.setState({ ...this.state, accountName: event.target.value })
  }

  isMnemonicComplete () {
    return this.state.mnemonic && this.state.mnemonic.split(' ').length === 12
  }

  render () {
    return (
      <ContentContainer>
        <Section>
          <Header>{t('importAccount')}</Header>
        </Section>
        <Section style={{ marginTop: 110 }}>
          <SecondaryText>
            {t('phraseOptionDesc')}
          </SecondaryText>
        </Section>
        <Form>
          <Form.Input
            label={t('accountNameTitle')}
            type='input'
            value={this.state.accountName}
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

export default withRouter(connect(mapStateToProps)(ImportMnemonic))

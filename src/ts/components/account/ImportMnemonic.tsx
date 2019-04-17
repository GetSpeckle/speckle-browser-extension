import * as React from 'react'
import styled from 'styled-components'
import t from '../../services/i18n'
import { importAccountFromMnemonic } from '../../services/keyring-vault-proxy'
import { RouteComponentProps, withRouter } from 'react-router'
import { KeyringPair$Json } from '@polkadot/keyring/types'
import { Message } from 'semantic-ui-react'
import { Button, Section, MnemonicPad } from '../basic-components'

interface ImportMnemonicProp extends RouteComponentProps {
  history: any
}
interface ImportMnemonicState {
  mnemonic: string,
  accountName: string,
  errorMessage?: string
}

class ImportMnemonic extends React.Component<ImportMnemonicProp, ImportMnemonicState> {

  constructor (props) {
    super(props)
    this.changeMnemonic = this.changeMnemonic.bind(this)
    this.changeAccountName = this.changeAccountName.bind(this)
    this.handleImport = this.handleImport.bind(this)
    this.isMnemonicComplete = this.isMnemonicComplete.bind(this)
  }

  state: ImportMnemonicState = {
    mnemonic: '',
    accountName: t('importedAccount')
  }

  handleImport () {

    importAccountFromMnemonic(this.state.mnemonic, this.state.accountName)
      .then((json: KeyringPair$Json) => {
        console.log(json)
      }).catch((reason) => {
        this.setState({ ...this.state, errorMessage: reason })
      })
  }

  changeMnemonic (event) {
    this.setState({ ...this.state, mnemonic: event.target.value })
  }

  changeAccountName (event) {
    this.setState({ ...this.state, accountName: event.target.value })
  }

  isMnemonicComplete () {
    return this.state.mnemonic && this.state.mnemonic.split(' ').length === 12
  }

  render () {
    return (
      <div>
        <Section>
          <span>{t('accountName')}</span>
          <AccountName value={this.state.accountName} onChange={this.changeAccountName}/>
        </Section>
        <Section>
          <span>{t('mnemonic')}</span>
          <MnemonicPad value={this.state.mnemonic} onChange={this.changeMnemonic}/>
        </Section>
        <Section>
          <Message negative={true} hidden={!this.state.errorMessage}>
            {this.state.errorMessage}
          </Message>
        </Section>
        <Section>
          <Button onClick={this.handleImport} disabled={!this.isMnemonicComplete()}>
            {t('import')}
          </Button>
        </Section>
      </div>
    )
  }
}

const AccountName = styled.input`
  width: 311px;
  height: 42px;
  font-family: Nunito;
  padding: 10px;
`

export default withRouter(ImportMnemonic)

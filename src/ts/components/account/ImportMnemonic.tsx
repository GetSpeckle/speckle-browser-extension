import * as React from 'react'
import styled from 'styled-components'
import t from '../../services/i18n'
import { importAccountFromMnemonic } from '../../services/keyring-vault-proxy'
import { RouteComponentProps, withRouter } from 'react-router'
import { KeyringPair$Json } from '@polkadot/keyring/types'
import { Message } from 'semantic-ui-react'

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
        <Message negative={true} hidden={!this.state.errorMessage} style={error}>
          {this.state.errorMessage}
        </Message>
        <Section>
          <ImportButton onClick={this.handleImport} disabled={!this.isMnemonicComplete()}>
            {t('import')}
          </ImportButton>
        </Section>
      </div>
    )
  }
}

const Section = styled.p`
    width: 311px;
    margin:18px auto;
    opacity: 0.6;
    font-family: Nunito;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #3e5860;
`
const MnemonicPad = styled.textarea`
  width: 311px;
  height: 200px;
  font-family: Nunito;
  padding: 10px;
`
const AccountName = styled.input`
  width: 311px;
  height: 42px;
  font-family: Nunito;
  padding: 10px;
`

const ImportButton = styled.button`
  width: 311px;
  height: 45px;
  border-radius: 4px;
  box-shadow: 0 3px 10px 0 rgba(72, 178, 228, 0.21);
  background-color: #24b6e8;
  font-family: Nunito;
  font-size: 16px;
  font-weight: 800;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.31;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;`

const error = {
  width: 311,
  margin: 'auto'
}

export default withRouter(ImportMnemonic)

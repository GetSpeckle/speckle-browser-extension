import * as React from 'react'
import styled from 'styled-components'
import t from '../../services/i18n'
import { importAccountFromMnemonic } from '../../services/keyring-vault-proxy'
import { RouteComponentProps, withRouter } from 'react-router'
import { KeyringPair$Json } from '@polkadot/keyring/types'
import { Message } from 'semantic-ui-react'
import { Button, ContentContainer, Section, TopSection, MnemonicPad } from '../basic-components'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'

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
        console.log(json) // TODO navigate to account screen
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
      <ContentContainer>
        <TopSection>
          <span>{t('accountName')}</span>
          <AccountName value={this.state.accountName} onChange={this.changeAccountName}/>
        </TopSection>

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
      </ContentContainer>
    )
  }
}

const AccountName = styled.input`
  width: 311px;
  height: 42px;
  font-family: Nunito;
  padding: 10px;
`

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings
  }
}

type StateProps = ReturnType<typeof mapStateToProps>

export default withRouter(connect(mapStateToProps)(ImportMnemonic))

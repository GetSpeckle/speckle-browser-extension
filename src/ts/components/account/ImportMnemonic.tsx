import * as React from 'react'
import styled from 'styled-components'
import t from '../../services/i18n'
import KeyringVault from '../../services/keyring-vault'
import { ACCOUNT_IMPORTED_ROUTE } from '../../constants/routes'
import { RouteComponentProps, withRouter } from 'react-router'

interface ImportMnemonicProp extends RouteComponentProps {
  history: any
}
interface ImportMnemonicState {
  mnemonic: string
}

class ImportMnemonic extends React.Component<ImportMnemonicProp, ImportMnemonicState> {

  handleImport () {
    KeyringVault.importAccountFromMnemonic(
      this.state.mnemonic,
      'Imported Account').then(() => {
        this.props.history.push(ACCOUNT_IMPORTED_ROUTE)
      })
  }

  isMnemonicComplete () {
    return this.state.mnemonic && this.state.mnemonic.split(' ').length === 12
  }

  render () {
    return (
      <div>
        <MnemonicPad value={this.state.mnemonic} />
        <StyledButton onClick={this.handleImport} disabled={!this.isMnemonicComplete()}>
          {t('import')}
        </StyledButton>
      </div>
    )
  }
}

const MnemonicPad = styled.textarea`
  width: 600px;
  height: 400px;
  font-family: Nunito;
`

const StyledButton = styled.button`
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

export default withRouter(ImportMnemonic)

import React from 'react'
import styled from 'styled-components'
import Identicon from '@polkadot/react-identicon'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import { Color } from '../styles/themes'
import t from '../../services/i18n'
import { AccountAddress, Title } from '../basic-components'
import { getSimpleAccounts } from '../../services/keyring-vault-proxy'
import { networks } from '../../constants/networks'

class SignBy extends React.Component<ISignByProps, ISignByState> {

  state: ISignByState = {
    name: undefined
  }

  componentDidMount () {
    getSimpleAccounts().then(simpleAccounts => {
      if (simpleAccounts && simpleAccounts.length > 0) {
        for (let i = 0; i < simpleAccounts.length; i++) {
          let simpleAccount = simpleAccounts[i]
          if (simpleAccount.address === this.props.address) {
            this.setState({ name: simpleAccount.name })
            break
          }
        }
      }
    })
  }

  static shortenAddress (address) {
    return address.substr(0, 10) + '...' + address.substr(address.length - 10)
  }

  render () {
    const { settings, address } = this.props
    const network = networks[settings.network]
    const identiconTheme = network.identiconTheme
    return (
      <SignByContainer>
        <IdenticonContainer color={settings.color}>
          <div>{t('signedBy')}</div>
          <Identicon
            value={address}
            style={{ marginTop: 10 }}
            theme={identiconTheme}
            size={50}
          />
        </IdenticonContainer>
        <AccountContainer>
          {this.state.name && <Title>{this.state.name}</Title>}
          <Address>{SignBy.shortenAddress(address)}</Address>
        </AccountContainer>
      </SignByContainer>
    )
  }
}

const SignByContainer = styled.div`
  height: 90px;
  display: flex;
  margin: 0 auto;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(62, 88, 96, 0.1)
`

type P = {
  color: Color
}

const IdenticonContainer = styled.div`
  width: 117px;
  font-size: 12px;
  font-weight: bold;
  color: #fbfeff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  background-image: ${(p: P) => `url(/assets/background/sign-bg-${p.color}.svg)`};
`

const AccountContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Address = styled(AccountAddress)`
  margin-top: 10px;
  color: black;
`

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings
  }
}

type StateProps = ReturnType<typeof mapStateToProps>

interface ISignByProps extends StateProps {
  address: string
}

interface ISignByState {
  name?: string
}

export default connect(mapStateToProps)(SignBy)

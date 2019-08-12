import React from 'react'
import styled from 'styled-components'
import Identicon from 'polkadot-identicon'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import { ColorScheme, colorSchemes } from '../styles/themes'
import t from '../../services/i18n'
import { AccountAddress, Title } from '../basic-components'
import { getSimpleAccounts } from '../../services/keyring-vault-proxy'

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

  render () {
    const { settings, address } = this.props
    const colorScheme = colorSchemes[settings.color]
    return (
      <SignByContainer>
        <IdenticonContainer colorScheme={colorScheme}>
          <span>{t('signedBy')}</span>
          <Identicon
            account={address}
            size={80}
          />
        </IdenticonContainer>
        <AccountContainer>
          {this.state.name && <Title>{this.state.name}</Title>}
          <Address>{address}</Address>
        </AccountContainer>
      </SignByContainer>
    )
  }
}

const SignByContainer = styled.div`
  width: 331px;
  height: 100px;
  margin: 0 auto;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(62, 88, 96, 0.1)
`

type IdenticonContainerProps = {
  colorScheme: ColorScheme
}

const IdenticonContainer = styled.div`
  width: 100px;
  height: 94px;
  font-size: 13px;
  font-weight: bold;
  color: #fbfeff;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  object-fit: contain;
  transform: rotate(-90deg);
  border-radius: 3px;
  background-image: radial-gradient(
    circle at 0 0,
    ${(p: IdenticonContainerProps) => p.colorScheme.stopColorOne},
    ${(p: IdenticonContainerProps) => p.colorScheme.stopColorTwo}
  );
`

const AccountContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`

const Address = styled(AccountAddress)`
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

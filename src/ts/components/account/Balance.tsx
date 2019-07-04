import React from 'react'
import t from '../../services/i18n'
import { connect } from 'react-redux'
import { IAppState } from '../../background/store/all'
import { Title, SecondaryText } from '../basic-components'
import { ChainProperties } from '@polkadot/types'
import ApiPromise from '@polkadot/api/promise'
import { formatBalance } from '@polkadot/util'
import styled from 'styled-components'

class Balance extends React.Component<IBalanceProps, IBalanceState> {

  state: IBalanceState = {
    balance: undefined,
    tries: 1
  }

  get api (): ApiPromise {
    const api = this.props.apiContext.api
    if (api) return api
    throw new Error(t('apiError'))
  }

  updateBalance = () => {
    if (this.props.apiContext.apiReady) {
      this.setState({ ...this.state, tries: 1 })
      this.api.rpc.system.properties().then(properties => {
        const chainProperties = (properties as ChainProperties)
        formatBalance.setDefaults({
          decimals: chainProperties.tokenDecimals,
          unit: chainProperties.tokenSymbol
        })
        this.doUpdate()
      })
    } else if (this.state.tries <= 10) {
      const nextTry = setTimeout(this.updateBalance, 1000)
      this.setState({ ...this.state, tries: this.state.tries + 1, nextTry: nextTry })
    } else {
      this.setState({ ...this.state, balance: t('balanceNA') })
    }
  }

  private doUpdate = () => {
    console.log(this.props.address)
    this.api.derive.balances.all(this.props.address, derivedBalances => {
      console.log('derivedBalances', derivedBalances)
      const formattedBalance = formatBalance(derivedBalances.availableBalance)
      if (formattedBalance !== this.state.balance) {
        this.setState({ ...this.state, balance: formattedBalance })
      }
    }).then(unsub => {
      this.setState({ ...this.state, unsub: unsub })
    })
  }

  componentDidMount (): void {
    this.updateBalance()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.address !== this.props.address) {
      this.state.unsub && this.state.unsub()
      this.updateBalance()
    }
  }

  componentWillUnmount (): void {
    this.state.nextTry && clearTimeout(this.state.nextTry)
  }

  render () {
    return this.state.balance !== undefined ? this.renderBalance() : this.renderPlaceHolder()
  }

  renderPlaceHolder () {
    return (
      <BalanceBox>
        <SecondaryText>
          {t('getBalance')}
        </SecondaryText>
      </BalanceBox>
    )
  }

  renderBalance () {
    return (
      <BalanceBox>
        <Title>
          {this.state.balance}
        </Title>
      </BalanceBox>
    )
  }
}

const BalanceBox = styled.div`
  width: 215px;
  height: 73px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(62, 88, 96, 0.1);
`

const mapStateToProps = (state: IAppState) => {
  return {
    apiContext: state.apiContext
  }
}

type StateProps = ReturnType<typeof mapStateToProps>

interface IBalanceProps extends StateProps {
  address: string
}

interface IBalanceState {
  balance?: string
  tries: number
  nextTry?: any
  unsub?: Function
}

export default connect(mapStateToProps)(Balance)

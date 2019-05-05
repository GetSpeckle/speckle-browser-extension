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

  constructor (props) {
    super(props)
    this.updateBalance = this.updateBalance.bind(this)
  }

  state: IBalanceState = {
    balance: undefined,
    tries: 1
  }

  get api (): ApiPromise {
    const api = this.props.apiContext.api
    if (api) return api
    throw new Error(t('apiError'))
  }

  updateBalance () {
    console.log('try', this.state.tries)
    this.setState({ ...this.state, tries: this.state.tries + 1 })
    if (this.props.apiContext.apiReady) {
      this.api.rpc.system.properties().then(properties => {
        const chainProperties = (properties as ChainProperties)
        formatBalance.setDefaults({
          decimals: chainProperties.tokenDecimals,
          unit: chainProperties.tokenSymbol
        })
        this.api.query.balances.freeBalance(this.props.address, currentBalance => {
          const formattedBalance = formatBalance(currentBalance)
          if (formattedBalance !== this.state.balance) {
            this.setState({ ...this.state, balance: formattedBalance })
          }
        })
      })
    } else if (this.state.tries <= 5) {
      const nextTry = setTimeout(this.updateBalance, 1000)
      this.setState({ ...this.state, nextTry: nextTry })
    } else {
      this.setState({ ...this.state, balance: t('balanceNA') })
    }
  }

  componentDidMount (): void {
    this.updateBalance()
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
  tries: number,
  nextTry?: any
}

export default connect(mapStateToProps)(Balance)

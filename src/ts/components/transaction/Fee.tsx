import React from 'react'
import t from '../../services/i18n'
import { connect } from 'react-redux'
import { IAppState } from '../../background/store/all'
import { ChainProperties } from '@polkadot/types'
import ApiPromise from '@polkadot/api/promise'
import { formatBalance } from '@polkadot/util'
import styled from 'styled-components'

class Fee extends React.Component<IFeeProps, IFeeState> {

  state: IFeeState = {
    fee: undefined,
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
      this.setState({ ...this.state, fee: t('balanceNA') })
    }
  }

  private doUpdate = () => {
    this.api.query.balances.transferFee(currentFee => {
      console.log('currentFee', currentFee)
      const formattedFee = formatBalance(currentFee)
      if (formattedFee !== this.state.fee) {
        this.setState({ ...this.state, fee: formattedFee })
      }
    }).then(unsub => {
      this.setState({ ...this.state, unsub: unsub })
    })
  }

  componentDidMount (): void {
    this.updateBalance()
  }

  componentWillUnmount (): void {
    this.state.nextTry && clearTimeout(this.state.nextTry)
  }

  render () {
    return this.state.fee !== undefined ? this.renderBalance() : this.renderPlaceHolder()
  }

  renderPlaceHolder () {
    return (
      <TxFee>Transaction Fee:
        <span/>
      </TxFee>
    )
  }

  renderBalance () {
    return (
      <TxFee>{t('transferFee')}
        <span>  {this.state.fee}</span>
      </TxFee>
    )
  }
}

const TxFee = styled.p`
{
  opacity: 0.6;
  color: #556267;
  font-family: Nunito;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.5;
  letter-spacing: normal;
}
> span {
  opacity: 1;
  font-weight: bold;
  color: #30383b;
  }
`

const mapStateToProps = (state: IAppState) => {
  return {
    apiContext: state.apiContext
  }
}

type StateProps = ReturnType<typeof mapStateToProps>

interface IFeeProps extends StateProps {}

interface IFeeState {
  fee?: string
  tries: number
  nextTry?: any
  unsub?: Function
}

export default connect(mapStateToProps)(Fee)

import React from 'react'
import t from '../../services/i18n'
import { connect } from 'react-redux'
import { IAppState } from '../../background/store/all'
import ApiPromise from '@polkadot/api/promise'
import { compactToU8a, formatBalance } from '@polkadot/util'
import styled from 'styled-components'
import { IExtrinsic } from '@polkadot/types/types'
import { DerivedFees } from '@polkadot/api-derive/types'
import BN from 'bn.js'
import { Balance, ChainProperties } from '@polkadot/types/interfaces'
import U32 from '@polkadot/types/primitive/U32'

const LENGTH_PUBLICKEY = 32 + 1 // publicKey + prefix
const LENGTH_SIGNATURE = 64
const LENGTH_ERA = 1
const SIGNATURE_SIZE = LENGTH_PUBLICKEY + LENGTH_SIGNATURE + LENGTH_ERA
const ADDRESS_LENGTH = 48

const calcSignatureLength = (extrinsic?: IExtrinsic | null, accountNonce?: BN): number => {
  return SIGNATURE_SIZE +
    (accountNonce ? compactToU8a(accountNonce).length : 0) +
    (extrinsic ? extrinsic.encodedLength : 0)
}

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

  componentDidUpdate (prevProps) {
    if (this.props.toAddress !== prevProps.toAddress || this.props.address !== prevProps.address) {
      this.updateFee()
    }
  }

  updateFee = () => {
    if (this.props.toAddress.length !== ADDRESS_LENGTH) return
    if (this.props.apiContext.apiReady) {
      this.setState({ ...this.state, tries: 1 })
      this.api.rpc.system.properties().then(properties => {
        const chainProperties = (properties as ChainProperties)
        formatBalance.setDefaults({
          decimals: chainProperties.tokenDecimals.unwrapOr(new U32(15)).toNumber(),
          unit: chainProperties.tokenSymbol.unwrapOr('DEV').toString()
        })
        this.doUpdate()
      })
    } else if (this.state.tries <= 10) {
      const nextTry = setTimeout(this.updateFee, 1000)
      this.setState({ ...this.state, tries: this.state.tries + 1, nextTry: nextTry })
    } else {
      this.setState({ ...this.state, fee: t('balanceNA') })
    }
  }

  private doUpdate = () => {
    const address = this.props.address
    const toAddress = this.props.toAddress
    Promise.all([
      this.api.derive.balances.fees() as unknown as DerivedFees,
      this.api.query.system.accountNonce(address) as unknown as BN,
      this.api.tx.balances.transfer(address, 1) as unknown as IExtrinsic,
      this.api.query.balances.freeBalance(toAddress) as unknown as Balance,
      this.api.query.balances.reservedBalance(toAddress) as unknown as Balance
    ]).then(([fees, nonce, ext, freeBalance, rsvdBalance]) => {
      const extLength = calcSignatureLength(ext, nonce)
      const baseFee = new BN(fees.transactionBaseFee)
      const byteFee = new BN(fees.transactionByteFee).muln(extLength)
      const transferFee = new BN(fees.transferFee)
      const available = freeBalance.add(rsvdBalance)
      const totalFee = available.isZero() ?
        baseFee.add(byteFee).add(transferFee).add(fees.creationFee) :
        baseFee.add(byteFee).add(transferFee)
      const formattedFee = formatBalance(totalFee)
      if (formattedFee !== this.state.fee) {
        this.setState({ ...this.state, fee: formattedFee })
        this.props.handleFeeChange(totalFee, fees.creationFee, fees.existentialDeposit, available)
      }
    })
  }

  componentDidMount (): void {
    this.updateFee()
  }

  componentWillUnmount (): void {
    this.state.nextTry && clearTimeout(this.state.nextTry)
  }

  render () {
    return this.state.fee !== undefined ? this.renderFee() : this.renderPlaceHolder()
  }

  renderPlaceHolder () {
    return (
      <TxFee>{t('transferFee')}
        <span/>
      </TxFee>
    )
  }

  renderFee () {
    return (
      <TxFee>{t('transferFee')}
        <span>&nbsp;{this.state.fee}</span>
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

interface IFeeProps extends StateProps {
  address: string,
  toAddress: string,
  handleFeeChange: any
}

interface IFeeState {
  fee?: string
  tries: number
  nextTry?: any
}

export default connect(mapStateToProps)(Fee)

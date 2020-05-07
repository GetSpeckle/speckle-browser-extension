import React from 'react'
import t from '../../services/i18n'
import { connect } from 'react-redux'
import { IAppState } from '../../background/store/all'
import ApiPromise from '@polkadot/api/promise'
import { formatBalance } from '@polkadot/util'
import styled from 'styled-components'
import BN from 'bn.js'
import { isAddressValid } from '../../services/address-transformer'

class Fee extends React.Component<IFeeProps, IFeeState> {

  state: IFeeState = {}

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
    if (!isAddressValid(this.props.toAddress)) {
      this.setState({ fee: undefined })
      return
    }
    const { address, toAddress } = this.props
    const ext = this.api.tx.balances.transfer(toAddress, 1)
    ext.paymentInfo(address).then((dispatchInfo) => {
      const formattedFee = formatBalance(dispatchInfo.partialFee, { forceUnit: '-', withSi: true })
      if (formattedFee !== this.state.fee) {
        this.setState({ ...this.state, fee: formattedFee })
        this.props.handleFeeChange(new BN(dispatchInfo.partialFee))
      }
    })
  }

  componentDidMount (): void {
    this.updateFee()
  }

  render () {
    return (
      <TxFee>{t('transferFee')}
        <span>&nbsp;{this.state.fee ? this.state.fee : ''}</span>
      </TxFee>
    )
  }
}

const TxFee = styled.p`
  opacity: 0.6;
  color: #556267;
  font-family: Nunito;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.5;
  letter-spacing: normal;
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
}

export default connect(mapStateToProps)(Fee)

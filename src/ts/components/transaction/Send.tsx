import * as React from 'react'
import { getAccount } from '../../services/keyring-vault-proxy'
import ApiPromise from '@polkadot/api/promise'
import { RouteComponentProps, withRouter } from 'react-router'
import {
  Button as StyledButton,
  ContentContainer,
  Section
} from '../basic-components'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import 'react-tippy/dist/tippy.css'
import { Form } from 'semantic-ui-react'
import t from '../../services/i18n'
interface ISendProps extends StateProps, RouteComponentProps, DispatchProps {
}

interface ISendState {
  amount: number,
  toAddress: string
}

class Send extends React.Component<ISendProps, ISendState> {

  get api (): ApiPromise {
    const api = this.props.apiContext.api
    if (api) return api
    throw new Error(t('apiError'))
  }

  constructor (props) {
    super(props)

    this.state = {
      amount: 0,
      toAddress: ''
    }
  }

  changeAmount = event => {
    const val = event.target.value
    this.setState({ amount: val })
  }

  changeAddress = event => {
    const val = event.target.value
    this.setState({ toAddress: val })
  }

  confirm = () => {
    if (!this.props.settings.selectedAccount) {
      return
    }
    debugger
    getAccount(this.props.settings.selectedAccount.address).then(
      result => {
        // Do the transfer and track the actual status
        this.api.tx.balances
          .transfer(this.state.toAddress, this.state.amount)
          .signAndSend(result, ({ events = [], status }) => {
            console.log('Transaction status:', status.type)

            if (status.isFinalized) {
              console.log('Completed at block hash', status.asFinalized.toHex())
              console.log('Events:')

              events.forEach(({ phase, event: { data, method, section } }) => {
                console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString())
              })

              process.exit(0)
            }
          })
      }
    )
  }

  render () {
    if (!this.props.settings.selectedAccount) {
      return (null)
    }

    return (
      <ContentContainer>
        <Form>
          <Form.TextArea
            label='Amount'
            value={this.state.amount}
            onChange={this.changeAmount}
          />
          <Form.TextArea
            label='toAddress'
            value={this.state.toAddress}
            onChange={this.changeAddress}
          />
          <Section>
            <StyledButton onClick={this.confirm}>
              Confirm
            </StyledButton>
          </Section>
        </Form>
      </ContentContainer>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    apiContext: state.apiContext,
    settings: state.settings
  }
}

const mapDispatchToProps = {}
type DispatchProps = typeof mapDispatchToProps

type StateProps = ReturnType<typeof mapStateToProps>

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Send))

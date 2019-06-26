import styled from 'styled-components'
import { Overlay } from './Overlay'
import { Button, Container, Icon, Modal } from 'semantic-ui-react'
import * as React from 'react'
import Identicon from 'polkadot-identicon'
import 'react-tippy/dist/tippy.css'
import { Tooltip } from 'react-tippy'
import t from '../../services/i18n'
import { colorSchemes } from '../styles/themes'
import { IExtrinsic } from '@polkadot/types/types'
import { formatBalance } from '@polkadot/util'
import BN = require('bn.js')

interface IConfirmProps {
  network: string,
  trigger: any,
  fromAddress: string,
  amount: BN,
  toAddress: string,
  fee: BN,
  creationFee: BN,
  existentialDeposit: BN,
  extrinsic?: IExtrinsic | null,
  color: string,
  recipientAvailable: BN,
  confirm: any
  open: boolean
  handleModal: any
}

interface IConfirmState {
  status: string,
  extHash?: string | null, // Get ext hash from saved extrinsic
  message?: string,
  msgTimeout?: any,
}

export default class Confirm extends React.Component<IConfirmProps, IConfirmState> {

  state: IConfirmState = {
    status: '',
    extHash: this.props.extrinsic === undefined ? null : this.props.extrinsic!.hash.toHex()
  }

  handleClose = () => this.props.handleModal(false)
  handleConfirm = () => {
    this.handleClose()
    this.props.confirm()
  }

  truncate = (address: string) => {
    return `${address.slice(0, 15)}...${address.slice(-3)}`
  }

  copyToClipboard = (val: string) => {
    const el = document.createElement('textarea')
    el.value = val
    el.setAttribute('readonly', '')
    el.style.position = 'absolute'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)

    this.setState({ message: t('copyAddressMessage') })
    const timeout = setTimeout(() => {
      this.setState({ message: '' })
    }, 100)
    this.setState({ msgTimeout: timeout })
  }

  render () {

    // Conditional Rendering for warning article
    const doesNotExist: boolean = this.props.recipientAvailable.cmp(this.props.existentialDeposit) === -1
    let warning
    if (doesNotExist) {
      warning = (
        <Warning>
          <div>
            <Icon name='warning sign' size={'small'}/>
            The final recipient balance is less or equal
            to {formatBalance(this.props.existentialDeposit)} (the existential amount) and will
            not be reflected
          </div>
          <div>
            <Icon name='warning sign' size={'small'}/>
            A fee of {formatBalance(this.props.creationFee)} will be deducted from the sender
            since the destination account does not exist
          </div>
        </Warning>
      )
    } else {
      warning = null
    }

    return (
      <Modal
        trigger={this.props.trigger}
        style={{ 'zIndex': 3 }}
        onClose={this.handleClose}
        open={this.props.open}
      >
        <UpperSection>
          <Offset>
            <Status>
              <Identicon account={this.props.fromAddress} size={48}/>
            </Status>
          </Offset>
          <Tooltip
            title={!this.state.message ? t('copyToClipboard') : t('copiedExclam')}
            position='bottom'
            trigger='mouseenter'
            arrow={true}
          >
            <FromAddress>
              {this.props.fromAddress.substring(0, 8) + '...' + this.props.fromAddress.substring(this.props.fromAddress.length - 10)}
            </FromAddress>
          </Tooltip>
          <Heading>Confirm Extrinsic</Heading>
          <Subheading>Review your extrinsic details</Subheading>
        </UpperSection>
        <OverlaySection>
          <Overlay/>
        </OverlaySection>
        <Section>
          <FromTo color={colorSchemes[this.props.color].backgroundColor}>
            <Icon name='arrow circle right' size={'big'} style={{  'marginLeft': '10px' }}/>
            <Container textAlign={'left'} style={{ 'marginLeft': '10px' }}>
              <div style={{ 'display': 'flex', 'alignItems': 'center', 'fontSize': '13px', 'marginLeft': '-10px' }}>
                <Identicon account={this.props.toAddress} size={20} style={{ 'marginRight': '5px' }}/>
                <Tooltip
                  title={!this.state.message ? t('copyToClipboard') : t('copiedExclam')}
                  position='bottom'
                  trigger='mouseenter'
                  arrow={true}
                >
                  <span onClick={() => this.copyToClipboard(this.props.toAddress)}>{this.truncate(this.props.toAddress)}</span>
                </Tooltip>
              </div>
              <div style={{ 'display': 'flex', 'alignItems': 'center', 'fontSize': '11px', 'marginLeft': '5px' }}>
                <p>Available: {formatBalance(this.props.recipientAvailable)}</p>
              </div>
            </Container>
          </FromTo>
        </Section>
        <Section>
          <Info>
            <Key>Fee</Key>
            <Value>{formatBalance(this.props.fee)}</Value>
          </Info>
          <div style={{ 'border': '1px solid gray' }}/>
        </Section>
        <Section>
          <Info>
            <Key>Amount</Key>
            <Value>{formatBalance(this.props.amount)}</Value>
          </Info>
        </Section>
        <Section>
          <Info>
            <Key>total</Key>
            <Value>{formatBalance(this.props.amount.add(this.props.fee))}</Value>
          </Info>
        </Section>
        <Section>
          <Info>
            {warning}
          </Info>
          <Info>
            <div style={{ 'fontSize': '11px' }}>
              <div>
                <Icon name='arrow right' size={'small'}/>
                Fees include the transaction fee and the per-byte fee
              </div>
            </div>
          </Info>
        </Section>
        <Section style={{ 'marginTop': '20px' }}>
          <Info>
            <Button onClick={this.handleClose}>Cancel</Button>
            <ConfirmButton
              color={colorSchemes[this.props.color].backgroundColor}
              onClick={this.handleConfirm}
            >
              Confirm
            </ConfirmButton>
          </Info>
        </Section>
      </Modal>
    )
  }
}

const UpperSection = styled.div`
  width: 100%
  margin: 8px 0 9px
  text-align: center
`
const Offset = styled.div`
width: 100%
margin-top:-34px;
display: flex;
justify-content: center;
margin-bottom: 8px;
`
const Heading = styled.h3`
{
  margin-top: 8px;
  margin-bottom: 4px;
  font-family: Nunito;
  font-size: 19px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #30383b;
}
`

const Subheading = styled.p`
{
  font-family: Nunito;
  font-size: 11px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #a0aeb4;
}
`

const OverlaySection = styled.div`
  width: 100%
  margin-top: 10px
  text-align: center
`

const Status = styled.div`
  {
    width: 50px;
    height: 50px;
    border-radius: 100%;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`

const Key = styled.p`
  font-family: Nunito;
  font-size: 11px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #a0aeb4;
`
const FromAddress = styled.span`
  font-family: Nunito;
  font-size: 8px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #a0aeb4;
`

const Value = styled.p`
  font-family: Nunito;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #30383b;
`

const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const FromTo = styled.div`
  width: 80%;
  border-radius:20px;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${ props => props.color }
  color: #fff;
  margin-top: 15px;
  margin-left: 10px;
 `

const Info = styled.div`
   width: 80%;
   display: flex;
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
`

const Warning = styled.div`
  background: #ffffe0;
  border-color: #eeeeae;
  font-size: 11px;
`

const ConfirmButton = styled(Button)`
background-color: ${ props => props.color }!important;
color: #fff!important;
`

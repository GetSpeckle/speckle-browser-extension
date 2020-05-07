import * as React from 'react'
import styled from 'styled-components'
import { Button as BasicButton, Icon, Image, Modal } from 'semantic-ui-react'
import { Button } from '../basic-components'
import Identicon from '@polkadot/react-identicon'
import 'react-tippy/dist/tippy.css'
import { Tooltip } from 'react-tippy'
import t from '../../services/i18n'
import { colorSchemes } from '../styles/themes'
import { IExtrinsic } from '@polkadot/types/types'
import { formatBalance } from '@polkadot/util'
import BN = require('bn.js')
import { networks } from '../../constants/networks'

interface IConfirmProps {
  network: string,
  trigger: any,
  fromAddress: string,
  amount: BN,
  tip: BN,
  toAddress: string,
  fee: BN,
  extrinsic?: IExtrinsic | null,
  color: string,
  senderAvailable: BN,
  confirm: any,
  open: boolean,
  handleModal: any
}

interface IConfirmState {
  addressCopied: boolean,
  copiedTimeout?: any
}

const formatOptions = { withSi: true }

const delay = 1500

export default class Confirm extends React.Component<IConfirmProps, IConfirmState> {

  state: IConfirmState = {
    addressCopied: false
  }

  componentWillUnmount () {
    if (this.state.copiedTimeout) {
      clearTimeout(this.state.copiedTimeout)
    }
  }

  handleClose = () => this.props.handleModal(false)

  handleConfirm = () => {
    this.handleClose()
    this.props.confirm()
  }

  truncate = (address: string) => {
    return `${address.slice(0, 13)}...${address.slice(-3)}`
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

    this.setState({ addressCopied: true })
    const timeout = setTimeout(() => {
      this.setState({ addressCopied: false })
    }, delay)
    this.setState({ copiedTimeout: timeout })
  }

  copyFromAddressToClipboard = () => this.copyToClipboard(this.props.fromAddress)

  copyToAddressToClipboard = () => this.copyToClipboard(this.props.toAddress)

  render () {
    const network = networks[this.props.network]
    const identiconTheme = network.identiconTheme
    const totalFee = this.props.amount.add(this.props.fee).add(this.props.tip)
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
              <Identicon value={this.props.fromAddress} size={48} theme={identiconTheme}/>
            </Status>
          </Offset>
          <Tooltip
            title={!this.state.addressCopied ? t('copyToClipboard') : t('copiedExclam')}
            duration={delay}
            position='bottom'
            trigger='mouseenter'
            arrow={true}
          >
            <FromAddress>
              <span onClick={this.copyFromAddressToClipboard}>
                {this.truncate(this.props.fromAddress)}
              </span>
            </FromAddress>
          </Tooltip>
          <Heading>Confirm Extrinsic</Heading>
          <Subheading>Review your extrinsic details</Subheading>
        </UpperSection>
        <OverlaySection>
          <Image
            src='/assets/overlay.svg'
            centered={true}
          />
        </OverlaySection>
        <Section>
          <FromTo color={colorSchemes[this.props.color].backgroundColor}>
            <Icon name='arrow circle right' size={'big'} style={{ 'marginLeft': '10px' }}/>
            <Identicon
              value={this.props.toAddress}
              size={28}
              style={{ 'marginRight': '5px' }}
              theme={identiconTheme}
            />
            <To>
              <Tooltip
                title={!this.state.addressCopied ? t('copyToClipboard') : t('copiedExclam')}
                position='bottom'
                trigger='mouseenter'
                arrow={true}
              >
                  <span onClick={this.copyToAddressToClipboard}>
                    {this.truncate(this.props.toAddress)}
                  </span>
              </Tooltip>
              <AvailableBalance>
                <p>Available: {formatBalance(this.props.senderAvailable, formatOptions)}</p>
              </AvailableBalance>
            </To>
          </FromTo>
        </Section>
        <Section style={{ 'marginTop': '8px' }}>
          <Info>
            <Key>Fee</Key>
            <Value>{formatBalance(this.props.fee, formatOptions)}</Value>
          </Info>
          <div style={{ 'border': '1px solid gray' }}/>
        </Section>
        <Section style={{ 'marginTop': '8px' }}>
          <Info>
            <Key>Amount</Key>
            <Value>{formatBalance(this.props.amount, formatOptions)}</Value>
          </Info>
        </Section>
        <Section style={{ 'marginTop': '8px' }}>
          <Info>
            <Key>Tip</Key>
            <Value>{formatBalance(this.props.tip, formatOptions)}</Value>
          </Info>
        </Section>
        <Section style={{ 'marginTop': '8px', 'marginBottom': '16px' }}>
          <Info>
            <Key>Total</Key>
            <Value>
              {formatBalance(totalFee, formatOptions)}
            </Value>
          </Info>
        </Section>
        <Section style={{ 'marginTop': '20px' }}>
          <Info>
            <BasicButton style={{ width: '45%' }} onClick={this.handleClose}>Cancel</BasicButton>
            <Button style={{ width: '45%' }} onClick={this.handleConfirm}>Confirm</Button>
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
`

const Subheading = styled.p`
  font-family: Nunito;
  font-size: 11px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #a0aeb4;
`

const OverlaySection = styled.div`
  width: 100%
  margin-top: 7px
  text-align: center
`

const Status = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 100%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Key = styled.p`
  margin-top: 3px;
  font-family: Nunito;
  font-size: 11px;
  font-weight: bold;
  color: #a0aeb4;
  margin-bottom: 0px;
`
const FromAddress = styled.span`
  font-family: Nunito;
  font-size: 8px;
  font-weight: bold;
  color: #a0aeb4;
`

const Value = styled.p`
  font-family: Nunito;
  font-size: 14px;
  line-height: 1.43;
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
  background-color: ${props => props.color}
  color: #fff;
  margin-top: 15px;
 `

const Info = styled.div`
  width: 80%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const To = styled.div`
  display: 'flex';
  alignItems: 'center';
  fontSize: '13px';
  marginLeft: '-10px'
`
const AvailableBalance = styled.div`
  display: 'flex';
  alignItems: 'center';
  fontSize: '11px';
  marginLeft: '10px'
`

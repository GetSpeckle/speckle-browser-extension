import styled from 'styled-components'
import { Overlay } from './Overlay'
import { Container, Icon, Modal } from 'semantic-ui-react'
import * as React from 'react'
import Identicon from 'polkadot-identicon'
import 'react-tippy/dist/tippy.css'
import { Tooltip } from 'react-tippy'
import t from '../../services/i18n'
import { colorSchemes } from '../styles/themes'
import { IExtrinsic } from '@polkadot/types/types'

interface IConfirmProps {
  network: string,
  trigger: any,
  fromAddress: string,
  fromName: string,
  amount: string,
  toAddress: string,
  fee: string,
  extrinsic?: IExtrinsic | null,
  color: string
}

interface IConfirmState {
  status: string,
  extHash?: string | null,
  message?: string,
  msgTimeout?: any
}

export default class Confirm extends React.Component<IConfirmProps, IConfirmState> {
  state: IConfirmState = {
    status: '',
    extHash: this.props.extrinsic === undefined ? null : this.props.extrinsic!.hash.toHex()
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
    return (
    <Modal trigger={this.props.trigger} style={{ 'zIndex': 3000 }}>
      <Section>
        <Offset>
          <Status>
            <Identicon account={this.props.fromAddress} size={48}/>
          </Status>
        </Offset>
        <Heading>Confirm Extrinsic</Heading>
        <Subheading>Review your extrinsic details</Subheading>
      </Section>
      <OverlaySection>
        <Overlay/>
      </OverlaySection>
      <Info>
        <FromTo color={colorSchemes[this.props.color].backgroundColor}>
          <Icon name='arrow circle right' size={'big'}/>
          <Container textAlign={'center'}>
            <Tooltip
              title={!this.state.message ? t('copyToClipboard') : t('copiedExclam')}
              position='bottom'
              trigger='mouseenter'
              arrow={true}
            >
              <AccountName onClick={() => this.copyToClipboard(this.props.toAddress)}>{this.truncate(this.props.toAddress)}</AccountName>
            </Tooltip>
          </Container>
        </FromTo>
        <Value>{this.state.extHash}</Value>
      </Info>
    </Modal>
    )
  }
}

const Section = styled.div`
  width: 100%
  margin: 8px 0 9px
  text-align: center
`
const Offset = styled.div`
width: 100%
margin-top:-34px;
display: flex;
justify-content: center;
`
const Heading = styled.h3`
{
  margin-top: 20px;
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
  margin: 18px 0 0px
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
/*
const Key = styled.p`
  font-family: Nunito;
  font-size: 11px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #a0aeb4;
  margin-left: 15px;
`
*/

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

const Info = styled.div`
  width: 100%;
  display: flex;
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
  margin-top: 10px;
 `

const AccountName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  width: 50px;
  font-size: 15px;
  margin-left: 30px;
`

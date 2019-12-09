import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import t from '../../services/i18n'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import { findNetwork, Network } from '../../constants/networks'
import { Grid } from 'semantic-ui-react'
import { bnToBn, formatBalance } from '@polkadot/util'
import { SignerPayloadJSON } from '@polkadot/types/types'
import BN from 'bn.js'
import { GenericCall } from '@polkadot/types'
import { displayAddress } from '../../services/address-transformer'
import { Color, colorSchemes } from '../styles/themes'
import { ExtrinsicPayload } from '@polkadot/types/interfaces'

type P = {
  color: Color
}

interface Decoded {
  json: MethodJson | null
  method: GenericCall | null
}

interface MethodJson {
  args: Record<string, string>
}

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings
  }
}

type StateProps = ReturnType<typeof mapStateToProps>

interface ISignMessageProps extends StateProps {
  isDecoded: boolean,
  extrinsicPayload: ExtrinsicPayload
  signerPayload: SignerPayloadJSON
}

const decodeMethod = (data: string, isDecoded: boolean, network: Network, specVersion: BN)
  : Decoded => {
  let json: MethodJson | null = null
  let method: GenericCall | null = null

  formatBalance.setDefaults({
    decimals: network.tokenDecimals,
    unit: network.tokenSymbol
  })
  try {
    if (isDecoded && network.hasMetadata && specVersion.eqn(network.specVersion)) {
      method = new GenericCall(network.registry, data)
      json = method.toJSON() as unknown as MethodJson
    }
  } catch (error) {
    json = null
    method = null
  }
  return { json, method }
}

const renderMethod = (data: string, { json, method }: Decoded): React.ReactNode => {
  if (!json || !method) {
    return (
      <SignMessageGridRow>
        <Message>{data}</Message>
      </SignMessageGridRow>
    )
  }

  return (
    <table>
      <tbody>
        <tr>
          <td align={'right'}>
            <Message>{t('action')}</Message>
          </td>
          <td align={'left'}>
            <Message>{method.sectionName}.{method.methodName}</Message>
          </td>
        </tr>
        <tr>
          <td align={'right'}>
            <Message>{t('dest')}</Message>
          </td>
          <td align={'left'}>
            <Message>{displayAddress(json.args.dest, false)}</Message>
          </td>
        </tr>
        <tr>
          <td align={'right'}>
            <Message>{t('value')}</Message>
          </td>
          <td align={'left'}>
            <Message>{formatBalance(json.args.value)}</Message>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

const Extrinsic = ({ settings, isDecoded, signerPayload }: ISignMessageProps) => {
  const { genesisHash, method, specVersion: hexSpec } = signerPayload
  const network = useRef(findNetwork(genesisHash)).current
  const specVersion = useRef(bnToBn(hexSpec)).current
  const [decoded, setDecoded] = useState<Decoded>({ json: null, method: null })
  useEffect((): void => {
    setDecoded(decodeMethod(method, isDecoded, network, specVersion))
  }, [isDecoded])

  return (
    <SignMessageGrid centered={true} textAlign='center'>
      <SignMessageGridRow textAlign='left' verticalAlign='top'>
        <SignMessageGridColumn width='12'>
          <Icon color={settings.color}><Caption>{t('signingMessageIcon')}</Caption></Icon>
        </SignMessageGridColumn>
        <SignMessageGridColumn width='1'>
          <NetworkIcon src={network.chain.iconUrl} alt='Chain logo'/>
        </SignMessageGridColumn>
        <SignMessageGridColumn width='3'>
          <NetworkName>{network.name}</NetworkName>
        </SignMessageGridColumn>
      </SignMessageGridRow>
      {renderMethod(method, decoded)}
    </SignMessageGrid>
  )
}

const NetworkIcon = styled.img`
  float: right;
  height: 20px;
  object-fit: contain;
`

const NetworkName = styled.span`
  float: right;
  height: 18px;
  font-family: Nunito;
  font-size: 13px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #000000;
`

const Message = styled.span`
  width: 301px;
  height: 36px;
  font-family: Nunito;
  font-size: 13px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #556267;
`

const Caption = styled.span`
  width: 53px;
  height: 18px;
  font-family: Nunito;
  font-size: 13px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #fcfeff;
`

const Icon = styled.div`
  width: 68px;
  height: 41px;
  background-image: linear-gradient(${(p: P) => colorSchemes[p.color].stopColorTwo}, ${(p: P) => colorSchemes[p.color].stopColorOne});
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
  text-align: center;
`

const SignMessageGrid = styled(Grid)` && {
  display: flex;
  height: 115px;
  margin: 0 auto;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(62, 88, 96, 0.1);
  background-color: #ffffff;
  }
`

const SignMessageGridRow = styled(Grid.Row)` && {
  padding: 0 !important;
}
`

const SignMessageGridColumn = styled(Grid.Column)` && {
  padding: 0 !important;
}
`

export default connect(mapStateToProps)(Extrinsic)

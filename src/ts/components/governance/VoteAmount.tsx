import * as React from 'react'
import styled from 'styled-components'
import { Dropdown } from 'semantic-ui-react'
import t from '../../services/i18n'
import { SiDef } from '@polkadot/util/types'
import { SI } from '@polkadot/util/format/si'
import { ErrorMessage } from '../basic-components'

export interface ConvictionDef {
  key: string
  text: string
  value: string
}

interface IAmountProps {
  handleAmountChange: any,
  handleAmountSiChange: any,
  handleConvictionChange: any,
  amountError: string,
}

const MIN_P = -3
const MAX_P = 6
const siOptions: SiDef[] = SI.filter(({ power }) => power >= MIN_P && power <= MAX_P)
const convictionOptions: ConvictionDef[] = [
  { key: '0.1x', text: '0.1x voting balance, no lockup period', value: '0.1x' },
  { key: '1x', text: '1x voting balance, locked for 1x enactment (28.00 days)', value: '1x' },
  { key: '2x', text: '2x voting balance, locked for 2x enactment (56.00 days)', value: '2x' },
  { key: '3x', text: '3x voting balance, locked for 3x enactment (112.00 days)', value: '3x' },
  { key: '4x', text: '4x voting balance, locked for 4x enactment (224.00 days)', value: '4x' },
  { key: '5x', text: '5x voting balance, locked for 5x enactment (448.00 days)', value: '5x' },
  { key: '6x', text: '6x voting balance, locked for 6x enactment (896.00 days)', value: '6x' }]

export default class VoteAmount extends React.Component<IAmountProps> {

  componentDidUpdate (prevProps) {
    if (this.props.amountError !== prevProps.amountError) {
      this.render()
    }
  }

  render () {
    const defaultValues = siOptions.filter(siDef => siDef.power === 0)
    const defaultValue = defaultValues[0].value
    return (
      <AmountDiv>
        <InputDiv>
          <Label>{t('amount')}</Label>
          <Row>
            <Input>
              <TruncatedInput type='text' onChange={this.props.handleAmountChange} size={21} />
              <ErrorMessage>{this.props.amountError}</ErrorMessage>
            </Input>
            <SiDropdown
              selection={true}
              options={siOptions}
              defaultValue={defaultValue}
              scrolling={true}
              onChange={this.props.handleAmountSiChange}
            />
          </Row>
          <Row style={{ 'marginTop': '10px' }}>
            <Label>Conviction</Label>
            <ConvictionDropdown
              selection={true}
              options={convictionOptions}
              defaultValue={defaultValue}
              scrolling={true}
              onChange={this.props.handleConvictionChange}
            />
          </Row>
        </InputDiv>
      </AmountDiv>
    )
  }
}

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  width: 320px;
`

const Label = styled.label`
  z-index: 2;
  width: 41px;
  height: 15px;
  font-size: 11px;
  font-family: Nunito;
  font-size: 11px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  position: absolute;
  margin-top:-7px;
  margin-left:12px;
  background:white;
  border-left: 2px;
  border-right: 2px;
`

const Input = styled.div`
  width: 200px;
  height: 54px;
  text-overflow: ellipsis;
  white-space:nowrap;
  overflow: hidden;
`

const SiDropdown = styled(Dropdown)`
  margin-left: 11px;
  height: 32px;
  min-width: 80px !important;
`

const ConvictionDropdown = styled(Dropdown)`
  z-index: 1;
  height: 50px;
  min-width: 310px !important;
`

const TruncatedInput = styled.input`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const AmountDiv = styled.div`
  height: 123px;
  margin-top: -10px;
`
const InputDiv = styled.div`
  margin-top: 10px;
`

import * as React from 'react'
import styled from 'styled-components'
import { Dropdown } from 'semantic-ui-react'
import t from '../../services/i18n'
import { SiDef } from '@polkadot/util/types'
import { SI } from '@polkadot/util/format/si'
import { ErrorMessage } from '../basic-components'

interface IAmountProps {
  handleAmountChange: any,
  handleAmountSiChange: any,
  handleTipChange: any,
  handleTipSiChange: any,
  amountError: string,
  tipError: string
}

const MIN_P = -3
const MAX_P = 6
const siOptions: SiDef[] = SI.filter(({ power }) => power >= MIN_P && power <= MAX_P)

export default class Amount extends React.Component<IAmountProps> {

  componentDidUpdate (prevProps) {
    if (this.props.amountError !== prevProps.amountError ||
      this.props.tipError !== prevProps.tipError) {
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
        </InputDiv>
        <InputDiv>
          <Label>{t('tip')}</Label>
          <Row>
            <Input>
              <TruncatedInput type='text' onChange={this.props.handleTipChange} size={21}/>
              <ErrorMessage>{this.props.tipError}</ErrorMessage>
            </Input>
            <SiDropdown
              selection={true}
              options={siOptions}
              defaultValue={defaultValue}
              scrolling={true}
              onChange={this.props.handleTipSiChange}
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
  width: 311px;
`

const Label = styled.label`
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

const TruncatedInput = styled.input`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const AmountDiv = styled.div`
  height: 123px;
`
const InputDiv = styled.div`
  margin-top: 10px;
`

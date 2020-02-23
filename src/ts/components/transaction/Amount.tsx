import * as React from 'react'
import styled from 'styled-components'
import { Dropdown } from 'semantic-ui-react'
import t from '../../services/i18n'
import { SiDef } from '@polkadot/util/types'
import { ErrorMessage } from '../basic-components'
import formatBalance from '@polkadot/util/format/formatBalance'

interface IAmountProps {
  handleAmountChange: any,
  handleAmountSiChange: any,
  handleTipChange: any,
  handleTipSiChange: any,
  amountValid: String,
  tipValid: String
}

const siOptions: SiDef[] = formatBalance.getOptions()

export default class Amount extends React.Component<IAmountProps> {

  componentDidUpdate (prevProps) {
    if (this.props.amountValid !== prevProps.amountValid ||
      this.props.tipValid !== prevProps.tipValid) {
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
          <div style={{ display: 'flex', width: '311px' }}>
            <Input>
              <TruncatedInput type='text' onChange={this.props.handleAmountChange} size={20} />
              <ErrorMessage>{this.props.amountValid}</ErrorMessage>
            </Input>
            <SiDropdown
              selection={true}
              options={siOptions}
              defaultValue={defaultValue}
              scrolling={true}
              onChange={this.props.handleAmountSiChange}
            />
          </div>
        </InputDiv>
        <InputDiv>
          <Label>{t('tip')}</Label>
          <div style={{ display: 'flex', width: '311px' }}>
            <Input>
              <TruncatedInput type='text' onChange={this.props.handleTipChange} size={20}/>
              <ErrorMessage>{this.props.tipValid}</ErrorMessage>
            </Input>
            <SiDropdown
              selection={true}
              options={siOptions}
              defaultValue={defaultValue}
              scrolling={true}
              onChange={this.props.handleTipSiChange}
            />
          </div>
        </InputDiv>
      </AmountDiv>
    )
  }
}

const Label = styled.label`
  {
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
  }
`

const Input = styled.div`
{
  width: 200px;
  height: 54px;
  text-overflow: ellipsis;
  white-space:nowrap;
  overflow: hidden;
}
`

const SiDropdown = styled(Dropdown)`
{
  margin-left: 11px;
  height: 32px;
  min-width: 100px;
}
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
  margin-top: 7.5px;
`

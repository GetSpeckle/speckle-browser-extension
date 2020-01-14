import * as React from 'react'
import styled from 'styled-components'
import { Dropdown } from 'semantic-ui-react'
import t from '../../services/i18n'
import { SiDef } from '@polkadot/util/types'

interface IAmountProps {
  handleAmountChange: any,
  handleDigitChange: any,
  handleTipChange: any,
  options: SiDef[]
}

export default class Amount extends React.Component<IAmountProps> {
  render () {
    const defaultValues = this.props.options.filter(siDef => siDef.power === 0)
    const defaultValue = defaultValues[0].value
    return (
      <div>
        <Label>{t('amount')}</Label>
        <div style={{ display: 'flex', width: '311px' }}>
          <Input>
            <TruncatedInput type='text' onChange={this.props.handleAmountChange} size={20}/>
          </Input>
          <Digit
            selection={true}
            options={this.props.options}
            defaultValue={defaultValue}
            scrolling={true}
            style={{ minWidth: '100px' }}
            onChange={this.props.handleDigitChange}
          />
        </div>
        <br/>
        <Label>{t('tip')}</Label>
        <div style={{ display: 'flex', width: '311px' }}>
          <Input>
            <TruncatedInput type='text' onChange={this.props.handleTipChange} size={20}/>
          </Input>
          <Digit
            selection={true}
            options={this.props.options}
            defaultValue={defaultValue}
            scrolling={true}
            style={{ minWidth: '100px' }}
            onChange={this.props.handleDigitChange}
          />
        </div>
      </div>
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
  height: 42px;
  text-overflow: ellipsis;
  white-space:nowrap;
  overflow: hidden;
}
`

const Digit = styled(Dropdown)`
{
  margin-left: 11px;
  height: 32px;
}
`

const TruncatedInput = styled.input`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

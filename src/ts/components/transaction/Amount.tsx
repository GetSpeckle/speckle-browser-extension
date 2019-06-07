import * as React from 'react'
import styled from 'styled-components'
import { Dropdown } from 'semantic-ui-react'


export default class Amount extends React.Component {
  render () {
    return (
      <div>
        <Label>Amount</Label>
        <div style={{ display: 'flex', width: '311px' }}>
          <Input>
          <input type='text'/>
          </Input>
          <Digit
            selection={true}
            options={options}
            defaultValue={options[5].value}
            scrolling={true}
            style={{ minWidth: '100px' }}
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
}
`

const Digit = styled(Dropdown)`
{
  margin-left: 11px;
  height: 32px;
}
`

const options = [
  { key: 'f', text: 'femto', value: '1' },
  { key: 'p', text: 'pico', value: '1000' },
  { key: 'n', text: 'nano', value: '1000000' },
  { key: 'm', text: 'micro', value: '1000000000' },
  { key: 'mi', text: 'milli', value: '1000000000000' },
  { key: 'd', text: 'DOT', value:  '1000000000000000' },
  { key: 'k', text: 'Kilo', value: '1000000000000000000' },
  { key: 'm', text: 'Mega', value: '1000000000000000000000' },
  { key: 'g', text: 'Giga', value: '1000000000000000000000000' },
  { key: 't', text: 'Tera', value: '1000000000000000000000000000' },
  { key: 'P', text: 'Peta', value: '1000000000000000000000000000000' },
  { key: 'e', text: 'Exa', value:  '1000000000000000000000000000000000' },
  { key: 'z', text: 'Zetta', value: '1000000000000000000000000000000000000' },
  { key: 'y', text: 'Yotta', value: '1000000000000000000000000000000000000000' }
]

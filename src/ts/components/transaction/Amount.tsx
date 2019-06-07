import * as React from 'react'
import styled from 'styled-components'
import { Dropdown } from 'semantic-ui-react'

/*
interface IAccountProps {
  changeAmount: any
}
*/

/*
interface IAmountState {
  value: string
  siUnit: string
}
 */

export default class Amount extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      value: '',
      siUnit: '-'
    }
  }

  /*
  handleOnChange = (_e, data) => {
    this.props.changeAmount(this.state.value, data.value)
  }
  */

  updateValue = (event) => {
    this.setState({ value: event.target.value })
    console.log(event.target.value)
  }

  updateDigit = (_event: React.SyntheticEvent<HTMLDivElement>, data: any) => {
    this.setState({ siUnit: data.value })
    console.log(data.value)
  }

  render () {
    return (
      <div>
        <Label>Amount</Label>
        <div style={{ display: 'flex', width: '311px' }}>
          <Input>
          <input type='text' onChange={this.updateValue}/>
          </Input>
          <Digit
            selection={true}
            options={options}
            defaultValue={options[8].value}
            scrolling={true}
            style={{ minWidth: '100px' }}
            onChange={this.updateDigit}
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
  { power: -24, value: 'y', text: 'yocto' },
  { power: -21, value: 'z', text: 'zepto' },
  { power: -18, value: 'a', text: 'atto' },
  { power: -15, value: 'f', text: 'femto' },
  { power: -12, value: 'p', text: 'pico' },
  { power: -9, value: 'n', text: 'nano' },
  { power: -6, value: 'µ', text: 'micro' },
  { power: -3, value: 'm', text: 'milli' },
  { power: 0, value: '-', text: 'DOT' }, // position 8
  { power: 3, value: 'k', text: 'Kilo' },
  { power: 6, value: 'M', text: 'Mega' },
  { power: 9, value: 'G', text: 'Giga' },
  { power: 12, value: 'T', text: 'Tera' },
  { power: 15, value: 'P', text: 'Peta' },
  { power: 18, value: 'E', text: 'Exa' },
  { power: 21, value: 'Z', text: 'Zeta' },
  { power: 24, value: 'Y', text: 'Yotta' }
]

import * as React from 'react'
import styled from 'styled-components'

export default class Amount extends React.Component {
  render () {
    return (
      <div>
        <Label>Amount</Label>
        <Field>
          <input type='text'/>
          <button>Max</button>
        </Field>
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

const Field = styled.div`
{
  width: 311px;
  height: 42px;
  display: flex;
}
input {
  flex: 1;
}
`

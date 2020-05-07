import * as React from 'react'
import styled from 'styled-components'
import t from '../../services/i18n'

interface IToAddressProps {
  handleAddressChange: any
}

export default class ToAddress extends React.Component<IToAddressProps> {

  render () {
    return (
      <div>
        <Label>{t('toAddress')}</Label>
        <Field>
          <AddressInput
            type='text'
            onChange={this.props.handleAddressChange}
            size={34}
            maxLength={48}
          />
        </Field>
      </div>
    )
  }
}

const Label = styled.label`
  width: 41px
  height: 15px
  font-size: 11px
  font-family: Nunito
  font-size: 11px
  font-weight: bold
  font-style: normal
  font-stretch: normal
  line-height: normal
  letter-spacing: normal
  position: absolute
  margin-top:-7px
  margin-left:12px
  background:white
  border-left: 2px
  border-right: 2px
`

const Field = styled.div`
  width: 311px
  height: 42px
  display: flex
`

const AddressInput = styled.input`
  flex: 1
  overflow: hidden
  white-space:nowrap
  text-overflow: ellipsis
`

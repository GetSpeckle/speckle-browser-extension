import React, { useState, useEffect } from 'react'
import { Form } from 'semantic-ui-react'
import { Button } from '../basic-components'

type Props = {
  onSign: (password: string) => Promise<any>
}

export default function Unlock ({ onSign }: Props) {
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')

  const onClick = () =>
    onSign(password)
      .catch((error) => setError(error.message))

  const changePassword = event => {
    setPassword(event.target.value)
  }

  useEffect(() => {
    if (error) {
      setError('')
    }
  }, [password])

  return (
    <Form>
      <Form.Input
        isError={!password || !!error}
        focus={true}
        onChange={changePassword}
        label='password for this account'
        type='password'
      />
      <Button
        label='Sign the transaction'
        onClick={onClick}
      />
    </Form>
  )
}

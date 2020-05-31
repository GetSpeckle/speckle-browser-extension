import React, { useState, useEffect } from 'react'
import { Button as BasicButton, Form, Grid } from 'semantic-ui-react'
import { Button } from '../basic-components'
import t from '../../services/i18n'

type Props = {
  onSign: (password: string) => Promise<any>,
  onCancel: () => any
}

export default function Unlock ({ onSign, onCancel }: Props) {
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')

  const sign = () =>
    onSign(password)
      .catch((error) => setError(error.message))
  const cancel = () => onCancel()

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
        error={!password || !!error}
        focus={true}
        onChange={changePassword}
        placeholder={t('password')}
        type='password'
      />
      <Grid columns='equal'>
        <Grid.Column>
          <BasicButton fluid={true} onClick={cancel} className='minor'>
            {t('cancel')}
          </BasicButton>
        </Grid.Column>
        <Grid.Column>
          <Button onClick={sign} className='narrow'>
            {t('sign')}
          </Button>
        </Grid.Column>
      </Grid>
    </Form>
  )
}

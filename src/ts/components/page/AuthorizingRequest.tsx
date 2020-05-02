// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react'
import { approveAuthRequest, rejectAuthRequest } from '../../services/messaging'
import { Button } from '../basic-components'
import AlertPanel from './AlertPanel'
import { Grid, Button as BasicButton } from 'semantic-ui-react'
import RequestPanel from './RequestPanel'
import t from '../../services/i18n'

const AuthorizingRequest = (props) => {
  const { id, request: { origin }, url } = props.request
  const onApprove = () =>
    approveAuthRequest(id)
      .catch(console.error)
  const onReject = () =>
    rejectAuthRequest(id)
      .catch(console.error)

  return (
    <div>

      <div className='auth-description'>
        {origin} {t('authDesc')}
      </div>

      {/* TODO: use the real value */}
      <RequestPanel
        origin={origin}
      />

      <AlertPanel
        color='red'
        message={t('accessAlert') + url}
        icon='linkify'
      />

      <AlertPanel
        color='red'
        message={t('approveAlert')}
        icon='exclamation'
      />

      <Grid columns='equal'>
        <Grid.Column>
          <BasicButton fluid={true} onClick={onReject} className='minor'>
            {t('reject')}
          </BasicButton>
        </Grid.Column>
        <Grid.Column>
          <Button onClick={onApprove} className='narrow'>
            {t('approve')}
          </Button>
        </Grid.Column>
      </Grid>

    </div>
  )
}

export default AuthorizingRequest

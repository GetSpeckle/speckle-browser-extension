import React from 'react'

import SigningRequest from './SigningRequest'

const Signing = (props) => {
  const { requests } = props
  const signingRequests = requests.map(([id, extrinsic, url], index) => (
    <SigningRequest
      isFirst={index === 0}
      key={id}
      extrinsic={extrinsic}
      signId={id}
      url={url}
    />
  ))
  return (
    <div>{signingRequests}</div>
  )
}

export default Signing

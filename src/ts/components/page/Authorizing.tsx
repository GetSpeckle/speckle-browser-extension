import React from 'react'
import AuthorizingRequest from './AuthorizingRequest'

const Authorizing = (props) => {
  const { requests } = props
  return (
    <div>
      {requests.map((request, index) => <AuthorizingRequest request={request} key={index}/>)}
    </div>
  )
}

export default Authorizing

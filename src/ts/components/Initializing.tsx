import * as React from 'react'
import '../../assets/app.css'
import { Image } from 'semantic-ui-react'

const logo = {
  width: 150,
  height: 65
}

const Initializing = () => {
  return (
    <div className='lds-grid-container'>
      <Image src='/assets/logo-3-x.svg' style={logo}/>
      <div className='lds-grid'>
        <div/>
        <div/>
        <div/>
        <div/>
        <div/>
      </div>
    </div>
  )
}

export default Initializing

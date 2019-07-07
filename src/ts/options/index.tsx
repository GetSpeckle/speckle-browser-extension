import * as React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import OptionsApp from './containers/OptionsApp'
import { store } from '../background/store'

ReactDOM.render(<Provider store={store}><OptionsApp /></Provider>,
  document.getElementById('options-root'))

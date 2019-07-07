import 'semantic-ui-css/semantic.min.css'
import '../../assets/app.css'

import * as React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import PopupApp from './containers/PopupApp'
import { store } from '../background/store'

ReactDOM.render(<Provider store={store}><PopupApp /></Provider>,
  document.getElementById('popup-root')
)

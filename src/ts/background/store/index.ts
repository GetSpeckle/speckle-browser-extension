import { createStore, applyMiddleware } from 'redux'
import promise from 'redux-promise-middleware'
import reducers from './all'

export const store = createStore(reducers, applyMiddleware(promise))

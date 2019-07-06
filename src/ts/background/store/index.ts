import { createStore, applyMiddleware } from 'redux'
import promise from 'redux-promise-middleware'
import reducers, { IAppState } from './all'

const defaultMiddlewares = [
  promise
]

const initializeStore = (initialState?: IAppState, middlewares = []) =>
  createStore(reducers, initialState, applyMiddleware(...defaultMiddlewares, ...middlewares))

export default initializeStore

import { createStore, applyMiddleware } from 'redux'
import promise from 'redux-promise-middleware'
import thunkMiddleware from 'redux-thunk'
import { loadingBarMiddleware } from 'react-redux-loading-bar'
import reducers, { IAppState } from './all'

const defaultMiddlewares = [
  thunkMiddleware,
  promise,
  loadingBarMiddleware()
]

const initializeStore = (initialState?: IAppState, middlewares = []) =>
  createStore(reducers, initialState, applyMiddleware(...defaultMiddlewares, ...middlewares))

export default initializeStore

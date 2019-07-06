import { AnyAction, Reducer } from 'redux'
import { ACTION_TYPES } from '../error'

export interface IError {
  message: string
}

const initialState: IError = {
  message: ''
}

const error: Reducer<IError, AnyAction> = (state = initialState, action) => {
  if (action.type === ACTION_TYPES.SET_ERROR) {
    console.log('set error message: ', action.payload)
    return { ...state, message: action.payload }
  } else {
    return state
  }
}

export default error

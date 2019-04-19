import { AnyAction, Reducer } from 'redux'

export interface IError {
  message: string
}

const initialState: IError = {
  message: ''
}

export const ACTION_TYPES = {
  SET_ERROR: 'SET_ERROR'
}

export function setError (message: string | null): AnyAction {
  return {
    type: ACTION_TYPES.SET_ERROR,
    payload: message
  }
}

/**
 * error reducer
 *
 * @param state the current state
 * @param action the action received
 */
const error: Reducer<IError, AnyAction> = (state = initialState, action) => {
  switch (action.type) {

    case ACTION_TYPES.SET_ERROR:
      console.log('set error message: ', action.payload)
      return { ...state, message: action.payload }

    default:
      return state
  }
}

export default error

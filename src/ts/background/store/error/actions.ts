import { AnyAction } from 'redux'

export const ACTION_TYPES = {
  SET_ERROR: 'SET_ERROR'
}

export function setError (message: string | null): AnyAction {
  return {
    type: ACTION_TYPES.SET_ERROR,
    payload: message
  }
}

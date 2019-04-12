import { AnyAction, Reducer } from 'redux'

export interface IAccountStatus {
  locked: boolean,
  created: boolean
}

const initialState: IAccountStatus = {
  locked: true,
  created: false
}

export const ACTION_TYPES = {
  SET_LOCKED: 'SET_LOCKED'
}

export function setLocked (locked: boolean): AnyAction {
  return {
    type: ACTION_TYPES.SET_LOCKED,
    payload: locked
  }
}

/**
 * account reducer
 *
 * @param state the current state
 * @param action the action received
 */
const account: Reducer<IAccountStatus, AnyAction> = (state = initialState, action) => {
  switch (action.type) {

    case ACTION_TYPES.SET_LOCKED:
      console.log('set locked statue: ', action.payload)
      return { ...state, locked: action.payload }

    default:
      return state
  }
}

export default account

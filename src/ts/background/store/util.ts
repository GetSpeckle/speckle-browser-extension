import { Action } from 'redux'

/**
 * An extended action with the optional payload field
 */
export interface SpeckleAction<T = any, P = any> extends Action {
  type: T
  payload?: P
}


export const REQUEST = (actionType: string) => `${actionType}_PENDING`

export const SUCCESS = (actionType: string) => `${actionType}_FULFILLED`

export const FAILURE = (actionType: string) => `${actionType}_REJECTED`

import { MessageTypes } from '../background/types'

export interface SendRequest {
  (message: MessageTypes, request?: any, subscriber?: (data: any) => any): Promise<any>
}

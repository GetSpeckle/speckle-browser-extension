
export type TransactionType = 'Sent' | 'Received' | 'Staked'
export type TransactionStatus = 'Pending' | 'Success' | 'Failure'

export interface ITransaction {
  id: string // uuid
  from: string
  to: string
  amount: Number
  fee: Number
  type: TransactionType
  status: TransactionStatus
  txHash?: string
  createTime: Date
  updateTime?: Date
}

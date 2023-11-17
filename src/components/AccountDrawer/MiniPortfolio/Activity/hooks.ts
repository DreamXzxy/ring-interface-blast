import { usePendingOrders } from 'state/signatures/hooks'
import { usePendingTransactions } from 'state/transactions/hooks'

export function usePendingActivity() {
  const pendingTransactions = usePendingTransactions()
  const pendingOrders = usePendingOrders()

  const hasPendingActivity = pendingTransactions.length > 0 || pendingOrders.length > 0
  const pendingActivityCount = pendingTransactions.length + pendingOrders.length

  return { hasPendingActivity, pendingActivityCount }
}

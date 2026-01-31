export type DepositStatus = "PENDING" | "PAID" | "CANCELLED" | "EXPIRED";

export interface BalanceDeposit {
  id: number;
  appTransId: string;
  zpTransId?: number;
  userId: number;
  userFullName?: string;
  amount: number;
  description?: string;
  orderUrl?: string;
  qrCode?: string;
  paymentGateway?: string;
  status: DepositStatus;
  paymentChannel?: number;
  expiredAt?: string;
  paidAt?: string;
  createdAt: string;
}

export interface BalanceStatistics {
  totalDeposited: number;
  todayDeposited: number;
  monthDeposited: number;
  totalTransactions: number;
  paidTransactions: number;
  pendingTransactions: number;
  cancelledTransactions: number;
  expiredTransactions: number;
  todayTransactions: number;
  monthTransactions: number;
}

export const DEPOSIT_STATUS_CONFIG = {
  PENDING: { label: "Chờ thanh toán", color: "bg-yellow-100 text-yellow-700" },
  PAID: { label: "Đã thanh toán", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Đã hủy", color: "bg-gray-100 text-gray-600" },
  EXPIRED: { label: "Hết hạn", color: "bg-red-100 text-red-700" },
} as const;

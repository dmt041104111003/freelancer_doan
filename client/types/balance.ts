export type WalletTransactionType =
  | "DEPOSIT"
  | "CREDIT_ADMIN_GRANT"
  | "CREDIT_DAILY"
  | "CREDIT_PURCHASE"
  | "CREDIT_USED"
  | "JOB_PAYMENT"
  | "DISPUTE_REFUND"
  | "ESCROW_REFUND"
  | "JOB_ESCROW"
  | "PENALTY_FEE"
  | "PENALTY_REFUND";

export interface WalletHistoryItem {
  id: number;
  type: WalletTransactionType;
  typeLabel: string;
  amount?: number;
  credits?: number;
  description?: string;
  referenceId?: number;
  referenceType?: string;
  status?: string;
  orderUrl?: string;
  appTransId?: string;
  userId?: number;
  userName?: string;
  createdAt: string;
}

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
  totalRevenue: number;
  totalFreelancerPaid: number;
  totalEscrowHeld: number;
  totalEscrowRefunded: number;
  totalUsers: number;
  totalEmployers: number;
  totalFreelancers: number;
  totalJobs: number;
  openJobs: number;
  inProgressJobs: number;
  completedJobs: number;
  disputedJobs: number;
  cancelledJobs: number;
  totalApplications: number;
}

export const DEPOSIT_STATUS_CONFIG = {
  PENDING: { label: "Chờ thanh toán", color: "bg-yellow-100 text-yellow-700" },
  PAID: { label: "Đã thanh toán", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Đã hủy", color: "bg-gray-100 text-gray-600" },
  EXPIRED: { label: "Hết hạn", color: "bg-red-100 text-red-700" },
} as const;

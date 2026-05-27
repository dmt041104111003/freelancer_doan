"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/format";
import {
  BalanceDeposit,
  BalanceStatistics,
  DepositStatus,
  DEPOSIT_STATUS_CONFIG,
  WalletHistoryItem,
  WalletTransactionType,
} from "@/types/balance";
import { Page } from "@/types/job";
import { Pagination } from "@/components/ui/pagination";
import Icon from "@/components/ui/Icon";
import AdminLoading from "../shared/AdminLoading";
import AdminPageHeader from "../shared/AdminPageHeader";
import AdminEmptyState from "../shared/AdminEmptyState";

type SubTab = "overview" | "deposits" | "transactions";

const SUB_TABS: { id: SubTab; label: string; icon: string }[] = [
  { id: "overview", label: "Thống kê", icon: "bar_chart" },
  { id: "deposits", label: "Nạp tiền", icon: "account_balance_wallet" },
  { id: "transactions", label: "Lịch sử GD", icon: "receipt_long" },
];

const DEPOSIT_STATUS_OPTIONS: { value: DepositStatus | ""; label: string }[] = [
  { value: "", label: "Tất cả" },
  { value: "PAID", label: "Đã TT" },
  { value: "PENDING", label: "Chờ TT" },
  { value: "CANCELLED", label: "Đã hủy" },
  { value: "EXPIRED", label: "Hết hạn" },
];

const TX_TYPE_OPTIONS: { value: WalletTransactionType | ""; label: string }[] = [
  { value: "", label: "Tất cả" },
  { value: "DEPOSIT", label: "Nạp tiền" },
  { value: "JOB_ESCROW", label: "Ký quỹ" },
  { value: "ESCROW_REFUND", label: "Hoàn escrow" },
  { value: "JOB_PAYMENT", label: "Thanh toán dự án" },
  { value: "DISPUTE_REFUND", label: "Hoàn tranh chấp" },
  { value: "CREDIT_PURCHASE", label: "Mua credit" },
  { value: "CREDIT_USED", label: "Ứng tuyển" },
  { value: "CREDIT_ADMIN_GRANT", label: "Admin cấp credit" },
  { value: "CREDIT_DAILY", label: "Credit hàng ngày" },
  { value: "PENALTY_FEE", label: "Phí phạt" },
  { value: "PENALTY_REFUND", label: "Hoàn phí phạt" },
];

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string; color?: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center gap-2 text-gray-500 mb-1">
        <Icon name={icon} size={18} className={color} />
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-lg font-bold text-gray-900">{value}</p>
    </div>
  );
}

function OverviewTab() {
  const [stats, setStats] = useState<BalanceStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.adminGetBalanceStatistics();
        if (res.status === "SUCCESS") setStats(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) return <AdminLoading />;
  if (!stats) return <AdminEmptyState message="Không có dữ liệu" />;

  return (
    <div className="space-y-4">
      {/* Doanh thu */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Doanh thu & Tài chính</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon="trending_up" label="Doanh thu (phí 5%)" value={formatCurrency(stats.totalRevenue || 0)} color="text-green-500" />
          <StatCard icon="account_balance_wallet" label="Tổng nạp" value={formatCurrency(stats.totalDeposited || 0)} color="text-blue-500" />
          <StatCard icon="payments" label="Đã trả freelancer" value={formatCurrency(stats.totalFreelancerPaid || 0)} color="text-purple-500" />
          <StatCard icon="lock" label="Đang giữ escrow" value={formatCurrency(stats.totalEscrowHeld || 0)} color="text-orange-500" />
        </div>
      </div>

      {/* Nạp tiền */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Nạp tiền</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon="today" label="Hôm nay" value={formatCurrency(stats.todayDeposited || 0)} />
          <StatCard icon="date_range" label="Tháng này" value={formatCurrency(stats.monthDeposited || 0)} />
          <StatCard icon="check_circle" label="GD thành công" value={String(stats.paidTransactions || 0)} color="text-green-500" />
          <StatCard icon="pending" label="GD đang chờ" value={String(stats.pendingTransactions || 0)} color="text-yellow-500" />
        </div>
      </div>

      {/* Nền tảng */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Nền tảng</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon="group" label="Tổng người dùng" value={String(stats.totalUsers || 0)} />
          <StatCard icon="business" label="Nhà tuyển dụng" value={String(stats.totalEmployers || 0)} color="text-blue-500" />
          <StatCard icon="engineering" label="Freelancer" value={String(stats.totalFreelancers || 0)} color="text-teal-500" />
          <StatCard icon="send" label="Tổng ứng tuyển" value={String(stats.totalApplications || 0)} color="text-indigo-500" />
        </div>
      </div>

      {/* Công việc */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Công việc</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCard icon="work" label="Tổng" value={String(stats.totalJobs || 0)} />
          <StatCard icon="public" label="Đang mở" value={String(stats.openJobs || 0)} color="text-blue-500" />
          <StatCard icon="autorenew" label="Đang thực hiện" value={String(stats.inProgressJobs || 0)} color="text-orange-500" />
          <StatCard icon="task_alt" label="Hoàn thành" value={String(stats.completedJobs || 0)} color="text-green-500" />
          <StatCard icon="gavel" label="Tranh chấp" value={String(stats.disputedJobs || 0)} color="text-red-500" />
        </div>
      </div>

      {/* Thêm thông tin */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">Trạng thái nạp tiền</h3>
          <div className="space-y-2 text-sm">
            {[
              { label: "Thành công", value: stats.paidTransactions, color: "text-green-600" },
              { label: "Đang chờ", value: stats.pendingTransactions, color: "text-yellow-600" },
              { label: "Đã hủy", value: stats.cancelledTransactions, color: "text-gray-600" },
              { label: "Hết hạn", value: stats.expiredTransactions, color: "text-red-600" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-gray-600">{item.label}</span>
                <span className={`font-medium ${item.color}`}>{item.value || 0}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">Thống kê nạp theo thời gian</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Hôm nay</p>
              <p className="font-bold text-gray-900">{formatCurrency(stats.todayDeposited || 0)}</p>
              <p className="text-xs text-gray-500">{stats.todayTransactions || 0} giao dịch</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Tháng này</p>
              <p className="font-bold text-gray-900">{formatCurrency(stats.monthDeposited || 0)}</p>
              <p className="text-xs text-gray-500">{stats.monthTransactions || 0} giao dịch</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DepositsTab() {
  const [deposits, setDeposits] = useState<BalanceDeposit[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<DepositStatus | "">("");

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await api.adminGetAllDeposits({
          page,
          size: 10,
          status: statusFilter || undefined,
        });
        if (res.status === "SUCCESS" && res.data) {
          const pageData = res.data as Page<BalanceDeposit>;
          setDeposits(pageData.content);
          setTotalPages(pageData.totalPages);
          setTotalElements(pageData.totalElements);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [page, statusFilter]);

  if (isLoading && deposits.length === 0) return <AdminLoading />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{totalElements} giao dịch</p>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as DepositStatus | ""); setPage(0); }}
          className="h-8 px-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#04A0EF]"
        >
          {DEPOSIT_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {deposits.length === 0 ? (
        <AdminEmptyState message="Không có giao dịch nào" />
      ) : (
        <>
          <div className="md:hidden space-y-3">
            {deposits.map((d) => (
              <div key={d.id} className="bg-white rounded-lg shadow p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{d.userFullName || `User #${d.userId}`}</p>
                    <p className="text-xs text-gray-500 font-mono truncate">{d.appTransId}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${DEPOSIT_STATUS_CONFIG[d.status]?.color || ""}`}>
                    {DEPOSIT_STATUS_CONFIG[d.status]?.label || d.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-[#04A0EF]">{formatCurrency(d.amount)}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 pt-2 border-t">
                  <div><p className="text-gray-400">Ngày tạo</p><p>{formatDateTime(d.createdAt)}</p></div>
                  <div><p className="text-gray-400">Thanh toán</p><p>{formatDateTime(d.paidAt)}</p></div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mã GD</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Người nạp</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Số tiền</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Thanh toán</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {deposits.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 font-mono text-gray-900">{d.appTransId}</td>
                      <td className="px-3 py-2">
                        <p className="font-medium text-gray-900">{d.userFullName || `User #${d.userId}`}</p>
                        <p className="text-xs text-gray-500">#{d.userId}</p>
                      </td>
                      <td className="px-3 py-2 text-right font-medium text-gray-900">{formatCurrency(d.amount)}</td>
                      <td className="px-3 py-2 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${DEPOSIT_STATUS_CONFIG[d.status]?.color || ""}`}>
                          {DEPOSIT_STATUS_CONFIG[d.status]?.label || d.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-500">{formatDateTime(d.createdAt)}</td>
                      <td className="px-3 py-2 text-gray-500">{formatDateTime(d.paidAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow md:rounded-none md:shadow-none">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} disabled={isLoading} />
          </div>
        </>
      )}
    </div>
  );
}

const TX_AMOUNT_COLOR: Record<string, string> = {
  DEPOSIT: "text-green-600",
  JOB_PAYMENT: "text-green-600",
  DISPUTE_REFUND: "text-green-600",
  ESCROW_REFUND: "text-green-600",
  PENALTY_REFUND: "text-green-600",
  JOB_ESCROW: "text-red-600",
  CREDIT_PURCHASE: "text-red-600",
  PENALTY_FEE: "text-red-600",
};

function TransactionsTab() {
  const [items, setItems] = useState<WalletHistoryItem[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<WalletTransactionType | "">("");

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await api.adminGetAllTransactions({
          page,
          size: 15,
          type: typeFilter || undefined,
        });
        if (res.status === "SUCCESS" && res.data) {
          const pageData = res.data as Page<WalletHistoryItem>;
          setItems(pageData.content);
          setTotalPages(pageData.totalPages);
          setTotalElements(pageData.totalElements);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [page, typeFilter]);

  if (isLoading && items.length === 0) return <AdminLoading />;

  const amountColor = (t: WalletHistoryItem) => TX_AMOUNT_COLOR[t.type] || "text-gray-900";

  const formatAmount = (t: WalletHistoryItem) => {
    if (t.amount != null && t.amount !== 0) {
      const sign = t.amount > 0 ? "+" : "";
      return sign + formatCurrency(t.amount);
    }
    if (t.credits != null && t.credits !== 0) {
      const sign = t.credits > 0 ? "+" : "";
      return sign + t.credits + " credit";
    }
    return "—";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{totalElements} giao dịch</p>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value as WalletTransactionType | ""); setPage(0); }}
          className="h-8 px-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#04A0EF]"
        >
          {TX_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {items.length === 0 ? (
        <AdminEmptyState message="Không có giao dịch nào" />
      ) : (
        <>
          {/* Mobile */}
          <div className="md:hidden space-y-3">
            {items.map((t) => (
              <div key={t.id} className="bg-white rounded-lg shadow p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500">{t.typeLabel}</p>
                    <p className="text-sm text-gray-900 truncate">{t.userName || `User #${t.userId}`}</p>
                  </div>
                  <p className={`text-sm font-semibold whitespace-nowrap ${amountColor(t)}`}>
                    {formatAmount(t)}
                  </p>
                </div>
                {t.description && <p className="text-xs text-gray-500 truncate">{t.description}</p>}
                <p className="text-xs text-gray-400">{formatDateTime(t.createdAt)}</p>
              </div>
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Người dùng</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Giá trị</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mô tả</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{t.typeLabel}</span>
                      </td>
                      <td className="px-3 py-2">
                        <p className="font-medium text-gray-900">{t.userName || "—"}</p>
                        {t.userId && <p className="text-xs text-gray-500">#{t.userId}</p>}
                      </td>
                      <td className={`px-3 py-2 text-right font-medium ${amountColor(t)}`}>
                        {formatAmount(t)}
                      </td>
                      <td className="px-3 py-2 text-gray-500 max-w-[200px] truncate">{t.description || "—"}</td>
                      <td className="px-3 py-2 text-gray-500">{formatDateTime(t.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow md:rounded-none md:shadow-none">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} disabled={isLoading} />
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminPayments() {
  const [activeTab, setActiveTab] = useState<SubTab>("overview");

  return (
    <div className="space-y-4">
      <AdminPageHeader title="Tài chính" />

      {/* Sub-tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex border-b overflow-x-auto">
          {SUB_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-[#04A0EF] text-[#04A0EF]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon name={tab.icon} size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "deposits" && <DepositsTab />}
      {activeTab === "transactions" && <TransactionsTab />}
    </div>
  );
}

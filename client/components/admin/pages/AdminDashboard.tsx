"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { BalanceStatistics, BalanceDeposit } from "@/types/balance";
import Icon from "@/components/ui/Icon";
import AdminLoading from "../shared/AdminLoading";
import AdminPageHeader from "../shared/AdminPageHeader";

export default function AdminDashboard() {
  const [stats, setStats] = useState<BalanceStatistics | null>(null);
  const [recentDeposits, setRecentDeposits] = useState<BalanceDeposit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, depositsRes] = await Promise.all([
          api.adminGetBalanceStatistics(),
          api.adminGetAllDeposits({ status: "PAID", page: 0, size: 5 }),
        ]);

        if (statsRes.status === "SUCCESS") setStats(statsRes.data);
        if (depositsRes.status === "SUCCESS" && depositsRes.data) {
          setRecentDeposits(depositsRes.data.content || []);
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <AdminLoading />;

  return (
    <div className="space-y-4">
      <AdminPageHeader title="Tổng quan" />

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Icon name="trending_up" size={18} className="text-green-500" />
            <span className="text-xs">Doanh thu</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{formatCurrency(stats?.totalRevenue || 0)}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Icon name="account_balance_wallet" size={18} className="text-blue-500" />
            <span className="text-xs">Tổng nạp</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{formatCurrency(stats?.totalDeposited || 0)}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Icon name="group" size={18} className="text-indigo-500" />
            <span className="text-xs">Người dùng</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{stats?.totalUsers || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Icon name="work" size={18} className="text-orange-500" />
            <span className="text-xs">Tổng việc</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{stats?.totalJobs || 0}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">Nền tảng</h3>
          <div className="space-y-2 text-sm">
            {[
              { label: "Nhà tuyển dụng", value: stats?.totalEmployers, color: "text-blue-600" },
              { label: "Freelancer", value: stats?.totalFreelancers, color: "text-teal-600" },
              { label: "Tổng ứng tuyển", value: stats?.totalApplications, color: "text-indigo-600" },
              { label: "Việc hoàn thành", value: stats?.completedJobs, color: "text-green-600" },
              { label: "Việc đang tranh chấp", value: stats?.disputedJobs, color: "text-red-600" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-gray-600">{item.label}</span>
                <span className={`font-medium ${item.color}`}>{item.value || 0}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">Nạp tiền hôm nay</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Hôm nay</p>
              <p className="font-bold text-gray-900">{formatCurrency(stats?.todayDeposited || 0)}</p>
              <p className="text-xs text-gray-500">{stats?.todayTransactions || 0} giao dịch</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Tháng này</p>
              <p className="font-bold text-gray-900">{formatCurrency(stats?.monthDeposited || 0)}</p>
              <p className="text-xs text-gray-500">{stats?.monthTransactions || 0} giao dịch</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Deposits */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900 text-sm">Nạp tiền gần đây</h3>
        </div>

        {recentDeposits.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm">Chưa có giao dịch nào</div>
        ) : (
          <>
            <div className="md:hidden divide-y divide-gray-100">
              {recentDeposits.map((deposit) => (
                <div key={deposit.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-gray-900 truncate flex-1">{deposit.userFullName || `User #${deposit.userId}`}</p>
                    <p className="font-semibold text-[#04A0EF] whitespace-nowrap">{formatCurrency(deposit.amount)}</p>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-xs text-gray-500">
                    <p className="font-mono truncate flex-1">{deposit.appTransId}</p>
                    <p className="whitespace-nowrap">{formatDateTime(deposit.paidAt)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mã GD</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Người nạp</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Số tiền</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentDeposits.map((deposit) => (
                    <tr key={deposit.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-mono text-gray-900">{deposit.appTransId}</td>
                      <td className="px-4 py-2 text-gray-700">{deposit.userFullName || `User #${deposit.userId}`}</td>
                      <td className="px-4 py-2 text-right font-medium text-gray-900">{formatCurrency(deposit.amount)}</td>
                      <td className="px-4 py-2 text-gray-500">{formatDateTime(deposit.paidAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

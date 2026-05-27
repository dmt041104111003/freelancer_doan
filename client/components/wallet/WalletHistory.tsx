"use client";

import { WalletHistoryItem } from "@/types/balance";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/Icon";

interface WalletHistoryProps {
  items: WalletHistoryItem[];
  isLoading: boolean;
}

export default function WalletHistory({ items, isLoading }: WalletHistoryProps) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(val || 0);

  const formatDate = (str?: string) =>
    str ? new Date(str).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-";

  const formatAmount = (item: WalletHistoryItem) => {
    if (item.amount != null) {
      const prefix = item.amount > 0 ? "+" : "";
      return (
        <span className={item.amount >= 0 ? "text-green-600" : "text-red-600"}>
          {prefix}{formatCurrency(item.amount)}
        </span>
      );
    }
    if (item.credits != null) {
      const prefix = item.credits > 0 ? "+" : "";
      return (
        <span className={item.credits >= 0 ? "text-yellow-600" : "text-red-600"}>
          {prefix}{item.credits} credit
        </span>
      );
    }
    return <span className="text-gray-400">-</span>;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Lịch sử</h2>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="w-6 h-6 border-2 border-[#04A0EF] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : items.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm">Chưa có giao dịch</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mô tả</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Thay đổi</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ngày</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={`${item.type}-${item.id}`} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-900">{item.typeLabel}</td>
                  <td className="px-4 py-2 text-gray-500 max-w-[200px] truncate">{item.description || "-"}</td>
                  <td className="px-4 py-2 text-right font-medium">{formatAmount(item)}</td>
                  <td className="px-4 py-2 text-gray-500">{formatDate(item.createdAt)}</td>
                  <td className="px-4 py-2 text-center">
                    {item.status === "PENDING" && item.orderUrl ? (
                      <Button
                        size="sm"
                        onClick={() => window.open(item.orderUrl!, "_blank")}
                        className="bg-[#04A0EF] hover:bg-[#0380BF]"
                      >
                        <Icon name="payment" size={14} />
                        Thanh toán
                      </Button>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

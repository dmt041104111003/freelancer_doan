"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api, WithdrawalRequest } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/Icon";

const EMPLOYER_PENALTY_PERCENT = 15;

type Role = "EMPLOYER" | "FREELANCER";

interface WithdrawalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: number;
  jobTitle: string;
  escrowAmount?: number;
  role: Role;
  onSuccess: () => void;
}

export default function WithdrawalDialog({
  open,
  onOpenChange,
  jobId,
  jobTitle,
  escrowAmount = 0,
  role,
  onSuccess,
}: WithdrawalDialogProps) {
  const [pendingRequest, setPendingRequest] = useState<WithdrawalRequest | null>(null);
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);
  const [reason, setReason] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const estimatedPenalty = Math.round(escrowAmount * EMPLOYER_PENALTY_PERCENT / 100);

  const isRequester = pendingRequest
    ? (role === "EMPLOYER" && pendingRequest.type === "EMPLOYER_CANCEL") ||
      (role === "FREELANCER" && pendingRequest.type === "FREELANCER_WITHDRAW")
    : false;
  const isResponder = pendingRequest && !isRequester;

  useEffect(() => {
    if (open) {
      setReason("");
      setResponseMessage("");
      fetchPendingRequest();
    } else {
      setPendingRequest(null);
    }
  }, [open, jobId]);

  const fetchPendingRequest = async () => {
    setIsLoadingRequest(true);
    try {
      const res = await api.getPendingWithdrawalRequest(jobId);
      if (res.status === "SUCCESS") {
        setPendingRequest(res.data);
      }
    } catch {
      // ignore
    } finally {
      setIsLoadingRequest(false);
    }
  };

  const handleCreate = async () => {
    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = role === "EMPLOYER"
        ? await api.createEmployerCancellation(jobId, reason)
        : await api.createFreelancerWithdrawal(jobId, reason);
      if (res.status === "SUCCESS") {
        toast.success("Đã gửi yêu cầu thành công");
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(res.message || "Có lỗi xảy ra");
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async () => {
    if (!pendingRequest) return;
    setIsSubmitting(true);
    try {
      const res = await api.approveWithdrawalRequest(
        jobId,
        pendingRequest.id,
        responseMessage || undefined
      );
      if (res.status === "SUCCESS") {
        toast.success("Đã chấp nhận yêu cầu");
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(res.message || "Có lỗi xảy ra");
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!pendingRequest) return;
    setIsSubmitting(true);
    try {
      const res = await api.rejectWithdrawalRequest(
        jobId,
        pendingRequest.id,
        responseMessage || undefined
      );
      if (res.status === "SUCCESS") {
        toast.success("Đã từ chối yêu cầu");
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(res.message || "Có lỗi xảy ra");
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelOwnRequest = async () => {
    if (!pendingRequest) return;
    setIsSubmitting(true);
    try {
      const res = await api.cancelWithdrawalRequest(jobId, pendingRequest.id);
      if (res.status === "SUCCESS") {
        toast.success("Đã hủy yêu cầu");
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(res.message || "Có lỗi xảy ra");
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!isSubmitting) onOpenChange(o); }}>
      <DialogContent className="max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {pendingRequest
              ? "Yêu cầu hủy/rút công việc"
              : role === "EMPLOYER"
                ? "Hủy công việc"
                : "Rút khỏi công việc"}
          </DialogTitle>
          <DialogDescription>
            {jobTitle}
          </DialogDescription>
        </DialogHeader>

        {isLoadingRequest ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-[#04A0EF] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : pendingRequest ? (
          /* === PENDING REQUEST VIEW === */
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Icon name="info" size={20} className="text-yellow-600 mt-0.5 shrink-0" />
                <div className="text-sm text-yellow-800 space-y-1">
                  <p className="font-medium">
                    {pendingRequest.type === "EMPLOYER_CANCEL"
                      ? "Employer yêu cầu hủy công việc"
                      : "Freelancer yêu cầu rút khỏi công việc"}
                  </p>
                  <p>
                    Người yêu cầu: <strong>{pendingRequest.requester.fullName}</strong>
                  </p>
                  <p>
                    Lý do: {pendingRequest.reason}
                  </p>
                  {pendingRequest.type === "EMPLOYER_CANCEL" && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700">
                      Nếu đồng ý: Employer bị trừ <strong>{EMPLOYER_PENALTY_PERCENT}%</strong> escrow ({formatCurrency(estimatedPenalty)}), hoàn {formatCurrency(escrowAmount - estimatedPenalty)}.
                    </div>
                  )}
                  {pendingRequest.type === "FREELANCER_WITHDRAW" && (
                    <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-orange-700">
                      Nếu đồng ý: Freelancer bị <strong>+1 nhân phẩm tệ</strong>, job được mở lại cho người khác ứng tuyển.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {isRequester ? (
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Đóng
                </Button>
                <Button
                  onClick={handleCancelOwnRequest}
                  disabled={isSubmitting}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                >
                  {isSubmitting ? "Đang xử lý..." : "Hủy yêu cầu"}
                </Button>
              </DialogFooter>
            ) : isResponder ? (
              <div className="space-y-3">
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder="Lời nhắn (không bắt buộc)..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#04A0EF] resize-none"
                />
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={handleReject}
                    disabled={isSubmitting}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    {isSubmitting ? "Đang xử lý..." : "Từ chối"}
                  </Button>
                  <Button
                    onClick={handleApprove}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isSubmitting ? "Đang xử lý..." : "Chấp nhận"}
                  </Button>
                </DialogFooter>
              </div>
            ) : null}
          </div>
        ) : (
          /* === CREATE REQUEST VIEW === */
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Icon name="warning" size={20} className="text-red-500 mt-0.5 shrink-0" />
                <div className="text-sm text-red-700 space-y-1">
                  <p className="font-semibold">Điều luật khi hủy/rút:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {role === "EMPLOYER" ? (
                      <>
                        <li>Bạn sẽ bị phạt <strong>{EMPLOYER_PENALTY_PERCENT}%</strong> số tiền ký quỹ ({formatCurrency(estimatedPenalty)})</li>
                        <li>Tiền phạt chỉ bị trừ nếu Freelancer <strong>đồng ý</strong></li>
                        <li>Nếu Freelancer <strong>chấp nhận</strong>: job bị hủy, hoàn {formatCurrency(escrowAmount - estimatedPenalty)} về bạn</li>
                        <li>Nếu Freelancer <strong>từ chối</strong>: job tiếp tục, không mất gì</li>
                      </>
                    ) : (
                      <>
                        <li>Bạn <strong>không bị phạt tiền</strong> (freelancer không có ký quỹ)</li>
                        <li>Nếu Employer <strong>chấp nhận</strong>: job mở lại cho người khác, bạn bị <strong>+1 nhân phẩm tệ</strong></li>
                        <li>Nếu Employer <strong>từ chối</strong>: job tiếp tục, không ảnh hưởng gì</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lý do <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={
                  role === "EMPLOYER"
                    ? "Vui lòng cho biết lý do bạn muốn hủy công việc..."
                    : "Vui lòng cho biết lý do bạn muốn rút khỏi công việc..."
                }
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#04A0EF] resize-none"
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                onClick={handleCreate}
                disabled={isSubmitting || !reason.trim()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Icon name={role === "EMPLOYER" ? "cancel" : "exit_to_app"} size={16} />
                    {role === "EMPLOYER" ? "Xác nhận gửi yêu cầu" : "Xác nhận gửi yêu cầu"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

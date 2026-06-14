"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, Dispute, DISPUTE_STATUS_CONFIG, AdminDisputeDetailResponse, PartyDetail, JobHistoryInfo, FileUploadInfo } from "@/lib/api";
import { Page } from "@/types/job";
import { formatDateTime, formatCurrency } from "@/lib/format";
import { Pagination } from "@/components/ui/pagination";
import AdminLoading from "../shared/AdminLoading";
import AdminPageHeader from "../shared/AdminPageHeader";
import AdminEmptyState from "../shared/AdminEmptyState";
import { downloadFileFromUrl } from "@/lib/utils";
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

type TabType = "detail" | "employer" | "freelancer" | "job" | "files";

export default function AdminDisputes() {
  const handleDownloadEvidence = (url: string, filename: string) => {
    downloadFileFromUrl(url, filename || "evidence.pdf");
  };
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  // Dialog states
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [detailData, setDetailData] = useState<AdminDisputeDetailResponse | null>(null);
  const [detailTab, setDetailTab] = useState<TabType>("detail");
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [requestResponseDialogOpen, setRequestResponseDialogOpen] = useState(false);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [daysToRespond, setDaysToRespond] = useState(3);
  const [resolveNote, setResolveNote] = useState("");
  const [employerWins, setEmployerWins] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper: check if freelancer deadline has passed
  const isDeadlinePassed = (deadline: string | null | undefined): boolean => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  // Helper: can admin make decision?
  const canMakeDecision = (dispute: Dispute): boolean => {
    if (dispute.status === "PENDING_ADMIN_DECISION") return true;
    if (dispute.status === "PENDING_FREELANCER_RESPONSE" && isDeadlinePassed(dispute.freelancerDeadline)) return true;
    return false;
  };

  const fetchDisputes = async (pageNum: number) => {
    setIsLoading(true);
    try {
      const response = await api.adminGetPendingDisputes({ page: pageNum, size: 10 });
      if (response.status === "SUCCESS" && response.data) {
        const pageData = response.data as Page<Dispute>;
        setDisputes(pageData.content);
        setTotalPages(pageData.totalPages);
        setTotalElements(pageData.totalElements);
      }
    } catch (error) {
      console.error("Error fetching disputes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendingCount = async () => {
    try {
      const response = await api.adminCountPendingDisputes();
      if (response.status === "SUCCESS") {
        setPendingCount(response.data);
      }
    } catch (error) {
      console.error("Error fetching pending count:", error);
    }
  };

  useEffect(() => {
    fetchDisputes(page);
    fetchPendingCount();
  }, [page]);

  const handleViewDetail = async (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setDetailDialogOpen(true);
    setDetailTab("detail");
    setIsDetailLoading(true);
    setDetailData(null);
    try {
      const response = await api.adminGetDisputeDetail(dispute.id);
      if (response.status === "SUCCESS") {
        setDetailData(response.data);
      } else {
        toast.error(response.message || "Không thể tải chi tiết tranh chấp");
      }
    } catch (error) {
      toast.error("Có lỗi khi tải chi tiết tranh chấp");
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleRequestResponse = async () => {
    if (!selectedDispute) return;
    setIsProcessing(true);
    try {
      const response = await api.adminRequestDisputeResponse(selectedDispute.id, daysToRespond);
      if (response.status === "SUCCESS") {
        toast.success(`Đã gửi yêu cầu phản hồi. Người làm có ${daysToRespond} ngày để phản hồi.`);
        setRequestResponseDialogOpen(false);
        fetchDisputes(page);
        fetchPendingCount();
      } else {
        toast.error(response.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResolve = async () => {
    if (!selectedDispute || employerWins === null || !resolveNote.trim()) {
      toast.error("Vui lòng chọn bên thắng và nhập ghi chú");
      return;
    }
    setIsProcessing(true);
    try {
      const response = await api.adminResolveDispute(selectedDispute.id, employerWins, resolveNote);
      if (response.status === "SUCCESS") {
        toast.success(`Đã giải quyết tranh chấp. ${employerWins ? "Bên thuê" : "Người làm"} thắng.`);
        setResolveDialogOpen(false);
        setResolveNote("");
        setEmployerWins(null);
        fetchDisputes(page);
        fetchPendingCount();
      } else {
        toast.error(response.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsProcessing(false);
    }
  };

  const openRequestDialog = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setDaysToRespond(3);
    setRequestResponseDialogOpen(true);
  };

  const openResolveDialog = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setResolveNote("");
    setEmployerWins(null);
    setResolveDialogOpen(true);
  };

  if (isLoading && disputes.length === 0) {
    return <AdminLoading />;
  }

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Quản lý khiếu nại"
        totalElements={totalElements}
        badge={pendingCount > 0 ? { count: pendingCount, label: "đang chờ" } : undefined}
      />

      {disputes.length === 0 ? (
        <AdminEmptyState message="Không có khiếu nại nào đang chờ xử lý" />
      ) : (
        <>
          {/* Mobile: Card View */}
          <div className="md:hidden space-y-3">
            {disputes.map((dispute) => (
              <div key={dispute.id} className="bg-white rounded-lg shadow p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 line-clamp-2">{dispute.jobTitle}</p>
                    <p className="text-xs text-gray-500 mt-1">#{dispute.id} - Job #{dispute.jobId}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full whitespace-nowrap bg-gray-100 text-gray-700">
                    {dispute.statusLabel}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Bên thuê</p>
                    <p className="font-medium text-gray-900 truncate">{dispute.employer.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Người làm</p>
                    <p className="font-medium text-gray-900 truncate">{dispute.freelancer.fullName}</p>
                  </div>
                </div>

                {dispute.freelancerDeadline && (
                  <p className="text-xs text-gray-500">
                    Hạn phản hồi: {formatDateTime(dispute.freelancerDeadline)}
                  </p>
                )}

                <p className="text-xs text-gray-500">{formatDateTime(dispute.createdAt)}</p>

                <div className="pt-2 border-t flex flex-wrap gap-2">
                  <button
                    onClick={() => handleViewDetail(dispute)}
                    className="text-gray-600 hover:underline text-sm"
                  >
                    Xem chi tiết
                  </button>
                  {dispute.status === "PENDING_FREELANCER_RESPONSE" && !dispute.freelancerDeadline && (
                    <button
                      onClick={() => openRequestDialog(dispute)}
                      className="text-gray-600 hover:underline text-sm"
                    >
                      Yêu cầu phản hồi
                    </button>
                  )}
                  {canMakeDecision(dispute) && (
                    <button
                      onClick={() => openResolveDialog(dispute)}
                      className="text-[#04A0EF] hover:underline text-sm"
                    >
                      Quyết định
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Table View */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Công việc</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Bên thuê</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Người làm</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Hạn phản hồi</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {disputes.map((dispute) => (
                    <tr key={dispute.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <p className="font-medium text-gray-900 truncate max-w-[200px]">{dispute.jobTitle}</p>
                        <p className="text-xs text-gray-500">#{dispute.id}</p>
                      </td>
                      <td className="px-3 py-2">
                        <p className="font-medium text-gray-900">{dispute.employer.fullName}</p>
                      </td>
                      <td className="px-3 py-2">
                        <p className="font-medium text-gray-900">{dispute.freelancer.fullName}</p>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                          {dispute.statusLabel}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-500">
                        {dispute.freelancerDeadline ? formatDateTime(dispute.freelancerDeadline) : "-"}
                      </td>
                      <td className="px-3 py-2 text-gray-500">{formatDateTime(dispute.createdAt)}</td>
                      <td className="px-3 py-2 text-center">
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <button
                            onClick={() => handleViewDetail(dispute)}
                            className="text-gray-600 hover:underline"
                          >
                            Chi tiết
                          </button>
                          {dispute.status === "PENDING_FREELANCER_RESPONSE" && !dispute.freelancerDeadline && (
                            <button
                              onClick={() => openRequestDialog(dispute)}
                              className="text-gray-600 hover:underline"
                            >
                              Yêu cầu
                            </button>
                          )}
                          {canMakeDecision(dispute) && (
                            <button
                              onClick={() => openResolveDialog(dispute)}
                              className="text-[#04A0EF] hover:underline"
                            >
                              Quyết định
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              disabled={isLoading}
            />
          )}
        </>
      )}

      {/* ===== DETAIL DIALOG ===== */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] flex flex-col overflow-hidden p-0">
          {isDetailLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#04A0EF]" />
              <span className="ml-3 text-gray-500">Đang tải chi tiết...</span>
            </div>
          ) : detailData ? (
            <>
              {/* Header */}
              <div className="shrink-0 p-6 pb-3 border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-lg">Tranh chấp #{detailData.id}</DialogTitle>
                    <p className="text-sm text-gray-500 mt-0.5">Công việc: {detailData.job.title}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ${
                    detailData.status === "PENDING_ADMIN_DECISION"
                      ? "bg-blue-100 text-blue-700"
                      : detailData.status === "PENDING_FREELANCER_RESPONSE"
                        ? "bg-orange-100 text-orange-700"
                        : detailData.status === "EMPLOYER_WON" || detailData.status === "FREELANCER_WON"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                  }`}>
                    {detailData.statusLabel}
                  </span>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mt-4 border-b">
                  {[
                    { key: "detail" as TabType, label: "Chi tiết khiếu nại" },
                    { key: "employer" as TabType, label: "Bên thuê" },
                    { key: "freelancer" as TabType, label: "Người làm" },
                    { key: "job" as TabType, label: "Công việc" },
                    { key: "files" as TabType, label: "Tài liệu" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setDetailTab(tab.key)}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-[1px] ${
                        detailTab === tab.key
                          ? "border-[#04A0EF] text-[#04A0EF]"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Tab: Detail */}
                {detailTab === "detail" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-1">
                          <Icon name="warning" size={18} /> Khiếu nại từ: {detailData.employer.fullName}
                        </h4>
                        <p className="text-sm text-red-700 whitespace-pre-wrap break-words">
                          {detailData.employerDescription}
                        </p>
                        {detailData.employerEvidenceFile && (
                          <button
                            onClick={() => handleDownloadEvidence(detailData.employerEvidenceFile!.secureUrl, "employer-evidence")}
                            className="flex items-center gap-2 mt-3 px-3 py-2 border border-red-300 rounded-md bg-white hover:bg-red-50 transition-colors w-full"
                          >
                            <Icon name="picture_as_pdf" size={20} className="text-red-500 shrink-0" />
                            <span className="flex-1 text-sm text-gray-700 text-left truncate">
                              {detailData.employerEvidenceFile.originalFilename || "Bằng chứng đính kèm"}
                            </span>
                            <Icon name="download" size={18} className="text-gray-500 shrink-0" />
                          </button>
                        )}
                      </div>

                      {detailData.freelancerDescription ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-1">
                            <Icon name="reply" size={18} /> Phản hồi từ: {detailData.freelancer.fullName}
                          </h4>
                          <p className="text-sm text-blue-700 whitespace-pre-wrap break-words">
                            {detailData.freelancerDescription}
                          </p>
                          {detailData.freelancerEvidenceFile && (
                            <button
                              onClick={() => handleDownloadEvidence(detailData.freelancerEvidenceFile!.secureUrl, "freelancer-evidence")}
                              className="flex items-center gap-2 mt-3 px-3 py-2 border border-blue-300 rounded-md bg-white hover:bg-blue-50 transition-colors w-full"
                            >
                              <Icon name="picture_as_pdf" size={20} className="text-red-500 shrink-0" />
                              <span className="flex-1 text-sm text-gray-700 text-left truncate">
                                {detailData.freelancerEvidenceFile.originalFilename || "Bằng chứng đính kèm"}
                              </span>
                              <Icon name="download" size={18} className="text-gray-500 shrink-0" />
                            </button>
                          )}
                        </div>
                      ) : detailData.freelancerDeadline ? (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-700">Chờ người làm phản hồi</h4>
                          <p className="text-sm text-gray-500 mt-1">Hạn: {formatDateTime(detailData.freelancerDeadline)}</p>
                        </div>
                      ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <p className="text-sm text-gray-500">Chưa yêu cầu người làm phản hồi</p>
                        </div>
                      )}
                    </div>

                    {detailData.adminNote && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <h4 className="font-medium text-purple-800 mb-1">Quyết định</h4>
                        <p className="text-sm text-purple-700">{detailData.adminNote}</p>
                        {detailData.resolvedBy && (
                          <p className="text-xs text-gray-500 mt-2">
                            Người xử lý: {detailData.resolvedBy.fullName} - {formatDateTime(detailData.resolvedAt!)}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="text-xs text-gray-400 flex gap-4">
                      <span>Tạo: {formatDateTime(detailData.createdAt)}</span>
                      <span>Cập nhật: {formatDateTime(detailData.updatedAt)}</span>
                    </div>
                  </div>
                )}

                {/* Tab: Employer */}
                {detailTab === "employer" && (
                  <PartyTab party={detailData.employer} label="Bên thuê" />
                )}

                {/* Tab: Freelancer */}
                {detailTab === "freelancer" && (
                  <PartyTab party={detailData.freelancer} label="Người làm" showApplication />
                )}

                {/* Tab: Job */}
                {detailTab === "job" && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4 border">
                      <h3 className="font-semibold text-gray-800 mb-3">{detailData.job.title}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">Ngân sách</p>
                          <p className="font-medium">{formatCurrency(detailData.job.budget)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Ký quỹ</p>
                          <p className="font-medium">{formatCurrency(detailData.job.escrowAmount)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Loại tiền</p>
                          <p className="font-medium">{detailData.job.currency}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Độ phức tạp</p>
                          <p className="font-medium">{detailData.job.complexity || "-"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Thời lượng</p>
                          <p className="font-medium">{detailData.job.duration || "-"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Hình thức</p>
                          <p className="font-medium">{detailData.job.workType || "-"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Trạng thái</p>
                          <p className="font-medium">{detailData.job.status || "-"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Ngày tạo</p>
                          <p className="font-medium">{formatDateTime(detailData.job.createdAt)}</p>
                        </div>
                      </div>
                      {detailData.job.skills?.length > 0 && (
                        <div className="mt-3">
                          <p className="text-gray-500 text-xs mb-1">Kỹ năng</p>
                          <div className="flex flex-wrap gap-1">
                            {detailData.job.skills.map((s, i) => (
                              <span key={i} className="text-xs px-2 py-0.5 bg-gray-200 rounded-full">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {(detailData.job.description || detailData.job.context || detailData.job.requirements || detailData.job.deliverables) && (
                      <div className="space-y-3">
                        {detailData.job.description && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Mô tả</h4>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 rounded p-3 border">{detailData.job.description}</p>
                          </div>
                        )}
                        {detailData.job.context && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Bối cảnh</h4>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 rounded p-3 border">{detailData.job.context}</p>
                          </div>
                        )}
                        {detailData.job.requirements && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Yêu cầu</h4>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 rounded p-3 border">{detailData.job.requirements}</p>
                          </div>
                        )}
                        {detailData.job.deliverables && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Sản phẩm bàn giao</h4>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 rounded p-3 border">{detailData.job.deliverables}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: Files */}
                {detailTab === "files" && (
                  <div className="space-y-6">
                    <PartyFilesSection
                      party={detailData.employer}
                      label={detailData.employer.fullName}
                      roleLabel="Bên thuê"
                    />
                    <PartyFilesSection
                      party={detailData.freelancer}
                      label={detailData.freelancer.fullName}
                      roleLabel="Người làm"
                    />
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-gray-500">Không có dữ liệu</div>
          )}
        </DialogContent>
      </Dialog>

      {/* Request Response Dialog */}
      <Dialog open={requestResponseDialogOpen} onOpenChange={setRequestResponseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yêu cầu người làm phản hồi</DialogTitle>
            <DialogDescription>
              Gửi yêu cầu để {selectedDispute?.freelancer.fullName} có thể gửi bằng chứng và giải thích
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số ngày phản hồi
              </label>
              <select
                value={daysToRespond}
                onChange={(e) => setDaysToRespond(Number(e.target.value))}
                className="w-full h-10 px-3 border border-gray-300 rounded-md"
              >
                <option value={1}>1 ngày</option>
                <option value={2}>2 ngày</option>
                <option value={3}>3 ngày</option>
                <option value={5}>5 ngày</option>
                <option value={7}>7 ngày</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestResponseDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleRequestResponse} disabled={isProcessing}>
              {isProcessing ? "Đang xử lý..." : "Gửi yêu cầu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Dialog */}
      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quyết định tranh chấp</DialogTitle>
            <DialogDescription>
              Chọn bên thắng và nhập ghi chú quyết định
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn bên thắng
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setEmployerWins(true)}
                  className={`p-3 border-2 rounded-lg text-center transition-colors ${
                    employerWins === true
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-medium">Bên thuê thắng</p>
                  <p className="text-xs text-gray-500 mt-1">{selectedDispute?.employer.fullName}</p>
                </button>
                <button
                  onClick={() => setEmployerWins(false)}
                  className={`p-3 border-2 rounded-lg text-center transition-colors ${
                    employerWins === false
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-medium">Người làm thắng</p>
                  <p className="text-xs text-gray-500 mt-1">{selectedDispute?.freelancer.fullName}</p>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú quyết định <span className="text-red-500">*</span>
              </label>
              <textarea
                value={resolveNote}
                onChange={(e) => setResolveNote(e.target.value)}
                placeholder="Nhập lý do quyết định..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {employerWins !== null && (
              <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm text-gray-600">
                <p className="font-medium mb-1 flex items-center gap-1">
                  <Icon name="info" size={16} />
                  Kết quả:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-5">
                  <li>{employerWins ? "Bên thuê" : "Người làm"} nhận tiền ký quỹ</li>
                  <li>{employerWins ? "Người làm" : "Bên thuê"} bị +1 Nhân phẩm tệ, -1 Nhân phẩm tốt</li>
                </ul>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleResolve}
              disabled={isProcessing || employerWins === null || !resolveNote.trim()}
            >
              {isProcessing ? "Đang xử lý..." : "Xác nhận quyết định"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ===== Party Tab Component ===== */
function PartyTab({ party, label, showApplication }: { party: PartyDetail; label: string; showApplication?: boolean }) {
  return (
    <div className="space-y-6">
      {/* Profile */}
      <div className="bg-gray-50 rounded-lg border p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden shrink-0">
            {party.avatarUrl ? (
              <img src={party.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <Icon name="person" size={24} />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{party.fullName}</h3>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <div><p className="text-gray-500 text-xs">Email</p><p className="font-medium truncate">{party.email}</p></div>
          {party.phoneNumber && <div><p className="text-gray-500 text-xs">SĐT</p><p className="font-medium">{party.phoneNumber}</p></div>}
          {party.title && <div><p className="text-gray-500 text-xs">Chức danh</p><p className="font-medium truncate">{party.title}</p></div>}
          {party.location && <div><p className="text-gray-500 text-xs">Địa điểm</p><p className="font-medium truncate">{party.location}</p></div>}
          {party.company && <div><p className="text-gray-500 text-xs">Công ty</p><p className="font-medium truncate">{party.company}</p></div>}
          <div><p className="text-gray-500 text-xs">Đã xác thực</p><p className="font-medium">{party.isVerified ? "Có" : "Không"}</p></div>
          <div><p className="text-gray-500 text-xs">Nhân phẩm tốt</p><p className="font-medium text-green-600">{party.trustScore}</p></div>
          <div><p className="text-gray-500 text-xs">Nhân phẩm tệ</p><p className="font-medium text-red-600">{party.untrustScore}</p></div>
          <div><p className="text-gray-500 text-xs">Ngày tham gia</p><p className="font-medium">{formatDateTime(party.createdAt)}</p></div>
        </div>
        {party.skills?.length > 0 && (
          <div className="mt-3">
            <p className="text-gray-500 text-xs mb-1">Kỹ năng</p>
            <div className="flex flex-wrap gap-1">
              {party.skills.map((s, i) => (
                <span key={i} className="text-xs px-2 py-0.5 bg-gray-200 rounded-full">{s}</span>
              ))}
            </div>
          </div>
        )}
        {party.bio && (
          <div className="mt-3">
            <p className="text-gray-500 text-xs mb-1">Giới thiệu</p>
            <p className="text-sm text-gray-600 whitespace-pre-wrap bg-white rounded p-2 border">{party.bio}</p>
          </div>
        )}
      </div>

      {/* Job Application (freelancer only) */}
      {showApplication && party.jobApplication && (
        <div className="bg-white rounded-lg border p-4">
          <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-1">
            <Icon name="assignment" size={16} /> Thông tin tham gia job
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><p className="text-gray-500 text-xs">Trạng thái đơn</p><p className="font-medium">{party.jobApplication.status}</p></div>
            <div><p className="text-gray-500 text-xs">Trạng thái work</p><p className="font-medium">{party.jobApplication.workStatus || "-"}</p></div>
            <div><p className="text-gray-500 text-xs">Ngày nộp đơn</p><p className="font-medium">{formatDateTime(party.jobApplication.createdAt)}</p></div>
            {party.jobApplication.workSubmittedAt && (
              <div><p className="text-gray-500 text-xs">Ngày nộp sản phẩm</p><p className="font-medium">{formatDateTime(party.jobApplication.workSubmittedAt)}</p></div>
            )}
          </div>
          {party.jobApplication.coverLetter && (
            <div className="mt-2">
              <p className="text-gray-500 text-xs mb-1">Thư xin việc</p>
              <p className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 rounded p-2 border">{party.jobApplication.coverLetter}</p>
            </div>
          )}
          {party.jobApplication.workSubmissionNote && (
            <div className="mt-2">
              <p className="text-gray-500 text-xs mb-1">Ghi chú nộp sản phẩm</p>
              <p className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 rounded p-2 border">{party.jobApplication.workSubmissionNote}</p>
            </div>
          )}
          {party.jobApplication.workRevisionNote && (
            <div className="mt-2">
              <p className="text-gray-500 text-xs mb-1">Yêu cầu chỉnh sửa</p>
              <p className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 rounded p-2 border">{party.jobApplication.workRevisionNote}</p>
            </div>
          )}
          {party.jobApplication.workSubmissionUrl && (
            <button
              onClick={() => handleDownloadFile(party.jobApplication!.workSubmissionUrl!, "work-submission")}
              className="flex items-center gap-2 mt-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Icon name="download" size={18} className="text-gray-500 shrink-0" />
              <span className="text-sm text-gray-700">Tải sản phẩm đã nộp</span>
            </button>
          )}
        </div>
      )}

      {/* History */}
      <div className="bg-white rounded-lg border p-4">
        <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-1">
          <Icon name="history" size={16} /> Lịch sử hoạt động (job này)
        </h4>
        {party.history.length === 0 ? (
          <p className="text-sm text-gray-400">Không có lịch sử</p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {party.history.map((h) => (
              <div key={h.id} className="flex items-start gap-2 text-sm p-2 bg-gray-50 rounded">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800">{h.actionLabel}</p>
                  {h.description && <p className="text-gray-500 text-xs whitespace-pre-wrap">{h.description}</p>}
                  <p className="text-gray-400 text-xs mt-0.5">
                    {h.user.fullName} - {formatDateTime(h.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  function handleDownloadFile(url: string, name: string) {
    downloadFileFromUrl(url, name);
  }
}

/* ===== Party Files Section ===== */
function PartyFilesSection({ party, label, roleLabel }: { party: PartyDetail; label: string; roleLabel: string }) {
  const [showAll, setShowAll] = useState(false);
  const files = party.uploadedFiles || [];
  const displayed = showAll ? files : files.slice(0, 10);

  return (
    <div className="bg-white rounded-lg border p-4">
      <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-1">
        <Icon name="folder" size={16} /> Tài liệu của {roleLabel}: {label}
        <span className="text-xs text-gray-400 font-normal">({files.length} tệp)</span>
      </h4>
      {files.length === 0 ? (
        <p className="text-sm text-gray-400">Không có tài liệu</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {displayed.map((f) => (
              <div key={f.id} className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-50 transition-colors">
                <Icon name={f.mimeType?.startsWith("image/") ? "image" : "description"} size={20} className="text-gray-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 truncate">{f.originalFilename}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    {f.readableSize && <span>{f.readableSize}</span>}
                    {f.usage && <span>({f.usage})</span>}
                    <span>{formatDateTime(f.createdAt)}</span>
                  </div>
                </div>
                <button
                  onClick={() => downloadFileFromUrl(f.secureUrl, f.originalFilename || "file")}
                  className="text-gray-500 hover:text-gray-700 p-1 shrink-0"
                >
                  <Icon name="download" size={16} />
                </button>
              </div>
            ))}
          </div>
          {files.length > 10 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-[#04A0EF] hover:underline mt-2"
            >
              {showAll ? "Thu gọn" : `Xem tất cả (${files.length} tệp)`}
            </button>
          )}
        </>
      )}
    </div>
  );
}

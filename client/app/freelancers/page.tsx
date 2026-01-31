"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Icon from "@/components/ui/Icon";
import { api } from "@/lib/api";
import { FreelancerListItem } from "@/types/user";
import { Page } from "@/types/job";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const DEFAULT_GREETING = "Xin chào! Tôi muốn kết nối với bạn.";

export default function FreelancersPage() {
  const router = useRouter();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [freelancers, setFreelancers] = useState<FreelancerListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sendingRequestId, setSendingRequestId] = useState<number | null>(null);
  const size = 12;

  const fetchFreelancers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getFreelancers({ page, size, sortBy: "fullName", sortDir: "asc" });
      if (res.data) {
        const data = res.data as Page<FreelancerListItem>;
        setFreelancers(data.content ?? []);
        setTotalPages(data.totalPages ?? 0);
        setTotalElements(data.totalElements ?? 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    fetchFreelancers();
  }, [fetchFreelancers]);

  const handleAddFriend = async (item: FreelancerListItem) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    const id = item.user.id;
    setSendingRequestId(id);
    try {
      await api.sendChatRequest(id, DEFAULT_GREETING);
      setFreelancers((prev) =>
        prev.map((f) =>
          f.user.id === id ? { ...f, relationStatus: "PENDING" as const, conversationId: null } : f
        )
      );
    } catch (e) {
      console.error(e);
    } finally {
      setSendingRequestId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Tìm Freelancer
          </h1>
          <p className="text-gray-500 mb-6">
            Danh sách freelancer trên nền tảng
          </p>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-4 border-[#04A0EF] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : freelancers.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow">
              <Icon name="engineering" size={64} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Chưa có freelancer nào.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {freelancers.map((item) => {
                  const user = item.user;
                  const isSelf = currentUser?.id === user.id;
                  const canAddFriend =
                    (item.relationStatus === "NONE" || item.relationStatus === "REJECTED") && !isSelf;
                  const isPending = item.relationStatus === "PENDING";
                  const isFriend = item.relationStatus === "ACCEPTED";
                  const sending = sendingRequestId === user.id;

                  return (
                    <div
                      key={user.id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col"
                    >
                      <div className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <Avatar className="h-14 w-14 shrink-0 ring-2 ring-gray-100">
                            <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                            <AvatarFallback className="bg-[#04A0EF]/10 text-[#04A0EF] text-lg">
                              {(user.fullName || "?").charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <p className="font-semibold text-gray-900 truncate">{user.fullName}</p>
                              {user.isVerified && (
                                <Icon name="verified" size={16} className="text-[#04A0EF] shrink-0" />
                              )}
                            </div>
                            {user.title && (
                              <p className="text-sm text-gray-600 truncate mt-0.5">{user.title}</p>
                            )}
                            {user.location && (
                              <p className="text-xs text-gray-500 flex items-center gap-0.5 mt-1">
                                <Icon name="location_on" size={14} />
                                {user.location}
                              </p>
                            )}
                          </div>
                        </div>
                        {user.bio && (
                          <p className="text-xs text-gray-500 line-clamp-2 mb-3">{user.bio}</p>
                        )}
                        {user.skills && user.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {user.skills.slice(0, 4).map((s) => (
                              <span
                                key={s}
                                className="text-xs px-2 py-0.5 rounded-full bg-[#04A0EF]/10 text-[#04A0EF]"
                              >
                                {s}
                              </span>
                            ))}
                            {user.skills.length > 4 && (
                              <span className="text-xs text-gray-400">+{user.skills.length - 4}</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="px-4 pb-4 pt-0 flex gap-2">
                        {isSelf ? (
                          <Button variant="secondary" size="sm" className="w-full" disabled>
                            Hồ sơ của bạn
                          </Button>
                        ) : isFriend ? (
                          <Link href={`/messages?userId=${user.id}`} className="flex-1">
                            <Button variant="default" size="sm" className="w-full bg-[#04A0EF] hover:bg-[#04A0EF]/90">
                              <Icon name="chat" size={16} className="mr-1.5" />
                              Nhắn tin
                            </Button>
                          </Link>
                        ) : isPending ? (
                          <Button variant="outline" size="sm" className="w-full" disabled>
                            Đã gửi yêu cầu
                          </Button>
                        ) : canAddFriend ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            disabled={sending}
                            onClick={() => handleAddFriend(item)}
                          >
                            {sending ? (
                              <>
                                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
                                Đang gửi...
                              </>
                            ) : (
                              <>
                                <Icon name="person_add" size={16} className="mr-1.5" />
                                Kết bạn
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="w-full" disabled>
                            {item.relationStatus === "BLOCKED" ? "Đã chặn" : "Nhắn tin"}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 0}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Trước
                  </Button>
                  <span className="text-sm text-gray-600">
                    Trang {page + 1} / {totalPages} ({totalElements} freelancer)
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Sau
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Job, Page } from "@/types/job";
import { api } from "@/lib/api";
import { normalizePage } from "@/lib/pageUtils";
import { useAuth } from "@/context/AuthContext";
import JobCardWithPreview from "../cards/JobCardWithPreview";
import JobsSearchBar from "../shared/JobsSearchBar";
import JobsEmptyState from "../shared/JobsEmptyState";
import JobsError from "../shared/JobsError";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/Icon";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const JOBS_PER_PAGE = 6;

export default function JobsList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState<Page<Job> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentPage = parseInt(searchParams.get("page") || "0", 10);

  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setDebouncedKeyword(searchKeyword.trim());
    }, 350);
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [searchKeyword]);

  const fetchSavedJobIds = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await api.getSavedJobIds();
      if (response.status === "SUCCESS" && response.data) {
        setFavorites(new Set(response.data));
      }
    } catch {
      // ignore
    }
  }, [isAuthenticated]);

  const fetchJobs = useCallback(
    async (pageNum: number = 0, append = false) => {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const params = {
          page: pageNum,
          size: JOBS_PER_PAGE,
          sortBy: "createdAt",
          sortDir: "desc" as const,
        };

        const response = debouncedKeyword
          ? await api.searchJobs({ keyword: debouncedKeyword, page: pageNum, size: JOBS_PER_PAGE })
          : await api.getOpenJobs(params);

        if (response.status === "SUCCESS" && response.data) {
          const normalized = normalizePage(response.data, JOBS_PER_PAGE);
          setPage(normalized);
          setJobs((prev) => (append ? [...prev, ...normalized.content] : normalized.content));
        } else {
          setError(response.message || "Không thể tải danh sách việc làm");
          if (!append) setJobs([]);
        }
      } catch {
        setError("Có lỗi xảy ra khi tải dữ liệu");
        if (!append) setJobs([]);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [debouncedKeyword]
  );

  useEffect(() => {
    if (debouncedKeyword && currentPage !== 0) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      router.replace(`/jobs?${params.toString()}`);
      return;
    }
    fetchJobs(currentPage);
    fetchSavedJobIds();
  }, [currentPage, debouncedKeyword, fetchJobs, fetchSavedJobIds, router, searchParams]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage <= 0) {
      params.delete("page");
    } else {
      params.set("page", newPage.toString());
    }
    router.push(`/jobs?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoadMore = async () => {
    if (!page || isLoadingMore || jobs.length >= totalElements) return;
    await fetchJobs(page.number + 1, true);
  };

  const handleFavorite = async (jobId: number) => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để lưu công việc");
      router.push("/login");
      return;
    }

    const isSaved = favorites.has(jobId);

    setFavorites((prev) => {
      const next = new Set(prev);
      if (isSaved) next.delete(jobId);
      else next.add(jobId);
      return next;
    });

    try {
      const response = await api.toggleSaveJob(jobId);
      if (response.status === "SUCCESS") {
        toast.success(isSaved ? "Đã bỏ lưu công việc" : "Đã lưu công việc");
      } else {
        setFavorites((prev) => {
          const next = new Set(prev);
          if (isSaved) next.add(jobId);
          else next.delete(jobId);
          return next;
        });
        toast.error(response.message || "Có lỗi xảy ra");
      }
    } catch {
      setFavorites((prev) => {
        const next = new Set(prev);
        if (isSaved) next.add(jobId);
        else next.delete(jobId);
        return next;
      });
      toast.error("Có lỗi xảy ra khi lưu công việc");
    }
  };

  const totalElements = page?.totalElements ?? 0;
  const hasMore = page ? jobs.length < totalElements : false;

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-6">
        <JobsSearchBar
          value={searchKeyword}
          onChange={setSearchKeyword}
          placeholder="Tìm kiếm việc làm theo tên, kỹ năng..."
        />
      </div>

      <div>
        {!isLoading && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <p className="text-gray-600">
              {debouncedKeyword ? (
                <>
                  Tìm thấy <span className="font-semibold text-[#04A0EF]">{totalElements}</span> việc làm
                  cho &quot;<span className="font-medium">{debouncedKeyword}</span>&quot;
                </>
              ) : (
                <>
                  <span className="font-semibold text-[#04A0EF]">{totalElements}</span> việc làm đang tuyển
                </>
              )}
            </p>
            {totalElements > 0 && (
              <p className="text-sm text-gray-500">
                Đang hiển thị {jobs.length} / {totalElements}
              </p>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.from({ length: JOBS_PER_PAGE }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex gap-3">
                  <Skeleton className="w-14 h-14 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2 mb-3" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20 rounded-md" />
                      <Skeleton className="h-6 w-16 rounded-md" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <JobsError message={error} onRetry={() => fetchJobs(currentPage)} />
        ) : jobs.length === 0 ? (
          <JobsEmptyState
            title="Không tìm thấy việc làm"
            message={debouncedKeyword ? "Thử tìm kiếm với từ khóa khác" : "Hiện chưa có việc làm nào đang tuyển"}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {jobs.map((job) => (
                <JobCardWithPreview
                  key={job.id}
                  job={job}
                  onFavorite={handleFavorite}
                  isFavorite={favorites.has(job.id)}
                />
              ))}
            </div>

            <div className="mt-8 space-y-4">
              {page && page.totalPages > 1 && (
                <Pagination
                  currentPage={page.number}
                  totalPages={page.totalPages}
                  onPageChange={handlePageChange}
                  disabled={isLoadingMore}
                />
              )}

              {hasMore && (
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="min-w-[200px] border-[#04A0EF] text-[#04A0EF] hover:bg-[#04A0EF]/5"
                  >
                    {isLoadingMore ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#04A0EF] border-t-transparent rounded-full animate-spin mr-2" />
                        Đang tải...
                      </>
                    ) : (
                      <>
                        <Icon name="expand_more" size={20} />
                        Tải thêm việc làm
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

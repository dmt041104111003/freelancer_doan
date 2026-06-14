"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
  const [skillKeyword, setSkillKeyword] = useState("");
  const [minBudget, setMinBudget] = useState<number>(0);
  const [maxBudget, setMaxBudget] = useState<number>(0);
  const [debouncedMinBudget, setDebouncedMinBudget] = useState(0);
  const [debouncedMaxBudget, setDebouncedMaxBudget] = useState(0);
  const [debouncedSkillKeyword, setDebouncedSkillKeyword] = useState("");
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const filterDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    if (filterDebounceRef.current) clearTimeout(filterDebounceRef.current);
    filterDebounceRef.current = setTimeout(() => {
      setDebouncedSkillKeyword(skillKeyword);
      setDebouncedMinBudget(minBudget);
      setDebouncedMaxBudget(maxBudget);
    }, 150);
    return () => {
      if (filterDebounceRef.current) clearTimeout(filterDebounceRef.current);
    };
  }, [skillKeyword, minBudget, maxBudget]);

  const maxAvailableBudget = useMemo(() => {
    const budgets = jobs.map(j => j.budget).filter((b): b is number => b != null);
    return budgets.length > 0 ? Math.max(...budgets) : 0;
  }, [jobs]);

  useEffect(() => {
    if (maxBudget === 0 && maxAvailableBudget > 0) {
      setMaxBudget(maxAvailableBudget);
    }
  }, [maxAvailableBudget, maxBudget]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      if (debouncedSkillKeyword.trim()) {
        const kw = debouncedSkillKeyword.trim().toLowerCase();
        const match = job.skills?.some(s => s.toLowerCase().includes(kw));
        if (!match) return false;
      }
      if (job.budget != null) {
        if (job.budget < debouncedMinBudget) return false;
        if (debouncedMaxBudget > 0 && job.budget > debouncedMaxBudget) return false;
      }
      return true;
    });
  }, [jobs, debouncedSkillKeyword, debouncedMinBudget, debouncedMaxBudget]);

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

  const formatBudgetDisplay = (budget?: number) => {
    if (!budget) return "0";
    if (budget >= 1000000) return `${(budget / 1000000).toFixed(budget % 1000000 === 0 ? 0 : 1)}tr`;
    return new Intl.NumberFormat("vi-VN").format(budget);
  };

  const totalElements = page?.totalElements ?? 0;
  const hasMore = page ? jobs.length < totalElements : false;
  const showingAll = !skillKeyword && minBudget === 0 && maxBudget >= maxAvailableBudget;

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Search Bar */}
      <div className="mb-4">
        <JobsSearchBar
          value={searchKeyword}
          onChange={setSearchKeyword}
          placeholder="Tìm kiếm việc làm theo tên công việc..."
        />
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Skills Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Kỹ năng
            </label>
            <div className="relative">
              <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={skillKeyword}
                onChange={(e) => setSkillKeyword(e.target.value)}
                placeholder="Lọc theo kỹ năng..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#04A0EF] focus:ring-2 focus:ring-[#04A0EF]/20 transition-all text-sm"
              />
            </div>
          </div>

          {/* Budget Range */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Mức lương: {formatBudgetDisplay(minBudget)} - {maxBudget > 0 ? formatBudgetDisplay(maxBudget) : "Tối đa"}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={maxAvailableBudget || 50000000}
                step={500000}
                value={minBudget}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMinBudget(Math.min(val, maxBudget));
                }}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#04A0EF] range-thumb"
              />
              <span className="text-xs text-gray-400 shrink-0">-</span>
              <input
                type="range"
                min={0}
                max={maxAvailableBudget || 50000000}
                step={500000}
                value={maxBudget}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMaxBudget(Math.max(val, minBudget));
                }}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#04A0EF] range-thumb"
              />
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {!showingAll && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">Bộ lọc:</span>
            {skillKeyword && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#eef2ff] text-[#4f46e5] text-xs rounded">
                Kỹ năng: {skillKeyword}
                <button onClick={() => setSkillKeyword("")} className="hover:text-[#4338ca]">
                  <Icon name="close" size={14} />
                </button>
              </span>
            )}
            {minBudget > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#eef2ff] text-[#4f46e5] text-xs rounded">
                Từ {formatBudgetDisplay(minBudget)}
                <button onClick={() => setMinBudget(0)} className="hover:text-[#4338ca]">
                  <Icon name="close" size={14} />
                </button>
              </span>
            )}
            {maxBudget < maxAvailableBudget && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#eef2ff] text-[#4f46e5] text-xs rounded">
                Đến {formatBudgetDisplay(maxBudget)}
                <button onClick={() => setMaxBudget(maxAvailableBudget)} className="hover:text-[#4338ca]">
                  <Icon name="close" size={14} />
                </button>
              </span>
            )}
            <button
              onClick={() => { setSkillKeyword(""); setMinBudget(0); setMaxBudget(maxAvailableBudget); }}
              className="text-xs text-gray-500 hover:text-gray-700 ml-auto"
            >
              Xóa tất cả
            </button>
          </div>
        )}
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
                  <span className="font-semibold text-[#04A0EF]">{filteredJobs.length}</span> việc làm đang tuyển
                  {!showingAll && filteredJobs.length < jobs.length && (
                    <span className="text-gray-400 font-normal"> (đã lọc từ {jobs.length})</span>
                  )}
                </>
              )}
            </p>
            {totalElements > 0 && (
              <p className="text-sm text-gray-500">
                Đang hiển thị {filteredJobs.length} / {totalElements}
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
        ) : filteredJobs.length === 0 ? (
          <JobsEmptyState
            title="Không tìm thấy việc làm"
            message={debouncedKeyword ? "Thử tìm kiếm với từ khóa khác" : "Hiện chưa có việc làm nào đang tuyển"}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredJobs.map((job) => (
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

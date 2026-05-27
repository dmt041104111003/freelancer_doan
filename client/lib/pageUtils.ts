import { Page } from "@/types/job";

type RawPage<T> = Partial<Page<T>> & {
  content?: T[];
  page?: {
    size?: number;
    number?: number;
    totalElements?: number;
    totalPages?: number;
  };
};

export function normalizePage<T>(raw: RawPage<T> | null | undefined, fallbackSize = 10): Page<T> {
  const content = raw?.content ?? [];
  const size = raw?.size ?? raw?.page?.size ?? fallbackSize;
  const number = raw?.number ?? raw?.page?.number ?? 0;
  const totalElements = raw?.totalElements ?? raw?.page?.totalElements ?? content.length;
  const computedTotalPages =
    raw?.totalPages ??
    raw?.page?.totalPages ??
    (size > 0 ? Math.ceil(totalElements / size) : 1);
  const totalPages = Math.max(computedTotalPages, totalElements > 0 ? 1 : 0);

  return {
    content,
    totalElements,
    totalPages,
    size,
    number,
    first: raw?.first ?? number <= 0,
    last: raw?.last ?? number >= totalPages - 1,
    empty: raw?.empty ?? content.length === 0,
  };
}

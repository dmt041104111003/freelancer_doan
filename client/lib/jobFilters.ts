import { Job } from "@/types/job";

export type PostedJobsFilter = Job["status"] | "all" | "history";
export type AcceptedJobsFilter =
  | Job["status"]
  | "all"
  | "history"
  | "submitted"
  | "applied"
  | "saved";

export function isActiveInProgress(job: Job): boolean {
  return job.status === "IN_PROGRESS" && !job.workReviewDeadline;
}

export function isWorkSubmitted(job: Job): boolean {
  return (
    job.workStatus === "SUBMITTED" ||
    job.workStatus === "APPROVED" ||
    Boolean(job.workSubmissionUrl)
  );
}

export function filterPostedJobs(jobs: Job[], filter: PostedJobsFilter): Job[] {
  switch (filter) {
    case "all":
      return jobs;
    case "IN_PROGRESS":
      // Đang thực hiện = OPEN (chờ ứng tuyển) + IN_PROGRESS (đang làm, chưa nộp)
      return jobs.filter((j) => j.status === "OPEN" || isActiveInProgress(j));
    case "DISPUTED":
      // Include jobs currently disputed OR jobs that had dispute (resolved)
      return jobs.filter((j) => j.status === "DISPUTED" || j.hadDispute === true);
    case "history":
      return jobs.filter((j) => j.status === "IN_PROGRESS" || j.status === "COMPLETED");
    default:
      return jobs.filter((j) => j.status === filter);
  }
}

export function filterAcceptedJobs(jobs: Job[], filter: AcceptedJobsFilter): Job[] {
  switch (filter) {
    case "all":
      return jobs;
    case "IN_PROGRESS":
      return jobs.filter((j) => j.status === "IN_PROGRESS" && !isWorkSubmitted(j));
    case "submitted":
      return jobs.filter((j) => j.status === "IN_PROGRESS" && isWorkSubmitted(j));
    case "DISPUTED":
      // Include jobs currently disputed OR jobs that had dispute (resolved)
      return jobs.filter((j) => j.status === "DISPUTED" || j.hadDispute === true);
    case "history":
      return jobs.filter((j) => j.status === "IN_PROGRESS" || j.status === "COMPLETED");
    default:
      return jobs.filter((j) => j.status === filter);
  }
}

export function postedJobsFetchParams(
  filter: PostedJobsFilter
): { status?: Job["status"]; size: number } {
  // Fetch all for these filters (need multiple statuses or hadDispute check)
  if (filter === "all" || filter === "history" || filter === "DISPUTED" || filter === "IN_PROGRESS") {
    return { size: 100 };
  }
  return { status: filter, size: 100 };
}

export function acceptedJobsFetchStatus(filter: AcceptedJobsFilter): string | undefined {
  // Fetch all for these filters (need client-side filtering)
  if (
    filter === "all" ||
    filter === "history" ||
    filter === "submitted" ||
    filter === "applied" ||
    filter === "saved" ||
    filter === "DISPUTED" ||
    filter === "IN_PROGRESS"
  ) {
    return undefined;
  }
  return filter;
}

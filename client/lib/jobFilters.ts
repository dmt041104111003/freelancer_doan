import { Job } from "@/types/job";

export type PostedJobsFilter = Job["status"] | "all" | "history" | "review";
export type AcceptedJobsFilter =
  | Job["status"]
  | "all"
  | "history"
  | "submitted"
  | "applied"
  | "saved";

export function isAwaitingEmployerReview(job: Job): boolean {
  return job.status === "IN_PROGRESS" && Boolean(job.workReviewDeadline);
}

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
      return jobs.filter(isActiveInProgress);
    case "review":
      return jobs.filter(isAwaitingEmployerReview);
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
    case "history":
      return jobs.filter((j) => j.status === "IN_PROGRESS" || j.status === "COMPLETED");
    default:
      return jobs.filter((j) => j.status === filter);
  }
}

export function postedJobsFetchParams(
  filter: PostedJobsFilter
): { status?: Job["status"]; size: number } {
  if (filter === "all" || filter === "history") {
    return { size: 100 };
  }
  if (filter === "review" || filter === "IN_PROGRESS") {
    return { status: "IN_PROGRESS", size: 100 };
  }
  return { status: filter, size: 100 };
}

export function acceptedJobsFetchStatus(filter: AcceptedJobsFilter): string | undefined {
  if (
    filter === "all" ||
    filter === "history" ||
    filter === "submitted" ||
    filter === "applied" ||
    filter === "saved"
  ) {
    return undefined;
  }
  return filter;
}

import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { JamSpecificContext } from "../../../common/components/JamSpecificStyling.tsx";
import { getJamId } from "../../../common/utils/getJamId.ts";
import { useApiRequest } from "../../../api/apiRequest.ts";
import { PostResponse } from "../../../common/models/post.ts";
import { Post } from "../../../common/models/post.ts";

export const JamInsights: React.FC = () => {
  const jam = useContext(JamSpecificContext);
  const jamId = getJamId();
  const req = useApiRequest();

  const postsQuery = useQuery<PostResponse>({
    queryKey: ["admin", "dashboard", "posts", jamId],
    queryFn: async () => req<PostResponse>(`/posts?jamId=${jamId}&page=1`),
  });

  const reportsQuery = useQuery<Post[]>({
    queryKey: ["admin", "dashboard", "reports", jamId],
    queryFn: async () => req<Post[]>(`/${jamId}/admin/reports`),
  });

  const totalPosts = postsQuery.data?.pagination.totalCount ?? 0;
  const postsOnCurrentPage = postsQuery.data?.posts.length ?? 0;
  const reportedPostsShown = reportsQuery.data?.length ?? 0;
  const highestReportCount = reportsQuery.data?.reduce((max, post) => Math.max(max, post.reportCount), 0) ?? 0;

  return (
    <section className="mb-8" aria-label="Jam insights">
      <h3 className="text-2xl text-center mb-4">Jam Insights</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
        <InsightCard label="Jam status" value={toTitleCase(jam.status)} />
        <InsightCard label="Schedule" value={getScheduleState(jam.start, jam.end)} />
        <InsightCard label="Total posts" value={String(totalPosts)} isLoading={postsQuery.isLoading} />
        <InsightCard
          label="Reported posts (shown)"
          value={String(reportedPostsShown)}
          isLoading={reportsQuery.isLoading}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InsightCard
          label="Time window"
          value={getJamTimeWindowText(jam.start, jam.end)}
          hint="(Uses your browser's local time zone)"
        />
        <InsightCard
          label="Moderation urgency"
          value={highestReportCount > 0 ? `Top report count: ${highestReportCount}` : "No reports right now"}
          isLoading={reportsQuery.isLoading}
        />
      </div>
    </section>
  );
};

const InsightCard: React.FC<{
  label: string;
  value: string;
  hint?: string;
  isLoading?: boolean;
}> = ({ label, value, hint, isLoading }) => {
  return (
    <article className="rounded-xl border border-[var(--theme-tile-border)] bg-[var(--theme-tile-bg)] p-4">
      <p className="text-sm opacity-80">{label}</p>
      <p className="text-xl font-semibold break-words">{isLoading ? "Loading..." : value}</p>
      {hint && <p className="text-xs mt-1 opacity-80">{hint}</p>}
    </article>
  );
};

const toTitleCase = (value: string) => {
  return value
    .toLowerCase()
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getScheduleState = (start: string | number, end: string | number) => {
  const now = Date.now();
  const startMs = typeof start === "number" ? start : Date.parse(start);
  const endMs = typeof end === "number" ? end : Date.parse(end);

  if (now < startMs) {
    return "Starts soon";
  }

  if (now > endMs) {
    return "Finished";
  }

  return "Live now";
};

const getJamTimeWindowText = (start: string | number, end: string | number) => {
  const now = Date.now();
  const startMs = typeof start === "number" ? start : Date.parse(start);
  const endMs = typeof end === "number" ? end : Date.parse(end);

  if (now < startMs) {
    return `Starts in ${formatDuration(startMs - now)}`;
  }

  if (now > endMs) {
    return `Ended ${formatDuration(now - endMs)} ago`;
  }

  return `${formatDuration(endMs - now)} remaining`;
};

const formatDuration = (ms: number) => {
  const totalMinutes = Math.max(0, Math.floor(ms / 60000));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}d ${hours}h`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
};

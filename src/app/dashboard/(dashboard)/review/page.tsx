import { getBusinesses } from "@/actions/business-action";
import { getReviews } from "@/actions/review-action";
import ReviewTable from "@/components/dashboard/ReviewTable";

interface ReviewPageProps {
  searchParams: Promise<{ page?: string; q?: string; status?: string }>;
}

export default async function ReviewPage({ searchParams }: ReviewPageProps) {
  const params = await searchParams;
  const page = Number(params.page) > 0 ? Number(params.page) : 1;
  const search = params.q ?? "";
  const status =
    (params.status as "pending" | "approved" | "rejected" | "all") ?? "all";

  const [{ data: reviews, total, pageSize }, businesses] = await Promise.all([
    getReviews({ page, search, status }),
    getBusinesses(),
  ]);

  return (
    <div className="space-y-8">
      <ReviewTable
        reviews={reviews}
        businesses={businesses}
        total={total}
        page={page}
        pageSize={pageSize}
        search={search}
        status={status}
      />
    </div>
  );
}

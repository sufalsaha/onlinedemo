import { getBlogs } from "@/actions/blog-action";
import BlogTable from "@/components/dashboard/BlogTable";

interface BlogPageProps {
  searchParams: Promise<{ page?: string; q?: string; status?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = Number(params.page) > 0 ? Number(params.page) : 1;
  const search = params.q ?? "";
  const status = (params.status as "draft" | "published" | "all") ?? "all";

  const { data: blogs, total, pageSize } = await getBlogs({
    page,
    search,
    status,
  });

  return (
    <div className="space-y-8">
      <BlogTable
        blogs={blogs}
        total={total}
        page={page}
        pageSize={pageSize}
        search={search}
        status={status}
      />
    </div>
  );
}

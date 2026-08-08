import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface BlogPaginationProps {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}

function buildHref(base: Record<string, string | undefined>, page: number) {
  const query = new URLSearchParams();
  if (base.q) query.set("q", base.q);
  if (base.category) query.set("category", base.category);
  if (base.tag) query.set("tag", base.tag);
  if (base.sort) query.set("sort", base.sort);
  if (page > 1) query.set("page", String(page));
  const qs = query.toString();
  return `/blogs${qs ? `?${qs}` : ""}`;
}

export function BlogPagination({ page, totalPages, searchParams }: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <Pagination className="mt-10">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={buildHref(searchParams, Math.max(page - 1, 1))}
            aria-disabled={page <= 1}
            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {pages.map((p, index) => {
          const prev = pages[index - 1];
          const showEllipsis = prev !== undefined && p - prev > 1;
          return (
            <span key={p} className="flex items-center">
              {showEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink href={buildHref(searchParams, p)} isActive={p === page}>
                  {p}
                </PaginationLink>
              </PaginationItem>
            </span>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href={buildHref(searchParams, Math.min(page + 1, totalPages))}
            aria-disabled={page >= totalPages}
            className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

import { ComplaintTable } from "@/components/dashboard/ComplaintTable";

interface ComplaintPageProps {
  searchParams: Promise<{ page?: string; q?: string; status?: string; priority?: string }>;
}

export default async function ComplaintPage({ searchParams }: ComplaintPageProps) {
  const params = await searchParams;
  return <ComplaintTable searchParams={params} />;
}

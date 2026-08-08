import { notFound } from "next/navigation";

import { getBusinessById } from "@/actions/business-action";
import { getCategories } from "@/actions/category-action";
import AddBusinessForm from "@/components/dashboard/forms/AddBusinessForm";

interface EditBusinessPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBusinessPage({ params }: EditBusinessPageProps) {
  const { id } = await params;

  const [business, categories] = await Promise.all([
    getBusinessById(id),
    getCategories(),
  ]);

  if (!business) {
    notFound();
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
      <AddBusinessForm categories={categories} business={business} asDialog={false} />
    </div>
  );
}

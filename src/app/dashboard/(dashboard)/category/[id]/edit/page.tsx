import { notFound } from "next/navigation";

import { getCategoryById } from "@/actions/category-action";
import AddCategoryForm from "@/components/dashboard/forms/AddCategoryForm";

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;

  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
      <AddCategoryForm category={category} asDialog={false} />
    </div>
  );
}

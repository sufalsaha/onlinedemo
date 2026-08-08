import { getCategories } from "@/actions/category-action";
import CategoryTable from "@/components/dashboard/CategoryTable";
import AddCategoryForm from "@/components/dashboard/forms/AddCategoryForm";

export default async function CategoryPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-8">
      {/* <AddCategoryForm /> */}
      <CategoryTable categories={categories} />
    </div>
  );
}
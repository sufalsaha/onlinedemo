import { getCategories } from "@/actions/category-action";
import AddBusinessForm from "@/components/dashboard/forms/AddBusinessForm";

export default async function Page(){
    const categories = await getCategories();
    return <AddBusinessForm categories={categories} />
}
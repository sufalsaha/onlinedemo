import { getBusinesses } from "@/actions/business-action";
import AddReviewForm from "@/components/dashboard/forms/AddReviewForm";




export default async function Page(){
    const businesses = await getBusinesses();
    return <AddReviewForm businesses={businesses} />
}
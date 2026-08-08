import { getBusinesses } from "@/actions/business-action";
import BusinessTable from "@/components/dashboard/Businesstable";


export default async function BusinessPage() {
  const businesses = await getBusinesses();

  return (
    <div className="space-y-8">
      <BusinessTable businesses={businesses} />
    </div>
  );
}
import { getBusinesses } from "@/actions/business-action";
import { ComplaintForm } from "./ComplaintForm";

export default async function Page() {
  const businesses = await getBusinesses();

  return (
    <div className="bg-gradient-to-br from-teal-50/20 via-slate-50 to-emerald-50/30 flex items-center justify-center py-10 md:py-20 px-4">
      <ComplaintForm businesses={businesses} />
    </div>
  );
}

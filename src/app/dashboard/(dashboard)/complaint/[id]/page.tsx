import { getCurrentAdmin } from "@/lib/auth/user-auth";
import { getComplaintById } from "@/actions/complaint-action";
import { notFound } from "next/navigation";
import { ComplaintDetails } from "@/components/dashboard/complaint-details";

interface ComplaintDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ComplaintDetailsPage({ params }: ComplaintDetailsPageProps) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
          <p className="text-muted-foreground">You must be logged in as an admin to view this page.</p>
        </div>
      </div>
    );
  }

  const { id } = await params;
  const complaint = await getComplaintById(id);

  if (!complaint) {
    notFound();
  }

  return <ComplaintDetails complaint={complaint} />;
}
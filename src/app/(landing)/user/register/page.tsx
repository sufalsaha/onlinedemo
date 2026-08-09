import { redirect } from "next/navigation";

import { RegisterForm } from "@/components/user/register-from";
import { getCurrentUser } from "@/lib/auth/user-auth";

export default async function Page() {
  const user = await getCurrentUser();
  if (user) redirect("/");

  return (
    <div className="flex  w-full items-center justify-center p-6 md:p-15">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  )
}

import { redirect } from "next/navigation"

import { VerifyForm } from "@/components/user/verify-form"
import { getCurrentUser } from "@/lib/auth/user-auth"

export default async function Page() {
  const user = await getCurrentUser()

  // The code is checked against the session, not a URL param, so there has to
  // be a session to check against.
  if (!user) redirect("/user/login")
  if (user.verified) redirect("/")

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <VerifyForm email={user.email} />
      </div>
    </div>
  )
}

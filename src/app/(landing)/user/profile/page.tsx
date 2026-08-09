import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MailWarning } from "lucide-react";

import { ChangePasswordForm } from "@/components/user/change-password-form";
import { ProfileForm } from "@/components/user/profile-form";
import { getCurrentUser } from "@/lib/auth/user-auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Your Profile",
  description: "Manage your account details and profile picture.",
};

export default async function Page() {
  const sessionUser = await getCurrentUser();

  // Nothing on this page is public, and every action below reads the same
  // session, so an unauthenticated visitor never gets as far as a form.
  if (!sessionUser) redirect("/user/login");

  // getCurrentUser() returns only what the navbar needs; the editable columns
  // are read here, scoped to the session's own id.
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      fullName: true,
      email: true,
      image: true,
      phone: true,
      jobTitle: true,
      bio: true,
    },
  });

  if (!user) redirect("/user/login");

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Your Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage how you appear across the site.
        </p>
      </div>

      {!sessionUser.verified && (
        <div className="mb-6 flex flex-wrap items-center gap-2 rounded-md bg-amber-500/10 p-3 text-sm font-medium text-amber-700 dark:text-amber-400">
          <MailWarning className="h-4 w-4 shrink-0" />
          <span>Your email address isn&apos;t verified yet.</span>
          <Link href="/user/verify" className="underline underline-offset-2">
            Verify now
          </Link>
        </div>
      )}

      <div className="space-y-6">
        <ProfileForm user={user} />
        <ChangePasswordForm />
      </div>
    </main>
  );
}

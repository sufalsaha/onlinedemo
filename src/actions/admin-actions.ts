"use server";

import { adminSession } from "@/lib/auth/app-user-session";
import { EN } from "@/lib/lang";

import { compare, hash } from "bcrypt";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function register(): Promise<{ error?: string; userId?: string }> {
  try {
    const password = "Asdfgh12345@#";

    const newUser = await prisma.admin.create({
      data: {
        email: "onlinetrustpoint@gmail.com",
        firstName: "Shamim",
        lastName: "Hossain",
        password: await hash(password, 10),
        passwordUpdatedAt: new Date(),
      },
    });

    return { userId: newUser.id };
  } catch (error: any) {
    console.error("Registration Error:", error);
    return {
      error: error.message || "Something went wrong during registration.",
    };
  }
}

export async function login(
  email: string,
  password: string,
): Promise<string | undefined> {
  const user = await prisma.admin.findUnique({
    where: { email: email },
  });
  if (!user) {
    return EN.invalidCredential;
  }

  const passwordsMatch = await compare(password, user.password);
  if (!passwordsMatch) {
    return EN.invalidCredential;
  }

  await adminSession.setUser({
    userId: user.id,
    passwordUpdatedAt: user.passwordUpdatedAt.toISOString(),
  });

  redirect("/dashboard");
}


export async function logout() {
  await adminSession.removeUser();
  redirect("/dashboard/login");
}

"use server";

import { adminSession, userSession } from "@/lib/auth/app-user-session";
import { EN } from "@/lib/lang";

import { compare, hash } from "bcrypt";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { generateOtp } from "@/lib/utils";
import { verificationOTPEmail } from "@/components/emails/verification-otp-email";
import { sendMail } from "@/lib/services/email-service";

export async function registerUser({
  fullName,
  email,
  password,
}: {
  fullName: string;
  email: string;
  password: string;
}): Promise<{ error?: string; userId?: string }> {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return {
        error: "Email already exists.",
      };
    }

    const otp = generateOtp();

    const newUser = await prisma.user.create({
      data: {
        email: email,
        fullName: fullName,
        password: await hash(password, 10),
        verificationOtp: otp,
        verificationOtpSendAt: new Date(),
        passwordUpdatedAt: new Date(),
      },
    });

    const emailHtml = verificationOTPEmail({ firstName: fullName, otp: otp });

    await sendMail({
      to: email,
      subject: "Verify your email address",
      html: emailHtml,
    });

    await userSession.setUser({
      userId: newUser.id,
      passwordUpdatedAt: newUser.passwordUpdatedAt.toISOString(),
      verified: newUser.verified,
    });
  } catch (error: any) {
    console.error("Registration Error:", error);

    return {
      error: error.message || "Something went wrong during registration.",
    };
  }

  redirect("/user/verify");
}

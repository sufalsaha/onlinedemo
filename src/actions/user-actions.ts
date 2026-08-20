"use server";

import { userSession } from "@/lib/auth/app-user-session";
import { getCurrentUser } from "@/lib/auth/user-auth";
import { canResendOtp, isOtpExpired, resendWaitSeconds } from "@/lib/auth/otp";
import { EN } from "@/lib/lang";

import { compare, hash } from "bcrypt";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { generateOtp } from "@/lib/utils";
import { verificationOTPEmail } from "@/components/emails/verification-otp-email";
import { resetPasswordOTPEmail } from "@/components/emails/reset-password-otp-email";
import { sendMail } from "@/lib/services/email-service";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyOtpSchema,
  type ForgotPasswordFormValues,
  type LoginFormValues,
  type ResetPasswordFormValues,
  type VerifyOtpFormValues,
} from "@/lib/schemas/auth";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_AVATAR_BYTES,
  changePasswordSchema,
  profileSchema,
  type ChangePasswordFormValues,
  type ProfileFormValues,
} from "@/lib/schemas/profile";
import { deleteImage, uploadFile } from "@/actions/image-action";
import { revalidatePath } from "next/cache";

type ActionError = { error?: string };

export async function registerUser({
  fullName,
  email,
  password,
  confirmPassword,
}: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<{ error?: string; userId?: string }> {
  // Server Actions are public endpoints — never trust what the form sent.
  const parsed = registerSchema.safeParse({
    fullName,
    email,
    password,
    confirmPassword,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: parsed.data.email,
      },
    });

    if (existingUser) {
      return {
        error: EN.emailAlreadyExists,
      };
    }

    const otp = generateOtp();

    const newUser = await prisma.user.create({
      data: {
        email: parsed.data.email,
        fullName: parsed.data.fullName,
        password: await hash(parsed.data.password, 10),
        verificationOtp: otp,
        verificationOtpSendAt: new Date(),
        passwordUpdatedAt: new Date(),
      },
    });

    const emailHtml = verificationOTPEmail({
      firstName: parsed.data.fullName,
      otp: otp,
    });

    await sendMail({
      to: parsed.data.email,
      subject: "Verify your email address",
      html: emailHtml,
    });

    await userSession.setUser({
      userId: newUser.id,
      passwordUpdatedAt: newUser.passwordUpdatedAt.toISOString(),
      verified: newUser.verified,
    });
  } catch (error: unknown) {
    console.error("Registration Error:", error);

    return {
      error:
        error instanceof Error ? error.message : EN.somethingWentWrong,
    };
  }

  redirect("/user/verify");
}

export async function loginUser(
  values: LoginFormValues,
): Promise<ActionError> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return { error: EN.invalidCredential };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    // Same message for "no such user" and "wrong password" so this endpoint
    // can't be used to discover which emails are registered.
    if (!user) {
      return { error: EN.invalidCredential };
    }

    const passwordsMatch = await compare(parsed.data.password, user.password);
    if (!passwordsMatch) {
      return { error: EN.invalidCredential };
    }

    await userSession.setUser({
      userId: user.id,
      passwordUpdatedAt: user.passwordUpdatedAt.toISOString(),
      verified: user.verified,
    });
  } catch (error: unknown) {
    console.error("Login Error:", error);
    return { error: EN.somethingWentWrong };
  }

  redirect("/");
}

export async function logoutUser() {
  await userSession.removeUser();
  redirect("/");
}

export async function verifyEmailOtp(
  values: VerifyOtpFormValues,
): Promise<ActionError> {
  const parsed = verifyOtpSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? EN.invalidOtp };
  }

  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return { error: EN.notLoggedIn };
    }
    if (sessionUser.verified) {
      return { error: EN.alreadyVerified };
    }

    // getCurrentUser() deliberately omits the OTP columns, so read them here.
    const record = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { verificationOtp: true, verificationOtpSendAt: true },
    });

    if (!record?.verificationOtp || record.verificationOtp !== parsed.data.code) {
      return { error: EN.invalidOtp };
    }
    if (isOtpExpired(record.verificationOtpSendAt)) {
      return { error: EN.expiredOtp };
    }

    const updated = await prisma.user.update({
      where: { id: sessionUser.id },
      data: {
        verified: true,
        verificationOtp: null,
        verificationOtpSendAt: null,
      },
    });

    // The cookie still carries verified:false — refresh it, or every
    // subsequent check would read a stale flag.
    await userSession.setUser({
      userId: updated.id,
      passwordUpdatedAt: updated.passwordUpdatedAt.toISOString(),
      verified: updated.verified,
    });
  } catch (error: unknown) {
    console.error("Verify Email Error:", error);
    return { error: EN.somethingWentWrong };
  }

  redirect("/");
}

export async function resendVerificationOtp(): Promise<
  ActionError & { success?: string }
> {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return { error: EN.notLoggedIn };
    }
    if (sessionUser.verified) {
      return { error: EN.alreadyVerified };
    }

    const record = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { verificationOtpSendAt: true },
    });

    if (!canResendOtp(record?.verificationOtpSendAt)) {
      const wait = resendWaitSeconds(record?.verificationOtpSendAt);
      return { error: `${EN.resendTooSoon} (${wait}s)` };
    }

    const otp = generateOtp();
    await prisma.user.update({
      where: { id: sessionUser.id },
      data: { verificationOtp: otp, verificationOtpSendAt: new Date() },
    });

    await sendMail({
      to: sessionUser.email,
      subject: "Verify your email address",
      html: verificationOTPEmail({ firstName: sessionUser.fullName, otp }),
    });

    return { success: EN.otpResent };
  } catch (error: unknown) {
    console.error("Resend Verification Error:", error);
    return { error: EN.somethingWentWrong };
  }
}

export async function sendPasswordResetOtp(
  values: ForgotPasswordFormValues,
): Promise<ActionError & { success?: string }> {
  const parsed = forgotPasswordSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid email address" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true, fullName: true, email: true, resetPasswordOtpSendAt: true },
    });

    // Only send when the account exists, but report success either way so
    // this endpoint can't be used to enumerate registered emails.
    if (user && canResendOtp(user.resetPasswordOtpSendAt)) {
      const otp = generateOtp();
      await prisma.user.update({
        where: { id: user.id },
        data: { resetPasswordOtp: otp, resetPasswordOtpSendAt: new Date() },
      });

      await sendMail({
        to: user.email,
        subject: "Reset your password",
        html: resetPasswordOTPEmail({ firstName: user.fullName, otp }),
      });
    }

    return { success: EN.passwordResetSent };
  } catch (error: unknown) {
    console.error("Password Reset Request Error:", error);
    return { error: EN.somethingWentWrong };
  }
}

export async function resetPassword(
  values: ResetPasswordFormValues,
): Promise<ActionError> {
  const parsed = resetPasswordSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true, resetPasswordOtp: true, resetPasswordOtpSendAt: true },
    });

    if (!user?.resetPasswordOtp || user.resetPasswordOtp !== parsed.data.code) {
      return { error: EN.invalidOtp };
    }
    if (isOtpExpired(user.resetPasswordOtpSendAt)) {
      return { error: EN.expiredOtp };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: await hash(parsed.data.password, 10),
        // getCurrentUser() compares this against the value baked into the
        // session cookie, so bumping it signs out every existing session.
        passwordUpdatedAt: new Date(),
        resetPasswordOtp: null,
        resetPasswordOtpSendAt: null,
      },
    });

    await userSession.removeUser();
  } catch (error: unknown) {
    console.error("Reset Password Error:", error);
    return { error: EN.somethingWentWrong };
  }

  redirect("/user/login");
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export async function updateProfile(
  values: ProfileFormValues,
): Promise<ActionError & { success?: string; emailChanged?: boolean }> {
  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  try {
    // The row to edit comes from the session — never from an argument — so
    // this action can only ever write the caller's own profile.
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return { error: EN.notLoggedIn };
    }

    const { fullName, email, phone, jobTitle, bio } = parsed.data;
    const emailChanged = email !== sessionUser.email;

    if (emailChanged) {
      const taken = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (taken) {
        return { error: EN.emailInUse };
      }
    }

    // Changing the login identity re-opens verification: `verified` is what
    // gates review posting, so it must not carry over to an unproven address.
    const otp = emailChanged ? generateOtp() : null;

    const updated = await prisma.user.update({
      where: { id: sessionUser.id },
      // An explicit whitelist. Nothing is spread in from the caller, so a
      // role/permission column added later still could not be set from here.
      data: {
        fullName,
        phone: phone ?? null,
        jobTitle: jobTitle ?? null,
        bio: bio ?? null,
        ...(emailChanged
          ? {
              email,
              verified: false,
              verificationOtp: otp,
              verificationOtpSendAt: new Date(),
            }
          : {}),
      },
    });

    if (emailChanged && otp) {
      // The cookie carries `verified` — leaving it true would keep the review
      // gate open on an address the user hasn't proven they own.
      await userSession.setUser({
        userId: updated.id,
        passwordUpdatedAt: updated.passwordUpdatedAt.toISOString(),
        verified: updated.verified,
      });

      await sendMail({
        to: updated.email,
        subject: "Verify your email address",
        html: verificationOTPEmail({ firstName: updated.fullName, otp }),
      });
    }

    revalidatePath("/", "layout");

    return {
      success: emailChanged ? EN.emailChangedVerify : EN.profileSaved,
      emailChanged,
    };
  } catch (error: unknown) {
    console.error("Update Profile Error:", error);
    return { error: EN.somethingWentWrong };
  }
}

export async function updateProfilePicture(
  data: FormData,
): Promise<ActionError & { success?: string; image?: string }> {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return { error: EN.notLoggedIn };
    }

    const file = data.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { error: EN.noImageSelected };
    }
    // Re-checked here because the client-side guard is only a convenience —
    // this action is a public endpoint.
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return { error: EN.invalidImageType };
    }
    if (file.size > MAX_AVATAR_BYTES) {
      return { error: EN.imageTooLarge };
    }

    const uploaded = await uploadFile(data);
    if (!uploaded?.uploadResult) {
      return { error: EN.uploadFailed };
    }

    const image = uploaded.uploadResult;

    const previous = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { image: true },
    });

    await prisma.user.update({
      where: { id: sessionUser.id },
      data: { image },
    });

    await discardImage(previous?.image);

    revalidatePath("/", "layout");

    return { success: EN.pictureUpdated, image };
  } catch (error: unknown) {
    console.error("Update Profile Picture Error:", error);
    return { error: EN.somethingWentWrong };
  }
}

export async function removeProfilePicture(): Promise<
  ActionError & { success?: string }
> {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return { error: EN.notLoggedIn };
    }

    const current = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { image: true },
    });

    await prisma.user.update({
      where: { id: sessionUser.id },
      data: { image: null },
    });

    await discardImage(current?.image);

    revalidatePath("/", "layout");

    return { success: EN.pictureRemoved };
  } catch (error: unknown) {
    console.error("Remove Profile Picture Error:", error);
    return { error: EN.somethingWentWrong };
  }
}

/**
 * Best-effort cleanup of a replaced avatar. The database is already correct by
 * the time this runs, so a storage failure must not fail the user's save.
 */
async function discardImage(image: string | null | undefined) {
  if (!image) return;

  try {
    await deleteImage({ imageName: image });
  } catch (error: unknown) {
    console.warn("Could not delete old profile picture:", error);
  }
}

export async function changePassword(
  values: ChangePasswordFormValues,
): Promise<ActionError & { success?: string }> {
  const parsed = changePasswordSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return { error: EN.notLoggedIn };
    }

    const record = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { password: true },
    });
    if (!record) {
      return { error: EN.notLoggedIn };
    }

    const matches = await compare(parsed.data.currentPassword, record.password);
    if (!matches) {
      return { error: EN.incorrectCurrentPassword };
    }

    const updated = await prisma.user.update({
      where: { id: sessionUser.id },
      data: {
        password: await hash(parsed.data.newPassword, 10),
        // Invalidates every session, since getCurrentUser() compares this
        // against the timestamp baked into the cookie.
        passwordUpdatedAt: new Date(),
      },
    });

    // ...including this one — so re-issue the cookie, or the user would be
    // signed out of the device they just changed the password on. Sessions
    // elsewhere stay invalidated, which is the point.
    await userSession.setUser({
      userId: updated.id,
      passwordUpdatedAt: updated.passwordUpdatedAt.toISOString(),
      verified: updated.verified,
    });

    return { success: EN.passwordChanged };
  } catch (error: unknown) {
    console.error("Change Password Error:", error);
    return { error: EN.somethingWentWrong };
  }
}

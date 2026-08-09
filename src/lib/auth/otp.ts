// Both OTP email templates tell the user the code is valid for 10 minutes,
// so that's the window enforced here.
export const OTP_TTL_MS = 10 * 60 * 1000;

// How long a user has to wait before asking for another code.
export const RESEND_COOLDOWN_MS = 60 * 1000;

export function isOtpExpired(sentAt: Date | null | undefined): boolean {
  if (!sentAt) return true;
  return Date.now() - sentAt.getTime() > OTP_TTL_MS;
}

export function canResendOtp(sentAt: Date | null | undefined): boolean {
  if (!sentAt) return true;
  return Date.now() - sentAt.getTime() >= RESEND_COOLDOWN_MS;
}

export function resendWaitSeconds(sentAt: Date | null | undefined): number {
  if (!sentAt) return 0;
  const remaining = RESEND_COOLDOWN_MS - (Date.now() - sentAt.getTime());
  return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
}

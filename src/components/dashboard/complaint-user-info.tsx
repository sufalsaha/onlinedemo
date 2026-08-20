"use client";

import { Mail, Phone, User, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ComplaintUserInfoProps {
  user?: {
    fullName: string;
    email: string;
    phone?: string | null;
    image?: string | null;
  };
  fallbackInfo: {
    fullName: string;
    email?: string | null;
    mobile: string;
  };
}

export function ComplaintUserInfo({ user, fallbackInfo }: ComplaintUserInfoProps) {
  // Determine if this is a registered user or guest submission
  const isRegisteredUser = !!user;

  // Use user data if available, otherwise fall back to complaint fields
  const displayName = user?.fullName || fallbackInfo.fullName;
  const displayEmail = user?.email || fallbackInfo.email;
  const displayPhone = user?.phone || fallbackInfo.mobile;
  const displayImage = user?.image;

  return (
    <div className="space-y-4">
      {/* User Profile Section */}
      <div className="flex items-start gap-4">
        <Avatar className="w-16 h-16">
          {displayImage ? (
            <AvatarImage src={displayImage} alt={displayName} />
          ) : null}
          <AvatarFallback>
            <UserCircle className="w-8 h-8" />
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg">{displayName}</h3>
            {isRegisteredUser && (
              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                Registered User
              </span>
            )}
          </div>

          <div className="space-y-2 mt-3">
            {displayEmail && (
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <a
                  href={`mailto:${displayEmail}`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {displayEmail}
                </a>
              </div>
            )}

            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <a
                href={`tel:${displayPhone}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {displayPhone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Full Name</p>
          <p className="text-sm font-medium">{displayName}</p>
        </div>

        {displayEmail && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Email</p>
            <p className="text-sm font-medium">{displayEmail}</p>
          </div>
        )}

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Phone</p>
          <p className="text-sm font-medium">{displayPhone}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">User Type</p>
          <p className="text-sm font-medium">
            {isRegisteredUser ? "Registered User" : "Guest Submission"}
          </p>
        </div>
      </div>
    </div>
  );
}
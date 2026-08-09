"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut, MailWarning, RotateCw, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logoutUser } from "@/actions/user-actions";

export type SessionUser = {
  fullName: string;
  image: string | null;
  verified: boolean;
};

/** Shared with AvatarUpload so both fallbacks read the same. */
export function initials(fullName: string) {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function UserMenu({
  user,
  onNavigate,
}: {
  user: SessionUser;
  onNavigate?: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="outline-none cursor-pointer" aria-label="Account menu">
          <Avatar className="h-9 w-9 border border-slate-200">
            {user.image && (
              <AvatarImage src={user.image} alt={user.fullName} />
            )}
            <AvatarFallback>{initials(user.fullName)}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-2">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.fullName}</p>
            {!user.verified && (
              <p className="text-xs leading-none text-muted-foreground">
                Email not verified
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/user/profile" onClick={onNavigate}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        {!user.verified && (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/user/verify" onClick={onNavigate}>
              <MailWarning className="mr-2 h-4 w-4" />
              <span>Verify your email</span>
            </Link>
          </DropdownMenuItem>
        )}
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LogoutButton() {
  const [pending, setPending] = useState(false);

  async function onLogoutClick() {
    setPending(true);
    await logoutUser();
    setPending(false);
  }

  return (
    <DropdownMenuItem
      disabled={pending}
      className="cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onLogoutClick();
      }}
    >
      {pending ? (
        <RotateCw className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="mr-2 h-4 w-4" />
      )}
      Log out
    </DropdownMenuItem>
  );
}

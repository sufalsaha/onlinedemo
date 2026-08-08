"use client";

import { Bell, LogOut, RotateCw, Settings, User } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import Link from "next/link";
import { convertToUpperSpaceSeparated } from "@/lib/utils";
import { useState } from "react";
import { logout } from "@/actions/admin-actions";



export default function AppNavbar({ fullName, email }: { fullName: string; email: string }) {
    const pathname = usePathname() || "";


  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
  <Breadcrumb>
      <BreadcrumbList>
        {pathname
          .split("/")
          .slice(1, -1)
          .map((p, i) => {
            return (
              <div key={i} className="flex items-center">
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link
                      href={pathname
                        .split("/")
                        .slice(0, i + 2)
                        .join("/")}
                    >
                      {convertToUpperSpaceSeparated(p)}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
              </div>
            );
          })}

        <BreadcrumbItem>
          <BreadcrumbPage>
            {convertToUpperSpaceSeparated(pathname.split("/").slice(-1)[0])}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

              {/* <h1 className="hidden md:block text-sm font-medium text-slate-500">Dashboard{pathname === "/dashboard" ? "" : ` / ${pathname.split("/").pop()}`}</h1> */}
            </div>

            {/* Right Side: Profile & Notifications */}
            <div className="flex items-center gap-4">
              {/* Notification Bell (Optional) */}
              <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
                <Bell className="w-5 h-5" />
              </button>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="outline-none">
                    <Avatar className="h-9 w-9 border border-slate-200">
                      <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                      <AvatarFallback>SS</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{fullName}</p>
                      <p className="text-xs leading-none text-muted-foreground italic">
                        {email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <LogoutButton />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
  );
}


function LogoutButton() {
  const [pending, setPending] = useState(false);
  async function onLogoutClick() {
    setPending(true);
    await logout();
    setPending(false);
  }
  return (
    <DropdownMenuItem
      disabled={pending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onLogoutClick();
      }}
    >
      {pending ? <RotateCw className="animate-spin" /> : <LogOut />}
      Log out
    </DropdownMenuItem>
  );
}

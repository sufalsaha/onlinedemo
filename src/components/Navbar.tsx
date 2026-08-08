

"use client";

import { Button } from "@/components/ui/button";

import { MessageSquare, Search } from "lucide-react";
import menu from "@/assets/menu-2-line.svg";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
// import { Logo } from "../Logo";
import logo from "@/assets/logo.svg";
import Image from "next/image";
import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Businesses", href: "/businesses" },
    { name: "About", href: "/about" },
    { name: "Blogs", href: "/blogs" },
    { name: "Contact", href: "/contact" },
  ];

  const closeSidebar = () => setOpen(false);

  return (
    <header className="sticky top-0 left-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm flex items-center justify-center h-15 md:h-20">
      <div className="container px-4 flex h-15 md:h-20 items-center justify-between">
        <Link href="/">
          {/* <Logo className="scale-90 origin-left" /> */}
          <Image src={logo} alt="Logo" className="w-45 md:w-60 " />
        </Link>

        <div className="hidden xl:flex items-center gap-6">
          <nav className="flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="transition-colors hover:text-[#00C085] text-foreground/80"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Link href={"/user/login"}>
            <button className="bg-[#1D1919] text-white rounded-full px-5 py-2 text-[14px] font-medium hover:bg-[#333] transition-colors cursor-pointer">
              Login
            </button>
            </Link>
          </div>
        </div>

        <div className="xl:hidden flex items-center gap-4">
          <div><Search className="text-[#5F6572]" /></div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              {/* <Button variant="ghost" size="icon" className="h-20 w-20">
                <Menu className="h-20 w-20" />
              </Button> */}
              <Image
                src={menu}
                alt="menu icon"
                className="md:size-[30px] xl:hidden cursor-pointer"
              />
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-4">
              <SheetHeader>
                <SheetTitle></SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeSidebar}
                    className="block px-2 py-1 text-lg hover:text-[#EF3340] font-medium"
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="mt-8 flex flex-col gap-4">
                  <Link href={"/user/login"}>
                  <button className="bg-[#1D1919] text-white rounded-full px-5 py-2 text-[14px] font-medium hover:bg-[#333] transition-colors cursor-pointer">
                    Login
                  </button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

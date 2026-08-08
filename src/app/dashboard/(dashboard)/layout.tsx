import AppNavbar from "@/components/dashboard/app-navber"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip" 
import { getCurrentAdmin } from "@/lib/auth/user-auth";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {

 const user = await getCurrentAdmin();
  if (!user) {
    redirect("/dashboard/login");
  }



  return (
    <SidebarProvider>
      {/* 2. Wrap the sidebar and main content inside TooltipProvider */}
      <TooltipProvider delayDuration={0}>
        <div className="flex h-screen w-full bg-slate-50/50">
          <AppSidebar />
          <main className="flex-1 overflow-y-auto">
            {/* Top Header */}
            <AppNavbar fullName={`${user.firstName} ${user.lastName}`} email={user.email} />
            {children}
          </main>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  )
}
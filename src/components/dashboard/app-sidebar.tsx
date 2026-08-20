"use client";


// components/app-sidebar.tsx
import {  LayoutDashboard, Settings, Users, PieChart, FileText, AlertCircle } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

const items = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Category", url: "/dashboard/category", icon: LayoutDashboard },
  { title: "Businesses", url: "/dashboard/business ", icon: PieChart },
  { title: "review", url: "/dashboard/review", icon: Users },
  { title: "Complaints", url: "/dashboard/complaint", icon: AlertCircle },
  { title: "Blog", url: "/dashboard/blog", icon: FileText },
  { title: "Settings", url: "#", icon: Settings },
];

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-600 font-bold px-4 py-6 text-xl">
            onlinetrustpoint
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url} className="flex items-center gap-3 p-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

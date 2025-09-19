
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Stethoscope,
  UtensilsCrossed,
  Dumbbell,
  Brain,
  Activity,
  User,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/book-appointment", icon: Stethoscope, label: "Book Appointment" },
  { href: "/doctor-dashboard", icon: LayoutDashboard, label: "Doctor Dashboard" },
  { href: "/diet", icon: UtensilsCrossed, label: "Diet" },
  { href: "/workout", icon: Dumbbell, label: "Workout" },
  { href: "/mental-boost", icon: Brain, label: "Mental Boost" },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2">
           <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="font-headline text-xl font-bold text-foreground">LifeBoost</h1>
        </div>
      </SidebarHeader>
      <SidebarMenu className="flex-1 p-2">
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
             <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
       <SidebarFooter className="p-2">
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Logout">
            <Link href="/login">
              <LogOut />
              <span>Logout</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}

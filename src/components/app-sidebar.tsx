"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Droplets,
  UtensilsCrossed,
  Dumbbell,
  Flower2,
  BedDouble,
  Activity,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
  { href: "/water", icon: <Droplets />, label: "Water" },
  { href: "/diet", icon: <UtensilsCrossed />, label: "Diet" },
  { href: "/workout", icon: <Dumbbell />, label: "Workout" },
  { href: "/meditation", icon: <Flower2 />, label: "Meditation" },
  { href: "/sleep", icon: <BedDouble />, label: "Sleep" },
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
            <Link href={item.href} asChild>
              <SidebarMenuButton
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                {item.icon}
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarFooter className="hidden md:flex">
         <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}

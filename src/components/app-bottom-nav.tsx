
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Droplets,
  UtensilsCrossed,
  Dumbbell,
  Flower2,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/diet", icon: UtensilsCrossed, label: "Diet" },
  { href: "/workout", icon: Dumbbell, label: "Workout" },
  { href: "/meditation", icon: Flower2, label: "Meditation" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function AppBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t bg-background/95 backdrop-blur-sm lg:hidden">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => (
          <Link href={item.href} key={item.href}>
            <div
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-md transition-colors",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}

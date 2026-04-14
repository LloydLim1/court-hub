"use client";

import {
  LayoutDashboard,
  LogOut,
  MonitorPlay,
  Package,
  Settings2,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "../../lib/utils";

const navigation = [
  { href: "/executive", label: "Executive", icon: LayoutDashboard, managerOnly: true },
  { href: "/operations", label: "Operations", icon: MonitorPlay },
  { href: "/bookings/new", label: "New Booking", icon: ShieldCheck },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/pricing", label: "Pricing", icon: Settings2, managerOnly: true },
  { href: "/staff", label: "Staff", icon: Users },
  { href: "/display", label: "Display", icon: MonitorPlay },
];

export function AppShell({
  children,
  role,
}: {
  children: React.ReactNode;
  role: "manager" | "front_desk";
}) {
  const pathname = usePathname();
  const router = useRouter();

  const filteredNavigation = navigation.filter((item) => !item.managerOnly || role === "manager");

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-72 flex-col border-r border-slate-800/70 bg-slate-950/70 px-5 py-6 backdrop-blur xl:flex">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300">CourtHub</p>
          <h1 className="display-heading mt-4 text-3xl font-semibold text-white">Shift control</h1>
          <p className="mt-3 text-sm text-slate-400">
            {role === "manager" ? "Manager / Owner workspace" : "Front desk operations workspace"}
          </p>
        </div>
        <nav className="mt-10 flex flex-1 flex-col gap-2">
          {filteredNavigation.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                className={cn(
                  "flex items-center gap-3 rounded-[20px] px-4 py-3 text-sm transition",
                  active
                    ? "bg-sky-400/14 text-white shadow-[0_16px_36px_rgba(14,165,233,0.12)]"
                    : "text-slate-400 hover:bg-slate-900/80 hover:text-white",
                )}
                href={item.href}
                key={item.href}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          className="mt-6 flex items-center gap-3 rounded-[20px] border border-slate-800 px-4 py-3 text-sm text-slate-300"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-800/70 bg-slate-950/60 px-4 py-4 backdrop-blur md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Live Facility Workspace</p>
              <h2 className="display-heading mt-1 text-2xl font-semibold text-white">CourtHub SportCenter Pro</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="glass-card rounded-full px-4 py-2">WebSocket Connected</span>
              <span className="glass-card rounded-full px-4 py-2">Zero-conflict engine active</span>
              <span className="glass-card rounded-full px-4 py-2">Grace window: 15 minutes</span>
            </div>
          </div>
        </header>
        <div className="flex-1 px-4 py-6 md:px-8">{children}</div>
      </div>
    </div>
  );
}

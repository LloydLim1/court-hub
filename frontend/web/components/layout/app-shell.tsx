"use client";

import { CalendarDays, Home, LogOut, ShieldCheck, UserCircle2 } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";

import type { AppSession } from "../../lib/auth";
import { cn } from "../../lib/utils";

const userNavigation = [
  { href: "/", label: "Discover", icon: Home },
  { href: "/dashboard", label: "My bookings", icon: CalendarDays },
];

const adminNavigation = [
  { href: "/", label: "Marketplace", icon: Home },
  { href: "/dashboard", label: "Player view", icon: UserCircle2 },
  { href: "/admin", label: "Admin view", icon: ShieldCheck },
];

export function AppShell({ children, session }: { children: React.ReactNode; session: AppSession }) {
  const pathname = usePathname();
  const router = useRouter();
  const navigation = session.role === "admin" ? adminNavigation : userNavigation;

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] pb-24">
      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <Link className="flex items-center gap-3" href="/">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-base font-bold text-white">
              CH
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950">CourtHub</p>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                {session.role === "admin" ? "Vendor admin" : "Player"}
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
              <Link className={active ? "nav-pill nav-pill-active" : "nav-pill"} href={item.href as Route} key={item.href}>
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 sm:block">
              {session.name}
            </div>
            <button className="secondary-button" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">{children}</main>

      <nav className="fixed inset-x-4 bottom-4 z-50 rounded-3xl border border-slate-200 bg-white/94 p-2 shadow-[0_20px_40px_rgba(15,23,42,0.14)] md:hidden">
        <div className={`grid gap-2 ${navigation.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                className={cn(
                  "flex flex-col items-center justify-center rounded-2xl px-3 py-2 text-xs font-medium",
                  active ? "bg-blue-600 text-white" : "text-slate-500",
                )}
                href={item.href as Route}
                key={item.href}
              >
                <Icon className="mb-1 h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

import { cookies } from "next/headers";

import { AppShell } from "../../components/layout/app-shell";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = ((await cookies()).get("courthub_role")?.value ?? "front_desk") as
    | "manager"
    | "front_desk";

  return <AppShell role={role}>{children}</AppShell>;
}

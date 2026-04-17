import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AppShell } from "../../components/layout/app-shell";
import { createSessionFromIdentity } from "../../lib/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const email = cookieStore.get("courthub_email")?.value;
  const role = cookieStore.get("courthub_role")?.value;

  if (!email || !role) {
    redirect("/login");
  }

  const session = createSessionFromIdentity({
    email,
    name: cookieStore.get("courthub_name")?.value,
    role,
  });

  return <AppShell session={session}>{children}</AppShell>;
}

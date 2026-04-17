import { cookies } from "next/headers";

import { UserDashboard } from "../../../components/dashboard/user-dashboard";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  return <UserDashboard userName={cookieStore.get("courthub_name")?.value ?? "Player"} />;
}

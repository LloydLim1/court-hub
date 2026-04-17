import { cookies } from "next/headers";

import { AdminDashboard } from "../../../components/dashboard/admin-dashboard";

export default async function AdminPage() {
  const cookieStore = await cookies();
  return (
    <AdminDashboard
      userName={cookieStore.get("courthub_name")?.value ?? "Admin"}
      vendorId={cookieStore.get("courthub_vendor_id")?.value}
    />
  );
}

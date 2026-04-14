import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getRoleHome } from "../lib/auth";

export default async function HomePage() {
  const role = (await cookies()).get("courthub_role")?.value;

  redirect(role ? getRoleHome(role) : "/login");
}

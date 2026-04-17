import { cookies } from "next/headers";

import { LandingPage } from "../components/home/landing-page";

export default async function HomePage() {
  const cookieStore = await cookies();

  return (
    <LandingPage
      role={cookieStore.get("courthub_role")?.value ?? null}
      userName={cookieStore.get("courthub_name")?.value ?? null}
    />
  );
}

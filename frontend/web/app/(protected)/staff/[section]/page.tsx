import { notFound } from "next/navigation";

import { FeatureDashboard } from "../../../../components/dashboard/feature-dashboard";

const validSections = new Set(["messages", "shift-logs", "incidents", "schedule"]);

export default async function StaffSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!validSections.has(section)) notFound();

  return <FeatureDashboard scope="staff" section={section} />;
}

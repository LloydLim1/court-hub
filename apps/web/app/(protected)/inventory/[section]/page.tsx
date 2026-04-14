import { notFound } from "next/navigation";

import { FeatureDashboard } from "../../../../components/dashboard/feature-dashboard";

const validSections = new Set(["maintenance", "damages", "low-stock", "history"]);

export default async function InventorySectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!validSections.has(section)) notFound();

  return <FeatureDashboard scope="inventory" section={section} />;
}

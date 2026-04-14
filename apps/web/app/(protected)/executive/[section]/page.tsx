import { notFound } from "next/navigation";

import { FeatureDashboard } from "../../../../components/dashboard/feature-dashboard";

const validSections = new Set([
  "revenue",
  "forecasting",
  "equipment-revenue",
  "customers",
  "reports",
]);

export default async function ExecutiveSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!validSections.has(section)) notFound();

  return <FeatureDashboard scope="executive" section={section} />;
}

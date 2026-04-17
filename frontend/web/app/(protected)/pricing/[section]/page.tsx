import { notFound } from "next/navigation";

import { FeatureDashboard } from "../../../../components/dashboard/feature-dashboard";

const validSections = new Set(["peak-hours", "special-days", "history", "simulator"]);

export default async function PricingSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!validSections.has(section)) notFound();

  return <FeatureDashboard scope="pricing" section={section} />;
}

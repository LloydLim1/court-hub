import { notFound } from "next/navigation";

import { FeatureDashboard } from "../../../../components/dashboard/feature-dashboard";

const validSections = new Set(["calendar", "transitions", "no-shows", "check-in", "today"]);

export default async function OperationsSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!validSections.has(section)) notFound();

  return <FeatureDashboard scope="operations" section={section} />;
}

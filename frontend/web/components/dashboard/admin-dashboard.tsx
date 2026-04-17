import { marketplaceVendors } from "@courthub/domain";

import { AvailabilityBrowser } from "../booking/availability-browser";
import { AdminScheduleBoard } from "./admin-schedule-board";

export function AdminDashboard({
  userName,
  vendorId,
}: {
  userName: string;
  vendorId?: string;
}) {
  const activeVendorId = vendorId ?? marketplaceVendors[0]?.id;
  const vendor = marketplaceVendors.find((item) => item.id === activeVendorId) ?? marketplaceVendors[0];

  return (
    <div className="page-shell">
      <section className="hero-panel">
        <p className="eyebrow text-blue-700">Admin Workspace</p>
        <h1 className="display-heading mt-3 text-4xl font-semibold text-slate-950 md:text-5xl">
          {userName}, manage {vendor?.name} like a premium multi-vendor sports venue.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          Review schedule health, create court holds, add new courts, and keep the marketplace availability clean.
        </p>
      </section>

      <AdminScheduleBoard vendorId={activeVendorId} />

      <AvailabilityBrowser
        description="Admins can use the same live browser to place schedule holds, test slot availability, and validate court buffers."
        mode="admin"
        title="Create schedule holds from live availability"
      />
    </div>
  );
}

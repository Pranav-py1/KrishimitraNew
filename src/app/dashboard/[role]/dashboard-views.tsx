
'use client';

import FarmerDashboard from '@/app/farmer/dashboard/page';
import ConsumerDashboard from '@/app/consumer/dashboard/page';
import AdminDashboard from '@/app/admin/dashboard/page';
import ExporterDashboard from '@/app/exporter/dashboard/page';

/**
 * Mapping of user roles to their respective dashboard components.
 */
export const RoleDashboards: Record<string, React.ComponentType> = {
  farmer: FarmerDashboard,
  consumer: ConsumerDashboard,
  admin: AdminDashboard,
  exporter: ExporterDashboard,
};

import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { formatPrice } from '@updesh/shared-types';
import { api } from '../lib/api';

export function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.admin.dashboard(),
  });

  return (
    <>
      <Helmet><title>Dashboard — Admin — Updesh Residency</title></Helmet>
      <div className="max-w-container mx-auto px-4 md:px-10 py-8">
        <h1 className="text-2xl font-medium mb-6">Admin Dashboard</h1>

        {isLoading ? (
          <p>Loading...</p>
        ) : data ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Users', value: data.totalUsers },
                { label: 'Total Properties', value: data.totalProperties },
                { label: 'Live', value: data.liveProperties },
                { label: 'Pending Review', value: data.pendingProperties },
                { label: 'Total Leads', value: data.totalLeads },
                { label: 'New Leads', value: data.newLeads },
                { label: 'Inventory Value', value: formatPrice(data.inventoryValue) },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-outline rounded-sm p-4">
                  <p className="text-2xl font-medium">{s.value}</p>
                  <p className="text-xs text-onSurface-variant uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>

            <h2 className="text-lg font-medium mb-4">City Distribution</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {Object.entries(data.cityCounts).map(([city, count]) => (
                <div key={city} className="bg-surface-dim border border-outline rounded-sm p-4">
                  <p className="font-medium text-lg">{count}</p>
                  <p className="text-sm text-onSurface-variant">{city}</p>
                </div>
              ))}
            </div>

            <h2 className="text-lg font-medium mb-4">Quick Links</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Approvals', to: '/admin/approvals' },
                { label: 'Users', to: '/admin/users' },
                { label: 'Properties', to: '/admin/properties' },
                { label: 'Leads', to: '/admin/leads' },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="flex items-center justify-center p-4 bg-primary text-white rounded-sm font-medium hover:bg-primary/90 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </>
        ) : (
          <p>Error loading dashboard.</p>
        )}
      </div>
    </>
  );
}

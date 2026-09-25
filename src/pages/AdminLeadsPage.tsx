import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import type { Property } from '@updesh/shared-types';
import { formatPrice } from '@updesh/shared-types';
import { api } from '../lib/api';
import { StatusBadge } from '../components/Chip';

export function AdminLeadsPage() {
  const [status, setStatus] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['admin-leads', status],
    queryFn: () => api.admin.leads(status ? { status } : undefined),
  });

  return (
    <>
      <Helmet><title>Leads Inbox — Admin</title></Helmet>
      <div className="max-w-container mx-auto px-4 md:px-10 py-8">
        <h1 className="text-2xl font-medium mb-2">Leads Inbox</h1>
        <p className="text-onSurface-variant mb-8">All viewing requests, call-backs, and notify-me submissions.</p>

        <div className="mb-6">
          <select
            className="input-field w-auto"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : data?.leads.length === 0 ? (
          <p className="text-onSurface-variant">No leads found.</p>
        ) : (
          <div className="bg-white border border-outline rounded-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface-dim text-left">
                <tr>
                  <th className="p-4 font-medium">Contact</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Property</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.leads.map((lead) => {
                  const property = lead.propertyId as Property | undefined;
                  return (
                    <tr key={lead._id ?? lead.id} className="border-t border-outline">
                      <td className="p-4">
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-onSurface-variant">{lead.phone}</p>
                        {lead.message && <p className="text-xs text-onSurface-variant mt-1">{lead.message}</p>}
                      </td>
                      <td className="p-4 capitalize">{lead.type.replace('_', ' ')}</td>
                      <td className="p-4">
                        {property && typeof property !== 'string' ? (
                          <>
                            <p>{property.title ?? property.locality}</p>
                            <p className="text-onSurface-variant">{formatPrice(property.price)}</p>
                          </>
                        ) : (
                          <span className="text-onSurface-variant">General enquiry</span>
                        )}
                      </td>
                      <td className="p-4 text-onSurface-variant">
                        {new Date(lead.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="p-4"><StatusBadge status={lead.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

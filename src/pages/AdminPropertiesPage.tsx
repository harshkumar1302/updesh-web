import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { formatPrice, propertyId } from '@updesh/shared-types';
import type { User } from '@updesh/shared-types';
import { api } from '../lib/api';
import { Button } from '../components/Button';
import { StatusBadge, Chip } from '../components/Chip';

export function AdminPropertiesPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-properties', statusFilter, cityFilter],
    queryFn: () => api.admin.allProperties({
      ...(statusFilter && { status: statusFilter }),
      ...(cityFilter && { city: cityFilter })
    }),
  });

  const toggleFeatured = useMutation({
    mutationFn: (id: string) => api.admin.toggleFeatured(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-properties'] }),
  });

  return (
    <>
      <Helmet><title>Properties — Admin — Updesh Residency</title></Helmet>
      <div className="max-w-container mx-auto px-4 md:px-10 py-8">
        <h1 className="text-2xl font-medium mb-6">Properties Management</h1>

        <div className="mb-6 flex flex-wrap gap-4">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-outline rounded-sm px-3 py-2 bg-white"
          >
            <option value="">All Statuses</option>
            <option value="live">Live</option>
            <option value="pending_review">Pending Review</option>
            <option value="rejected">Rejected</option>
            <option value="sold">Sold</option>
          </select>
          
          <select 
            value={cityFilter} 
            onChange={(e) => setCityFilter(e.target.value)}
            className="border border-outline rounded-sm px-3 py-2 bg-white"
          >
            <option value="">All Cities</option>
            <option value="Delhi">Delhi</option>
            <option value="Gurugram">Gurugram</option>
            <option value="Noida">Noida</option>
            <option value="Ghaziabad">Ghaziabad</option>
            <option value="Faridabad">Faridabad</option>
          </select>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="bg-white border border-outline rounded-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead className="bg-surface-dim text-left">
                <tr>
                  <th className="p-4 font-medium">Property Details</th>
                  <th className="p-4 font-medium">Location & Price</th>
                  <th className="p-4 font-medium">Seller</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.properties.map((p) => {
                  const seller = p.sellerId as User;
                  return (
                    <tr key={propertyId(p)} className="border-t border-outline">
                      <td className="p-4">
                        <p className="font-medium">{p.title}</p>
                        <div className="flex gap-2 mt-1">
                          <Chip>{p.type}</Chip>
                          <Chip>{p.bhk} BHK</Chip>
                        </div>
                      </td>
                      <td className="p-4">
                        <p>{p.locality}, {p.city}</p>
                        <p className="font-medium">{formatPrice(p.price)}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">{seller?.name ?? 'Unknown'}</p>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={p.status} />
                        {p.featured && <span className="ml-2 text-xs font-bold text-primary">FEATURED</span>}
                      </td>
                      <td className="p-4">
                        <Button 
                          variant={p.featured ? "secondary" : "primary"}
                          onClick={() => toggleFeatured.mutate(propertyId(p))}
                          disabled={toggleFeatured.isPending}
                        >
                          {p.featured ? 'Unfeature' : 'Make Featured'}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="p-4 bg-surface-dim text-sm text-onSurface-variant">
              Showing {data?.properties.length} of {data?.total} properties
            </div>
          </div>
        )}
      </div>
    </>
  );
}

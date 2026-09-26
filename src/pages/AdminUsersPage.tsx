import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import type { UserRole } from '@updesh/shared-types';
import { api } from '../lib/api';
import { Chip } from '../components/Chip';

export function AdminUsersPage() {
  const [roleFilter, setRoleFilter] = useState<string>('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', roleFilter],
    queryFn: () => api.admin.users(roleFilter ? { role: roleFilter } : undefined),
  });

  const updateRole = useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) => api.admin.updateUserRole(id, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  return (
    <>
      <Helmet><title>Users — Admin — Updesh Residency</title></Helmet>
      <div className="max-w-container mx-auto px-4 md:px-10 py-8">
        <h1 className="text-2xl font-medium mb-6">Users Management</h1>

        <div className="mb-6 flex gap-4">
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-outline rounded-sm px-3 py-2 bg-white"
          >
            <option value="">All Roles</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="bg-white border border-outline rounded-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead className="bg-surface-dim text-left">
                <tr>
                  <th className="p-4 font-medium">User Details</th>
                  <th className="p-4 font-medium">Contact</th>
                  <th className="p-4 font-medium">Joined</th>
                  <th className="p-4 font-medium">Stats</th>
                  <th className="p-4 font-medium">Role</th>
                </tr>
              </thead>
              <tbody>
                {data?.users.map((u) => (
                  <tr key={u.id} className="border-t border-outline">
                    <td className="p-4">
                      <p className="font-medium">{u.name}</p>
                      <Chip>{u.role}</Chip>
                    </td>
                    <td className="p-4">
                      <p>{u.email}</p>
                      <p className="text-onSurface-variant">{u.phone}</p>
                    </td>
                    <td className="p-4 text-onSurface-variant">
                      {new Date(u.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-4">
                      <p>Listings: {u.listingsCount}</p>
                      <p>Leads: {u.leadsCount}</p>
                    </td>
                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={(e) => updateRole.mutate({ id: u.id, role: e.target.value as UserRole })}
                        disabled={updateRole.isPending}
                        className="border border-outline rounded-sm px-2 py-1 bg-white text-sm"
                      >
                        <option value="buyer">Buyer</option>
                        <option value="seller">Seller</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 bg-surface-dim text-sm text-onSurface-variant">
              Showing {data?.users.length} of {data?.total} users
            </div>
          </div>
        )}
      </div>
    </>
  );
}

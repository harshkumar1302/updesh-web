import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import type { User } from '@updesh/shared-types';
import { formatPrice, propertyId } from '@updesh/shared-types';
import { api } from '../lib/api';
import { Button } from '../components/Button';
import { StatusBadge, Chip } from '../components/Chip';

export function AdminApprovalsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-pending'],
    queryFn: () => api.admin.pendingListings(),
  });

  const approve = useMutation({
    mutationFn: (id: string) => api.admin.updateListing(id, 'approve'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-pending'] }),
  });

  const reject = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      api.admin.updateListing(id, 'reject', reason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-pending'] }),
  });

  return (
    <>
      <Helmet><title>Pending Approvals — Admin</title></Helmet>
      <div className="max-w-container mx-auto px-4 md:px-10 py-8">
        <h1 className="text-2xl font-medium mb-2">Pending Approvals</h1>
        <p className="text-onSurface-variant mb-8">Review and manage property submissions requiring authorization.</p>

        {isLoading ? (
          <p>Loading...</p>
        ) : data?.listings.length === 0 ? (
          <p className="text-onSurface-variant">No pending listings.</p>
        ) : (
          <>
          <div className="md:hidden space-y-4">
            {data?.listings.map((p) => {
              const seller = p.sellerId as User;
              return (
                <div key={propertyId(p)} className="bg-white border border-outline rounded-sm p-4 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-medium">{p.title}</p>
                      <p className="text-sm text-onSurface-variant">{p.locality}, {p.city}</p>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="flex gap-2">
                    <Chip>{formatPrice(p.price)}</Chip>
                    <Chip>{p.bhk} BHK</Chip>
                  </div>
                  <p className="text-sm text-onSurface-variant">
                    {seller?.name ?? 'Unknown'} · {new Date(p.createdAt).toLocaleDateString('en-IN')}
                  </p>
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={() => approve.mutate(propertyId(p))} disabled={approve.isPending}>
                      Approve
                    </Button>
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() => reject.mutate({ id: propertyId(p), reason: 'Does not meet listing guidelines' })}
                      disabled={reject.isPending}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="hidden md:block bg-white border border-outline rounded-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface-dim text-left">
                <tr>
                  <th className="p-4 font-medium">Submitter</th>
                  <th className="p-4 font-medium">Property Details</th>
                  <th className="p-4 font-medium">Submission Date</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.listings.map((p) => {
                  const seller = p.sellerId as User;
                  return (
                    <tr key={propertyId(p)} className="border-t border-outline">
                      <td className="p-4">
                        <p className="font-medium">{seller?.name ?? 'Unknown'}</p>
                        <p className="text-onSurface-variant capitalize">{seller?.role ?? 'seller'}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">{p.title}</p>
                        <p className="text-onSurface-variant">{p.locality}, {p.city}</p>
                        <div className="flex gap-2 mt-1">
                          <Chip>{formatPrice(p.price)}</Chip>
                          <Chip>{p.bhk} BHK</Chip>
                        </div>
                      </td>
                      <td className="p-4 text-onSurface-variant">
                        {new Date(p.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </td>
                      <td className="p-4"><StatusBadge status={p.status} /></td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => approve.mutate(propertyId(p))}
                            disabled={approve.isPending}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => reject.mutate({ id: propertyId(p), reason: 'Does not meet listing guidelines' })}
                            disabled={reject.isPending}
                          >
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="p-4 bg-surface-dim text-sm text-onSurface-variant flex justify-between">
              <span>Showing {data?.listings.length} of {data?.total} pending items</span>
            </div>
          </div>
          </>
        )}
      </div>
    </>
  );
}

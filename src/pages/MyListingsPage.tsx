import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { formatListingPrice, propertyId } from '@updesh/shared-types';
import { DEFAULT_PROPERTY_IMAGE } from '../lib/property-images';
import { api } from '../lib/api';
import { Button } from '../components/Button';
import { StatusBadge, Chip } from '../components/Chip';
import { PropertyGridSkeleton } from '../components/Skeleton';

export function MyListingsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-listings'],
    queryFn: () => api.users.myListings(),
  });

  return (
    <>
      <Helmet><title>My Listings — Updesh Residency</title></Helmet>
      <div className="max-w-container mx-auto px-4 md:px-10 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-medium">My Listings</h1>
            <p className="text-onSurface-variant">Manage your property portfolio.</p>
          </div>
          <Link to="/post"><Button>+ List New Property</Button></Link>
        </div>

        {data?.stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Active Listings', value: data.stats.activeListings },
              { label: 'Total Views (30D)', value: data.stats.totalViews30d },
              { label: 'Enquiries (30D)', value: data.stats.enquiries30d },
              { label: 'Pending Approval', value: data.stats.pendingApproval },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-outline rounded-sm p-4">
                <p className="text-2xl font-medium">{s.value}</p>
                <p className="text-xs text-onSurface-variant uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {isLoading ? (
          <PropertyGridSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.listings.map((p) => (
              <div key={propertyId(p)} className="bg-white border border-outline rounded-sm overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <img src={p.images[0] ?? DEFAULT_PROPERTY_IMAGE} alt="" className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3">
                    <StatusBadge status={p.status} />
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xl font-medium">
                    {formatListingPrice(p.price, p.listingType ?? 'buy')}
                  </p>
                  <p className="text-sm text-onSurface-variant">{p.locality}, {p.city}</p>
                  <div className="flex gap-2 mt-2">
                    <Chip>{p.bhk} BHK</Chip>
                    <Chip>{p.type}</Chip>
                  </div>
                  {p.rejectionReason && (
                    <p className="text-xs text-error mt-2">Rejected: {p.rejectionReason}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

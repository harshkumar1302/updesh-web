import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { propertyId } from '@updesh/shared-types';
import { api } from '../lib/api';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyGridSkeleton } from '../components/Skeleton';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export function ShortlistPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['saved'],
    queryFn: () => api.users.mySaved(),
  });

  const toggle = useMutation({
    mutationFn: (id: string) => api.users.toggleSaved(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['saved'] }),
  });

  return (
    <>
      <Helmet><title>Your Shortlist — Updesh Residency</title></Helmet>
      <div className="max-w-container mx-auto px-4 md:px-10 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 mb-8">
          <div>
            <h1 className="text-2xl font-medium">Your Shortlist</h1>
            <p className="text-onSurface-variant">Curated properties awaiting your final decision.</p>
          </div>
          <p className="text-xs uppercase tracking-wider text-onSurface-variant">
            {data?.properties.length ?? 0} Saved Properties
          </p>
        </div>

        {isLoading ? (
          <PropertyGridSkeleton />
        ) : data?.properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-onSurface-variant mb-4">No saved properties yet.</p>
            <Link to="/search"><Button>Browse Properties</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.properties.map((p) => (
              <PropertyCard
                key={propertyId(p)}
                property={p}
                showSave
                saved
                onSave={() => toggle.mutate(propertyId(p))}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { api } from '../lib/api';
import { FilterBar, filtersFromParams, POPULAR_LOCALITIES } from '../components/FilterBar';
import { FilterChips } from '../components/FilterChips';
import { listingTypeLabel } from '../components/ListingTypePicker';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyGridSkeleton } from '../components/Skeleton';
import { Button } from '../components/Button';
import { EnquiryModal } from '../components/EnquiryModal';
import { useState } from 'react';

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const filters = filtersFromParams(params);
  const [notifyOpen, setNotifyOpen] = useState(false);

  const { data: localities } = useQuery({
    queryKey: ['localities'],
    queryFn: () => api.localities.list(),
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => api.properties.search(filters),
  });

  const activeFilters: string[] = [];
  activeFilters.push(listingTypeLabel(filters.listingType ?? 'buy'));
  if (filters.bhk) activeFilters.push(`${filters.bhk} BHK+`);
  if (filters.locality) activeFilters.push(filters.locality);
  if (filters.minPrice || filters.maxPrice) {
    const isRent = filters.listingType === 'rent';
    const fmt = (n: number) =>
      isRent
        ? n >= 100000
          ? `₹${(n / 100000).toFixed(0)}L`
          : `₹${(n / 1000).toFixed(0)}k`
        : `₹${(n / 10000000).toFixed(0)}Cr`;
    const min = filters.minPrice ? fmt(filters.minPrice) : '';
    const max = filters.maxPrice ? fmt(filters.maxPrice) : '';
    activeFilters.push(`${min}${min && max ? ' - ' : ''}${max}`);
  }

  const clearFilters = () => {
    const next = new URLSearchParams();
    if (filters.listingType) next.set('listingType', filters.listingType);
    setParams(next);
  };

  const widenBudget = () => {
    const next = new URLSearchParams(params);
    if (filters.minPrice) next.set('minPrice', String(Math.floor(filters.minPrice * 0.8)));
    if (filters.maxPrice) next.set('maxPrice', String(Math.ceil(filters.maxPrice! * 1.2)));
    else if (filters.minPrice) next.set('maxPrice', String(Math.ceil(filters.minPrice * 2)));
    setParams(next);
  };

  if (isError) {
    return (
      <div className="max-w-container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-medium text-primary mb-4">Service Unavailable</h1>
        <p className="text-onSurface-variant mb-6">Unable to reach the server. Please try again.</p>
        <Link to="/maintenance"><Button>View Status</Button></Link>
      </div>
    );
  }

  const isEmpty = !isLoading && data?.properties.length === 0;

  return (
    <>
      <Helmet>
        <title>Property Search — Updesh Residency</title>
      </Helmet>

      <div className="max-w-container mx-auto px-4 md:px-10 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-medium text-primary mb-2">
              {listingTypeLabel(filters.listingType ?? 'buy')} Properties
            </h1>
            {activeFilters.length > 0 && (
              <p className="text-sm text-onSurface-variant">
                Active Filters: {activeFilters.join(', ')}
              </p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <FilterChips listingType={filters.listingType ?? 'buy'} />
        </div>

        <div className="mb-8">
          <FilterBar localities={localities?.localities ?? []} />
        </div>

        {isLoading ? (
          <PropertyGridSkeleton />
        ) : isEmpty ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-6 bg-surface-dim rounded-md flex items-center justify-center">
              <svg className="w-8 h-8 text-onSurface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-medium mb-2">0 Properties Found</h2>
            <p className="text-onSurface-variant mb-6 max-w-md mx-auto">
              No matches found. Try widening your filters, adjusting your budget range, or checking different localities within the NCR.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Button onClick={clearFilters}>Clear All Filters</Button>
              {(filters.minPrice || filters.maxPrice) && (
                <Button variant="secondary" onClick={widenBudget}>Widen Budget by 20%</Button>
              )}
              <Button variant="secondary" onClick={() => setNotifyOpen(true)}>Notify Me</Button>
            </div>
            <p className="text-xs uppercase tracking-wider text-onSurface-variant mb-4">Popular Localities in Delhi NCR</p>
            <div className="flex flex-wrap justify-center gap-3">
              {POPULAR_LOCALITIES.map((loc) => (
                <Link
                  key={loc}
                  to={`/search?listingType=${filters.listingType ?? 'buy'}&locality=${encodeURIComponent(loc)}`}
                  className="px-4 py-2 border border-outline rounded-full text-sm hover:border-primary"
                >
                  {loc}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-onSurface-variant mb-6">
              {data?.total ?? 0} properties found
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.properties.map((p) => (
                <PropertyCard key={p._id ?? p.id} property={p} />
              ))}
            </div>
            {data?.nextCursor && (
              <div className="text-center mt-8">
                <Button
                  variant="secondary"
                  onClick={() => {
                    const next = new URLSearchParams(params);
                    next.set('cursor', data.nextCursor!);
                    setParams(next);
                  }}
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <EnquiryModal
        open={notifyOpen}
        onClose={() => setNotifyOpen(false)}
        type="notify_me"
        filters={filters as Record<string, unknown>}
        title="Notify Me When Available"
      />
    </>
  );
}

import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { api } from '../lib/api';
import { POPULAR_LOCALITIES } from '../components/FilterBar';
import { ListingTypePicker } from '../components/ListingTypePicker';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyGridSkeleton } from '../components/Skeleton';

export function HomePage() {
  const { data: featuredBuy, isLoading: buyLoading } = useQuery({
    queryKey: ['properties', 'featured', 'buy'],
    queryFn: () => api.properties.search({ sort: 'featured', listingType: 'buy', limit: 3 }),
  });

  const { data: featuredRent, isLoading: rentLoading } = useQuery({
    queryKey: ['properties', 'featured', 'rent'],
    queryFn: () => api.properties.search({ sort: 'featured', listingType: 'rent', limit: 3 }),
  });

  const isLoading = buyLoading || rentLoading;

  return (
    <>
      <Helmet>
        <title>Updesh Residency — Delhi NCR Exclusive</title>
        <meta name="description" content="Curated resale and rental properties in Delhi NCR. Search by locality, budget, and BHK." />
      </Helmet>

      <section className="max-w-container mx-auto px-4 md:px-10 py-12 md:py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-medium text-primary mb-3">Delhi NCR Exclusive</h1>
          <p className="text-onSurface-variant">Curated residences for discerning buyers and tenants.</p>
        </div>

        <div className="mb-16">
          <p className="text-center text-xs uppercase tracking-wider text-onSurface-variant mb-4">
            What are you looking for?
          </p>
          <ListingTypePicker />
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium">Featured for Sale</h2>
            <Link to="/search?listingType=buy" className="text-sm text-primary hover:underline">
              View all →
            </Link>
          </div>
          {isLoading ? (
            <PropertyGridSkeleton count={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBuy?.properties.map((p) => (
                <PropertyCard key={p._id ?? p.id} property={p} />
              ))}
            </div>
          )}
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium">Featured for Rent</h2>
            <Link to="/search?listingType=rent" className="text-sm text-primary hover:underline">
              View all →
            </Link>
          </div>
          {isLoading ? (
            <PropertyGridSkeleton count={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRent?.properties.map((p) => (
                <PropertyCard key={p._id ?? p.id} property={p} />
              ))}
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-xs uppercase tracking-wider text-onSurface-variant mb-4">
            Popular Localities in Delhi NCR
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {POPULAR_LOCALITIES.map((loc) => (
              <Link
                key={loc}
                to={`/search?listingType=buy&locality=${encodeURIComponent(loc)}`}
                className="px-4 py-2 border border-outline rounded-full text-sm hover:border-primary hover:text-primary transition-colors"
              >
                {loc}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { formatListingPrice, formatArea, propertyId } from '@updesh/shared-types';
import { DEFAULT_PROPERTY_IMAGE } from '../lib/property-images';
import { api } from '../lib/api';
import { Button } from '../components/Button';
import { Chip, VerifiedBadge } from '../components/Chip';
import { PropertyCard } from '../components/PropertyCard';
import { EnquiryModal } from '../components/EnquiryModal';
import { PropertyGridSkeleton } from '../components/Skeleton';

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [enquiryType, setEnquiryType] = useState<'viewing_request' | 'call_request' | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['property', id],
    queryFn: () => api.properties.get(id!),
    enabled: !!id,
  });

  if (isLoading) return <PropertyGridSkeleton count={1} />;
  if (isError || !data) {
    return (
      <div className="max-w-container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-medium mb-4">Property Not Found</h1>
        <Link to="/search"><Button>Browse Properties</Button></Link>
      </div>
    );
  }

  const { property, similar } = data;
  const images = property.images.length ? property.images : [DEFAULT_PROPERTY_IMAGE];
  const seller = typeof property.sellerId === 'object' ? property.sellerId : null;

  return (
    <>
      <Helmet>
        <title>{property.title} — Updesh Residency</title>
        <meta name="description" content={property.description.slice(0, 160)} />
      </Helmet>

      <div className="max-w-container mx-auto px-4 md:px-10 py-8 pb-28 md:pb-8">
        <div className="mb-6 md:mb-8">
          <div className="aspect-[4/3] md:aspect-[16/10] rounded-sm overflow-hidden md:hidden mb-6">
            <img src={images[activeImage]} alt={property.title} className="w-full h-full object-cover" />
            {images.length > 1 && (
              <div className="flex gap-2 mt-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-16 h-12 rounded-sm overflow-hidden border-2 ${
                      i === activeImage ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="lg:col-span-2 aspect-[16/10] rounded-sm overflow-hidden">
            <img src={images[activeImage]} alt={property.title} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-rows-3 gap-4">
            {images.slice(1, 4).map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i + 1)}
                className="rounded-sm overflow-hidden aspect-[16/10]"
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex gap-2 mb-3">
                {property.featured && <Chip>Exclusive</Chip>}
                <Chip>Verified Listing</Chip>
              </div>
              <h1 className="text-3xl font-medium mb-2">{property.title}</h1>
              <p className="text-onSurface-variant flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {property.locality}, {property.city}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 border border-outline rounded-sm">
              <div>
                <p className="text-xs uppercase tracking-wider text-onSurface-variant">Price</p>
                <p className="text-xl font-medium">
                  {formatListingPrice(property.price, property.listingType ?? 'buy')}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-onSurface-variant">Configuration</p>
                <p className="text-xl font-medium">{property.bhk} BHK</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-onSurface-variant">Built-up Area</p>
                <p className="text-xl font-medium">{formatArea(property.areaSqft)}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-3">About This Property</h2>
              <p className="text-onSurface-variant leading-relaxed">{property.description}</p>
            </div>

            {property.amenities.length > 0 && (
              <div>
                <h2 className="text-lg font-medium mb-4">Premium Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 p-3 border border-outline rounded-sm text-sm">
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="hidden lg:block lg:sticky lg:top-24 h-fit">
            <div className="border border-outline rounded-sm p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-dim flex items-center justify-center">
                  <svg className="w-5 h-5 text-onSurface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{seller?.name ?? 'Estate Partner'}</span>
                    <VerifiedBadge />
                  </div>
                  <p className="text-xs text-onSurface-variant capitalize">
                    {property.sellerType === 'broker' ? 'Broker' : 'Verified Owner'}
                  </p>
                </div>
              </div>
              <Button className="w-full" onClick={() => setEnquiryType('viewing_request')}>
                Request Brochure & Viewing
              </Button>
              <Button variant="secondary" className="w-full" onClick={() => setEnquiryType('call_request')}>
                Call Partner
              </Button>
            </div>
          </div>
        </div>

        {similar.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-medium mb-6">Comparable Estates</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similar.map((p) => (
                <PropertyCard key={propertyId(p)} property={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="md:hidden fixed bottom-14 left-0 right-0 z-40 bg-white border-t border-outline px-4 py-3 flex gap-3 safe-area-pb">
        <Button className="flex-1" onClick={() => setEnquiryType('viewing_request')}>
          Contact Owner
        </Button>
        <Button variant="secondary" className="flex-1" onClick={() => setEnquiryType('call_request')}>
          Request Call
        </Button>
      </div>

      <EnquiryModal
        open={!!enquiryType}
        onClose={() => setEnquiryType(null)}
        propertyId={id}
        type={enquiryType ?? 'viewing_request'}
        title={enquiryType === 'call_request' ? 'Request Call-back' : 'Enquire About This Property'}
      />
    </>
  );
}

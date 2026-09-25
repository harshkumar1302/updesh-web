import { Link } from 'react-router-dom';
import type { Property } from '@updesh/shared-types';
import { formatListingPrice, formatArea, propertyId } from '@updesh/shared-types';
import { DEFAULT_PROPERTY_IMAGE } from '../lib/property-images';
import { Chip, VerifiedBadge } from './Chip';

interface PropertyCardProps {
  property: Property;
  showSave?: boolean;
  onSave?: () => void;
  saved?: boolean;
}

export function PropertyCard({ property, showSave, onSave, saved }: PropertyCardProps) {
  const id = propertyId(property);
  const image = property.images[0] ?? DEFAULT_PROPERTY_IMAGE;

  return (
    <Link
      to={`/properties/${id}`}
      className="group block bg-white border border-outline rounded-sm overflow-hidden hover:shadow-hover transition-shadow"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {property.featured && (
          <span className="absolute top-3 left-3 bg-white/90 text-xs font-medium px-2 py-1 rounded-sm uppercase tracking-wider">
            Exclusive
          </span>
        )}
        <span className={`absolute ${property.featured ? 'top-12' : 'top-3'} left-3 bg-primary/90 text-white text-xs font-medium px-2 py-1 rounded-sm uppercase tracking-wider`}>
          {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
        </span>
        {showSave && onSave && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onSave();
            }}
            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm"
            aria-label={saved ? 'Remove from shortlist' : 'Save property'}
          >
            <svg
              className={`w-4 h-4 ${saved ? 'text-red-500 fill-current' : 'text-gray-400'}`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill={saved ? 'currentColor' : 'none'}
              strokeWidth={2}
            >
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        )}
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xl font-medium text-onSurface">
            {formatListingPrice(property.price, property.listingType ?? 'buy')}
          </span>
          <VerifiedBadge />
        </div>
        <p className="text-sm text-onSurface-variant">
          {property.locality}, {property.city}
        </p>
        <div className="flex flex-wrap gap-2">
          <Chip>{property.bhk} BHK</Chip>
          <Chip>{formatArea(property.areaSqft)}</Chip>
          <Chip>{property.type.replace('_', ' ')}</Chip>
        </div>
      </div>
    </Link>
  );
}

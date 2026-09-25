import { Link, useSearchParams } from 'react-router-dom';
import type { ListingType } from '@updesh/shared-types';
import { POPULAR_LOCALITIES } from './FilterBar';

interface FilterChipsProps {
  listingType?: ListingType;
}

export function FilterChips({ listingType = 'buy' }: FilterChipsProps) {
  const [params] = useSearchParams();
  const activeLocality = params.get('locality') ?? '';

  const chips = [{ label: 'All', value: '' }, ...POPULAR_LOCALITIES.map((l) => ({ label: l, value: l }))];

  const buildUrl = (locality: string) => {
    const next = new URLSearchParams(params);
    if (locality) next.set('locality', locality);
    else next.delete('locality');
    next.delete('cursor');
    if (!next.get('listingType')) next.set('listingType', listingType);
    return `/search?${next.toString()}`;
  };

  return (
    <div className="md:hidden -mx-4 px-4 overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 pb-1">
        {chips.map((chip) => {
          const active = chip.value === activeLocality || (chip.value === '' && !activeLocality);
          return (
            <Link
              key={chip.label}
              to={buildUrl(chip.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm border transition-colors ${
                active
                  ? 'bg-surface-dim border-primary text-primary'
                  : 'bg-white border-outline text-onSurface-variant'
              }`}
            >
              {chip.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

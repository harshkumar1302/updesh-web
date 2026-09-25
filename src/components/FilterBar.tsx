import { useSearchParams, useNavigate } from 'react-router-dom';
import type { ListingType, SearchFilters } from '@updesh/shared-types';
import { ListingTypePicker } from './ListingTypePicker';

const BUY_BUDGET_PRESETS = [
  { label: 'Any Price', min: undefined, max: undefined },
  { label: 'Under ₹1 Cr', min: undefined, max: 10000000 },
  { label: '₹1-5 Cr', min: 10000000, max: 50000000 },
  { label: '₹5-20 Cr', min: 50000000, max: 200000000 },
  { label: '₹20 Cr+', min: 200000000, max: undefined },
];

const RENT_BUDGET_PRESETS = [
  { label: 'Any Rent', min: undefined, max: undefined },
  { label: 'Under ₹50k', min: undefined, max: 50000 },
  { label: '₹50k - ₹1L', min: 50000, max: 100000 },
  { label: '₹1L - ₹2L', min: 100000, max: 200000 },
  { label: '₹2L+', min: 200000, max: undefined },
];

interface FilterBarProps {
  localities: { name: string; city: string }[];
  compact?: boolean;
  navigateOnChange?: boolean;
}

export function FilterBar({ localities, compact, navigateOnChange }: FilterBarProps) {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const listingType = (params.get('listingType') as ListingType) ?? 'buy';
  const budgetPresets = listingType === 'rent' ? RENT_BUDGET_PRESETS : BUY_BUDGET_PRESETS;

  const applyParams = (next: URLSearchParams) => {
    if (navigateOnChange) {
      navigate(`/search?${next.toString()}`);
    } else {
      setParams(next);
    }
  };

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('cursor');
    applyParams(next);
  };

  const setListingType = (type: ListingType) => {
    const next = new URLSearchParams(params);
    next.set('listingType', type);
    next.delete('minPrice');
    next.delete('maxPrice');
    next.delete('cursor');
    applyParams(next);
  };

  const selectClass =
    'bg-surface-dim border-0 rounded-sm px-3 py-2 text-sm text-onSurface focus:outline-none focus:ring-1 focus:ring-primary';

  return (
    <div className={`flex flex-wrap gap-3 ${compact ? '' : 'p-4 border border-outline rounded-md bg-white'}`}>
      <ListingTypePicker variant="compact" value={listingType} onChange={setListingType} />

      <div className="flex flex-col gap-1">
        {!compact && <label className="text-xs uppercase tracking-wider text-onSurface-variant">Locality</label>}
        <select
          className={selectClass}
          value={params.get('locality') ?? ''}
          onChange={(e) => update('locality', e.target.value)}
        >
          <option value="">All Localities</option>
          {localities.map((l) => (
            <option key={`${l.city}-${l.name}`} value={l.name}>
              {l.name}, {l.city}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        {!compact && (
          <label className="text-xs uppercase tracking-wider text-onSurface-variant">
            {listingType === 'rent' ? 'Monthly Rent' : 'Budget'}
          </label>
        )}
        <select
          className={selectClass}
          value={`${params.get('minPrice') ?? ''}-${params.get('maxPrice') ?? ''}`}
          onChange={(e) => {
            const preset = budgetPresets.find((p) => `${p.min ?? ''}-${p.max ?? ''}` === e.target.value);
            const next = new URLSearchParams(params);
            next.delete('cursor');
            if (preset?.min) next.set('minPrice', String(preset.min));
            else next.delete('minPrice');
            if (preset?.max) next.set('maxPrice', String(preset.max));
            else next.delete('maxPrice');
            applyParams(next);
          }}
        >
          {budgetPresets.map((p) => (
            <option key={p.label} value={`${p.min ?? ''}-${p.max ?? ''}`}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        {!compact && <label className="text-xs uppercase tracking-wider text-onSurface-variant">BHK</label>}
        <select
          className={selectClass}
          value={params.get('bhk') ?? ''}
          onChange={(e) => update('bhk', e.target.value)}
        >
          <option value="">Any Size</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n} BHK{n === 5 ? '+' : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        {!compact && <label className="text-xs uppercase tracking-wider text-onSurface-variant">Sort</label>}
        <select
          className={selectClass}
          value={params.get('sort') ?? 'featured'}
          onChange={(e) => update('sort', e.target.value)}
        >
          <option value="featured">Featured</option>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}

export function filtersFromParams(params: URLSearchParams): SearchFilters {
  const listingType = params.get('listingType');
  return {
    locality: params.get('locality') ?? undefined,
    city: params.get('city') ?? undefined,
    listingType: listingType === 'rent' || listingType === 'buy' ? listingType : 'buy',
    minPrice: params.get('minPrice') ? Number(params.get('minPrice')) : undefined,
    maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined,
    bhk: params.get('bhk') ? Number(params.get('bhk')) : undefined,
    type: (params.get('type') as SearchFilters['type']) ?? undefined,
    sort: (params.get('sort') as SearchFilters['sort']) ?? 'featured',
    cursor: params.get('cursor') ?? undefined,
    limit: 20,
  };
}

export const POPULAR_LOCALITIES = [
  'South Delhi',
  'Gurgaon',
  'Noida',
  'Vasant Vihar',
  'Golf Course Road',
];

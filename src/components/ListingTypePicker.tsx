import { useNavigate } from 'react-router-dom';
import type { ListingType } from '@updesh/shared-types';

interface ListingTypePickerProps {
  variant?: 'hero' | 'compact';
  value?: ListingType;
  onChange?: (type: ListingType) => void;
}

const OPTIONS: { type: ListingType; title: string; description: string; icon: string }[] = [
  {
    type: 'buy',
    title: 'Buy',
    description: 'Own a home in Delhi NCR',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    type: 'rent',
    title: 'Rent',
    description: 'Find a home to lease',
    icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z',
  },
];

export function ListingTypePicker({ variant = 'hero', value, onChange }: ListingTypePickerProps) {
  const navigate = useNavigate();

  const select = (type: ListingType) => {
    if (onChange) {
      onChange(type);
      return;
    }
    navigate(`/search?listingType=${type}`);
  };

  if (variant === 'compact') {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs uppercase tracking-wider text-onSurface-variant">Looking to</label>
        <div className="inline-flex rounded-sm bg-surface-dim p-1">
          {OPTIONS.map((opt) => (
            <button
              key={opt.type}
              type="button"
              onClick={() => select(opt.type)}
              className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors ${
                value === opt.type
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-onSurface-variant hover:text-onSurface'
              }`}
            >
              {opt.title}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
      {OPTIONS.map((opt) => (
        <button
          key={opt.type}
          type="button"
          onClick={() => select(opt.type)}
          className="group text-left p-6 bg-white border border-outline rounded-md hover:border-primary hover:shadow-hover transition-all"
        >
          <div className="w-12 h-12 mb-4 rounded-full bg-surface-dim flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={opt.icon} />
            </svg>
          </div>
          <h2 className="text-xl font-medium mb-1">{opt.title}</h2>
          <p className="text-sm text-onSurface-variant mb-4">{opt.description}</p>
          <span className="text-sm font-medium text-primary group-hover:underline">
            Browse {opt.title.toLowerCase()} listings →
          </span>
        </button>
      ))}
    </div>
  );
}

export function listingTypeLabel(type: ListingType = 'buy'): string {
  return type === 'rent' ? 'Rent' : 'Buy';
}

import { ReactNode } from 'react';

export function Chip({ children }: { children: ReactNode }) {
  return <span className="chip">{children}</span>;
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    live: 'bg-green-50 text-green-700',
    pending_review: 'bg-amber-50 text-amber-700',
    rejected: 'bg-red-50 text-red-700',
    sold: 'bg-gray-100 text-gray-600',
    new: 'bg-blue-50 text-blue-700',
    contacted: 'bg-purple-50 text-purple-700',
    closed: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-medium ${colors[status] ?? 'bg-gray-100 text-gray-600'}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status.replace('_', ' ').toUpperCase()}
    </span>
  );
}

export function VerifiedBadge() {
  return (
    <svg className="w-4 h-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}

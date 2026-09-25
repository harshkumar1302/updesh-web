import type { ReactElement } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';

type Tab = {
  to: string;
  label: string;
  match: (path: string) => boolean;
  icon: (active: boolean) => ReactElement;
  requiresAuth?: boolean;
  requiresSeller?: boolean;
};

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-[22px] h-[22px] mb-0.5" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={active ? 0 : 1.75}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="w-[22px] h-[22px] mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function SellRentIcon({ active }: { active: boolean }) {
  return (
    <span
      className={`mb-0.5 w-7 h-7 rounded-lg border-[1.5px] flex items-center justify-center ${
        active ? 'border-onSurface' : 'border-current'
      }`}
    >
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    </span>
  );
}

function ActivityIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-[22px] h-[22px] mb-0.5" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={active ? 0 : 1.75}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="w-[22px] h-[22px] mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

const tabs: Tab[] = [
  {
    to: '/',
    label: 'Home',
    match: (p) => p === '/',
    icon: (active) => <HomeIcon active={active} />,
  },
  {
    to: '/search',
    label: 'Search',
    match: (p) => p.startsWith('/search') || p.startsWith('/properties'),
    icon: () => <SearchIcon />,
  },
  {
    to: '/post',
    label: 'Sell/Rent',
    match: (p) => p.startsWith('/post'),
    icon: (active) => <SellRentIcon active={active} />,
    requiresAuth: true,
  },
  {
    to: '/activity',
    label: 'Activity',
    match: (p) =>
      p.startsWith('/activity') ||
      p.startsWith('/dashboard/shortlist') ||
      p.startsWith('/dashboard/enquiries'),
    icon: (active) => <ActivityIcon active={active} />,
  },
  {
    to: '/menu',
    label: 'Menu',
    match: (p) =>
      p.startsWith('/menu') ||
      p.startsWith('/dashboard/listings') ||
      p.startsWith('/admin'),
    icon: () => <MenuIcon />,
  },
];

export function MobileTabBar() {
  const location = useLocation();
  const { user } = useAuth();
  const path = location.pathname;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-outline safe-area-pb">
      <div className="flex items-stretch justify-around h-[52px] pt-1.5">
        {tabs.map((tab) => {
          const active = tab.match(path);
          let to = tab.to;
          if (tab.requiresAuth && !user) to = '/login';

          return (
            <Link
              key={tab.label}
              to={to}
              state={tab.requiresAuth && !user ? { from: { pathname: tab.to } } : undefined}
              className={`flex flex-col items-center justify-center flex-1 min-w-0 px-1 text-[11px] font-medium leading-tight ${
                active ? 'text-onSurface font-semibold' : 'text-onSurface-variant'
              }`}
            >
              {tab.icon(active)}
              <span className="truncate">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

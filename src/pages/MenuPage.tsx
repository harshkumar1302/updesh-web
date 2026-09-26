import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../lib/auth';
import { Button } from '../components/Button';

type MenuItem = {
  label: string;
  sub: string;
  to: string;
  icon: 'listings' | 'approvals' | 'reports' | 'support';
};

function MenuIcon({ type }: { type: MenuItem['icon'] }) {
  const cls = 'w-5 h-5 text-primary';
  switch (type) {
    case 'listings':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    case 'approvals':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'reports':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
      );
    default:
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
}

function MenuSection({ title, items }: { title: string; items: MenuItem[] }) {
  return (
    <div>
      <p className="text-[11px] font-bold tracking-wider text-onSurface-variant mb-2 ml-1">{title}</p>
      <div className="bg-white border border-outline rounded-lg overflow-hidden divide-y divide-outline">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-3 px-4 py-3.5 hover:bg-surface-dim transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MenuIcon type={item.icon} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[15px]">{item.label}</p>
              <p className="text-xs text-onSurface-variant">{item.sub}</p>
            </div>
            <svg className="w-[18px] h-[18px] text-outline-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function MenuPage() {
  const { user, loading, logout, isAdmin, isSeller } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-onSurface-variant">Loading...</div>
      </div>
    );
  }

  const selling: MenuItem[] = isSeller
    ? [
        { label: 'My Listings', sub: 'Manage your portfolio', to: '/dashboard/listings', icon: 'listings' },
        { label: 'Enquiries Received', sub: 'Messages from buyers', to: '/dashboard/property-leads', icon: 'reports' },
      ]
    : [];

  const admin: MenuItem[] = isAdmin
    ? [
        { label: 'Dashboard', sub: 'Overview and stats', to: '/admin/dashboard', icon: 'reports' },
        { label: 'Users', sub: 'Manage users', to: '/admin/users', icon: 'support' },
        { label: 'Properties', sub: 'Manage properties', to: '/admin/properties', icon: 'listings' },
        { label: 'Pending Approvals', sub: 'Review submissions', to: '/admin/approvals', icon: 'approvals' },
        { label: 'Leads Inbox', sub: 'Viewing requests and callbacks', to: '/admin/leads', icon: 'reports' },
      ]
    : [];

  return (
    <>
      <Helmet>
        <title>Menu — Updesh Residency</title>
      </Helmet>
      <div className="max-w-container mx-auto px-4 md:px-10 py-8 md:py-10">
        <h1 className="text-2xl font-medium mb-6 md:mb-8">Menu</h1>

        {!user ? (
          <div className="max-w-xl space-y-8">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Welcome to Updesh Residency</h2>
              <p className="text-onSurface-variant text-sm">
                Sign in to manage listings, save favorites, and track enquiries.
              </p>
              <Link to="/login" state={{ from: { pathname: '/menu' } }}>
                <Button>Sign In</Button>
              </Link>
            </div>
            <MenuSection
              title="SUPPORT"
              items={[{ label: 'Contact Support', sub: 'Get help from our team', to: '/contact', icon: 'support' }]}
            />
          </div>
        ) : (
          <div className="max-w-xl space-y-6">
            <div className="flex items-center gap-3.5 p-4 md:p-5 bg-white border border-outline rounded-lg">
              <div className="w-[52px] h-[52px] rounded-full bg-primary text-white flex items-center justify-center text-xl font-semibold flex-shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[17px] truncate">{user.name}</p>
                <p className="text-sm text-onSurface-variant truncate">{user.email}</p>
              </div>
              <span className="text-[10px] font-bold tracking-wide text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase">
                {user.role}
              </span>
            </div>

            {selling.length > 0 && <MenuSection title="SELLING" items={selling} />}
            {admin.length > 0 && <MenuSection title="ADMIN" items={admin} />}

            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-lg border border-error/25 bg-white text-error font-semibold hover:bg-error/5 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </div>
        )}
      </div>
    </>
  );
}

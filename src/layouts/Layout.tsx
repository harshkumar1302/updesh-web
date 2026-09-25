import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { MobileTabBar } from '../components/MobileTabBar';

export function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLink = (to: string, label: string) => {
    const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
    return (
      <Link
        to={to}
        className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
          active ? 'border-primary text-primary' : 'border-transparent text-onSurface-variant hover:text-onSurface'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="border-b border-outline bg-white sticky top-0 z-40">
      <div className="max-w-container mx-auto px-4 md:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="text-lg font-medium text-primary">
          Updesh Residency
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {navLink('/', 'Home')}
          {navLink('/search', 'Search')}
          {navLink('/post', 'Sell/Rent')}
          {navLink('/activity', 'Activity')}
          {navLink('/menu', 'Menu')}
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative group">
              <button className="w-8 h-8 rounded-full bg-surface-dim flex items-center justify-center">
                <svg className="w-5 h-5 text-onSurface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-outline rounded-md shadow-hover py-2 hidden group-hover:block">
                <p className="px-4 py-2 text-sm font-medium">{user.name}</p>
                <Link to="/menu" className="block px-4 py-2 text-sm hover:bg-surface-dim">Account</Link>
                <button onClick={logout} className="w-full text-left px-4 py-2 text-sm hover:bg-surface-dim text-error">
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="text-sm font-medium text-primary hover:text-primary-dark">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="hidden md:block border-t border-outline bg-white mt-auto">
      <div className="max-w-container mx-auto px-4 md:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-medium text-primary">Updesh Residency</p>
          <p className="text-sm text-onSurface-variant mt-1">
            © 2026 Updesh Residency. Delhi NCR&apos;s Exclusive Property Circle.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-onSurface-variant">
          <Link to="/privacy" className="hover:text-onSurface">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-onSurface">Terms of Service</Link>
          <Link to="/contact" className="hover:text-onSurface">Contact Support</Link>
        </div>
      </div>
    </footer>
  );
}

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col pb-14 md:pb-0">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileTabBar />
    </div>
  );
}

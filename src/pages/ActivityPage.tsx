import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../lib/auth';
import { api } from '../lib/api';
import { Button } from '../components/Button';

function ActivityRow({
  to,
  label,
  sub,
  icon,
}: {
  to: string;
  label: string;
  sub: string;
  icon: 'heart' | 'mail';
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-4 bg-white border border-outline rounded-lg hover:bg-surface-dim transition-colors"
    >
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        {icon === 'heart' ? (
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-onSurface">{label}</p>
        <p className="text-sm text-onSurface-variant">{sub}</p>
      </div>
      <svg className="w-[18px] h-[18px] text-outline-variant flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

export function ActivityPage() {
  const { user, loading } = useAuth();

  const { data: saved } = useQuery({
    queryKey: ['saved'],
    queryFn: () => api.users.mySaved(),
    enabled: !!user,
  });

  const { data: leads } = useQuery({
    queryKey: ['my-leads'],
    queryFn: () => api.users.myLeads(),
    enabled: !!user,
  });

  const favCount = saved?.properties.length ?? 0;
  const enquiryCount = leads?.leads.length ?? 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-onSurface-variant">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Activity — Updesh Residency</title>
      </Helmet>
      <div className="max-w-container mx-auto px-4 md:px-10 py-8 md:py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-medium">Activity</h1>
          <p className="text-onSurface-variant mt-1">Your saved properties and enquiries</p>
        </div>

        {!user ? (
          <div className="text-center py-16 px-6 max-w-md mx-auto">
            <svg className="w-10 h-10 mx-auto text-onSurface-variant mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h2 className="text-lg font-semibold mb-2">Sign in to see activity</h2>
            <p className="text-onSurface-variant text-sm mb-6">Save favorites and track enquiries in one place.</p>
            <Link to="/login" state={{ from: { pathname: '/activity' } }}>
              <Button className="w-full sm:w-auto">Sign In</Button>
            </Link>
          </div>
        ) : (
          <div className="max-w-xl space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-white border border-outline rounded-lg text-center">
                <p className="text-3xl font-semibold text-primary">{favCount}</p>
                <p className="text-xs text-onSurface-variant mt-1">Saved</p>
              </div>
              <div className="p-4 bg-white border border-outline rounded-lg text-center">
                <p className="text-3xl font-semibold text-primary">{enquiryCount}</p>
                <p className="text-xs text-onSurface-variant mt-1">Enquiries</p>
              </div>
            </div>

            <div className="space-y-3">
              <ActivityRow
                to="/dashboard/shortlist"
                label="My Favorites"
                sub={`${favCount} saved properties`}
                icon="heart"
              />
              <ActivityRow
                to="/dashboard/enquiries"
                label="My Enquiries"
                sub={`${enquiryCount} active inquiries`}
                icon="mail"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

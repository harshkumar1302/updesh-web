import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { LoginPage } from './pages/LoginPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { PostPropertyPage } from './pages/PostPropertyPage';
import { MyListingsPage } from './pages/MyListingsPage';
import { MyEnquiriesPage } from './pages/MyEnquiriesPage';
import { ShortlistPage } from './pages/ShortlistPage';
import { AdminApprovalsPage } from './pages/AdminApprovalsPage';
import { AdminLeadsPage } from './pages/AdminLeadsPage';
import { ActivityPage } from './pages/ActivityPage';
import { MenuPage } from './pages/MenuPage';
import { NotFoundPage, MaintenancePage, StaticPage } from './pages/MiscPages';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="activity" element={<ActivityPage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="properties/:id" element={<PropertyDetailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="maintenance" element={<MaintenancePage />} />
        <Route path="privacy" element={<StaticPage title="Privacy Policy"><p>Privacy policy content coming soon.</p></StaticPage>} />
        <Route path="terms" element={<StaticPage title="Terms of Service"><p>Terms of service content coming soon.</p></StaticPage>} />
        <Route path="contact" element={<StaticPage title="Contact Us"><p>Email: support@updesh.com · Phone: +91 99999 99999</p></StaticPage>} />

        <Route path="signup/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />

        <Route path="post" element={<ProtectedRoute roles={['seller', 'admin']}><PostPropertyPage /></ProtectedRoute>} />
        <Route path="dashboard/listings" element={<ProtectedRoute roles={['seller', 'admin']}><MyListingsPage /></ProtectedRoute>} />
        <Route path="dashboard/enquiries" element={<ProtectedRoute><MyEnquiriesPage /></ProtectedRoute>} />
        <Route path="dashboard/shortlist" element={<ProtectedRoute><ShortlistPage /></ProtectedRoute>} />
        <Route path="dashboard" element={<Navigate to="/dashboard/listings" replace />} />

        <Route path="admin/approvals" element={<ProtectedRoute roles={['admin']}><AdminApprovalsPage /></ProtectedRoute>} />
        <Route path="admin/leads" element={<ProtectedRoute roles={['admin']}><AdminLeadsPage /></ProtectedRoute>} />
        <Route path="admin" element={<Navigate to="/admin/approvals" replace />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

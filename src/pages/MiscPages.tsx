import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export function NotFoundPage() {
  return (
    <div className="max-w-container mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl font-medium text-primary mb-4">404</h1>
      <p className="text-onSurface-variant mb-8">This page doesn&apos;t exist.</p>
      <Link to="/"><Button>Back to Home</Button></Link>
    </div>
  );
}

export function MaintenancePage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-medium text-primary mb-4">We&apos;ll be back shortly</h1>
        <p className="text-onSurface-variant mb-6">
          Updesh Residency is temporarily unavailable. Our team is working to restore service.
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
        <p className="mt-4">
          <a href="https://wa.me/919999999999" className="text-primary underline text-sm">
            Contact us on WhatsApp
          </a>
        </p>
      </div>
    </div>
  );
}

export function StaticPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="max-w-container mx-auto px-4 md:px-10 py-12">
      <h1 className="text-2xl font-medium mb-6">{title}</h1>
      <div className="prose text-onSurface-variant max-w-2xl">{children}</div>
    </div>
  );
}

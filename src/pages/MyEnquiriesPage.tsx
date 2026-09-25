import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import type { Property } from '@updesh/shared-types';
import { formatPrice, propertyId } from '@updesh/shared-types';
import { DEFAULT_PROPERTY_IMAGE } from '../lib/property-images';
import { api } from '../lib/api';
import { Button } from '../components/Button';
import { StatusBadge } from '../components/Chip';

export function MyEnquiriesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-leads'],
    queryFn: () => api.users.myLeads(),
  });

  return (
    <>
      <Helmet><title>My Enquiries — Updesh Residency</title></Helmet>
      <div className="max-w-container mx-auto px-4 md:px-10 py-8">
        <h1 className="text-2xl font-medium mb-2">My Enquiries</h1>
        <p className="text-onSurface-variant mb-8">Track the status of your property inquiries.</p>

        {isLoading ? (
          <p className="text-onSurface-variant">Loading...</p>
        ) : data?.leads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-onSurface-variant mb-4">No enquiries yet.</p>
            <Link to="/search"><Button>Browse Properties</Button></Link>
          </div>
        ) : (
          <div className="space-y-4">
            {data?.leads.map((lead) => {
              const property = lead.propertyId as Property | undefined;
              if (!property || typeof property === 'string') return null;
              return (
                <div key={lead._id ?? lead.id} className="flex flex-col md:flex-row gap-4 bg-white border border-outline rounded-sm overflow-hidden">
                  <div className="md:w-48 aspect-[4/3] md:aspect-auto flex-shrink-0">
                    <img src={property.images?.[0] ?? DEFAULT_PROPERTY_IMAGE} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xl font-medium">{formatPrice(property.price)}</p>
                          <p className="text-sm text-onSurface-variant">{property.bhk} BHK · {property.locality}, {property.city}</p>
                        </div>
                        <StatusBadge status={lead.status} />
                      </div>
                      <p className="text-sm text-onSurface-variant mt-2 capitalize">{lead.type.replace('_', ' ')}</p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-xs text-onSurface-variant">
                        Inquired on: {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <Link to={`/properties/${propertyId(property)}`}>
                        <Button variant="secondary">View Details</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

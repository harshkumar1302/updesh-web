import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { propertyId } from '@updesh/shared-types';
import { api } from '../lib/api';
import { StatusBadge, Chip } from '../components/Chip';
import { DEFAULT_PROPERTY_IMAGE } from '../lib/property-images';

export function SellerPropertyLeadsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['seller-property-leads'],
    queryFn: () => api.users.propertyLeads(),
  });

  return (
    <>
      <Helmet><title>Property Enquiries — Updesh Residency</title></Helmet>
      <div className="max-w-container mx-auto px-4 md:px-10 py-8">
        <h1 className="text-2xl font-medium mb-2">Property Enquiries</h1>
        <p className="text-onSurface-variant mb-8">Leads and messages received for your properties.</p>

        {isLoading ? (
          <p>Loading...</p>
        ) : !data?.leads || data.leads.length === 0 ? (
          <p className="text-onSurface-variant">No enquiries received yet.</p>
        ) : (
          <div className="space-y-4">
            {data.leads.map((lead) => {
              const p = lead.property;
              return (
                <div key={lead.id ?? lead._id} className="bg-white border border-outline rounded-sm p-4 md:p-6 flex flex-col md:flex-row gap-6">
                  {p && (
                    <div className="md:w-48 flex-shrink-0">
                      <div className="aspect-[4/3] rounded-sm overflow-hidden mb-2">
                        <img src={p.images[0] ?? DEFAULT_PROPERTY_IMAGE} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                      <p className="font-medium text-sm truncate">{p.title}</p>
                      <p className="text-xs text-onSurface-variant">{p.locality}, {p.city}</p>
                    </div>
                  )}
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-medium">{lead.name}</h3>
                          <Chip>{lead.type.replace('_', ' ')}</Chip>
                        </div>
                        <p className="text-onSurface-variant">{lead.phone} {lead.email ? `· ${lead.email}` : ''}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <StatusBadge status={lead.status} />
                        <span className="text-xs text-onSurface-variant">
                          {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    
                    {lead.message && (
                      <div className="bg-surface-dim p-4 rounded-sm text-sm">
                        <p className="font-medium mb-1">Message:</p>
                        <p className="text-onSurface-variant whitespace-pre-wrap">{lead.message}</p>
                      </div>
                    )}
                    {lead.preferredTime && (
                      <p className="text-sm"><span className="font-medium">Preferred Time:</span> {lead.preferredTime}</p>
                    )}
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

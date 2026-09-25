import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import type { ListingType } from '@updesh/shared-types';
import { api } from '../lib/api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { StepProgress } from '../components/StepProgress';

const STEPS = ['Basic Details', 'Photos', 'Location & Review'];

export function PostPropertyPage() {
  const [step, setStep] = useState(0);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'flat' as const,
    bhk: 3,
    price: '',
    areaSqft: '',
    furnishing: 'unfurnished' as const,
    locality: '',
    city: 'Delhi',
    address: '',
    geo: { lat: 28.6139, lng: 77.2090 },
    amenities: [] as string[],
    sellerType: 'owner' as const,
    listingType: 'buy' as ListingType,
  });

  const { data: localities } = useQuery({
    queryKey: ['localities'],
    queryFn: () => api.localities.list(),
  });

  const update = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const submitBasic = async () => {
    const res = await api.properties.create({
      ...form,
      title: form.title || `${form.bhk} BHK ${form.type} in ${form.locality}`,
      price: Number(form.price),
      areaSqft: Number(form.areaSqft),
    });
    setPropertyId(res.property._id ?? res.property.id ?? null);
    setStep(1);
  };

  const submitPhotos = async () => {
    if (propertyId && files.length >= 1) {
      await api.properties.uploadImages(propertyId, files);
    }
    setStep(2);
  };

  const publish = async () => {
    navigate('/dashboard/listings');
  };

  return (
    <>
      <Helmet><title>Post a Property — Updesh Residency</title></Helmet>
      <div className="max-w-container mx-auto px-4 md:px-10 py-8">
        <h1 className="text-2xl font-medium mb-2">Post a Property</h1>
        <p className="text-onSurface-variant mb-8">Inner Circle Listing Process</p>

        <StepProgress steps={STEPS} currentStep={step} />

        <div className="max-w-2xl mx-auto bg-white border border-outline rounded-md p-4 md:p-6">
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-onSurface-variant mb-1">Listing Type</label>
                <select className="input-field" value={form.listingType} onChange={(e) => update('listingType', e.target.value)}>
                  <option value="buy">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-onSurface-variant mb-1">Property Type</label>
                <select className="input-field" value={form.type} onChange={(e) => update('type', e.target.value)}>
                  <option value="flat">Flat</option>
                  <option value="floor">Independent Floor</option>
                  <option value="villa">Villa</option>
                  <option value="plot">Plot</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-onSurface-variant mb-1">Configuration (BHK)</label>
                <select className="input-field" value={form.bhk} onChange={(e) => update('bhk', Number(e.target.value))}>
                  {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} BHK</option>)}
                </select>
              </div>
              <Input label={form.listingType === 'rent' ? 'Monthly Rent (INR)' : 'Asking Price (INR)'} placeholder={form.listingType === 'rent' ? '₹ e.g. 85000' : '₹ e.g. 150000000'} value={form.price} onChange={(e) => update('price', e.target.value)} />
              <Input label="Super Built-Up Area" placeholder="e.g. 4500" value={form.areaSqft} onChange={(e) => update('areaSqft', e.target.value)} />
              <div>
                <label className="block text-xs uppercase tracking-wider text-onSurface-variant mb-1">Locality</label>
                <select className="input-field" value={form.locality} onChange={(e) => {
                  const loc = localities?.localities.find((l) => l.name === e.target.value);
                  update('locality', e.target.value);
                  if (loc) {
                    update('city', loc.city);
                    update('geo', loc.geo);
                  }
                }}>
                  <option value="">Select locality</option>
                  {localities?.localities.map((l) => (
                    <option key={l.name} value={l.name}>{l.name}, {l.city}</option>
                  ))}
                </select>
              </div>
              <Input label="Property Title" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Luxury Penthouse in Vasant Vihar" />
              <div>
                <label className="block text-xs uppercase tracking-wider text-onSurface-variant mb-1">Description</label>
                <textarea className="input-field resize-none" rows={4} value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Describe the property..." />
              </div>
              <Input label="Address" value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="Full address (private until lead submitted)" />
              <div className="flex justify-end">
                <Button onClick={submitBasic} disabled={!form.locality || !form.price || !form.areaSqft || !form.description}>
                  Next: Photos →
                </Button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-onSurface-variant">Upload at least 1 photo (max 15). JPEG/PNG up to 10MB each.</p>
              <div
                className="border-2 border-dashed border-outline rounded-md p-12 text-center"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  setFiles([...files, ...Array.from(e.dataTransfer.files)]);
                }}
              >
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png"
                  className="hidden"
                  id="photo-upload"
                  onChange={(e) => setFiles([...files, ...Array.from(e.target.files ?? [])])}
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <p className="font-medium mb-2">Drag and drop photos here</p>
                  <p className="text-sm text-onSurface-variant mb-4">or click to browse</p>
                  <Button type="button" onClick={() => document.getElementById('photo-upload')?.click()}>
                    Browse Files
                  </Button>
                </label>
              </div>
              {files.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Uploaded ({files.length})</p>
                  <div className="flex gap-2 flex-wrap">
                    {files.map((f, i) => (
                      <div key={i} className="w-24 h-24 rounded-sm overflow-hidden relative">
                        <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-between">
                <Button variant="secondary" onClick={() => setStep(0)}>← Back</Button>
                <Button onClick={submitPhotos} disabled={files.length < 1}>Next: Review →</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-medium">Review & Publish</h2>
              <div className="p-4 bg-surface-dim rounded-sm space-y-2 text-sm">
                <p><strong>Type:</strong> {form.type} · {form.bhk} BHK</p>
                <p><strong>Price:</strong> ₹{Number(form.price).toLocaleString('en-IN')}</p>
                <p><strong>Area:</strong> {form.areaSqft} sq.ft.</p>
                <p><strong>Location:</strong> {form.locality}, {form.city}</p>
                <p><strong>Photos:</strong> {files.length} uploaded</p>
              </div>
              <p className="text-xs text-onSurface-variant">
                By publishing, this listing will be reviewed before going live on Updesh Residency.
              </p>
              <div className="flex justify-between">
                <Button variant="secondary" onClick={() => setStep(1)}>← Back</Button>
                <Button onClick={publish}>Publish Listing →</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

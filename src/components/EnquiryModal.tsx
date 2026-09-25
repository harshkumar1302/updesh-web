import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './Button';
import { Input } from './Input';
import { api } from '../lib/api';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone required'),
  message: z.string().optional(),
  preferredTime: z.string().optional(),
  website: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface EnquiryModalProps {
  open: boolean;
  onClose: () => void;
  propertyId?: string;
  type: 'viewing_request' | 'call_request' | 'notify_me';
  filters?: Record<string, unknown>;
  title?: string;
}

export function EnquiryModal({
  open,
  onClose,
  propertyId,
  type,
  filters,
  title = 'Enquire About This Property',
}: EnquiryModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    await api.leads.create({
      propertyId,
      type,
      name: data.name,
      phone: data.phone,
      message: data.message,
      preferredTime: data.preferredTime,
      filters,
      website: data.website,
    });
    reset();
    onClose();
    alert('Your enquiry has been submitted. We will be in touch shortly.');
  };

  return (
    open ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" onClick={onClose} />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative bg-white border border-outline rounded-md shadow-hover w-full max-w-md p-6 space-y-4"
        >
          <h2 className="text-xl font-medium">{title}</h2>
          <input type="text" {...register('website')} className="hidden" tabIndex={-1} autoComplete="off" />
          <Input label="Full Name" {...register('name')} error={errors.name?.message} />
          <Input label="Phone Number" placeholder="+91" {...register('phone')} error={errors.phone?.message} />
          {(type === 'viewing_request' || type === 'call_request') && (
            <Input label="Preferred Time" {...register('preferredTime')} placeholder="e.g. Weekend morning" />
          )}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-onSurface-variant mb-1">
              Message
            </label>
            <textarea
              {...register('message')}
              rows={3}
              className="input-field resize-none"
              placeholder="Tell us about your requirements..."
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Sending...' : 'Send Enquiry →'}
          </Button>
        </form>
      </div>
    ) : null
  );
}

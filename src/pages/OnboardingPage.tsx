import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { api } from '../lib/api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export function OnboardingPage() {
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ['localities'],
    queryFn: () => api.localities.list(),
  });

  const cities = [...new Set(data?.localities.map((l) => l.city) ?? [])];
  const localityGroups = cities.map((city) => ({
    city,
    localities: data?.localities.filter((l) => l.city === city).slice(0, 4) ?? [],
  }));

  const toggle = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((l) => l !== name) : [...prev, name]
    );
  };

  const complete = () => {
    navigate('/');
  };

  return (
    <>
      <Helmet><title>Welcome — Updesh Residency</title></Helmet>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg bg-white border border-outline rounded-md p-8">
          <p className="text-xs uppercase tracking-wider text-onSurface-variant mb-2">Onboarding</p>
          <h1 className="text-2xl font-medium mb-2">Welcome to Updesh Residency</h1>
          <p className="text-sm text-onSurface-variant mb-6">
            Tell us your preferences to tailor your property experience.
          </p>

          <div className="space-y-4 mb-6">
            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" />
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-onSurface-variant mb-2">
                Preferred Localities (Delhi NCR)
              </label>
              <p className="text-xs text-onSurface-variant mb-3">Select multiple</p>
              <div className="grid grid-cols-2 gap-2">
                {localityGroups.flatMap((g) => g.localities).slice(0, 8).map((l) => (
                  <button
                    key={l.name}
                    type="button"
                    onClick={() => toggle(l.name)}
                    className={`p-3 text-sm text-left rounded-sm border transition-colors ${
                      selected.includes(l.name)
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-outline hover:border-primary/50'
                    }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button className="w-full" onClick={complete}>
            Complete Setup →
          </Button>
        </div>
      </div>
    </>
  );
}

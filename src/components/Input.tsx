import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs font-medium uppercase tracking-wider text-onSurface-variant">
          {label}
        </label>
      )}
      <input ref={ref} className={`input-field ${className}`} {...props} />
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  )
);

Input.displayName = 'Input';

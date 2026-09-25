interface StepProgressProps {
  steps: string[];
  currentStep: number;
}

export function StepProgress({ steps, currentStep }: StepProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between md:hidden mb-2">
        <span className="text-xs uppercase tracking-wider text-onSurface-variant">
          Step {currentStep + 1} of {steps.length}
        </span>
        <span className="text-sm font-medium">{steps[currentStep]}</span>
      </div>
      <div className="h-1.5 bg-surface-dim rounded-full overflow-hidden md:hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
      <div className="hidden md:flex gap-4">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                i <= currentStep ? 'bg-primary text-white' : 'bg-surface-dim text-onSurface-variant'
              }`}
            >
              {i + 1}
            </div>
            <span className={`text-sm ${i <= currentStep ? 'text-onSurface' : 'text-onSurface-variant'}`}>
              {label.toUpperCase()}
            </span>
            {i < steps.length - 1 && (
              <div className={`w-12 h-0.5 ${i < currentStep ? 'bg-primary' : 'bg-outline'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

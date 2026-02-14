import './BeginnerMode.css';

interface StepIndicatorProps {
  total: number;
  current: number;
}

export default function StepIndicator({ total, current }: StepIndicatorProps) {
  return (
    <div className="step-indicator" role="progressbar" aria-valuenow={current + 1} aria-valuemin={1} aria-valuemax={total}>
      <div className="step-dots">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`step-dot ${i < current ? 'completed' : ''} ${i === current ? 'active' : ''}`}
          />
        ))}
      </div>
      <span className="step-text">{current + 1} / {total}</span>
    </div>
  );
}

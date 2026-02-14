import './BeginnerMode.css';

interface GuideBubbleProps {
  text: string;
  position?: 'top' | 'bottom';
}

export default function GuideBubble({ text, position = 'top' }: GuideBubbleProps) {
  return (
    <div className={`guide-bubble guide-bubble-${position}`} role="status" aria-live="polite">
      <span className="guide-avatar">&#129302;</span>
      <p className="guide-text">{text}</p>
    </div>
  );
}

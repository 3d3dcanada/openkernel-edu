import './BeginnerMode.css';

interface GlowingTileProps {
  emoji: string;
  label: string;
  isGlowing: boolean;
  isDimmed: boolean;
  onClick: () => void;
}

export default function GlowingTile({ emoji, label, isGlowing, isDimmed, onClick }: GlowingTileProps) {
  return (
    <button
      className={`beginner-tile ${isGlowing ? 'glow-tile' : ''} ${isDimmed ? 'dimmed' : ''}`}
      onClick={onClick}
      disabled={isDimmed}
      aria-label={`${label} ${isGlowing ? '- tap this one!' : ''}`}
    >
      <span className="tile-emoji">{emoji}</span>
      <span className="tile-label">{label}</span>
      {isGlowing && <span className="tile-pointer" aria-hidden="true">&#128070;</span>}
    </button>
  );
}

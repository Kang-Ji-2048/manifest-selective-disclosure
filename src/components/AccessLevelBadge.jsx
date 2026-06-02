import { levelById } from "../theme.js";

export default function AccessLevelBadge({ levelId, showAudience = false }) {
  const lvl = levelById(levelId);
  if (!lvl) return null;
  return (
    <span className="lvl-badge" style={{ color: lvl.color }} title={lvl.plain}>
      <span className="ic" aria-hidden>
        {lvl.icon}
      </span>
      {lvl.label}
      {showAudience && (
        <span style={{ fontWeight: 500, opacity: 0.8 }}>· {lvl.audience}</span>
      )}
    </span>
  );
}

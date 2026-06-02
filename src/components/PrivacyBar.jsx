import { useSession } from "../state/SessionContext.jsx";

function fmt(s) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

// The deniability/anti-surveillance status strip. Communicates, in plain
// language, the guarantees the architecture actually provides.
export default function PrivacyBar({ withClock = true }) {
  const { secondsLeft } = useSession();
  const warn = secondsLeft <= 15;
  return (
    <div className="privacy-bar" role="status" aria-live="polite">
      <span className="item">🚫🍪 No cookies</span>
      <span className="item">📡 No tracking</span>
      <span className="item">🗑️ Clears on close</span>
      {withClock && (
        <span className={"clock" + (warn ? " warn" : "")}>
          auto-logout {fmt(secondsLeft)}
        </span>
      )}
    </div>
  );
}

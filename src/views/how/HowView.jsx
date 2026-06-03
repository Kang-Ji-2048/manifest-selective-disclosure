import { Link } from "react-router-dom";
import { pipeline, attacks } from "../../data/mockData.js";
import { ACCESS_LEVELS } from "../../theme.js";

// Simple inline-SVG line icons (stroke = currentColor, so they pick up the
// accent colour). Kept deliberately plain so a non-technical reader gets the
// meaning at a glance.
function Icon({ name, size = 26 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  switch (name) {
    case "lock":
      return (
        <svg {...common}>
          <rect x="5" y="11" width="14" height="9" rx="2" />
          <path d="M8 11 V8 a4 4 0 0 1 8 0 v3" />
        </svg>
      );
    case "eye-off":
      return (
        <svg {...common}>
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
          <line x1="3" y1="3" x2="21" y2="21" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12l3 3 5-6" />
        </svg>
      );
    case "undo":
      return (
        <svg {...common}>
          <path d="M4 9h10a5 5 0 0 1 0 10H8" />
          <path d="M4 9l4-4M4 9l4 4" />
        </svg>
      );
    case "phone":
      return (
        <svg {...common}>
          <rect x="7" y="2" width="10" height="20" rx="2.5" />
          <line x1="10.5" y1="5" x2="13.5" y2="5" />
          <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 2l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5z" />
          <path d="M9 12l2.5 2.5L16 9" />
        </svg>
      );
    case "bars":
      return (
        <svg {...common}>
          <line x1="4" y1="20" x2="20" y2="20" />
          <rect x="6" y="12" width="3" height="7" fill="currentColor" stroke="none" />
          <rect x="11" y="7" width="3" height="12" fill="currentColor" stroke="none" />
          <rect x="16" y="14" width="3" height="5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "sliders":
      return (
        <svg {...common}>
          <line x1="5" y1="7" x2="19" y2="7" />
          <circle cx="9" cy="7" r="2.3" fill="currentColor" stroke="none" />
          <line x1="5" y1="12" x2="19" y2="12" />
          <circle cx="14" cy="12" r="2.3" fill="currentColor" stroke="none" />
          <line x1="5" y1="17" x2="19" y2="17" />
          <circle cx="11" cy="17" r="2.3" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return null;
  }
}

const TRUST = [
  { icon: "lock", text: "Your footage stays on your phone" },
  { icon: "eye-off", text: "No name, no account — nothing to hack" },
  { icon: "check", text: "Anyone can check the numbers are real" },
  { icon: "undo", text: "You stay in control — reversible until you choose a court" },
];

const STEPS = [
  {
    icon: "phone",
    title: "You record it",
    body: "You film or photograph what happened — offline. It's locked in a vault only your passphrase opens. We never receive a copy.",
  },
  {
    icon: "shield",
    title: "Real people confirm it",
    body: "Independent volunteers check it's genuine, then delete their copy. There is no central library of footage for anyone to seize or leak.",
  },
  {
    icon: "bars",
    title: "It becomes a safe number",
    body: "Your evidence joins a count. We can prove the count is true — “512 people recorded this” — without revealing a single person.",
  },
  {
    icon: "sliders",
    title: "You decide what's shared",
    body: "Only you choose how far it goes: keep it sealed, strengthen the count, share an anonymous version, or give one named court your full record.",
  },
];

export default function HowView() {
  return (
    <div className="container stack">
      <section className="hero">
        <h1>How it works</h1>
        <p>
          Your phone records what happened. The recording never leaves it. Only a verified,
          anonymous proof does — and only if you say so.
        </p>
      </section>

      {/* ---- 30-second trust strip ---- */}
      <div className="grid cols-4 trust-strip">
        {TRUST.map((t) => (
          <div key={t.text} className="card pad trust-item">
            <span className="trust-ic">
              <Icon name={t.icon} size={26} />
            </span>
            <span>{t.text}</span>
          </div>
        ))}
      </div>

      {/* ---- Four big steps ---- */}
      <div className="eyebrow">The whole idea, in four steps</div>
      <ol className="flow-steps">
        {STEPS.map((s, i) => (
          <li key={s.title} className="card pad flow-step">
            <span className="flow-ic">
              <Icon name={s.icon} size={40} />
            </span>
            <div>
              <div className="flow-step-head">
                <span className="flow-n">{i + 1}</span>
                <b>{s.title}</b>
              </div>
              <p className="muted" style={{ margin: "4px 0 0", fontSize: 14 }}>
                {s.body}
              </p>
            </div>
          </li>
        ))}
      </ol>

      {/* ---- What you can choose ---- */}
      <div className="eyebrow">What you can choose · the safe default is to share nothing</div>
      <div className="grid cols-4">
        {ACCESS_LEVELS.map((l) => (
          <div key={l.id} className="card pad stack how-level" style={{ borderTop: `3px solid ${l.color}`, gap: 6 }}>
            <div style={{ fontSize: 24 }} aria-hidden>
              {l.icon}
            </div>
            <b style={{ fontSize: 14 }}>{l.label}</b>
            <div className="faint" style={{ fontSize: 12 }}>
              {l.short}
            </div>
            <span className="tag" style={{ color: l.color, borderColor: l.color }}>
              {l.reversible ? "Reversible" : "One-way · permanent"}
            </span>
          </div>
        ))}
      </div>

      {/* ---- Optional technical depth ---- */}
      <details className="tech-details">
        <summary>Under the hood — for people who want the detail</summary>
        <div className="tech-body stack">
          <p className="muted" style={{ marginTop: 0, fontSize: 13 }}>
            The plain steps above map onto five technical stages. Each stage also blunts a specific
            kind of attack.
          </p>
          <ol className="how-steps">
            {pipeline.map((p) => (
              <li key={p.n} className="how-step card pad" style={{ background: "var(--bg)" }}>
                <div className="step-num">{p.n}</div>
                <div className="stack" style={{ gap: 6 }}>
                  <div>
                    <b style={{ fontSize: 14 }}>{p.title}</b>{" "}
                    <span className="faint" style={{ fontSize: 12 }}>· {p.sub}</span>
                  </div>
                  <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                    {p.body}
                  </p>
                  <div className="pill-row">
                    {p.defends.map((d) => (
                      <span key={d} className="tag">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="eyebrow" style={{ marginTop: 6 }}>
            Attacks each stage defends against
          </div>
          <div className="grid cols-2">
            {attacks.map((a) => (
              <div key={a.id} className="card pad" style={{ background: "var(--bg)" }}>
                <b style={{ fontSize: 13 }}>{a.name}</b>{" "}
                <span className="faint" style={{ fontSize: 12 }}>· {a.e}</span>
                <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                  ↳ {a.fix}
                </div>
              </div>
            ))}
          </div>

          <p className="faint" style={{ fontSize: 11.5, margin: 0 }}>
            The building blocks: C2PA capture-time signing, OpenTimestamps anchoring to Bitcoin,
            Semaphore one-count proofs, differential privacy, and BBS+ selective disclosure. These
            protect the published figures — they do not harden your phone, which stays the weakest
            link.
          </p>
        </div>
      </details>

      {/* ---- CTA ---- */}
      <div className="nudge stack">
        <h3>Don't take our word for it</h3>
        <p style={{ margin: 0 }}>
          Every number on the public dashboard can be checked by anyone, and your own vault shows
          exactly what would leave before anything does.
        </p>
        <div className="pill-row" style={{ marginTop: 4 }}>
          <Link className="btn btn-primary" to="/public">
            See the public numbers →
          </Link>
          <Link className="btn" to="/me">
            Open your vault →
          </Link>
        </div>
      </div>
    </div>
  );
}

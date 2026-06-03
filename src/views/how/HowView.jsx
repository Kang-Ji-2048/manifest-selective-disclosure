import { Link } from "react-router-dom";
import { pipeline, attacks } from "../../data/mockData.js";
import { ACCESS_LEVELS } from "../../theme.js";

// Two device-side steps that precede the verification pipeline, written in
// plain language. The remaining steps are pulled from the shared `pipeline`
// data so this page and the Court view never drift apart.
const CAPTURE_STEPS = [
  {
    title: "Capture on your device",
    sub: "C2PA signed at the moment of recording",
    body:
      "You record offline. The file is signed with a C2PA provenance manifest at capture and sealed in an encrypted vault only your passphrase opens. Nothing is uploaded, and there is no account to leak.",
    defends: ["Encrypted vault", "Offline capture", "C2PA provenance"],
  },
  {
    title: "Anchor it in time",
    sub: "OpenTimestamps → Bitcoin",
    body:
      "Only a hash of the file is committed to Bitcoin via OpenTimestamps, giving tamper-evident proof it existed at that moment. The media itself never leaves your phone.",
    defends: ["Tamper-evident", "No media upload"],
  },
];

const PATHS = [
  { k: "A", t: "Aggregate proof + anchor", d: "Corroborates scale and timing at no individual cost. No one steps forward." },
  { k: "B", t: "A witness steps forward", d: "One willing contributor selectively discloses their full chain of custody to a named court (BBS+)." },
  { k: "C", t: "Sealed escrow", d: "A provenance key released only under pre-defined legal conditions. The contributor, never the platform, chooses." },
];

function Step({ n, title, sub, body, defends }) {
  return (
    <li className="how-step card pad">
      <div className="step-num">{n}</div>
      <div className="stack" style={{ gap: 6 }}>
        <div>
          <b style={{ fontSize: 15 }}>{title}</b>{" "}
          <span className="faint" style={{ fontSize: 12.5 }}>· {sub}</span>
        </div>
        <p className="muted" style={{ margin: 0, fontSize: 13.5 }}>
          {body}
        </p>
        {defends && (
          <div className="pill-row">
            {defends.map((d) => (
              <span key={d} className="tag">
                {d}
              </span>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}

export default function HowView() {
  const steps = [
    ...CAPTURE_STEPS,
    ...pipeline.map((p) => ({ title: p.title, sub: p.sub, body: p.body, defends: p.defends })),
  ];

  return (
    <div className="container stack">
      <section className="hero">
        <h1>How Manifest works</h1>
        <p>
          From a recording on a phone to a verifiable, anonymous statistic — with no central
          database of victims, and without anyone having to trust us. Here is the whole path, and
          where the contributor stays in control.
        </p>
      </section>

      {/* ---- End-to-end flow ---- */}
      <div className="eyebrow">From phone to proof · the life of a testimony</div>
      <ol className="how-steps">
        {steps.map((s, i) => (
          <Step key={s.title} n={i + 1} title={s.title} sub={s.sub} body={s.body} defends={s.defends} />
        ))}
      </ol>

      {/* ---- Disclosure levels ---- */}
      <div className="eyebrow">You decide what leaves · four disclosure levels</div>
      <div className="grid cols-4">
        {ACCESS_LEVELS.map((l) => (
          <div key={l.id} className="card pad stack how-level" style={{ borderTop: `3px solid ${l.color}` }}>
            <div style={{ fontSize: 24 }} aria-hidden>
              {l.icon}
            </div>
            <div>
              <b style={{ fontSize: 14.5 }}>{l.label}</b>
              <div className="faint" style={{ fontSize: 12 }}>
                {l.audience}
              </div>
            </div>
            <p className="muted" style={{ margin: 0, fontSize: 12.5 }}>
              {l.plain}
            </p>
            <span className="tag" style={{ color: l.color, borderColor: l.color }}>
              {l.reversible ? "Reversible" : "One-way · permanent"}
            </span>
          </div>
        ))}
      </div>

      {/* ---- Court paths ---- */}
      <div className="eyebrow">If it reaches a court · three paths, the contributor's choice</div>
      <div className="grid cols-3">
        {PATHS.map((p) => (
          <div key={p.k} className="card pad stack">
            <div style={{ fontFamily: "var(--display)", fontSize: 26, fontWeight: 700, color: "var(--accent-text)" }}>
              Path {p.k}
            </div>
            <b style={{ fontSize: 14 }}>{p.t}</b>
            <p className="muted" style={{ margin: 0, fontSize: 12.5 }}>
              {p.d}
            </p>
          </div>
        ))}
      </div>

      {/* ---- Adversaries ---- */}
      <div className="eyebrow">Adversaries the pipeline defends against</div>
      <div className="grid cols-2">
        {attacks.map((a) => (
          <div key={a.id} className="card pad">
            <b style={{ fontSize: 13.5 }}>{a.name}</b>{" "}
            <span className="faint" style={{ fontSize: 12.5 }}>· {a.e}</span>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>
              ↳ {a.fix}
            </div>
          </div>
        ))}
      </div>

      {/* ---- Honest limit + CTA ---- */}
      <div className="nudge stack">
        <h3>See the proofs for yourself</h3>
        <p style={{ margin: 0 }}>
          These methods protect the published statistic; they do not harden the contributor's own
          device, which remains the weakest link. Every published figure still carries a
          zero-knowledge proof and a stated differential-privacy method you can check.
        </p>
        <div className="pill-row" style={{ marginTop: 4 }}>
          <Link className="btn btn-primary" to="/public">
            Public dashboard →
          </Link>
          <Link className="btn" to="/me">
            Your vault →
          </Link>
        </div>
      </div>
    </div>
  );
}

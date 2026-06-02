import { useState } from "react";
import { Link } from "react-router-dom";
import { aggregate, exemplars } from "../../data/mockData.js";

function Sparkline({ data, color = "#0072b2" }) {
  const w = 220;
  const h = 48;
  const max = Math.max(...data);
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * (h - 6) - 3}`)
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Verified testimonies over time">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatCard({ n, lbl, proof }) {
  const [shown, setShown] = useState(false);
  return (
    <div className="card pad stat">
      <div className="n">{n}</div>
      <div className="lbl">{lbl}</div>
      <button
        className="verify"
        style={{ border: "none", background: "none", cursor: "pointer", padding: 0 }}
        onClick={() => setShown((s) => !s)}
      >
        🔎 {shown ? "hide proof" : "verify this figure"}
      </button>
      {shown && (
        <div className="verify-box" style={{ marginTop: 10, color: "#3a5", background: "#0b0f14" }}>
          <div className="line">
            <span className="ok">✓</span> ZK count proof <span className="mono">{proof}</span>
          </div>
          <div className="line ok">✓ issuer signatures valid · nullifiers distinct</div>
          <div className="line ok">✓ figure recomputes locally — no identities revealed</div>
        </div>
      )}
    </div>
  );
}

export default function PublicView() {
  const a = aggregate;
  return (
    <div className="container stack">
      <section className="hero">
        <h1>Prove something happened — without exposing the people who were there.</h1>
        <p>
          Manifest publishes <b>proofs, not databases</b>. Every figure below is
          differentially private and carries a zero-knowledge proof you can verify
          yourself. No testimony, location or identity is ever stored centrally.
        </p>
      </section>

      {/* ---- Funder section ---- */}
      <div className="eyebrow">For funders · verifiable collective impact</div>
      <div className="grid cols-4">
        <StatCard n={`≥ ${a.headline.testimonies}`} lbl="Verified testimonies" proof={a.proofId} />
        <StatCard n={a.headline.events} lbl="Distinct events" proof="sem:events:b2…" />
        <StatCard n={a.headline.regions} lbl="Regions" proof="sem:regions:9c…" />
        <StatCard n={a.headline.verifiers} lbl="Independent verifiers" proof="sem:verif:41…" />
      </div>

      <div className="grid cols-2">
        <div className="card pad stack">
          <div className="eyebrow">By region</div>
          {a.regions.map((r) => (
            <div key={r.name}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span>{r.name}</span>
                <span className="muted">
                  {r.count} · {r.events} events
                </span>
              </div>
              <div className="bar">
                <span style={{ width: `${r.share * 100}%`, background: "var(--oi-blue)" }} />
              </div>
            </div>
          ))}
          <div className="faint" style={{ fontSize: 11.5 }}>
            Figures perturbed with differential privacy (ε = {a.epsilon}) over {a.window}.
          </div>
        </div>

        <div className="card pad stack">
          <div className="eyebrow">Verified testimonies over time</div>
          <Sparkline data={a.trend} />
          <p className="muted" style={{ fontSize: 13, margin: 0 }}>
            Funders already accept aggregate reporting. The novelty here is that the
            aggregate is <b>cryptographically verifiable</b> rather than self-asserted — a
            programme officer can independently recompute every number without ever seeing a
            person.
          </p>
          <div className="pill-row">
            <span className="tag">Semaphore counts</span>
            <span className="tag">Differential privacy</span>
            <span className="tag">No honeypot</span>
          </div>
        </div>
      </div>

      {/* ---- Public exemplars ---- */}
      <div className="eyebrow">In their words · shared by choice, stripped of identity</div>
      <div className="grid cols-3">
        {exemplars.map((x) => (
          <div className="exemplar" key={x.id}>
            <div className="q">“{x.quote}”</div>
            <div className="src">{x.src}</div>
          </div>
        ))}
      </div>

      {/* ---- Nudge ---- */}
      <div className="nudge stack">
        <h3>Do you have evidence of the same thing?</h3>
        <p style={{ margin: 0 }}>
          You are almost certainly not the only one. When you contribute, Manifest can tell
          you privately how many others recorded the same event — without anyone, including
          us, learning who you are. Your recording stays on your phone. Only a proof ever
          leaves, and only if you choose to release it.
        </p>
        <div className="pill-row" style={{ marginTop: 4 }}>
          <Link className="btn btn-primary" to="/me">
            See how it works on your phone →
          </Link>
          <span className="tag">🔗 41 others recorded near you this month</span>
        </div>
      </div>
    </div>
  );
}

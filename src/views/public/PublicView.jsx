import { useState } from "react";
import { Link } from "react-router-dom";
import { aggregate, exemplars, themes, methodRefs } from "../../data/mockData.js";

// Fan chart: the noised month-level series with its 95% DP interval drawn as a
// shaded band. Showing the uncertainty is both more honest and blurs the
// precision an attacker would need.
function FanChart({ trend, color = "#0072b2" }) {
  const w = 280;
  const h = 96;
  const padX = 8;
  const padTop = 8;
  const padBottom = 20;
  const pts = trend.points;
  const hi = pts.map((p) => p.v + (p.pm || 0));
  const lo = pts.map((p) => Math.max(0, p.v - (p.pm || 0)));
  const max = Math.max(...hi);
  const x = (i) => padX + (i / (pts.length - 1)) * (w - 2 * padX);
  const y = (v) => h - padBottom - (v / max) * (h - padTop - padBottom);

  const center = pts.map((p, i) => `${x(i)},${y(p.v)}`).join(" ");
  const band =
    pts.map((_, i) => `${x(i)},${y(hi[i])}`).join(" ") +
    " " +
    pts.map((_, i) => `${x(pts.length - 1 - i)},${y(lo[pts.length - 1 - i])}`).join(" ");

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label="Verified testimonies per month, with 95% differential-privacy interval"
    >
      <polygon points={band} fill={color} opacity="0.16" />
      <polyline points={center} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={p.t}>
          <circle cx={x(i)} cy={y(p.v)} r="2.6" fill={color} />
          <text x={x(i)} y={h - 6} fontSize="9" textAnchor="middle" fill="#8a929c">
            {p.t}
          </text>
        </g>
      ))}
    </svg>
  );
}

function figureText(f) {
  if (f.mode === "ge") return `≥ ${f.value}`;
  if (f.mode === "pm") return `${f.value} ± ${f.pm}`;
  return `${f.value}`;
}

function StatCard({ figure, lbl }) {
  const [shown, setShown] = useState(false);
  return (
    <div className="card pad stat">
      <div className="n">{figureText(figure)}</div>
      <div className="lbl">{lbl}</div>
      {figure.mode === "pm" && (
        <div className="faint" style={{ fontSize: 10.5, marginTop: 1 }}>
          95% interval · DP-noised
        </div>
      )}
      {figure.mode === "ge" && (
        <div className="faint" style={{ fontSize: 10.5, marginTop: 1 }}>
          lower bound · exact value withheld
        </div>
      )}
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
            <span className="ok">✓</span> ZK count proof <span className="mono">{figure.proof}</span>
          </div>
          <div className="line ok">✓ issuer signatures valid · nullifiers distinct</div>
          <div className="line ok">✓ figure recomputes locally — no identities revealed</div>
        </div>
      )}
    </div>
  );
}

// Treemap of theme shares from opted-in text. A 1-D squarified layout (tiles
// sized by share) — no verbatim text leaves the aggregate.
function ThemeTreemap({ data }) {
  return (
    <div className="treemap" role="img" aria-label="Share of testimonies by theme">
      {data.map((t) => (
        <div
          key={t.name}
          className="tile"
          style={{ flexGrow: t.share, background: t.color }}
          title={`${t.name} · ${Math.round(t.share * 100)}%`}
        >
          <span className="tile-name">{t.name}</span>
          <span className="tile-share">{Math.round(t.share * 100)}%</span>
        </div>
      ))}
    </div>
  );
}

export default function PublicView() {
  const a = aggregate;
  const visibleRegions = a.regions.filter((r) => r.count >= a.minCohort);
  const suppressed = a.regions.filter((r) => r.count < a.minCohort);
  const maxRegion = Math.max(...visibleRegions.map((r) => r.count + (r.pm || 0)));

  return (
    <div className="container stack">
      <section className="hero">
        <h1>Prove something happened — without exposing the people who were there.</h1>
        <p>
          Manifest publishes <b>proofs, not databases</b>. Every figure below is
          differentially private, released as a <b>verifiable range</b> rather than a
          false-precision point, and carries a zero-knowledge proof you can check
          yourself. No testimony, location or identity is ever stored centrally.
        </p>
      </section>

      {/* ---- Funder section ---- */}
      <div className="eyebrow">For funders · verifiable collective impact</div>
      <div className="grid cols-4">
        <StatCard figure={a.headline.testimonies} lbl="Verified testimonies" />
        <StatCard figure={a.headline.events} lbl="Distinct events" />
        <StatCard figure={a.headline.regions} lbl="Regions" />
        <StatCard figure={a.headline.verifiers} lbl="Independent verifiers" />
      </div>

      <div className="grid cols-2">
        <div className="card pad stack">
          <div className="eyebrow">By region · coarse admin level</div>
          {visibleRegions.map((r) => (
            <div key={r.name}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span>{r.name}</span>
                <span className="muted">
                  {r.count} ± {r.pm} · {r.events} events
                </span>
              </div>
              <div className="bar bar-ci" aria-hidden>
                {/* ± interval rendered behind the point estimate */}
                <span
                  className="ci"
                  style={{
                    left: `${((r.count - r.pm) / maxRegion) * 100}%`,
                    width: `${((2 * r.pm) / maxRegion) * 100}%`,
                  }}
                />
                <span
                  className="pt"
                  style={{ left: `calc(${(r.count / maxRegion) * 100}% - 1px)`, background: "var(--oi-blue)" }}
                />
              </div>
            </div>
          ))}
          {suppressed.map((r) => (
            <div key={r.name}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span>{r.name}</span>
                <span className="faint">&lt; {a.minCohort} · suppressed</span>
              </div>
              <div className="bar" aria-hidden>
                <span className="suppressed-fill" />
              </div>
            </div>
          ))}
          <div className="faint" style={{ fontSize: 11.5 }}>
            Counts perturbed with differential privacy (ε = {a.epsilon}) over {a.window};
            bars show the 95% interval. Any region with fewer than {a.minCohort} contributors is
            <b> suppressed, not approximated</b> (cohort k-anonymity). No point maps are published.
          </div>
        </div>

        <div className="card pad stack">
          <div className="eyebrow">Verified testimonies over time · {a.trend.unit}</div>
          <FanChart trend={a.trend} />
          <p className="muted" style={{ fontSize: 13, margin: 0 }}>
            The shaded band is the differential-privacy uncertainty, shown rather than hidden.
            Funders are buying a <b>cryptographically verifiable range</b> — a programme officer
            can independently recompute every figure without ever seeing a person.
          </p>
          <div className="pill-row">
            <span className="tag">Semaphore counts</span>
            <span className="tag">Differential privacy</span>
            <span className="tag">Uncertainty shown</span>
          </div>
        </div>
      </div>

      {/* ---- Theme shares ---- */}
      <div className="grid cols-2">
        <div className="card pad stack">
          <div className="eyebrow">What the testimonies are about · theme shares</div>
          <ThemeTreemap data={themes} />
          <div className="faint" style={{ fontSize: 11.5 }}>
            Topic categories from text contributors opted into public disclosure, shown as
            <b> shares of the whole</b> — never as word clouds, verbatim quotes, or searchable
            free text.
          </div>
        </div>

        <div className="card pad stack">
          <div className="eyebrow">Disclosure-control methods · cited</div>
          <ul className="method-list">
            {methodRefs.map((m) => (
              <li key={m.method}>
                <div className="m-method">{m.method}</div>
                <div className="m-use">{m.use}</div>
                <div className="m-cite">{m.cite}</div>
              </li>
            ))}
          </ul>
          <div className="faint" style={{ fontSize: 11 }}>
            Honest limit: these methods protect the <i>published statistic</i>. Publishing too many
            overlapping aggregates can still enable reconstruction — the defence is restraint — and
            none of this hardens the contributor's endpoint, which remains the weakest link.
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
          <span className="tag">🔗 ≥ 40 others recorded the same events this month</span>
        </div>
      </div>
    </div>
  );
}

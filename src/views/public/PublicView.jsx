import { useState } from "react";
import { Link } from "react-router-dom";
import { aggregate, exemplars, themes, methodRefs, issues, regionShapes } from "../../data/mockData.js";

// Fan chart: the noised month-level series with its 95% DP interval drawn as a
// shaded band. Showing the uncertainty is both more honest and blurs the
// precision an attacker would need.
function FanChart({ trend, color = "var(--accent)" }) {
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

  // `color` flows in via the SVG's CSS `color` so currentColor resolves the
  // theme variable (var() does not resolve in SVG presentation attributes).
  return (
    <svg
      width="100%"
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label="Verified testimonies per month, with 95% differential-privacy interval"
      style={{ color }}
    >
      <polygon points={band} fill="currentColor" opacity="0.16" />
      <polyline points={center} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={p.t}>
          <circle cx={x(i)} cy={y(p.v)} r="2.6" fill="currentColor" />
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

// Resolve the per-region view for the current selection. For "all issues" we use
// the headline regional breakdown; for a specific issue we use its byRegion data.
// Every cell is tagged none / suppressed / shown against the k-anonymity rule.
function regionViewFor(issue) {
  const k = aggregate.minCohort;
  return aggregate.regions.map((r) => {
    let count;
    let pm;
    let events;
    if (issue) {
      const b = issue.byRegion.find((x) => x.region === r.name) || { count: 0 };
      count = b.count;
      pm = b.pm;
    } else {
      count = r.count;
      pm = r.pm;
      events = r.events;
    }
    const state = count === 0 ? "none" : count < k ? "suppressed" : "shown";
    return { name: r.name, count, pm, events, state };
  });
}

// Interactive coarse choropleth + constrained issue drill-down.
// No point/pin layer, no jitter — geography is aggregated to admin regions and
// sub-threshold cells are suppressed. Rendered as local inline SVG (no tiles/CDN).
function MapExplorer() {
  const [issueId, setIssueId] = useState(null); // null = all issues
  const [region, setRegion] = useState(null);

  const issue = issues.find((i) => i.id === issueId) || null;
  const view = regionViewFor(issue);
  const k = aggregate.minCohort;
  const maxShown = Math.max(1, ...view.filter((v) => v.state === "shown").map((v) => v.count));
  const total = issue ? issue.total : aggregate.headline.testimonies;
  const trend = issue ? issue.trend : aggregate.trend;
  const selected = region ? view.find((v) => v.name === region) : null;

  return (
    <div className="stack">
      {/* Constrained issue selector — fixed list, no free-form filtering */}
      <div className="issue-tabs" role="tablist" aria-label="Filter by issue">
        <button
          role="tab"
          aria-selected={!issueId}
          className={!issueId ? "active" : ""}
          onClick={() => {
            setIssueId(null);
            setRegion(null);
          }}
        >
          All issues
        </button>
        {issues.map((i) => (
          <button
            key={i.id}
            role="tab"
            aria-selected={issueId === i.id}
            className={issueId === i.id ? "active" : ""}
            onClick={() => {
              setIssueId(i.id);
              setRegion(null);
            }}
          >
            <span aria-hidden>{i.icon}</span> {i.name}
          </button>
        ))}
      </div>

      <div className="grid cols-2">
        {/* ---- Map ---- */}
        <div className="card pad stack">
          <div className="eyebrow">
            Where testimonies come from · Asia–Pacific {issue ? `· ${issue.name}` : ""}
          </div>
          <svg
            viewBox={regionShapes.viewBox}
            className="choropleth"
            role="group"
            aria-label="Coarse regional choropleth of testimony counts"
          >
            <defs>
              <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="6" height="6" fill="transparent" />
                <line x1="0" y1="0" x2="0" y2="6" stroke="#9aa0a6" strokeWidth="2" />
              </pattern>
            </defs>
            {regionShapes.regions.map((g) => {
              const v = view.find((x) => x.name === g.name);
              const intensity = v.state === "shown" ? v.count / maxShown : 0;
              const fill =
                v.state === "none"
                  ? "var(--line-soft)"
                  : v.state === "suppressed"
                  ? "url(#hatch)"
                  : `rgba(var(--accent-rgb),${0.2 + intensity * 0.7})`;
              const isSel = region === g.name;
              return (
                <path
                  key={g.name}
                  d={g.path}
                  style={{ fill, stroke: isSel ? "var(--oi-vermillion)" : "#fff", strokeWidth: isSel ? 3 : 1.5 }}
                  className="region-shape"
                  onClick={() => setRegion(isSel ? null : g.name)}
                  role="button"
                  tabIndex={0}
                  aria-label={
                    v.state === "shown"
                      ? `${g.name}: ${v.count} ± ${v.pm}`
                      : v.state === "suppressed"
                      ? `${g.name}: fewer than ${k}, suppressed`
                      : `${g.name}: no testimonies`
                  }
                />
              );
            })}
            {regionShapes.regions.map((g) => {
              const v = view.find((x) => x.name === g.name);
              const light = v.state === "shown" && v.count / maxShown > 0.5;
              return (
                <text
                  key={`l-${g.name}`}
                  x={g.lx}
                  y={g.ly}
                  fontSize="12"
                  fontWeight="800"
                  textAnchor="middle"
                  pointerEvents="none"
                  style={{ fill: light ? "var(--on-accent)" : "var(--ink)" }}
                >
                  {g.short}
                </text>
              );
            })}
          </svg>

          <div className="map-legend">
            <span className="swatch grad" /> fewer →
            <span className="swatch grad-hi" /> more
            <span className="swatch hatch" /> &lt; {k} suppressed
            <span className="swatch none" /> none
          </div>

          {selected ? (
            <div className="region-detail">
              <b>{selected.name}</b>
              {selected.state === "shown" && (
                <span className="muted">
                  {" "}
                  — {selected.count} ± {selected.pm}
                  {selected.events != null ? ` · ${selected.events} distinct events` : ""}
                </span>
              )}
              {selected.state === "suppressed" && (
                <span className="faint"> — fewer than {k} contributors · suppressed (no usable count)</span>
              )}
              {selected.state === "none" && <span className="faint"> — no testimonies recorded</span>}
            </div>
          ) : (
            <div className="faint" style={{ fontSize: 12 }}>
              Select a region for its figure. Shading is the DP-noised count; hatched regions fall
              below the k-anonymity threshold and are suppressed, not estimated.
            </div>
          )}

          <div className="faint" style={{ fontSize: 11.5 }}>
            Coarse admin-level choropleth — no points, no pins, no jitter. Geography is aggregated
            until each shown cell holds ≥ {k} contributors; the rest are dropped. Rendered locally
            (no map tiles or third-party CDN).
          </div>
        </div>

        {/* ---- Selected-issue statistics ---- */}
        <div className="card pad stack">
          <div className="eyebrow">
            {issue ? "Issue statistics" : "All testimonies"} · verifiable range
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
            <div className="n" style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em" }}>
              {figureText(total)}
            </div>
            <div className="muted" style={{ fontSize: 13 }}>
              {issue ? issue.name : "verified testimonies"} · {aggregate.window}
            </div>
          </div>
          {issue && (
            <p className="muted" style={{ fontSize: 13, margin: 0 }}>
              {issue.blurb}
            </p>
          )}

          <div className="eyebrow" style={{ marginTop: 4 }}>By region</div>
          {view.map((r) =>
            r.state === "shown" ? (
              <div key={r.name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span>{r.name}</span>
                  <span className="muted">{r.count} ± {r.pm}</span>
                </div>
                <div className="bar bar-ci" aria-hidden>
                  <span
                    className="ci"
                    style={{
                      left: `${((r.count - r.pm) / maxShown) * 100}%`,
                      width: `${((2 * r.pm) / maxShown) * 100}%`,
                    }}
                  />
                  <span className="pt" style={{ left: `calc(${(r.count / maxShown) * 100}% - 1px)`, background: "var(--accent)" }} />
                </div>
              </div>
            ) : (
              <div key={r.name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span>{r.name}</span>
                  <span className="faint">{r.state === "suppressed" ? `< ${k} · suppressed` : "—"}</span>
                </div>
                <div className="bar" aria-hidden>
                  <span className="suppressed-fill" style={r.state === "none" ? { background: "var(--line-soft)" } : undefined} />
                </div>
              </div>
            )
          )}

          <div className="eyebrow" style={{ marginTop: 4 }}>Over time · {trend.unit}</div>
          <FanChart trend={trend} />

          <div className="pill-row">
            <span className="tag">Semaphore counts</span>
            <span className="tag">Differential privacy</span>
            <span className="tag">Constrained drill-down</span>
          </div>
          <div className="faint" style={{ fontSize: 11 }}>
            Issues are a fixed list and every issue×region cell obeys the same suppression rule —
            there is no free-form filtering that could isolate a single contributor.
          </div>
        </div>
      </div>
    </div>
  );
}

// Treemap of theme shares from opted-in text. Tiles sized by share — no verbatim
// text leaves the aggregate.
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

      {/* ---- Map + per-issue drill-down ---- */}
      <div className="eyebrow">Explore by issue & geography · fund what you can verify</div>
      <MapExplorer />

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

import { campaigns } from "../../data/mockData.js";
import { apacGeo } from "../../data/apacGeo.js";

// Fit a single country's outline into a square box, centred. Reuses the bundled
// APAC geometry; returns an SVG path string (or null if the country isn't found).
function countryPath(name, box = 116, pad = 12) {
  const f = apacGeo.features.find((x) => x.properties.name === name);
  if (!f) return null;
  const nlon = (lon) => (lon < 0 ? lon + 360 : lon);
  const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
  for (const poly of polys) {
    for (const ring of poly) {
      for (const [lon, lat] of ring) {
        const L = nlon(lon);
        if (L < minLon) minLon = L;
        if (L > maxLon) maxLon = L;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      }
    }
  }
  const spanLon = maxLon - minLon || 1;
  const spanLat = maxLat - minLat || 1;
  const scale = (box - 2 * pad) / Math.max(spanLon, spanLat);
  const offX = pad + ((box - 2 * pad) - spanLon * scale) / 2;
  const offY = pad + ((box - 2 * pad) - spanLat * scale) / 2;
  const px = (lon) => offX + (nlon(lon) - minLon) * scale;
  const py = (lat) => offY + (maxLat - lat) * scale;
  let d = "";
  for (const poly of polys) {
    for (const ring of poly) {
      ring.forEach(([lon, lat], i) => {
        d += (i === 0 ? "M" : "L") + px(lon).toFixed(1) + "," + py(lat).toFixed(1);
      });
      d += "Z";
    }
  }
  return d;
}

// Radar graphic: concentric rings + crosshair + sweep wedge, with the country
// silhouette and a marker on top.
function Radar({ country }) {
  const W = 116;
  const H = 116;
  const cx = W / 2;
  const cy = H / 2;
  const d = countryPath(country, W);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="radar" role="img" aria-label={`${country} radar`}>
      <defs>
        <radialGradient id="sweep" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,0,0.18)" />
          <stop offset="100%" stopColor="rgba(255,255,0,0)" />
        </radialGradient>
      </defs>
      {[16, 30, 44].map((r) => (
        <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,0,0.18)" strokeWidth="0.6" />
      ))}
      <line x1={cx} y1="8" x2={cx} y2={H - 8} stroke="rgba(255,255,0,0.14)" strokeWidth="0.6" />
      <line x1="8" y1={cy} x2={W - 8} y2={cy} stroke="rgba(255,255,0,0.14)" strokeWidth="0.6" />
      <path d={`M${cx},${cy} L${cx},6 A${cy - 6},${cy - 6} 0 0 1 ${W - 8},${cy} Z`} fill="url(#sweep)" />
      {d && <path d={d} className="radar-country" />}
      <circle cx={cx + 14} cy={cy - 10} r="2.2" className="radar-mark" />
    </svg>
  );
}

function CampaignCard({ c }) {
  return (
    <article className={`campaign-card status-${c.status}`}>
      <div className="radar-wrap">
        <Radar country={c.geo || c.country} />
        <span className="status-chip">{c.statusLabel}</span>
        <span className="flag" aria-hidden>
          {c.flag}
        </span>
      </div>
      <div className="campaign-body">
        <div className="eyebrow">{c.country}</div>
        <h3>{c.title}</h3>
        <p className="muted" style={{ margin: 0, fontSize: 12.5 }}>
          {c.blurb}
        </p>
        <div className="pill-row">
          {c.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
        <div className="stat-cells">
          {c.stats.map((s) => (
            <div key={s.label} className="stat-cell">
              <b>{s.n}</b>
              <span className="sc-label">{s.label}</span>
              <span className="sc-src">{s.src}</span>
            </div>
          ))}
        </div>
        <div className="pill-row campaign-actions">
          <button className="btn btn-primary" type="button">
            Take action →
          </button>
          <button className="btn" type="button">
            Donate →
          </button>
          <button className="btn" type="button">
            Remix as poster →
          </button>
        </div>
        <a className="report-link" href="#" onClick={(e) => e.preventDefault()}>
          Amnesty report →
        </a>
      </div>
    </article>
  );
}

export default function FundView() {
  return (
    <div className="container stack">
      <div className="module-head grid cols-2">
        <div>
          <div className="eyebrow module-eyebrow">— Module 03 · Fund</div>
          <h1 className="module-title">Direct to the front line.</h1>
        </div>
        <div className="stack" style={{ justifyContent: "center" }}>
          <p className="muted" style={{ margin: 0 }}>
            Every campaign has its own wallet. Send funds directly in crypto or a currency of your
            choice.
          </p>
          <p className="muted" style={{ margin: 0 }}>
            A 3–5% platform fee sustains Manifest as decentralised public infrastructure — the rest
            reaches the organiser.
          </p>
        </div>
      </div>

      <div className="campaigns-grid">
        {campaigns.map((c) => (
          <CampaignCard key={c.id} c={c} />
        ))}
      </div>

      <div className="faint" style={{ fontSize: 11.5 }}>
        Prototype: figures are illustrative and sourced to public reporting; wallets and donations
        are not live. Campaigns can be created from a signed ground report in the Witness module.
      </div>
    </div>
  );
}

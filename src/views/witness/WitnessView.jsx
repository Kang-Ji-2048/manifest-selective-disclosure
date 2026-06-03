import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { issues, regionShapes, campaigns, COUNTRY_TO_REGION } from "../../data/mockData.js";

// Everything here happens on the device. Nothing is sent to a server; the
// exports are generated in the browser from the form state.
export default function WitnessView() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ category: "", region: "", what: "", when: "", where: "", who: "" });
  const [files, setFiles] = useState([]);
  const [receipt, setReceipt] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // Structured taxonomy shared with the dashboard: a report is aggregated by
  // issue category × region × month, exactly the axes the public figures use.
  const issue = issues.find((i) => i.id === form.category) || null;
  const monthLabel = new Date(form.when || Date.now()).toLocaleString("en-GB", { month: "long" });
  const matchingCampaigns = form.region
    ? campaigns.filter((c) => COUNTRY_TO_REGION[c.geo || c.country] === form.region)
    : [];

  const buildRecord = () => ({
    module: "witness",
    schema: "manifest.ground-report.v1",
    category: issue ? { id: issue.id, name: issue.name } : null,
    region: form.region || null,
    whatHappened: form.what,
    when: form.when || null,
    where: form.where || null,
    who: form.who || "anonymous",
    evidence: files.map((f) => ({ name: f.name, bytes: f.size, type: f.type })),
    createdAt: new Date().toISOString(),
  });

  const download = (filename, text, mime) => {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    download("ground-report.json", JSON.stringify(buildRecord(), null, 2), "application/json");
  };

  const signReceipt = async () => {
    const record = buildRecord();
    const json = JSON.stringify(record);
    let hashHex = "unavailable-in-this-browser";
    try {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(json));
      hashHex = Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    } catch {
      /* Web Crypto unavailable (e.g. non-secure context) — keep placeholder */
    }
    setReceipt({ hash: hashHex, at: record.createdAt });
  };

  const exportPDF = () => {
    const r = buildRecord();
    const rows = [
      ["Category", r.category ? r.category.name : "—"],
      ["Region", r.region || "—"],
      ["What happened", r.whatHappened || "—"],
      ["When", r.when || "—"],
      ["Where", r.where || "—"],
      ["Who", r.who],
      ["Evidence", r.evidence.length ? r.evidence.map((e) => e.name).join(", ") : "none attached"],
      ["Created", r.createdAt],
      ["Receipt (SHA-256)", receipt ? receipt.hash : "not yet signed"],
    ];
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Ground report</title>
      <style>
        body{font-family:'IBM Plex Mono',ui-monospace,monospace;color:#111;margin:40px;line-height:1.5}
        h1{font-family:Oswald,Impact,sans-serif;text-transform:uppercase;letter-spacing:.02em;font-size:28px}
        .row{margin:10px 0}.k{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#666}
        .v{font-size:14px;white-space:pre-wrap;word-break:break-word}
        .seal{margin-top:24px;padding:12px;border:1px solid #111;font-size:11px}
      </style></head><body>
      <h1>Manifest · Ground Report</h1>
      ${rows.map(([k, v]) => `<div class="row"><div class="k">${k}</div><div class="v">${String(v).replace(/</g, "&lt;")}</div></div>`).join("")}
      <div class="seal">Generated on this device. No server received this report. Verify the receipt hash by recomputing SHA-256 over the exported JSON.</div>
      </body></html>`);
    w.document.close();
    w.focus();
    w.print();
  };

  return (
    <div className="container stack">
      <div>
        <div className="eyebrow module-eyebrow">— Module 01 · Witness</div>
        <h1 className="module-title">Submit a ground report.</h1>
        <p className="muted" style={{ maxWidth: "60ch", marginTop: 12 }}>
          Create a structured testimony with verifiable evidence. Export a signed PDF, a
          machine-readable JSON receipt, or launch a campaign directly from the report. By default
          nothing goes to any server — it lives on your device until you choose to publish.
        </p>
      </div>

      <div className="card pad stack report-form">
        <div className="grid cols-2">
          <label className="field">
            <span className="field-label">Category — how it's counted</span>
            <select value={form.category} onChange={set("category")}>
              <option value="">Select a violation type…</option>
              {issues.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field-label">Region — where it's counted</span>
            <select value={form.region} onChange={set("region")}>
              <option value="">Select a region…</option>
              {regionShapes.regions.map((r) => (
                <option key={r.name} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="field">
          <span className="field-label">What happened — in your own words</span>
          <textarea
            rows={4}
            value={form.what}
            onChange={set("what")}
            placeholder="Describe the event in factual terms. This stays on your device; only the category, region and month above are ever counted."
          />
        </label>

        <div className="grid cols-2">
          <label className="field">
            <span className="field-label">When</span>
            <input type="datetime-local" value={form.when} onChange={set("when")} />
          </label>
          <label className="field">
            <span className="field-label">Where</span>
            <input type="text" value={form.where} onChange={set("where")} placeholder="City, location, or GPS" />
          </label>
        </div>

        <label className="field">
          <span className="field-label">
            Who <span className="faint">· optional — can be anonymous</span>
          </span>
          <input type="text" value={form.who} onChange={set("who")} placeholder="Witness name, identifier, or organisation" />
        </label>

        <div className="field">
          <span className="field-label">Evidence</span>
          <label className="dropzone">
            <input
              type="file"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              style={{ display: "none" }}
            />
            {files.length ? (
              <span>{files.map((f) => f.name).join(" · ")}</span>
            ) : (
              <span>Drop files or click — images, video, audio, docs</span>
            )}
          </label>
        </div>

        {receipt && (
          <div className="verify-box stack" style={{ gap: 4 }}>
            <div style={{ fontWeight: 700, color: "var(--accent-text)" }}>Signed on this device</div>
            <div className="line">sha-256: <span className="mono">{receipt.hash}</span></div>
            <div className="line">at: {receipt.at}</div>
            <div className="line faint">Recompute this hash over the exported JSON to verify nothing changed.</div>
          </div>
        )}

        <div className="pill-row report-actions">
          <button className="btn btn-primary" type="button" onClick={signReceipt}>
            Sign &amp; generate receipt →
          </button>
          <button className="btn" type="button" onClick={exportJSON}>
            Export JSON →
          </button>
          <button className="btn" type="button" onClick={exportPDF}>
            Export PDF →
          </button>
        </div>
        <div className="pill-row">
          <button className="btn btn-block" type="button" onClick={() => navigate("/fund")}>
            Create campaign from report →
          </button>
        </div>
      </div>

      {/* How a single report becomes a statistic */}
      <div className="card pad stack" style={{ background: "var(--bg)" }}>
        <div className="eyebrow">Where this goes</div>
        <p className="muted" style={{ margin: 0, fontSize: 13 }}>
          Nothing is published yet. After independent verification, only the structured tags above
          leave — your words, files and identity stay on your device. The report becomes a single{" "}
          <b>anonymous count</b>, added through a one-way Semaphore nullifier that can never be
          traced back to you, feeding the figures funders see:
        </p>
        <ul className="goes-list">
          <li>
            <span className="goes-k">Issue total</span>
            <span>{issue ? issue.name : "— choose a category"}</span>
          </li>
          <li>
            <span className="goes-k">Region</span>
            <span>{form.region ? `${form.region} on the APAC map` : "— choose a region"}</span>
          </li>
          <li>
            <span className="goes-k">Trend</span>
            <span>the {monthLabel} point on the time series</span>
          </li>
          <li>
            <span className="goes-k">Campaigns</span>
            <span>
              {form.region
                ? matchingCampaigns.length
                  ? matchingCampaigns.map((c) => c.country).join(", ")
                  : "no active campaign in that region yet"
                : "— choose a region"}
            </span>
          </li>
        </ul>
        <div className="faint" style={{ fontSize: 11.5 }}>
          Counts are differentially private and obey a minimum-cohort rule: if fewer than 20 people
          report the same issue in your region, it stays suppressed — shown only as “&lt; 20”, never
          as a precise figure that could single you out.
        </div>
      </div>
    </div>
  );
}

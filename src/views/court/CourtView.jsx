import { useState } from "react";
import { authorisedOrgs, courtEvidence, pipeline, attacks } from "../../data/mockData.js";

/* ---------------- Org gate ---------------- */
function CourtGate({ onEnter }) {
  const [orgId, setOrgId] = useState(authorisedOrgs[0].id);
  const [code, setCode] = useState("");
  const org = authorisedOrgs.find((o) => o.id === orgId);

  return (
    <div className="container narrow">
      <div className="court-card">
        <div className="pad stack">
          <div className="eyebrow" style={{ color: "#56b4e9" }}>
            Restricted · authorised organisations only
          </div>
          <h2>Court & accountability access</h2>
          <p className="muted" style={{ margin: 0 }}>
            This view is limited to a fixed register of vetted organisations. Access is
            role-based and revocable (Hats Protocol); every query is itself logged.
          </p>

          <label className="stack" style={{ display: "block" }}>
            <span className="faint" style={{ fontSize: 12 }}>
              Organisation
            </span>
            <select
              value={orgId}
              onChange={(e) => setOrgId(e.target.value)}
              style={{
                width: "100%",
                padding: "11px 12px",
                borderRadius: 10,
                background: "#0b0f14",
                color: "#e6edf3",
                border: "1px solid #2a313b",
                fontSize: 14,
              }}
            >
              {authorisedOrgs.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </label>

          <div className="kv">
            <div className="row">
              <span className="k">Role</span>
              <span className="v">{org.role}</span>
            </div>
            <div className="row">
              <span className="k">Access scope</span>
              <span className="v" style={{ textAlign: "right", maxWidth: 240 }}>
                {org.scope}
              </span>
            </div>
          </div>

          <label className="stack" style={{ display: "block" }}>
            <span className="faint" style={{ fontSize: 12 }}>
              Credential code
            </span>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`e.g. ${org.code}-••••`}
              style={{
                width: "100%",
                padding: "11px 12px",
                borderRadius: 10,
                background: "#0b0f14",
                color: "#e6edf3",
                border: "1px solid #2a313b",
                fontFamily: "var(--mono)",
                letterSpacing: "0.12em",
              }}
            />
          </label>

          <button className="btn btn-primary btn-block" disabled={!code.trim()} onClick={() => onEnter(org)}>
            Authenticate as {org.code}
          </button>
          <div className="hint-chip" style={{ background: "#0b0f14", color: "#9aa6b2" }}>
            Prototype: any code authenticates the demo. A real deployment would verify a
            DID-bound credential and check the org's Hat on-chain.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Verification panel ---------------- */
function VerifyPanel({ zk }) {
  const [done, setDone] = useState(false);
  return (
    <div className="verify-box stack">
      <div style={{ fontWeight: 700, color: "#c8d6e2" }}>Zero-knowledge verification</div>
      <div className="muted" style={{ fontSize: 12 }}>{zk.statement}</div>
      <div className="line">scheme: {zk.scheme}</div>
      <div className="line">proof: {zk.proofId}</div>
      <div className="line">{zk.nullifier}</div>
      {!done ? (
        <button className="btn btn-primary" style={{ alignSelf: "flex-start" }} onClick={() => setDone(true)}>
          Run verifier
        </button>
      ) : (
        <>
          <div className="line ok">✓ proof structurally valid</div>
          <div className="line ok">✓ issued by an authorised verifier (Hat valid at issue time)</div>
          <div className="line ok">✓ nullifier unique — counted exactly once</div>
          <div className="line ok">✓ statement holds · no identity revealed</div>
        </>
      )}
    </div>
  );
}

/* ---------------- Evidence detail ---------------- */
function EvidenceDetail({ ev, onBack }) {
  return (
    <div className="stack">
      <button className="btn btn-ghost" onClick={onBack} style={{ alignSelf: "flex-start", color: "#9aa6b2" }}>
        ← All evidence
      </button>

      <div className="court-card">
        <div className="pad stack">
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h2 style={{ marginRight: "auto" }}>{ev.title}</h2>
            <span className="tag" style={{ background: "#0b0f14", color: "#d55e00", borderColor: "#3a2a20" }}>
              {ev.pathLabel}
            </span>
          </div>
          <div className="kv">
            <div className="row">
              <span className="k">Location class</span>
              <span className="v">{ev.locationClass}</span>
            </div>
            <div className="row">
              <span className="k">Captured</span>
              <span className="v">{ev.capturedWindow}</span>
            </div>
            <div className="row">
              <span className="k">Contributor identity</span>
              <span className="v" style={{ color: ev.identity === "Not disclosed" ? "#009e73" : "#e69f00" }}>
                {ev.identity}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid cols-2">
        <div className="court-card">
          <div className="pad stack">
            <div className="eyebrow" style={{ color: "#56b4e9" }}>
              Proof
            </div>
            <VerifyPanel zk={ev.zk} />
          </div>
        </div>

        <div className="court-card">
          <div className="pad stack">
            <div className="eyebrow" style={{ color: "#e69f00" }}>
              Bitcoin timing anchor · OpenTimestamps
            </div>
            <div className="kv">
              <div className="row">
                <span className="k">Chain</span>
                <span className="v">{ev.anchor.chain}</span>
              </div>
              <div className="row">
                <span className="k">Tx</span>
                <span className="v">{ev.anchor.txid}</span>
              </div>
              <div className="row">
                <span className="k">Block</span>
                <span className="v">{ev.anchor.block.toLocaleString()}</span>
              </div>
              <div className="row">
                <span className="k">Confirmations</span>
                <span className="v" style={{ color: "#009e73" }}>
                  {ev.anchor.confirmations.toLocaleString()}
                </span>
              </div>
              <div className="row">
                <span className="k">Merkle root</span>
                <span className="v">{ev.anchor.merkleRoot}</span>
              </div>
              <div className="row">
                <span className="k">Anchored</span>
                <span className="v">{new Date(ev.anchor.anchoredAt).toUTCString()}</span>
              </div>
            </div>
            <div className="faint" style={{ fontSize: 11.5 }}>
              The file's hash is committed to Bitcoin, giving tamper-evident proof it
              existed at this time. Disabled automatically in deployment profiles where
              chain access is blocked or illegal.
            </div>
            <div className="pill-row">
              <span className="tag" style={{ background: "#0b0f14", color: ev.c2pa.present ? "#009e73" : "#9aa6b2", borderColor: "#2a313b" }}>
                C2PA {ev.c2pa.present ? "present" : "absent"}
              </span>
              <span className="tag" style={{ background: "#0b0f14", color: "#9aa6b2", borderColor: "#2a313b" }}>
                edits: {ev.c2pa.edits}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="court-card">
        <div className="pad stack">
          <div className="eyebrow" style={{ color: "#56b4e9" }}>
            Chain of custody
          </div>
          <ul className="chain">
            {ev.chain.map((c, i) => (
              <li key={i} className={c.done ? "" : "pending"}>
                <div className="t">{c.t}</div>
                <div className="d">{c.d}</div>
                <div className="when">{c.when}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Pipeline + attacks ---------------- */
function HowVerification() {
  return (
    <div className="court-card">
      <div className="pad stack">
        <div className="eyebrow" style={{ color: "#56b4e9" }}>
          How evidence reaches this view · the verification pipeline
        </div>
        <div className="grid cols-3">
          {pipeline.map((p) => (
            <div key={p.n} style={{ border: "1px solid #2a313b", borderRadius: 12, padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "#56b4e9",
                    color: "#06121b",
                    fontWeight: 800,
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {p.n}
                </span>
                <b style={{ fontSize: 13.5 }}>{p.title}</b>
              </div>
              <div className="faint" style={{ fontSize: 11, margin: "2px 0 6px 30px" }}>
                {p.sub}
              </div>
              <div className="muted" style={{ fontSize: 12 }}>
                {p.body}
              </div>
              <div className="pill-row" style={{ marginTop: 8 }}>
                {p.defends.map((d) => (
                  <span key={d} className="tag" style={{ background: "#0b0f14", color: "#9aa6b2", borderColor: "#2a313b", fontSize: 10 }}>
                    {d}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="eyebrow" style={{ color: "#e69f00", marginTop: 6 }}>
          Adversaries defended against
        </div>
        <div className="kv">
          {attacks.map((at) => (
            <div className="row" key={at.id} style={{ flexDirection: "column", alignItems: "stretch", gap: 3 }}>
              <span style={{ fontWeight: 700, fontSize: 13 }}>
                {at.name} <span className="faint" style={{ fontWeight: 400 }}>· {at.e}</span>
              </span>
              <span className="muted" style={{ fontSize: 12 }}>↳ {at.fix}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Shell ---------------- */
export default function CourtView() {
  const [org, setOrg] = useState(null);
  const [selected, setSelected] = useState(null);

  if (!org) return <CourtGate onEnter={setOrg} />;

  const ev = courtEvidence.find((e) => e.id === selected);

  return (
    <div className="container stack">
      <div
        className="court-card"
        style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "12px 16px" }}
      >
        <span className="tag" style={{ background: "#0b0f14", color: "#56b4e9", borderColor: "#2a313b" }}>
          ● authenticated · {org.code}
        </span>
        <span className="muted" style={{ fontSize: 13 }}>{org.name}</span>
        <button
          className="btn btn-ghost"
          style={{ marginLeft: "auto", color: "#9aa6b2" }}
          onClick={() => {
            setOrg(null);
            setSelected(null);
          }}
        >
          Sign out
        </button>
      </div>

      {ev ? (
        <EvidenceDetail ev={ev} onBack={() => setSelected(null)} />
      ) : (
        <>
          <div className="eyebrow" style={{ color: "#56b4e9" }}>
            Released to your organisation · {courtEvidence.length} records
          </div>
          <div className="grid cols-2">
            {courtEvidence.map((e) => (
              <button
                key={e.id}
                className="court-card"
                onClick={() => setSelected(e.id)}
                style={{ textAlign: "left", cursor: "pointer", color: "inherit" }}
              >
                <div className="pad stack">
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <b style={{ fontSize: 15, marginRight: "auto" }}>{e.title}</b>
                    <span className="tag" style={{ background: "#0b0f14", color: "#d55e00", borderColor: "#3a2a20", fontSize: 10 }}>
                      Path {e.disclosurePath}
                    </span>
                  </div>
                  <div className="muted" style={{ fontSize: 12.5 }}>
                    {e.locationClass} · {e.capturedWindow}
                  </div>
                  <div className="pill-row">
                    <span className="tag" style={{ background: "#0b0f14", color: e.zk.verifies ? "#009e73" : "#9aa6b2", borderColor: "#2a313b", fontSize: 10 }}>
                      ZK ✓
                    </span>
                    <span className="tag" style={{ background: "#0b0f14", color: "#e69f00", borderColor: "#2a313b", fontSize: 10 }}>
                      ₿ anchored
                    </span>
                    <span className="tag" style={{ background: "#0b0f14", color: "#9aa6b2", borderColor: "#2a313b", fontSize: 10 }}>
                      {e.identity === "Not disclosed" ? "anonymous" : "witness"}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <DisclosurePaths />
          <HowVerification />
        </>
      )}
    </div>
  );
}

function DisclosurePaths() {
  const paths = [
    { k: "A", t: "Aggregate proof + anchor", d: "Corroborates scale and timing at no individual cost. No one steps forward." },
    { k: "B", t: "A witness steps forward", d: "One willing contributor selectively discloses their full chain of custody to a named court (BBS+)." },
    { k: "C", t: "Sealed escrow", d: "A provenance key released only under pre-defined legal conditions. The contributor, never the platform, chooses." },
  ];
  return (
    <div className="court-card">
      <div className="pad stack">
        <div className="eyebrow" style={{ color: "#56b4e9" }}>
          Three disclosure paths · increasing exposure, contributor's choice
        </div>
        <div className="grid cols-3">
          {paths.map((p) => (
            <div key={p.k} style={{ border: "1px solid #2a313b", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#d55e00" }}>Path {p.k}</div>
              <b style={{ fontSize: 13.5 }}>{p.t}</b>
              <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                {p.d}
              </div>
            </div>
          ))}
        </div>
        <div className="faint" style={{ fontSize: 11.5 }}>
          Honest limit: a zero-knowledge count is not yet a tested evidentiary object in any
          court, and a conviction may still require a willing, named witness. This design
          supports cases and corroborates scale; it does not replace testimony where the law
          demands it.
        </div>
      </div>
    </div>
  );
}

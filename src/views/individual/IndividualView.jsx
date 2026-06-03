import { useState } from "react";
import { useSession } from "../../state/SessionContext.jsx";
import { ACCESS_LEVELS, levelById } from "../../theme.js";
import AccessLevelBadge from "../../components/AccessLevelBadge.jsx";
import PrivacyBar from "../../components/PrivacyBar.jsx";
import Modal from "../../components/Modal.jsx";

const TABS = [
  { id: "vault", label: "Vault", ic: "🗄️", title: "Your vault", sub: "Everything here stays on this phone." },
  { id: "leaves", label: "What leaves", ic: "📤", title: "What leaves", sub: "You decide what each audience can see." },
  { id: "proof", label: "Proof", ic: "🛡️", title: "Your proof", sub: "Authenticity without identity." },
  { id: "audit", label: "Audit", ic: "📜", title: "Audit log", sub: "A record only you can see." },
];

/* ---------------- Login ---------------- */
function Login() {
  const { unlock } = useSession();
  const [pass, setPass] = useState("");
  return (
    <div className="login-wrap">
      <form
        className="login stack"
        onSubmit={(e) => {
          e.preventDefault();
          if (pass.trim()) unlock();
        }}
      >
        <div style={{ fontSize: 44 }} aria-hidden>
          🔑
        </div>
        <h1 style={{ fontSize: 22, color: "var(--accent-text)" }}>Only you hold the key</h1>
        <p className="muted" style={{ margin: 0 }}>
          There is no account and no username. Your passphrase unlocks the vault on
          this device only — it is never sent anywhere.
        </p>
        <input
          type="password"
          inputMode="text"
          autoFocus
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="• • • • • • • •"
          aria-label="Passphrase"
        />
        <button className="btn btn-primary btn-block" type="submit" disabled={!pass.trim()}>
          Unlock vault
        </button>
        <div className="hint-chip">
          Prototype: any passphrase opens the demo vault. Close the tab and the session
          is gone — no cookie, no history, nothing to seize.
        </div>
      </form>
    </div>
  );
}

/* ---------------- Vault pane ---------------- */
function VaultPane() {
  const { testimonies } = useSession();
  return (
    <>
      <div className="vault-hero">
        <div className="lock" aria-hidden>
          🔒
        </div>
        <div className="t">Only you hold the key</div>
        <div className="s">{testimonies.length} testimonies · encrypted on this device</div>
      </div>
      {testimonies.map((t) => (
        <div className="clip" key={t.id}>
          <div className="thumb" aria-hidden>
            {t.icon}
          </div>
          <div className="meta">
            <b>{t.title}</b>
            {t.locationClass}
            <br />
            {t.detail}
          </div>
          <div className="right">
            <AccessLevelBadge levelId={t.accessLevel} />
          </div>
        </div>
      ))}
      <div className="note">
        Your media never leaves this phone. Manifest only ever shares <b>proof</b> that it
        is real and that others like you exist — never the recording, and never who you
        are.
      </div>
    </>
  );
}

/* ---------------- What-leaves pane ---------------- */
function LevelControl({ testimony }) {
  const { setAccessLevel } = useSession();
  const [pendingCourt, setPendingCourt] = useState(false);
  const current = levelById(testimony.accessLevel);
  const isCourt = testimony.accessLevel === "court";

  const choose = (lvl) => {
    if (lvl.id === testimony.accessLevel) return;
    if (lvl.id === "court") {
      setPendingCourt(true);
      return;
    }
    setAccessLevel(testimony.id, lvl.id);
  };

  return (
    <div className="audience">
      <div className="head">
        <div>
          <div className="name">{testimony.title}</div>
          <div className="desc">{testimony.locationClass}</div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <AccessLevelBadge levelId={testimony.accessLevel} />
        </div>
      </div>

      {isCourt ? (
        <div className="reveal" style={{ background: "#f6eef0", color: "var(--lv-court)" }}>
          <b>Court disclosure is locked in.</b> This was a one-way decision and cannot be
          reversed from here — the named court already holds the sealed record.
        </div>
      ) : (
        <>
          <div className="segmented" role="group" aria-label={`Disclosure level for ${testimony.title}`}>
            {ACCESS_LEVELS.map((lvl) => {
              const active = lvl.id === testimony.accessLevel;
              return (
                <button
                  key={lvl.id}
                  aria-pressed={active}
                  style={active ? { background: lvl.color } : undefined}
                  onClick={() => choose(lvl)}
                >
                  <span className="ic" aria-hidden>
                    {lvl.icon}
                  </span>
                  {lvl.short}
                </button>
              );
            })}
          </div>
          <div className="reveal" style={{ borderLeft: `3px solid ${current.color}` }}>
            <b>{current.label}.</b> {current.plain}
          </div>
        </>
      )}

      {pendingCourt && (
        <CourtConsentModal
          testimony={testimony}
          onCancel={() => setPendingCourt(false)}
          onConfirm={() => {
            setAccessLevel(testimony.id, "court");
            setPendingCourt(false);
          }}
        />
      )}
    </div>
  );
}

function CourtConsentModal({ testimony, onConfirm, onCancel }) {
  const [ack, setAck] = useState(false);
  return (
    <Modal onClose={onCancel}>
      <div className="body stack">
        <div className="warn-ico" aria-hidden>
          ⚖️
        </div>
        <h3>Release “{testimony.title}” to a named court?</h3>
        <p className="muted" style={{ margin: 0 }}>
          This is the only <b>one-way</b> decision in Manifest. Your full sealed record —
          which <b>can identify you</b> — will be disclosed to a single named court via
          BBS+ selective disclosure. You may be asked to testify. It cannot be undone from
          this device.
        </p>
        <label style={{ display: "flex", gap: 10, fontSize: 13, alignItems: "flex-start" }}>
          <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} style={{ marginTop: 3 }} />
          <span>
            I understand this is irreversible, may identify me, and I consent to disclosure
            to one named court.
          </span>
        </label>
      </div>
      <div className="foot">
        <button className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-danger" disabled={!ack} onClick={onConfirm} style={{ marginLeft: "auto" }}>
          Release to court
        </button>
      </div>
    </Modal>
  );
}

function LeavesPane() {
  const { testimonies } = useSession();
  return (
    <>
      <p className="muted" style={{ fontSize: 13, marginTop: 0 }}>
        Choose what each piece of evidence reveals. Levels 1–3 are reversible; court
        disclosure is one-way and asks for explicit consent.
      </p>
      {testimonies.map((t) => (
        <LevelControl key={t.id} testimony={t} />
      ))}
    </>
  );
}

/* ---------------- Proof pane ---------------- */
function ProofPane() {
  const { testimonies } = useSession();
  return (
    <>
      <div style={{ textAlign: "center" }}>
        <div className="proof-seal" aria-hidden>
          ✓
        </div>
        <h3 style={{ margin: 0 }}>Verified</h3>
        <p className="muted" style={{ fontSize: 12.5, marginTop: 6 }}>
          Each testimony is reviewed against the Berkeley Protocol and anchored in time on
          Bitcoin. The proof carries no identity.
        </p>
      </div>
      {testimonies.map((t) => (
        <div className="kv" key={t.id} style={{ marginTop: 14 }}>
          <div className="row">
            <span className="k">{t.title}</span>
            <span className="v" style={{ color: "var(--oi-green)" }}>
              {t.proof.scheme.split(" ")[0]} ✓
            </span>
          </div>
          <div className="row">
            <span className="k">Proof ID</span>
            <span className="v">{t.proof.zkId}</span>
          </div>
          <div className="row">
            <span className="k">Anchored ({t.anchor.chain})</span>
            <span className="v">blk {t.anchor.block.toLocaleString()}</span>
          </div>
          <div className="row">
            <span className="k">Contains your name?</span>
            <span className="v" style={{ color: "var(--oi-green)" }}>
              No
            </span>
          </div>
        </div>
      ))}
    </>
  );
}

/* ---------------- Audit pane ---------------- */
function AuditPane() {
  const { audit } = useSession();
  if (!audit.length) {
    return (
      <div className="empty">
        No disclosures yet.
        <br />
        Change a level under <b>What leaves</b> and it will be recorded here — visible only
        to you.
      </div>
    );
  }
  return (
    <>
      <p className="muted" style={{ fontSize: 13, marginTop: 0 }}>
        Every change you make is logged back to you — power made legible.
      </p>
      {audit.map((e) => (
        <div className={"log-item " + e.kind} key={e.id}>
          <div className="when">{e.when}</div>
          <div className="what">{e.text}</div>
        </div>
      ))}
    </>
  );
}

/* ---------------- Shell ---------------- */
export default function IndividualView() {
  const { unlocked, wipe } = useSession();
  const [tab, setTab] = useState("vault");

  if (!unlocked) {
    return (
      <div className="container narrow">
        <Login />
      </div>
    );
  }

  const active = TABS.find((t) => t.id === tab);

  return (
    <div className="container">
      <div className="indiv-wrap stack">
        <PrivacyBar />

        <div className="card">
          <div className="indiv-head">
            <div style={{ flex: 1 }}>
              <h1>{active.title}</h1>
              <div className="sub">{active.sub}</div>
            </div>
            <button
              className="btn btn-ghost"
              onClick={wipe}
              title="End the session and wipe everything from memory"
            >
              <span aria-hidden>⏻</span> End session
            </button>
          </div>

          <div className="tabs" role="tablist" aria-label="Vault sections">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={t.id === tab}
                className={t.id === tab ? "active" : ""}
                onClick={() => setTab(t.id)}
              >
                <span className="ic" aria-hidden>
                  {t.ic}
                </span>
                {t.label}
              </button>
            ))}
          </div>

          <div className="indiv-content">
            {tab === "vault" && <VaultPane />}
            {tab === "leaves" && <LeavesPane />}
            {tab === "proof" && <ProofPane />}
            {tab === "audit" && <AuditPane />}
          </div>
        </div>

        <div className="hint-chip">
          Try it: open <b>What leaves</b>, set a testimony to a different level, then check the{" "}
          <b>Audit</b> tab. Leave the page idle and it locks itself.
        </div>

        <div className="eyebrow">The 60-second trust model</div>
        <div className="mini-legend">
          <Legend n="1" t="Vault" d="Your testimony is encrypted; only you hold the key." />
          <Legend n="2" t="What leaves" d="Four levels, plain-language consequences. Default is ‘No disclosure’." />
          <Legend n="3" t="Proof" d="A verified badge proving authenticity without identity." />
          <Legend n="4" t="Audit" d="Every disclosure is logged back to you." />
        </div>
      </div>
    </div>
  );
}

function Legend({ n, t, d }) {
  return (
    <div className="card pad" style={{ display: "flex", gap: 10 }}>
      <div
        style={{
          flex: "0 0 24px",
          height: 24,
          borderRadius: "50%",
          background: "var(--accent)",
          color: "var(--on-accent)",
          fontWeight: 700,
          fontSize: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {n}
      </div>
      <div style={{ fontSize: 12.5 }}>
        <b>{t}.</b> <span className="muted">{d}</span>
      </div>
    </div>
  );
}

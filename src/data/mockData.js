// ============================================================
// Mock data for the Manifest prototype.
// All names, hashes and figures are fabricated for demonstration.
// Locations are deliberately coarse ("location-class") — never a precise
// point — mirroring the real privacy model.
// ============================================================

// ---- The contributor's own testimonies (Individual view) ----
// accessLevel is one of the ids in src/theme.js ACCESS_LEVELS.
export const myTestimonies = [
  {
    id: "t-9f2a",
    title: "Dispersal at the port road",
    kind: "video",
    icon: "🎥",
    captured: "2026-05-28",
    locationClass: "Coastal district · Metro region A",
    detail: "0:48 · 1080p · captured offline",
    accessLevel: "partial",
    proof: {
      zkId: "sem:9f2a…c1",
      scheme: "Semaphore membership proof",
      standard: "Berkeley Protocol",
      containsName: false,
    },
    anchor: {
      service: "OpenTimestamps",
      chain: "Bitcoin",
      txid: "0xb71f4a…e208",
      block: 901_447,
      merkleRoot: "3c1d…a9f0",
      anchoredAt: "2026-05-28T11:04:00Z",
    },
    credential: {
      issuer: "did:pkh:verifier-pool-3",
      sig: "BBS+",
      claims: ["event: dispersal", "location-class: coastal-A", "standard: Berkeley"],
    },
  },
  {
    id: "t-4b71",
    title: "Checkpoint detention",
    kind: "video",
    icon: "🎥",
    captured: "2026-05-28",
    locationClass: "Northern corridor · Metro region A",
    detail: "1:12 · audio + video · captured offline",
    accessLevel: "public",
    proof: {
      zkId: "sem:4b71…77",
      scheme: "Semaphore membership proof",
      standard: "Berkeley Protocol",
      containsName: false,
    },
    anchor: {
      service: "OpenTimestamps",
      chain: "Bitcoin",
      txid: "0x2e90c3…11a4",
      block: 901_449,
      merkleRoot: "8af2…0d3c",
      anchoredAt: "2026-05-28T15:22:00Z",
    },
    credential: {
      issuer: "did:pkh:verifier-pool-1",
      sig: "BBS+",
      claims: ["event: detention", "location-class: northern-A", "standard: Berkeley"],
    },
  },
  {
    id: "t-c0d8",
    title: "Aftermath at the market",
    kind: "photos",
    icon: "📷",
    captured: "2026-05-29",
    locationClass: "Central market · Metro region A",
    detail: "3 photos · C2PA-signed at capture",
    accessLevel: "none",
    proof: {
      zkId: "sem:c0d8…3e",
      scheme: "Semaphore membership proof",
      standard: "Berkeley Protocol",
      containsName: false,
    },
    anchor: {
      service: "OpenTimestamps",
      chain: "Bitcoin",
      txid: "0x77ab21…9f02",
      block: 901_512,
      merkleRoot: "1b6e…cc41",
      anchoredAt: "2026-05-29T09:40:00Z",
    },
    credential: {
      issuer: "did:pkh:verifier-pool-2",
      sig: "BBS+",
      claims: ["event: aftermath", "location-class: central-A", "standard: Berkeley"],
    },
  },
];

// The three audiences shown on the "What leaves" screen, and the maximum
// level that audience can ever be granted.
export const AUDIENCES = [
  {
    id: "matching",
    name: "The matching layer",
    color: "var(--lv-partial)",
    dot: "#0072b2",
    blurb: "Corroborates that others witnessed the same thing.",
    maxLevel: "partial",
  },
  {
    id: "public",
    name: "Public & funders",
    color: "var(--lv-public)",
    dot: "#009e73",
    blurb: "Anonymised exemplars and verifiable impact counts.",
    maxLevel: "public",
  },
  {
    id: "court",
    name: "A named court",
    color: "var(--lv-court)",
    dot: "#d55e00",
    blurb: "Your full sealed record — identifying, one-way.",
    maxLevel: "court",
  },
];

// ---- Public / funder aggregates ----
// Each figure is differentially-private and carries an independently
// verifiable zero-knowledge count proof.
export const aggregate = {
  window: "01 Jan – 31 May 2026",
  epsilon: 1.1,
  headline: {
    testimonies: 512,
    events: 12,
    regions: 4,
    verifiers: 38,
  },
  proofId: "sem-batch:2026Q2:e4d1…0a",
  regions: [
    { name: "Metro region A", count: 247, share: 0.48, proof: "sem:reg-A:1c…", events: 5 },
    { name: "River delta B", count: 134, share: 0.26, proof: "sem:reg-B:7a…", events: 3 },
    { name: "Highland C", count: 79, share: 0.15, proof: "sem:reg-C:33…", events: 2 },
    { name: "Border zone D", count: 52, share: 0.1, proof: "sem:reg-D:9e…", events: 2 },
  ],
  trend: [21, 34, 29, 52, 68, 91, 74, 60, 83],
};

// Anonymised exemplars contributors opted into public disclosure.
export const exemplars = [
  {
    id: "x1",
    quote:
      "Three vans arrived before dawn. I filmed from the second floor until the battery died. I never thought a count could protect me — but no one knows it was me.",
    src: "Verified testimony · coastal-A · May 2026 · no identity attached",
  },
  {
    id: "x2",
    quote:
      "I was sure I was the only one who saw it. The matching told me forty-one others recorded the same hour. That changed what I was willing to do.",
    src: "Verified testimony · northern-A · May 2026 · no identity attached",
  },
  {
    id: "x3",
    quote:
      "The phone was borrowed. There was no account, no login that survived. When I closed the app it was as if I had never opened it.",
    src: "Verified testimony · central-A · April 2026 · no identity attached",
  },
];

// ---- Court view ----
export const authorisedOrgs = [
  {
    id: "ai-apac",
    name: "Amnesty International — APAC Regional Office",
    role: "Documentation partner",
    scope: "Aggregate proofs · timing anchors · consented chains of custody",
    code: "AI-APAC",
  },
  {
    id: "natl-commission",
    name: "National Human Rights Commission (independent)",
    role: "Statutory body",
    scope: "Aggregate proofs · anchors · escrow release under legal order",
    code: "NHRC",
  },
  {
    id: "intl-court",
    name: "International accountability mechanism",
    role: "Treaty body",
    scope: "Aggregate proofs · anchors · witness-led full disclosure",
    code: "IAM",
  },
];

// Evidence objects visible at court level (only those contributors released).
export const courtEvidence = [
  {
    id: "t-9f2a",
    title: "Dispersal at the port road",
    disclosurePath: "A", // A = aggregate proof + anchor; B = witness steps forward; C = sealed escrow
    pathLabel: "Path A · aggregate proof + timing anchor",
    locationClass: "Coastal district · Metro region A",
    capturedWindow: "28 May 2026 · morning",
    identity: "Not disclosed",
    zk: {
      statement:
        "≥ 1 distinct valid credential exists, issued by an authorised verifier, for this event/region/window.",
      scheme: "Semaphore (Groth16-free membership proof + nullifier)",
      proofId: "sem:9f2a…c1",
      verifies: true,
      nullifier: "null:7d3e…b1 (counted once)",
    },
    anchor: {
      service: "OpenTimestamps",
      chain: "Bitcoin",
      txid: "0xb71f4a…e208",
      block: 901_447,
      confirmations: 6_120,
      merkleRoot: "3c1d…a9f0",
      anchoredAt: "2026-05-28T11:04:00Z",
    },
    c2pa: { present: true, signer: "did:key:capture-app", edits: "none recorded" },
    chain: [
      { t: "Captured on device", d: "C2PA manifest signed at the moment of recording.", when: "28 May 11:01", done: true },
      { t: "Anchored in time", d: "Hash committed to Bitcoin via OpenTimestamps.", when: "28 May 11:04", done: true },
      { t: "Verified in-pod", d: "Community verifier reviewed against Berkeley Protocol inside the contributor's pod; copy discarded.", when: "29 May 18:20", done: true },
      { t: "Credential issued", d: "Verifiable Credential (BBS+) issued for {event, location-class, standard}.", when: "29 May 18:22", done: true },
      { t: "Aggregated", d: "Counted via Semaphore nullifier; no link to person retained.", when: "31 May 02:00", done: true },
    ],
  },
  {
    id: "t-4b71",
    title: "Checkpoint detention",
    disclosurePath: "B",
    pathLabel: "Path B · witness stepped forward (BBS+ selective disclosure)",
    locationClass: "Northern corridor · Metro region A",
    capturedWindow: "28 May 2026 · afternoon",
    identity: "Disclosed to this court only, with consent (ref. WIT-0007)",
    zk: {
      statement:
        "Full chain-of-custody credential selectively disclosed to this named court; issuer signature intact.",
      scheme: "BBS+ selective disclosure over W3C Verifiable Credential",
      proofId: "sem:4b71…77",
      verifies: true,
      nullifier: "null:2a90…04 (counted once)",
    },
    anchor: {
      service: "OpenTimestamps",
      chain: "Bitcoin",
      txid: "0x2e90c3…11a4",
      block: 901_449,
      confirmations: 6_118,
      merkleRoot: "8af2…0d3c",
      anchoredAt: "2026-05-28T15:22:00Z",
    },
    c2pa: { present: true, signer: "did:key:capture-app", edits: "trim only (logged)" },
    chain: [
      { t: "Captured on device", d: "C2PA manifest signed at capture.", when: "28 May 15:18", done: true },
      { t: "Anchored in time", d: "Hash committed to Bitcoin via OpenTimestamps.", when: "28 May 15:22", done: true },
      { t: "Verified in-pod", d: "Reviewed against Berkeley Protocol; copy discarded.", when: "29 May 19:05", done: true },
      { t: "Credential issued", d: "Verifiable Credential (BBS+) issued.", when: "29 May 19:07", done: true },
      { t: "Witness consent recorded", d: "Contributor stepped forward; consent ref. WIT-0007 logged for this court only.", when: "01 Jun 10:12", done: true },
    ],
  },
];

// The 5-phase verification pipeline (shown in the court / technical view).
export const pipeline = [
  {
    n: 1,
    title: "Technical filter",
    sub: "Automated triage",
    body: "An on-device NLP classifier (NuMind-class) sorts submissions by event type and routes them — no human sees raw media to triage.",
    defends: ["Volume / noise"],
  },
  {
    n: 2,
    title: "Mechanistic filter",
    sub: "Removes most bad actors",
    body: "Rate-limiting and automated flagging blunt Sybil flooding; C2PA + provenance checks catch fabricated or AI-generated media; cross-corroboration catches poisoning meant to discredit a case.",
    defends: ["Sybil attacks", "Fabricated / AI content", "Poisoning"],
  },
  {
    n: 3,
    title: "Community verification",
    sub: "Jury-style, independent",
    body: "Independent verifiers who cannot communicate (a jury-selection pattern) review against the Berkeley Protocol. Wikipedia-style governance and Hats Protocol roles make authority revocable, not token-weighted. Tuned for low false-accept given the ZK stakes.",
    defends: ["Compromised verifiers"],
  },
  {
    n: 4,
    title: "Aggregation",
    sub: "Proofs, not testimonies",
    body: "Valid credentials are counted with Semaphore nullifiers — each counted once, none linkable to a person. MPC lets coalitions compute joint figures; differential privacy bounds leakage.",
    defends: ["Re-identification", "Honeypot creation"],
  },
  {
    n: 5,
    title: "Disclosure",
    sub: "Tiered, contributor-chosen",
    body: "One substrate renders different views by audience. The contributor — never the platform — chooses the path: aggregate proof, public exemplar, or full court disclosure.",
    defends: ["Coerced over-disclosure"],
  },
];

export const attacks = [
  { id: "sybil", name: "Sybil attacks", e: "Fake/duplicate claims", fix: "Rate limiting + automated flagging + one-count nullifiers" },
  { id: "fabricated", name: "Fabricated content", e: "AI-generated media", fix: "C2PA provenance + capture-time signing" },
  { id: "poison", name: "Poisoning", e: "Fakes planted to discredit a case", fix: "Cross-corroboration against independent evidence" },
  { id: "verifier", name: "Compromised verifiers", e: "Captured community reviewers", fix: "Non-communicating jury pool + revocable Hats roles" },
];

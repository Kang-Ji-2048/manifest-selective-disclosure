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
    locationClass: "Coastal district · South Asia",
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
    locationClass: "Northern corridor · South Asia",
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
    locationClass: "Central market · South Asia",
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
// Each figure is differentially-private (Laplace mechanism, ε below) and carries
// an independently verifiable zero-knowledge count proof. Figures are released as
// a noised point ± a 95% interval, or as a lower bound (≥ N) where a crisp value
// would be too precise. Cohorts smaller than `minCohort` are suppressed entirely
// (cohort / spatial k-anonymity) — never jittered.
export const aggregate = {
  window: "01 Jan – 31 May 2026",
  epsilon: 1.1,
  minCohort: 20, // k-anonymity threshold: any cell below this is suppressed, not shown
  headline: {
    // mode: "ge" → render "≥ value"; "pm" → "value ± pm" (95%); "exact" → small category count
    testimonies: { value: 512, pm: 34, mode: "pm", proof: "sem-batch:2026Q2:e4d1…0a" },
    events: { value: 12, mode: "ge", proof: "sem:events:b2…" },
    regions: { value: 4, mode: "exact", proof: "sem:regions:9c…" },
    verifiers: { value: 38, pm: 6, mode: "pm", proof: "sem:verif:41…" },
  },
  proofId: "sem-batch:2026Q2:e4d1…0a",
  // Coarse admin-level breakdown. Counts are noised; `pm` is the 95% half-width.
  // The final cell falls below minCohort and is therefore suppressed downstream.
  regions: [
    { name: "South Asia", count: 168, pm: 19, share: 0.31, proof: "sem:reg-A:1c…", events: 4 },
    { name: "Southeast Asia", count: 263, pm: 24, share: 0.49, proof: "sem:reg-B:7a…", events: 5 },
    { name: "East Asia", count: 38, pm: 10, share: 0.07, proof: "sem:reg-C:33…", events: 2 },
    { name: "Oceania", count: 52, pm: 12, share: 0.1, proof: "sem:reg-D:9e…", events: 2 },
    { name: "Pacific Islands", count: 11, pm: 7, share: 0.02, proof: "sem:reg-E:c4…", events: 1 },
  ],
  // Month-level series rendered as a fan chart: v is the noised value, pm the 95%
  // DP half-width drawn as the surrounding uncertainty band.
  trend: {
    unit: "Month · 2026",
    points: [
      { t: "Jan", v: 21, pm: 9 },
      { t: "Feb", v: 34, pm: 11 },
      { t: "Mar", v: 52, pm: 13 },
      { t: "Apr", v: 74, pm: 16 },
      { t: "May", v: 91, pm: 18 },
    ],
  },
};

// ---- Coarse region geometry for the choropleth map (Public view) ----
// A stylised, abstract admin map rendered locally as inline SVG — no map tiles,
// no third-party CDN, no point/pin layer. Regions are shaded by their noised
// count; cells below minCohort are suppressed (hatched), never jittered.
// The five coarse APAC sub-regions the dashboard aggregates into. The map is
// drawn from real (low-res) country geometry in apacGeo.js, but every country
// is shaded by its SUB-REGION's value — coarse sub-regional aggregation gives
// larger k-anonymity cohorts than any country- or point-level map would.
export const regionShapes = {
  regions: [
    { name: "South Asia", short: "S Asia" },
    { name: "Southeast Asia", short: "SE Asia" },
    { name: "East Asia", short: "E Asia" },
    { name: "Oceania", short: "Oceania" },
    { name: "Pacific Islands", short: "Pacific" },
  ],
};

// Maps each country in apacGeo.js to one of the five sub-regions above.
export const COUNTRY_TO_REGION = {
  India: "South Asia",
  Pakistan: "South Asia",
  Bangladesh: "South Asia",
  "Sri Lanka": "South Asia",
  Nepal: "South Asia",
  Bhutan: "South Asia",
  Afghanistan: "South Asia",
  China: "East Asia",
  Japan: "East Asia",
  "South Korea": "East Asia",
  "North Korea": "East Asia",
  Mongolia: "East Asia",
  Taiwan: "East Asia",
  Indonesia: "Southeast Asia",
  Malaysia: "Southeast Asia",
  Thailand: "Southeast Asia",
  Vietnam: "Southeast Asia",
  Philippines: "Southeast Asia",
  Myanmar: "Southeast Asia",
  Cambodia: "Southeast Asia",
  Laos: "Southeast Asia",
  Brunei: "Southeast Asia",
  Australia: "Oceania",
  "New Zealand": "Oceania",
  "Papua New Guinea": "Oceania",
  Fiji: "Pacific Islands",
  "Solomon Islands": "Pacific Islands",
  Vanuatu: "Pacific Islands",
  "New Caledonia": "Pacific Islands",
};

// ---- Per-issue statistics (Public view, funder drill-down) ----
// Funders typically back a single issue/project, so the dashboard offers a
// CONSTRAINED drill-down: a fixed list of issues (no free-form filtering that
// could isolate a tiny subgroup — the dashboard equivalent of a differencing
// attack). Every issue×region cell obeys the same minCohort rule; sub-threshold
// cells carry no usable count. All figures are DP-noised and carry a ZK proof.
export const issues = [
  {
    id: "dispersal",
    name: "Dispersal / crowd control",
    icon: "🛡️",
    blurb: "Forced dispersal of assemblies, crowd-control munitions, beatings.",
    total: { value: 174, pm: 20, mode: "pm", proof: "sem:iss-disp:7c…" },
    byRegion: [
      { region: "South Asia", count: 58, pm: 12 },
      { region: "Southeast Asia", count: 92, pm: 14 },
      { region: "East Asia", count: 10, pm: 5 },
      { region: "Oceania", count: 14, pm: 6 },
      { region: "Pacific Islands", count: 0 },
    ],
    trend: {
      unit: "Month · 2026",
      points: [
        { t: "Jan", v: 8, pm: 5 },
        { t: "Feb", v: 14, pm: 6 },
        { t: "Mar", v: 31, pm: 9 },
        { t: "Apr", v: 52, pm: 12 },
        { t: "May", v: 69, pm: 14 },
      ],
    },
  },
  {
    id: "detention",
    name: "Detention at checkpoints",
    icon: "⛓️",
    blurb: "Arbitrary detention and disappearances at checkpoints and corridors.",
    total: { value: 138, pm: 18, mode: "pm", proof: "sem:iss-det:2a…" },
    byRegion: [
      { region: "South Asia", count: 44, pm: 11 },
      { region: "Southeast Asia", count: 74, pm: 13 },
      { region: "East Asia", count: 8, pm: 5 },
      { region: "Oceania", count: 12, pm: 6 },
      { region: "Pacific Islands", count: 0 },
    ],
    trend: {
      unit: "Month · 2026",
      points: [
        { t: "Jan", v: 6, pm: 4 },
        { t: "Feb", v: 12, pm: 6 },
        { t: "Mar", v: 24, pm: 8 },
        { t: "Apr", v: 41, pm: 10 },
        { t: "May", v: 55, pm: 12 },
      ],
    },
  },
  {
    id: "property",
    name: "Property & premises damage",
    icon: "🏚️",
    blurb: "Destruction of homes, premises and livelihoods.",
    total: { value: 92, pm: 15, mode: "pm", proof: "sem:iss-prop:9e…" },
    byRegion: [
      { region: "South Asia", count: 28, pm: 8 },
      { region: "Southeast Asia", count: 49, pm: 11 },
      { region: "East Asia", count: 6, pm: 4 },
      { region: "Oceania", count: 9, pm: 5 },
      { region: "Pacific Islands", count: 0 },
    ],
    trend: {
      unit: "Month · 2026",
      points: [
        { t: "Jan", v: 5, pm: 4 },
        { t: "Feb", v: 9, pm: 5 },
        { t: "Mar", v: 17, pm: 7 },
        { t: "Apr", v: 26, pm: 8 },
        { t: "May", v: 35, pm: 9 },
      ],
    },
  },
  {
    id: "medical",
    name: "Denial of medical access",
    icon: "🚑",
    blurb: "Obstruction of medical care and denial of access to the injured.",
    total: { value: 61, pm: 12, mode: "pm", proof: "sem:iss-med:41…" },
    byRegion: [
      { region: "South Asia", count: 21, pm: 7 },
      { region: "Southeast Asia", count: 34, pm: 9 },
      { region: "East Asia", count: 2, pm: 2 },
      { region: "Oceania", count: 4, pm: 3 },
      { region: "Pacific Islands", count: 0 },
    ],
    trend: {
      unit: "Month · 2026",
      points: [
        { t: "Jan", v: 3, pm: 3 },
        { t: "Feb", v: 7, pm: 4 },
        { t: "Mar", v: 11, pm: 5 },
        { t: "Apr", v: 17, pm: 6 },
        { t: "May", v: 23, pm: 7 },
      ],
    },
  },
];

// ---- Theme / topic shares (Public view) ----
// Counts of themes extracted from text contributors opted into public disclosure.
// Rendered as a treemap of category *shares* — no verbatim text, no word cloud,
// no free-text search. (Safe: "treemaps / stacked bars of category shares".)
export const themes = [
  { name: "Dispersal / crowd control", share: 0.34, color: "var(--oi-blue)" },
  { name: "Detention at checkpoints", share: 0.27, color: "var(--oi-green)" },
  { name: "Property & premises damage", share: 0.18, color: "var(--oi-orange)" },
  { name: "Denial of medical access", share: 0.12, color: "var(--oi-purple)" },
  { name: "Other (opted-in)", share: 0.09, color: "var(--faint)" },
];

// ---- Cited methods (Public view reference block) ----
// The disclosure-control techniques this dashboard applies, with canonical sources.
export const methodRefs = [
  {
    method: "Differential privacy (Laplace mechanism)",
    use: "Every published count is perturbed and released with its 95% interval.",
    cite: "Dwork & Roth, The Algorithmic Foundations of Differential Privacy (2014).",
  },
  {
    method: "Cell suppression",
    use: "Cohorts below the k-anonymity threshold are withheld entirely, not shown.",
    cite: "Hundepool et al., Statistical Disclosure Control (Wiley, 2012).",
  },
  {
    method: "Spatial k-anonymity (not geomasking)",
    use: "Geography is aggregated to coarse admin areas until each holds ≥ k contributors; sub-threshold areas are dropped. No jitter, no point maps.",
    cite: "Sweeney, k-anonymity (2002); Duckham & Kulik, spatial cloaking (2005).",
  },
  {
    method: "Uncertainty-first visualisation",
    use: "DP noise is shown as ± bands and fan charts, not hidden behind false-precision points.",
    cite: "Spiegelhalter et al., visualising uncertainty, Science (2011).",
  },
  {
    method: "Verifiable aggregation",
    use: "Each figure carries a zero-knowledge count proof a reviewer can recompute without seeing any person.",
    cite: "Semaphore membership proofs + nullifiers.",
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
    locationClass: "Coastal district · South Asia",
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
    locationClass: "Northern corridor · South Asia",
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

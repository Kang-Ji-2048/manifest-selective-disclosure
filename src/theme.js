// Okabe–Ito colour-blind-safe palette (Okabe & Ito, 2008).
// Used consistently so the four disclosure levels are distinguishable by
// everyone, including the ~8% of men with colour-vision deficiency.
export const OKABE_ITO = {
  black: "#000000",
  orange: "#E69F00",
  skyBlue: "#56B4E9",
  bluishGreen: "#009E73",
  yellow: "#F0E442",
  blue: "#0072B2",
  vermillion: "#D55E00",
  reddishPurple: "#CC79A7",
};

// The four access levels. Order matters: index === exposure rank.
// Levels 0–2 are reversible ("both ways"); level 3 (Court) is one-way.
export const ACCESS_LEVELS = [
  {
    id: "none",
    rank: 0,
    label: "No disclosure",
    short: "Only you",
    color: "#5b5b5b",
    reversible: true,
    audience: "No one",
    icon: "🔒",
    plain: "Sealed on your device. Shared with no one. Nothing leaves this phone.",
    consequence:
      "Your testimony stays encrypted under your key. Manifest holds nothing about it.",
  },
  {
    id: "partial",
    rank: 1,
    label: "Partial disclosure",
    short: "Matching only",
    color: OKABE_ITO.blue,
    reversible: true,
    audience: "The matching layer",
    icon: "🔗",
    plain:
      "Used only to corroborate other evidence. A one-way fingerprint joins the count — never your video, never your name.",
    consequence:
      "Lets Manifest prove ‘N people witnessed this’ using a Semaphore nullifier. You are counted exactly once and cannot be linked back.",
  },
  {
    id: "public",
    rank: 2,
    label: "Public disclosure",
    short: "Anonymised, public",
    color: OKABE_ITO.bluishGreen,
    reversible: true,
    audience: "The public & funders",
    icon: "🌐",
    plain:
      "An anonymised version is publishable. Identifying detail is stripped before anything is shown.",
    consequence:
      "Appears as an opt-in exemplar in the public view and counts toward the verifiable impact figures funders see.",
  },
  {
    id: "court",
    rank: 3,
    label: "Court disclosure",
    short: "Named court only",
    color: OKABE_ITO.vermillion,
    reversible: false,
    audience: "One named legal body",
    icon: "⚖️",
    plain:
      "Your full sealed record is released to a single named court. This can identify you. It cannot be undone.",
    consequence:
      "Releases your chain-of-custody credential via BBS+ selective disclosure to one court. Requires explicit consent. One-way.",
  },
];

export const levelByRank = (rank) => ACCESS_LEVELS[rank];
export const levelById = (id) => ACCESS_LEVELS.find((l) => l.id === id);

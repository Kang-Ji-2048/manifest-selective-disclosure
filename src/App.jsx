import { useState, useEffect } from "react";
import { Routes, Route, NavLink, useLocation, Navigate } from "react-router-dom";
import PublicView from "./views/public/PublicView.jsx";
import HowView from "./views/how/HowView.jsx";
import IndividualView from "./views/individual/IndividualView.jsx";
import CourtView from "./views/court/CourtView.jsx";
import { useMediaQuery } from "./hooks/useMediaQuery.js";

// Colour themes. Default is high-contrast Black & Yellow; Okabe–Ito is offered
// as a colour-blind-safe accessibility option. The choice is applied to the
// <html> element and persisted in localStorage.
const THEMES = [
  { id: "black-yellow", label: "Black & Yellow", short: "B&Y", title: "High-contrast default palette" },
  { id: "okabe-ito", label: "Okabe–Ito", short: "OI", title: "Colour-blind-safe accessibility palette" },
];

function ThemeToggle() {
  // Example of JS-driven divergence: shorter labels on small screens.
  const compact = useMediaQuery("(max-width: 600px)");
  const [theme, setTheme] = useState(() => {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem("manifest-theme") || "black-yellow";
    }
    return "black-yellow";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("manifest-theme", theme);
    } catch {
      /* storage unavailable — theme still applies for this session */
    }
  }, [theme]);

  return (
    <div className="theme-toggle" role="group" aria-label="Colour theme">
      {THEMES.map((t) => (
        <button
          key={t.id}
          className={theme === t.id ? "active" : ""}
          aria-pressed={theme === t.id}
          title={t.title}
          aria-label={t.title}
          onClick={() => setTheme(t.id)}
        >
          {compact ? t.short : t.label}
        </button>
      ))}
    </div>
  );
}

function Header() {
  const { pathname } = useLocation();
  const onCourt = pathname.startsWith("/court");
  return (
    <header className="app-header" style={onCourt ? { background: "#0d1117", borderColor: "#2a313b" } : undefined}>
      <div className="inner">
        <div className="brand" style={onCourt ? { color: "#56b4e9" } : undefined}>
          MANIFEST
          <span className="pillars">DECOLONISE · DECENTRALISE · DEMOCRATISE</span>
        </div>
        <nav className="viewnav" aria-label="Prototype views">
          <NavLink to="/public" className={({ isActive }) => (isActive ? "active" : "")}>
            Public
          </NavLink>
          <NavLink to="/how" className={({ isActive }) => (isActive ? "active" : "")}>
            How it works
          </NavLink>
          <NavLink to="/me" className={({ isActive }) => (isActive ? "active" : "")}>
            Individual
          </NavLink>
          <NavLink to="/court" className={({ isActive }) => (isActive ? "active" : "")}>
            Court
          </NavLink>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="app-footer">
      <div className="inner">
        <span>
          Manifest · selective-disclosure prototype · Manifest Studio Collective ×
          Amnesty International APAC
        </span>
        <span>No cookies · No analytics · Nothing stored server-side</span>
      </div>
    </footer>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const onCourt = pathname.startsWith("/court");
  return (
    <div className={"app" + (onCourt ? " court-shell" : "")}>
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/public" replace />} />
          <Route path="/public" element={<PublicView />} />
          <Route path="/how" element={<HowView />} />
          <Route path="/me" element={<IndividualView />} />
          <Route path="/court" element={<CourtView />} />
          <Route path="*" element={<Navigate to="/public" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

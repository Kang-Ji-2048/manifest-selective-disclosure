import { Routes, Route, NavLink, useLocation, Navigate } from "react-router-dom";
import PublicView from "./views/public/PublicView.jsx";
import IndividualView from "./views/individual/IndividualView.jsx";
import CourtView from "./views/court/CourtView.jsx";

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
          <NavLink to="/me" className={({ isActive }) => (isActive ? "active" : "")}>
            Individual
          </NavLink>
          <NavLink to="/court" className={({ isActive }) => (isActive ? "active" : "")}>
            Court
          </NavLink>
        </nav>
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
          <Route path="/me" element={<IndividualView />} />
          <Route path="/court" element={<CourtView />} />
          <Route path="*" element={<Navigate to="/public" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

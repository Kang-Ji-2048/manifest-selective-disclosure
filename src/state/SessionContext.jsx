import { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { myTestimonies, AUDIENCES } from "../data/mockData.js";
import { levelById } from "../theme.js";

// Auto-logout window. Short on purpose for the demo; a real deployment would
// tune this per deployment profile.
const IDLE_MS = 90_000;

const SessionContext = createContext(null);
export const useSession = () => useContext(SessionContext);

// Fresh copy so a wipe truly resets to first-run state (no persistence).
const freshTestimonies = () => myTestimonies.map((t) => ({ ...t }));

function nowStamp() {
  const d = new Date();
  return (
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) +
    " · " +
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  );
}

export function SessionProvider({ children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [testimonies, setTestimonies] = useState(freshTestimonies);
  const [audit, setAudit] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(Math.round(IDLE_MS / 1000));

  const deadlineRef = useRef(0);
  const tickRef = useRef(null);

  // Reset everything to first-run state. No cookies/storage are touched
  // because none are ever written.
  const reset = useCallback(() => {
    setUnlocked(false);
    setTestimonies(freshTestimonies());
    setAudit([]);
    deadlineRef.current = 0;
  }, []);

  const bumpDeadline = useCallback(() => {
    deadlineRef.current = Date.now() + IDLE_MS;
  }, []);

  const unlock = useCallback(() => {
    setUnlocked(true);
    setSecondsLeft(Math.round(IDLE_MS / 1000));
    bumpDeadline();
  }, [bumpDeadline]);

  const lock = useCallback(() => reset(), [reset]);

  // Idle countdown + activity listeners.
  useEffect(() => {
    if (!unlocked) {
      if (tickRef.current) clearInterval(tickRef.current);
      return;
    }
    bumpDeadline();
    const onActivity = () => bumpDeadline();
    const events = ["pointerdown", "keydown", "touchstart", "mousemove", "scroll"];
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));

    tickRef.current = setInterval(() => {
      const left = Math.max(0, Math.round((deadlineRef.current - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left <= 0) reset();
    }, 1000);

    return () => {
      clearInterval(tickRef.current);
      events.forEach((e) => window.removeEventListener(e, onActivity));
    };
  }, [unlocked, bumpDeadline, reset]);

  const setAccessLevel = useCallback((testimonyId, levelId) => {
    setTestimonies((prev) =>
      prev.map((t) => (t.id === testimonyId ? { ...t, accessLevel: levelId } : t))
    );
    setTestimonies((prev) => {
      const t = prev.find((x) => x.id === testimonyId);
      const lvl = levelById(levelId);
      setAudit((log) => [
        {
          id: Math.random().toString(36).slice(2),
          when: nowStamp(),
          kind: levelId === "none" ? "revoke" : levelId === "court" ? "court" : "grant",
          text:
            levelId === "none"
              ? `Revoked all disclosure for “${t?.title}”.`
              : `Set “${t?.title}” to ${lvl.label} — visible to ${lvl.audience}.`,
        },
        ...log,
      ]);
      return prev;
    });
  }, []);

  const value = {
    unlocked,
    unlock,
    lock,
    wipe: lock,
    testimonies,
    audiences: AUDIENCES,
    setAccessLevel,
    audit,
    secondsLeft,
    idleSeconds: Math.round(IDLE_MS / 1000),
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

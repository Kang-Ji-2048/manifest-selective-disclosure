import { useState, useEffect } from "react";

// Returns whether a CSS media query currently matches, and updates on resize.
// Use this only where mobile and desktop need genuinely DIFFERENT markup;
// for simple reflow, prefer CSS media queries in index.css.
//
//   const isMobile = useMediaQuery("(max-width: 600px)");
//   return isMobile ? <Drawer /> : <Sidebar />;
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia(query).matches
      : false
  );

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return undefined;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

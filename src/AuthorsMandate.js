import { useEffect, useRef } from "react";
import "./janus-fade.css";

export default function JanusFadeIn({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.classList.add("janus-fade-in");
  }, []);

  return (
    <div ref={ref} className="janus-fade-wrapper">
      {children}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animated count-up that triggers when the element scrolls into view.
 * Reproduces the original `counts()` routine: respects `prefers-reduced-motion`,
 * preserves leading zeros and decimal places, and renders the raw value as-is
 * if it isn't numeric.
 */
export function useCountUp<T extends HTMLElement = HTMLElement>(raw: string) {
  const ref = useRef<T>(null);
  const [display, setDisplay] = useState(raw);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const target = parseFloat(raw.replace(/,/g, ""));
    // Non-numeric or reduced-motion: leave the display at its initial `raw`
    // value (set via useState) rather than calling setState inside the effect.
    if (isNaN(target)) return;

    const decimals = (raw.split(".")[1] || "").length;
    const intLen = raw.split(".")[0].replace(/[^0-9]/g, "").length;
    const lead = /^0\d/.test(raw);

    const format = (v: number) => {
      let s = decimals ? v.toFixed(decimals) : Math.round(v).toString();
      if (lead) {
        let ip = s.split(".")[0];
        while (ip.length < intLen) ip = "0" + ip;
        s = ip + (decimals ? "." + s.split(".")[1] : "");
      }
      return s;
    };

    if (reduced) return;

    let frame = 0;
    let start: number | null = null;
    const run = (now: number) => {
      if (!start) start = now;
      const p = Math.min((now - start) / 1100, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(format(target * eased));
      if (p < 1) frame = requestAnimationFrame(run);
      else setDisplay(raw);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            frame = requestAnimationFrame(run);
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [raw]);

  return { ref, display };
}

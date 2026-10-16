"use client";

import { useEffect, useRef } from "react";

export default function GccCat({ sleeping = false, accessory = "" }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (sleeping) return undefined;

    const trackPointer = (event) => {
      const svg = svgRef.current;
      if (!svg) return;
      const bounds = svg.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      const cursorX = ((event.clientX - bounds.left) / bounds.width) * 180;
      const cursorY = ((event.clientY - bounds.top) / bounds.height) * 180;
      svg.querySelectorAll("[data-gcc-pupil]").forEach((pupil) => {
        const eyeX = Number(pupil.dataset.eyeX);
        const eyeY = Number(pupil.dataset.eyeY);
        let dx = (cursorX - eyeX) / 34;
        let dy = (cursorY - eyeY) / 34;
        const distance = Math.hypot(dx, dy) || 1;
        const offset = Math.min(distance, 1) * 3.2;
        dx = (dx / distance) * offset;
        dy = (dy / distance) * offset;
        pupil.setAttribute("transform", `translate(${dx} ${dy})`);
      });
    };

    window.addEventListener("pointermove", trackPointer, { passive: true });
    return () => window.removeEventListener("pointermove", trackPointer);
  }, [sleeping]);

  return (
    <svg ref={svgRef} aria-hidden="true" className={`gcc-cat${sleeping ? " sleeping" : ""}`} viewBox="0 0 180 180" fill="none">
      <path d="M42 79 34 35 68 51M138 79l8-44-34 16" fill="#58A6FF" stroke="#2F81F7" strokeWidth="5" strokeLinejoin="round" />
      <path d="m44 62-4-18 18 12m78 6 4-18-18 12" fill="#3FB950" />
      <circle cx="90" cy="91" r="51" fill="#58A6FF" />
      {sleeping ? <path d="M62 91q8 7 16 0m24 0q8 7 16 0" stroke="#0D1117" strokeWidth="3" strokeLinecap="round" /> : <g><ellipse cx="70" cy="89" rx="8" ry="10" fill="white" /><ellipse cx="110" cy="89" rx="8" ry="10" fill="white" /><circle data-gcc-pupil data-eye-x="70" data-eye-y="89" cx="70" cy="89" r="4" fill="#0D1117" /><circle data-gcc-pupil data-eye-x="110" data-eye-y="89" cx="110" cy="89" r="4" fill="#0D1117" /></g>}
      <circle cx="57" cy="111" r="8" fill="#3FB950" opacity=".7" />
      <circle cx="123" cy="111" r="8" fill="#3FB950" opacity=".7" />
      <path d="M86 106q4-5 8 0l-4 5-4-5Zm4 7v3m0 0q-6 8-12 0m12 0q6 8 12 0" stroke="#0D1117" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {accessory === "mic" && <g><rect x="126" y="108" width="13" height="34" rx="7" fill="#BC8CFF"/><path d="M121 126v4a12 12 0 0 0 24 0v-4m-12 16v8m-8 0h16" stroke="#BC8CFF" strokeWidth="4" strokeLinecap="round"/></g>}
      {accessory === "trophy" && <g><path d="M126 105h30v23a15 15 0 0 1-30 0v-23Zm0 6h-9v8a12 12 0 0 0 12 12m27-20h9v8a12 12 0 0 1-12 12m-12 17v8m-12 0h24" stroke="#E3B341" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round"/><path d="M134 111h14v12a7 7 0 0 1-14 0v-12Z" fill="#E3B341"/></g>}
      {sleeping && <g className="cat-sleep-mark"><text x="139" y="45" fill="#8B949E" fontSize="19" fontFamily="monospace">Z</text><text x="153" y="30" fill="#8B949E" fontSize="13" fontFamily="monospace">z</text></g>}
    </svg>
  );
}

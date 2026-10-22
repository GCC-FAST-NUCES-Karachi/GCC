"use client";
import "./RevealOnScroll.css";

import { useEffect, useRef } from "react";

export default function RevealOnScroll({ as: Element = "div", className = "", children, ...props }) {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    element.classList.add("is-ready");
    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      element.classList.add("is-visible");
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.classList.add("is-visible");
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(element);
    return () => { observer.disconnect(); element.classList.remove("is-ready", "is-visible"); };
  }, []);

  const classes = [className, "reveal-on-scroll"].filter(Boolean).join(" ");
  return <Element ref={elementRef} className={classes} {...props}>{children}</Element>;
}

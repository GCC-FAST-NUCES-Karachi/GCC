"use client";

import { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HighlightsCarousel({ children, slideCount }) {
  const trackRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const updateActiveSlide = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const slides = [...track.children];
    const trackLeft = track.getBoundingClientRect().left;
    const current = slides.reduce((closestIndex, slide, index) => {
      const closest = slides[closestIndex];
      return Math.abs(slide.getBoundingClientRect().left - trackLeft) < Math.abs(closest.getBoundingClientRect().left - trackLeft)
        ? index
        : closestIndex;
    }, 0);
    setActiveSlide(current);
  }, []);

  const move = (direction) => {
    const nextIndex = Math.max(0, Math.min(slideCount - 1, activeSlide + direction));
    const nextSlide = trackRef.current?.children[nextIndex];
    if (nextSlide && trackRef.current) {
      const track = trackRef.current;
      track.scrollTo({
        left: nextSlide.offsetLeft - track.offsetLeft - Number.parseFloat(getComputedStyle(track).paddingLeft),
        behavior: "smooth",
      });
    }
    setActiveSlide(nextIndex);
  };

  return (
    <div className="highlights-carousel" aria-roledescription="carousel">
      <div
        className="highlights-carousel-track"
        ref={trackRef}
        onScroll={updateActiveSlide}
        role="region"
        tabIndex={0}
        aria-label="Highlights and community links"
      >
        {children}
      </div>
      <div className="highlights-carousel-controls" aria-label="Workshop slides">
        <button type="button" onClick={() => move(-1)} disabled={activeSlide === 0} aria-label="Previous highlight">
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <span aria-live="polite"><span className="highlights-slide-current">{String(activeSlide + 1).padStart(2, "0")}</span> / {String(slideCount).padStart(2, "0")}</span>
        <button type="button" onClick={() => move(1)} disabled={activeSlide === slideCount - 1} aria-label="Next highlight">
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

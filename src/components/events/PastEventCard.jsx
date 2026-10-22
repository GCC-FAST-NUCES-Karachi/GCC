"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Clock3, MapPin } from "lucide-react";

export default function PastEventCard({ event }) {
  const images = event.images ?? (event.image ? [{ src: event.image, alt: event.alt }] : []);
  const [activeSlide, setActiveSlide] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStart = useRef(null);
  const sliderRef = useRef(null);
  const slideCount = images.length + 1;
  const moveSlide = (step) => {
    setDragOffset(0);
    setIsDragging(false);
    setActiveSlide((index) => Math.max(0, Math.min(slideCount - 1, index + step)));
  };
  const startSwipe = (event) => {
    if (event.target.closest("button")) return;
    touchStart.current = {
      x: event.touches[0]?.clientX ?? 0,
      time: performance.now(),
    };
    setIsDragging(true);
  };
  const updateSwipe = (event) => {
    if (!touchStart.current) return;
    setDragOffset(event.touches[0].clientX - touchStart.current.x);
  };
  const endSwipe = (event) => {
    if (!touchStart.current) return;

    const distance = event.changedTouches[0].clientX - touchStart.current.x;
    const elapsed = Math.max(1, performance.now() - touchStart.current.time);
    const velocity = Math.abs(distance) / elapsed;
    const threshold = Math.max(45, (sliderRef.current?.clientWidth ?? 300) * 0.18);
    touchStart.current = null;
    setDragOffset(0);
    setIsDragging(false);

    if (Math.abs(distance) > threshold || (Math.abs(distance) > 20 && velocity > 0.45)) {
      const step = distance < 0 ? 1 : -1;
      setActiveSlide((index) => Math.max(0, Math.min(slideCount - 1, index + step)));
    }
  };
  const cancelSwipe = () => {
    touchStart.current = null;
    setDragOffset(0);
    setIsDragging(false);
  };
  const showingDetails = activeSlide === 0;
  const activeImage = activeSlide - 1;
  const slides = [
    { type: "details", key: "details" },
    ...images.map((image, imageIndex) => ({ type: "image", image, imageIndex, key: `image-${imageIndex}` })),
  ];
  const slideStyle = {
    transform: `translate3d(calc(-${activeSlide * 100}% + ${dragOffset}px), 0, 0)`,
    transition: isDragging ? "none" : undefined,
  };

  return (
    <article className="past-event-card" aria-roledescription="carousel" aria-label={`${event.title} details and gallery`}>
      <div
        className="past-event-slider"
        ref={sliderRef}
        onTouchStart={startSwipe}
        onTouchMove={updateSwipe}
        onTouchEnd={endSwipe}
        onTouchCancel={cancelSwipe}
      >
        <div className="past-event-slider-track" style={slideStyle}>
          {slides.map((slide, index) => slide.type === "details" ? (
            <div className="past-event-slide past-event-card-copy" key={slide.key} aria-roledescription="slide" aria-label="Event details" aria-hidden={activeSlide !== index}>
              <div className="past-event-card-heading">
                <span className="event-date"><small>{event.month}</small><strong>{event.day}</strong><small>{event.year}</small></span>
                <span className="event-state completed">Past event</span>
              </div>
              <h3>{event.title}</h3>
              {event.place && <p><MapPin size={13} aria-hidden="true" /><span>{event.place}</span></p>}
              {event.time && <p><Clock3 size={13} aria-hidden="true" /><span>{event.time}</span></p>}
              {event.summary && <p className="past-event-summary">{event.summary}</p>}
            </div>
          ) : (
            <div className="past-event-slide past-event-gallery" key={slide.key} aria-roledescription="slide" aria-label={`Image ${slide.imageIndex + 1} of ${images.length}`} aria-hidden={activeSlide !== index}>
              <Image
                src={slide.image.src}
                alt={slide.image.alt ?? `${event.title} event photo ${slide.imageIndex + 1}`}
                fill
                sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
      {images.length > 0 && (
        <div className="past-event-slider-controls">
          <button type="button" onClick={() => moveSlide(-1)} disabled={activeSlide === 0} aria-label={`Previous ${event.title} slide`}>
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <span aria-live="polite">{showingDetails ? "Details · swipe for photos" : `Photo ${activeImage + 1} of ${images.length} · swipe for details`}</span>
          <button type="button" onClick={() => moveSlide(1)} disabled={activeSlide === slideCount - 1} aria-label={`Next ${event.title} slide`}>
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </article>
  );
}

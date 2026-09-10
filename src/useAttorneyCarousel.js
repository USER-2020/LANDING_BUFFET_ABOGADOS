import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export default function useAttorneyCarousel(count) {
  const viewport = useRef(null);
  const busy = useRef(false);
  const touch = useRef(null);
  const [index, setIndex] = useState(count);
  const [animated, setAnimated] = useState(false);
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(2);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useLayoutEffect(() => {
    const measure = () => {
      const card = viewport.current.querySelector('.attorney-card');
      const track = viewport.current.querySelector('.attorney-track');
      setAnimated(false);
      busy.current = false;
      setIndex(current => count + ((current % count) + count) % count);
      setStep(card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap));
      setVisible(Number(getComputedStyle(viewport.current).getPropertyValue('--cards-visible')));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(viewport.current);
    measure();
    return () => observer.disconnect();
  }, [count]);

  function move(direction) {
    if (busy.current || !step || !direction) return;
    if (reduced) {
      setAnimated(false);
      setIndex(current => count + ((current + direction) % count + count) % count);
    } else {
      busy.current = true;
      setAnimated(true);
      setIndex(current => current + direction);
    }
  }

  function goTo(position) {
    let distance = position - (index % count);
    if (distance > count / 2) distance -= count;
    if (distance < -count / 2) distance += count;
    move(distance);
  }

  function settle() {
    busy.current = false;
    setAnimated(false);
    setIndex(current => count + ((current % count) + count) % count);
  }

  useEffect(() => {
    if (!animated) return;
    // Also settle when a transition is interrupted or the tab is backgrounded.
    const timeout = setTimeout(settle, 800);
    return () => clearTimeout(timeout);
  }, [index, animated]);

  useEffect(() => {
    if (hovered || focused || reduced || !step || animated) return;
    const timer = setInterval(() => { if (!document.hidden && touch.current === null) move(1); }, 4500);
    return () => clearInterval(timer);
  }, [hovered, focused, reduced, step, animated, index]);

  return { viewport, index, animated, step, visible, goTo, settle,
    interaction: {
      onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false),
      onFocusCapture: () => setFocused(true),
      onBlurCapture: event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); },
      onTouchStart: event => { touch.current = event.touches[0].clientX; },
      onTouchEnd: event => {
        if (touch.current !== null) {
          const distance = touch.current - event.changedTouches[0].clientX;
          if (Math.abs(distance) > 45) move(distance > 0 ? 1 : -1);
        }
        touch.current = null;
      },
      onTouchCancel: () => { touch.current = null; },
    },
  };
}

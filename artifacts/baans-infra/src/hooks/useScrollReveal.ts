import { useEffect, useRef } from 'react';

/**
 * OVERLOAD 1 — ref-based (original API used by WhyBambooSection and others).
 * Call with no arguments: const ref = useScrollReveal<HTMLElement>()
 * Attach the returned ref to a DOM element. When it enters the viewport,
 * the element receives the class "is-visible" (or the supplied visibleClass).
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  visibleClass?: string
): React.RefObject<T>;

/**
 * OVERLOAD 2 — selector-based (used by Projects, About, etc.).
 * Call with a CSS selector string: useScrollReveal('.my-class')
 * All matching elements in the document get observed and receive visibleClass.
 */
export function useScrollReveal(
  selector: string,
  visibleClass?: string,
  options?: IntersectionObserverInit
): void;

// ── Implementation ────────────────────────────────────────────────────────────
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  selectorOrClass?: string,
  visibleClass = 'is-visible',
  options: IntersectionObserverInit = {}
): React.RefObject<T> | void {

  // Determine which overload is being used.
  // If the first argument is undefined OR starts with a dot/hash/tag it's a selector.
  // If it's undefined we're in ref mode.
  const isRefMode = selectorOrClass === undefined || (
    // treat as ref mode when called as useScrollReveal<T>() with no args
    typeof selectorOrClass === 'string' &&
    !selectorOrClass.startsWith('.') &&
    !selectorOrClass.startsWith('#') &&
    !selectorOrClass.match(/^[a-z]/i)
  );

  // Ref used in ref-mode
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cls = isRefMode ? (selectorOrClass ?? 'is-visible') : visibleClass;

    const defaultOptions: IntersectionObserverInit = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
      ...options,
    };

    if (isRefMode) {
      // ── Ref mode ──
      const el = elementRef.current;
      if (!el) return;

      if (prefersReduced) {
        el.classList.add(cls);
        return;
      }

      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(cls);
          observer.unobserve(el);
        }
      }, defaultOptions);

      observer.observe(el);
      return () => observer.disconnect();

    } else {
      // ── Selector mode ──
      const selector = selectorOrClass as string;

      if (prefersReduced) {
        document.querySelectorAll<HTMLElement>(selector).forEach(el => {
          el.classList.add(cls);
        });
        return;
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add(cls);
            observer.unobserve(entry.target);
          }
        });
      }, defaultOptions);

      document.querySelectorAll<HTMLElement>(selector).forEach(el => observer.observe(el));
      return () => observer.disconnect();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isRefMode) return elementRef as React.RefObject<T>;
}

/**
 * Splits the text content of an element into individual word spans
 * with staggered animation-delay, then adds the `word-stagger` class
 * to the parent. Used for hero headings.
 */
export function applyWordStagger(el: HTMLElement, baseDelayMs = 0, staggerMs = 80) {
  const text = el.textContent || '';
  const words = text.split(/\s+/).filter(Boolean);
  el.innerHTML = words
    .map((w, i) => {
      const delay = baseDelayMs + i * staggerMs;
      return `<span class="word" style="animation-delay:${delay}ms">${w}</span>`;
    })
    .join(' ');
  el.classList.add('word-stagger');
}

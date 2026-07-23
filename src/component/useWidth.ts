import { useEffect, useRef, useState } from "react";

/**
 * Tracks an element's rendered width so a doodle (which needs real pixel
 * dimensions) can be sized to match the text it annotates.
 *
 * Returns 0 until mounted, so callers should skip rendering the doodle while
 * the width is still unknown — that also keeps prerender output stable.
 */
export function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, width };
}

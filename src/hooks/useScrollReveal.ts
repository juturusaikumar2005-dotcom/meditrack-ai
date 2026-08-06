import { useEffect, useState } from 'react';

export function useScrollReveal() {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.15 },
    );
    obs.observe(ref);
    return () => obs.disconnect();
  }, [ref]);

  return { ref: setRef, visible };
}

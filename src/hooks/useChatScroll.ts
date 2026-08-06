import { useEffect, useRef, type RefObject } from 'react';

export function useChatScroll<T extends HTMLElement>(
  dependencies: unknown[]
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, dependencies);

  return ref;
}

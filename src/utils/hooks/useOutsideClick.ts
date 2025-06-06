'use client';

import { RefObject, useEffect } from 'react';

function useClickOutside(
  ref: RefObject<HTMLElement>,
  handler: (event: MouseEvent) => void
): void {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler(event);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, handler]);
}

export default useClickOutside;

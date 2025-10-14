'use client';

import { useEffect, useRef } from 'react';

export default function TawkTo() {
  const tawkLoaded = useRef(false);

  useEffect(() => {
    if (tawkLoaded.current) {
      return;
    }

    if (typeof window !== 'undefined') {
      const s1 = document.createElement("script");
      const s0 = document.getElementsByTagName("script")[0];
      
      s1.async = true;
      s1.src = 'https://embed.tawk.to/68ee281903e6dd1951504041/1j7h4p9bm';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      
      if (s0 && s0.parentNode) {
        s0.parentNode.insertBefore(s1, s0);
      }

      tawkLoaded.current = true;
    }
  }, []);

  return null;
}

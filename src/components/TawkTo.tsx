
'use client';

import { useEffect, useRef } from 'react';

export default function TawkTo() {
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent the script from being injected twice due to React Strict Mode
    if (initialized.current) {
      return;
    }
    initialized.current = true;

    var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
    (function () {
      var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/68ee281903e6dd1951504041/1j7h4p9bm';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode?.insertBefore(s1, s0);
    })();
  }, []);

  return null; // The script is injected manually, so the component renders nothing.
}

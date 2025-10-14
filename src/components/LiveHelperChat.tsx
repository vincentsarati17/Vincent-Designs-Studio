
'use client';

import Script from 'next/script';
import { useEffect } from 'react';

export default function LiveHelperChat() {
  useEffect(() => {
    // This effect ensures the script is re-evaluated on client-side navigation
    // although the Next.js Script component with 'afterInteractive' strategy should handle this well.
  }, []);

  return (
    <Script id="live-helper-chat" strategy="afterInteractive">
      {`
        var LHC_API = LHC_API||{};
        LHC_API.args = {
          mode:'widget',
          lhc_base_url:'//YOUR_LIVEHELPERCHAT_DOMAIN/index.php/', // <-- IMPORTANT: Replace with your domain
          theme:0,
        };
        (function() {
          var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
          var referrer = (document.referrer) ? encodeURIComponent(document.referrer.substr(document.referrer.indexOf('://')+1)) : '';
          var location  = (document.location) ? encodeURIComponent(window.location.href.substring(window.location.protocol.length)) : '';
          po.src = LHC_API.args.lhc_base_url + 'chat/getstatus/(click)/internal/(position)/bottom_right/(ma)/br/(top)/350/(units)/pixels/(leaveamessage)/true?r='+referrer+'&l='+location;
          var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
        })();
      `}
    </Script>
  );
}

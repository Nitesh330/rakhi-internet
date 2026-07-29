import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    YQV5?: any;
  }
}

export default function SeventeenTrackWidget({ trackingNumber, carrierCode }: { trackingNumber: string; carrierCode?: string }) {
  // Generate a completely unique, sanitized container ID based on the current tracking details.
  // This ensures that when the tracking number or carrier changes, a brand new container ID is used,
  // which prevents any caching or iframe reuse conflicts inside the global YQV5 tracker.
  const containerId = 'YQContainer-' + String(trackingNumber + '-' + (carrierCode || 'auto')).replace(/[^a-zA-Z0-9]/g, '');

  useEffect(() => {
    if (!trackingNumber) return;

    let timeoutId: NodeJS.Timeout;

    const renderWidget = () => {
      const containerElement = document.getElementById(containerId);
      // Ensure the container exists in the DOM before executing the script
      if (!containerElement) {
        timeoutId = setTimeout(renderWidget, 30);
        return;
      }

      if (window.YQV5) {
        try {
          // Clear any stale iframe content inside the container before rendering
          containerElement.innerHTML = '';
          
          window.YQV5.trackSingle({
            YQ_ContainerId: containerId,
            YQ_Height: 560,
            YQ_Fc: carrierCode || "0", // Use specific carrier code if provided, otherwise auto-detect
            YQ_Lang: "en",
            YQ_Num: trackingNumber
          });
        } catch (e) {
          console.error("17track render error:", e);
        }
      } else {
        timeoutId = setTimeout(renderWidget, 100);
      }
    };

    if (!document.getElementById("17track-script")) {
      const script = document.createElement("script");
      script.id = "17track-script";
      script.src = "https://external.17track.net/ExternalTrack.js";
      script.type = "text/javascript";
      script.async = true;
      document.body.appendChild(script);
      
      script.onload = () => {
        renderWidget();
      };
    } else {
      renderWidget();
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [trackingNumber, carrierCode, containerId]);

  return (
    <div className="w-full bg-white rounded-xl overflow-hidden border border-slate-200" style={{ minHeight: '560px' }}>
      <div id={containerId} key={containerId} className="w-full" style={{ minHeight: '560px' }}></div>
    </div>
  );
}

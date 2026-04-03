import React, { useState, useEffect, useRef } from "react";
import "./FrameViewer.css";

/**
 * FrameViewer
 *
 * Renders a URL inside an iframe with:
 *  - Animated loading overlay
 *  - Best-effort detection of X-Frame-Options blocks
 *  - 10-second timeout fallback (site loads slowly → hide spinner)
 *
 * Note: Cross-origin blocking detection is inherently limited in browsers.
 * If the frame fires a load event but the document is null/inaccessible,
 * we call onBlocked(). For many sites the iframe simply shows a blank page
 * or a browser error — in those cases the user can use the ↗ button.
 */
export default function FrameViewer({ url, onBlocked }) {
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef(null);
  const timerRef  = useRef(null);

  useEffect(() => {
    // Reset state on URL change
    setLoading(true);

    // Safety timeout: stop spinner after 10 s regardless
    timerRef.current = setTimeout(() => setLoading(false), 10_000);

    return () => clearTimeout(timerRef.current);
  }, [url]);

  const handleLoad = () => {
    clearTimeout(timerRef.current);
    setLoading(false);

    // Best-effort block detection
    try {
      const doc = iframeRef.current?.contentDocument;
      if (doc === null) onBlocked?.();
    } catch {
      // Cross-origin access throws — that's normal, NOT a block indicator
    }
  };

  const handleError = () => {
    clearTimeout(timerRef.current);
    setLoading(false);
    onBlocked?.();
  };

  return (
    <div className="frame-wrap">
      {loading && (
        <div className="frame-loading" aria-live="polite" aria-label="Loading website">
          <div className="frame-dots">
            <span /><span /><span />
          </div>
          <p className="frame-loading-url">{url}</p>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={url}
        title="Website preview"
        onLoad={handleLoad}
        onError={handleError}
        className={loading ? "frame-hidden" : "frame-visible"}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
}

import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import UrlSidebar  from "../components/UrlSidebar";
import FrameViewer from "../components/FrameViewer";
import NavControls from "../components/NavControls";
import "./NavigatorPage.css";

export default function NavigatorPage({ session, index, setIndex }) {
  const { sessionId, urls, total } = session;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [frameBlocked, setFrameBlocked] = useState(false);
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef(null);

  const currentUrl = urls[index]?.url ?? "";

  /* ── Persist index to backend (debounced 600 ms) ── */
  const persist = useCallback((idx) => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      try {
        await axios.patch(`/api/sessions/${sessionId}`, { currentIndex: idx });
      } catch { /* non-critical */ }
      setSaving(false);
    }, 600);
  }, [sessionId]);

  const goTo = useCallback((idx) => {
    if (idx < 0 || idx >= total) return;
    setIndex(idx);
    setFrameBlocked(false);
    persist(idx);
  }, [total, setIndex, persist]);

  /* ── Keyboard navigation ── */
  useEffect(() => {
    const handler = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
      if (e.key === "ArrowLeft")  goTo(index - 1);
      if (e.key === "ArrowRight") goTo(index + 1);
      if (e.key === "Escape")     setSidebarOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index, goTo]);

  const openExternal = () =>
    window.open(currentUrl, "_blank", "noopener,noreferrer");

  return (
    <div className="nav-page">

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <UrlSidebar
        open={sidebarOpen}
        urls={urls}
        currentIndex={index}
        onSelect={(i) => { goTo(i); setSidebarOpen(false); }}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ─── Main panel ─── */}
      <div className="nav-panel">

        {/* Address bar */}
        <div className="addr-bar">
          {/* List toggle */}
          <button
            className="icon-btn"
            onClick={() => setSidebarOpen((v) => !v)}
            title="Toggle URL list  (has all URLs)"
            aria-expanded={sidebarOpen}
          >
            <span>≡</span>
          </button>

          {/* URL pill */}
          <div className="addr-pill">
            <span className="addr-scheme" title={
              currentUrl.startsWith("https") ? "Secure (HTTPS)" : "Not secure (HTTP)"
            }>
              {currentUrl.startsWith("https") ? "🔒" : "⚠️"}
            </span>
            <span className="addr-url" title={currentUrl}>{currentUrl}</span>
          </div>

          {/* Right actions */}
          <div className="addr-right">
            {saving && (
              <span className="save-indicator" title="Saving position…" />
            )}
            <button
              className="icon-btn"
              onClick={openExternal}
              title="Open in new tab"
            >
              ↗
            </button>
          </div>
        </div>

        {/* Viewer area */}
        <div className="nav-viewer">
          {frameBlocked ? (
            <BlockedScreen url={currentUrl} onOpen={openExternal} />
          ) : (
            <FrameViewer
              url={currentUrl}
              onBlocked={() => setFrameBlocked(true)}
            />
          )}
        </div>

        {/* Navigation controls */}
        <NavControls
          index={index}
          total={total}
          onPrev={() => goTo(index - 1)}
          onNext={() => goTo(index + 1)}
          onJump={goTo}
        />
      </div>
    </div>
  );
}

/* ── Blocked screen component ─────────────────────────── */
function BlockedScreen({ url, onOpen }) {
  return (
    <div className="blocked-screen">
      <div className="blocked-icon">⊘</div>
      <p className="blocked-title">Embedding blocked</p>
      <p className="blocked-sub">
        This site uses <code>X-Frame-Options</code> or{" "}
        <code>Content-Security-Policy</code> to prevent embedding.
      </p>
      <p className="blocked-url">{url}</p>
      <button className="blocked-btn" onClick={onOpen}>
        Open in New Tab ↗
      </button>
    </div>
  );
}

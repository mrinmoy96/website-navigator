import React, { useState, useCallback } from "react";
import "./App.css";
import UploadPage    from "./pages/UploadPage";
import NavigatorPage from "./pages/NavigatorPage";

export default function App() {
  const [session, setSession] = useState(null); // null → upload screen
  const [index,   setIndex]   = useState(0);

  const handleUpload = useCallback((data) => {
    setSession(data);
    setIndex(0);
  }, []);

  const handleReset = useCallback(() => {
    setSession(null);
    setIndex(0);
  }, []);

  return (
    <div className="app">
      {/* ════ Header ════ */}
      <header className="app-header">
        <button
          className="app-logo"
          onClick={session ? handleReset : undefined}
          style={{ cursor: session ? "pointer" : "default" }}
          aria-label="WebNav — go home"
        >
          <span className="logo-mark">▶</span>
          <span className="logo-name">WEBNAV</span>
        </button>

        {session && (
          <div className="app-meta">
            <span className="meta-chip">
              <span className="meta-icon">◈</span>
              <span className="meta-file">{session.fileName}</span>
            </span>
            <span className="meta-sep">·</span>
            <span className="meta-count">{session.total} URLs</span>
            <button className="btn-outline" onClick={handleReset}>
              ← New File
            </button>
          </div>
        )}
      </header>

      {/* ════ Main ════ */}
      <main className="app-main">
        {session
          ? <NavigatorPage session={session} index={index} setIndex={setIndex} />
          : <UploadPage onSuccess={handleUpload} />
        }
      </main>

      <footer className="app-footer">
        MERN Stack Assignment · Website Navigator · {new Date().getFullYear()}
      </footer>
    </div>
  );
}

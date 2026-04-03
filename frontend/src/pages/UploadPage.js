import React, { useState, useRef, useCallback } from "react";
import axios from "axios";
import "./UploadPage.css";

const VALID_EXTS = ["xlsx", "xls", "csv"];

export default function UploadPage({ onSuccess }) {
  const [dragging,  setDragging]  = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [error,     setError]     = useState(null);
  const inputRef = useRef(null);

  const processFile = useCallback(async (file) => {
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (!VALID_EXTS.includes(ext)) {
      setError(`"${file.name}" is not supported. Please upload .xlsx, .xls, or .csv`);
      return;
    }
    setError(null);
    setUploading(true);
    setProgress(0);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const { data } = await axios.post("/api/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) =>
          setProgress(Math.round((e.loaded / (e.total || 1)) * 100)),
      });
      onSuccess(data);
    } catch (e) {
      setError(e.response?.data?.error ?? "Upload failed — please try again.");
    } finally {
      setUploading(false);
    }
  }, [onSuccess]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  }, [processFile]);

  const onInputChange = (e) => {
    processFile(e.target.files?.[0]);
    e.target.value = "";
  };

  return (
    <div className="upload-page">

      {/* Hero */}
      <section className="upload-hero">
        <p className="hero-eyebrow">// MERN Stack Tool</p>
        <h1 className="hero-title">Website<br/>Navigator</h1>
        <p className="hero-sub">
          Upload a spreadsheet of URLs and browse every site
          inside the app — no tab-switching, no copy-pasting.
        </p>
      </section>

      {/* Drop Zone */}
      <div
        className={`dropzone${dragging ? " dz--over" : ""}${uploading ? " dz--busy" : ""}`}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        aria-label="Upload spreadsheet file"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={onInputChange}
          className="sr-only"
        />

        {uploading ? (
          <div className="dz-loading">
            <svg className="dz-spinner" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="20" fill="none"
                strokeWidth="3" stroke="var(--c-border-hi)" />
              <circle cx="25" cy="25" r="20" fill="none"
                strokeWidth="3" stroke="var(--c-accent)"
                strokeDasharray="125.6" strokeDashoffset="94.2"
                strokeLinecap="round" />
            </svg>
            <span className="dz-pct">{progress}<small>%</small></span>
            <div className="dz-bar-wrap">
              <div className="dz-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="dz-hint">Extracting URLs from file…</span>
          </div>
        ) : (
          <div className="dz-idle">
            <div className="dz-icon" aria-hidden="true">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="4" width="40" height="52" rx="3"
                  stroke="currentColor" strokeWidth="2"/>
                <rect x="18" y="4" width="28" height="16" rx="2"
                  fill="var(--c-accent)" opacity="0.15"/>
                <path d="M14 24h28M14 32h28M14 40h18"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="50" cy="50" r="10" fill="var(--c-bg-2)"
                  stroke="var(--c-accent)" strokeWidth="2"/>
                <path d="M50 46v8M46 50h8"
                  stroke="var(--c-accent)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="dz-headline">
              {dragging ? "Drop to upload" : "Drop your file here"}
            </p>
            <span className="dz-or">— or —</span>
            <button className="dz-btn" type="button" tabIndex={-1}>
              Browse Files
            </button>
            <p className="dz-formats">
              .xlsx &nbsp;·&nbsp; .xls &nbsp;·&nbsp; .csv &nbsp;&nbsp;|&nbsp;&nbsp; max 10 MB
            </p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="upload-error" role="alert">
          <span className="err-icon">!</span>
          <span>{error}</span>
        </div>
      )}

      {/* How it works */}
      <section className="how-it-works">
        <h2 className="how-label">// HOW IT WORKS</h2>
        <div className="how-grid">
          {[
            {
              n: "01",
              title: "Prepare spreadsheet",
              body: "Add http/https URLs to any column. They can be mixed with other text — the extractor finds them all.",
            },
            {
              n: "02",
              title: "Upload file",
              body: "Drag-and-drop or click browse. The backend parses the file and returns all unique URLs instantly.",
            },
            {
              n: "03",
              title: "Navigate sites",
              body: "Click Prev / Next or press ← → arrow keys. Sites load in an embedded viewer right inside the app.",
            },
          ].map(({ n, title, body }) => (
            <div key={n} className="how-card">
              <span className="how-num">{n}</span>
              <strong className="how-title">{title}</strong>
              <p className="how-body">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

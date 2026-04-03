import React, { useRef, useEffect, useState } from "react";
import "./UrlSidebar.css";

export default function UrlSidebar({ open, urls, currentIndex, onSelect, onClose }) {
  const listRef   = useRef(null);
  const activeRef = useRef(null);
  const [query, setQuery] = useState("");

  // Scroll active item into view when sidebar opens or index changes
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }, 50);
    }
  }, [open, currentIndex]);

  const filtered = query.trim()
    ? urls.filter((u) => u.url.toLowerCase().includes(query.toLowerCase()))
    : urls;

  return (
    <aside className={`url-sidebar${open ? " url-sidebar--open" : ""}`}
      aria-label="URL list"
      aria-hidden={!open}
    >
      {/* Header */}
      <div className="sidebar-head">
        <span className="sidebar-title">// URL LIST</span>
        <span className="sidebar-badge">{urls.length}</span>
        <button className="sidebar-close" onClick={onClose} aria-label="Close sidebar">✕</button>
      </div>

      {/* Search */}
      <div className="sidebar-search">
        <span className="search-icon">⌕</span>
        <input
          type="text"
          placeholder="Filter URLs…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
          aria-label="Filter URLs"
        />
        {query && (
          <button className="search-clear" onClick={() => setQuery("")} aria-label="Clear filter">×</button>
        )}
      </div>

      {/* List */}
      <div className="sidebar-list" ref={listRef} role="listbox" aria-label="Websites">
        {filtered.length === 0 ? (
          <p className="sidebar-empty">No URLs match "{query}"</p>
        ) : (
          filtered.map((entry, i) => {
            // When filtered, find the real index
            const realIndex = urls.indexOf(entry);
            const isActive  = realIndex === currentIndex;
            return (
              <button
                key={realIndex}
                ref={isActive ? activeRef : null}
                className={`sidebar-item${isActive ? " sidebar-item--active" : ""}`}
                onClick={() => onSelect(realIndex)}
                role="option"
                aria-selected={isActive}
                title={entry.url}
              >
                <span className="si-index">{String(realIndex + 1).padStart(2, "0")}</span>
                <span className="si-url">{entry.url}</span>
                {isActive && <span className="si-dot" aria-hidden="true" />}
              </button>
            );
          })
        )}
      </div>

      {/* Footer counter */}
      <div className="sidebar-foot">
        {query
          ? `${filtered.length} of ${urls.length} URLs`
          : `${currentIndex + 1} / ${urls.length} URLs`
        }
      </div>
    </aside>
  );
}

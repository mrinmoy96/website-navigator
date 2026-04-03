/**
 * Scans every cell in the parsed 2-D array (rows × cols) and
 * returns an array of unique, valid http(s) URL objects.
 */
const URL_RE = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi;

function isValidUrl(str) {
  try {
    const u = new URL(str);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function cleanUrl(raw) {
  // Strip common trailing punctuation that isn't part of the URL
  return raw.replace(/[.,;:!?)"'\]]+$/, "");
}

function extractUrls(rows) {
  const seen    = new Set();
  const results = [];

  rows.forEach((row, rowIndex) => {
    if (!Array.isArray(row)) return;

    row.forEach((cell) => {
      if (cell == null) return;
      const text = String(cell).trim();

      // 1. Try the whole cell as a URL (most common case)
      const direct = cleanUrl(text);
      if (isValidUrl(direct) && !seen.has(direct)) {
        seen.add(direct);
        results.push({ url: direct, label: direct, row: rowIndex + 1 });
        return;
      }

      // 2. Scan the cell for embedded URLs
      const matches = text.match(URL_RE) ?? [];
      for (const raw of matches) {
        const url = cleanUrl(raw);
        if (isValidUrl(url) && !seen.has(url)) {
          seen.add(url);
          results.push({ url, label: url, row: rowIndex + 1 });
        }
      }
    });
  });

  return results;
}

module.exports = { extractUrls };

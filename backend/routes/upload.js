const express = require("express");
const router  = express.Router();
const multer  = require("multer");
const XLSX    = require("xlsx");
const { v4: uuidv4 } = require("uuid");
const { extractUrls } = require("../middleware/urlExtractor");
const mem = require("../middleware/memStore");

/* ── Multer config ──────────────────────────────────────── */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter(_req, file, cb) {
    const validExts = [".xlsx", ".xls", ".csv"];
    const ok = validExts.some((ext) =>
      file.originalname.toLowerCase().endsWith(ext)
    );
    ok
      ? cb(null, true)
      : cb(new Error("Only .xlsx, .xls, and .csv files are accepted."));
  },
});

/* ── Helpers ─────────────────────────────────────────────── */
function isMongoLive() {
  try { return require("mongoose").connection.readyState === 1; }
  catch { return false; }
}

async function persistSession(data) {
  if (isMongoLive()) {
    const Session = require("../models/Session");
    await Session.create(data);
  } else {
    mem.set(data.sessionId, data);
  }
}

/* ── POST /api/upload ────────────────────────────────────── */
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file received." });
    }

    // Parse workbook
    const wb   = XLSX.read(req.file.buffer, { type: "buffer" });
    const ws   = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

    const urls = extractUrls(rows);

    if (urls.length === 0) {
      return res.status(422).json({
        error:
          "No valid URLs found in the file. " +
          "Make sure your spreadsheet contains http:// or https:// links.",
      });
    }

    const sessionId = uuidv4();
    const session = {
      sessionId,
      fileName: req.file.originalname,
      urls,
      currentIndex: 0,
    };

    await persistSession(session);

    res.status(201).json({
      sessionId,
      fileName: req.file.originalname,
      total: urls.length,
      urls,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message || "Upload processing failed." });
  }
});

module.exports = router;

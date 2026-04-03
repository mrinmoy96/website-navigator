require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const uploadRouter   = require("./routes/upload");
const sessionsRouter = require("./routes/sessions");

const app  = express();
const PORT = process.env.PORT || 5000;

/* ── Middleware ─────────────────────────────────────────── */
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

/* ── Routes ─────────────────────────────────────────────── */
app.use("/api/upload",   uploadRouter);
app.use("/api/sessions", sessionsRouter);
app.get("/api/health", (_req, res) =>
  res.json({ ok: true, ts: new Date().toISOString() })
);

/* ── MongoDB (optional) ──────────────────────────────────── */
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅  MongoDB connected"))
    .catch((err) => console.warn("⚠️   MongoDB unavailable:", err.message));
} else {
  console.log("ℹ️   No MONGO_URI set — using in-memory store");
}

app.listen(PORT, () =>
  console.log(`🚀  Backend running → http://localhost:${PORT}`)
);

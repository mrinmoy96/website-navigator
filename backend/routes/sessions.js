const express = require("express");
const router  = express.Router();
const mem = require("../middleware/memStore");

/* ── Helpers ─────────────────────────────────────────────── */
function isMongoLive() {
  try { return require("mongoose").connection.readyState === 1; }
  catch { return false; }
}

async function findSession(id) {
  if (isMongoLive()) {
    const Session = require("../models/Session");
    return (await Session.findOne({ sessionId: id }).lean()) ?? null;
  }
  return mem.get(id);
}

async function updateSession(id, patch) {
  if (isMongoLive()) {
    const Session = require("../models/Session");
    return (
      await Session.findOneAndUpdate({ sessionId: id }, patch, { new: true }).lean()
    ) ?? null;
  }
  return mem.update(id, patch);
}

async function deleteSession(id) {
  if (isMongoLive()) {
    const Session = require("../models/Session");
    await Session.deleteOne({ sessionId: id });
  } else {
    mem.remove(id);
  }
}

/* ── GET /api/sessions/:id ───────────────────────────────── */
router.get("/:id", async (req, res) => {
  const session = await findSession(req.params.id);
  if (!session) return res.status(404).json({ error: "Session not found." });
  res.json(session);
});

/* ── PATCH /api/sessions/:id ─────────────────────────────── */
router.patch("/:id", async (req, res) => {
  const session = await findSession(req.params.id);
  if (!session) return res.status(404).json({ error: "Session not found." });

  const idx = Number(req.body.currentIndex);
  if (!Number.isInteger(idx) || idx < 0 || idx >= session.urls.length) {
    return res.status(400).json({ error: "currentIndex out of range." });
  }

  const updated = await updateSession(req.params.id, { currentIndex: idx });
  res.json({ currentIndex: updated.currentIndex });
});

/* ── DELETE /api/sessions/:id ────────────────────────────── */
router.delete("/:id", async (req, res) => {
  await deleteSession(req.params.id);
  res.json({ ok: true });
});

module.exports = router;

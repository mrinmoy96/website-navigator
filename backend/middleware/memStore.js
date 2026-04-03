/**
 * Simple TTL-aware Map used when MongoDB is not configured.
 * Sessions auto-expire after 24 hours.
 */
const TTL = 24 * 60 * 60 * 1000; // 24 h in ms
const _store = new Map();

function _prune() {
  const now = Date.now();
  for (const [k, v] of _store) {
    if (now > v.exp) _store.delete(k);
  }
}

function set(id, data) {
  _store.set(id, { data: { ...data }, exp: Date.now() + TTL });
}

function get(id) {
  _prune();
  const entry = _store.get(id);
  if (!entry) return null;
  return entry.data;
}

function update(id, patch) {
  const existing = get(id);
  if (!existing) return null;
  const updated = { ...existing, ...patch };
  set(id, updated);
  return updated;
}

function remove(id) {
  _store.delete(id);
}

module.exports = { set, get, update, remove };

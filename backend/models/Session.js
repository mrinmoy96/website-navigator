const mongoose = require("mongoose");

const urlEntrySchema = new mongoose.Schema({
  url:   { type: String, required: true },
  label: { type: String, default: "" },
  row:   { type: Number },
});

const sessionSchema = new mongoose.Schema(
  {
    sessionId:    { type: String, required: true, unique: true, index: true },
    fileName:     { type: String, required: true },
    urls:         { type: [urlEntrySchema], required: true },
    currentIndex: { type: Number, default: 0 },
    createdAt:    { type: Date, default: Date.now, expires: 86400 }, // TTL 24 h
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);

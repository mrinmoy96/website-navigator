# 🌐 WebNav — Website Navigator

> A full-stack MERN application that reads website URLs from an Excel or CSV file and lets you browse every site without leaving the app.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-00b09c?style=flat-square)
![Node](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Optional-47A248?style=flat-square&logo=mongodb)

---

## ✨ Features

| Feature | Details |
|---|---|
| **File Upload** | Drag-and-drop or browse — supports `.xlsx`, `.xls`, `.csv` up to 10 MB |
| **Smart URL Extraction** | Scans every cell, finds all valid `http/https` URLs automatically |
| **Embedded Viewer** | Sites load inside an iframe — no tab switching |
| **Navigation** | Prev / Next buttons + keyboard `←` `→` arrow keys |
| **Jump to URL** | Click the counter to jump to any site by number |
| **URL Sidebar** | Slide-in list of all URLs with live search/filter |
| **Block Detection** | Detects `X-Frame-Options` blocks and offers "Open in New Tab" |
| **Session Persistence** | Saves your position to MongoDB (or in-memory fallback) |
| **Responsive UI** | Works on desktop and mobile |

---

## 🗂 Project Structure

```
website-navigator/
├── backend/                   # Node.js + Express API
│   ├── middleware/
│   │   ├── memStore.js        # In-memory session store (MongoDB fallback)
│   │   └── urlExtractor.js    # URL parsing utility
│   ├── models/
│   │   └── Session.js         # Mongoose schema
│   ├── routes/
│   │   ├── upload.js          # POST /api/upload
│   │   └── sessions.js        # GET/PATCH/DELETE /api/sessions/:id
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/                  # React 18 app
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── FrameViewer.js  # iframe with loading state
│       │   ├── NavControls.js  # Prev/Next/progress bar
│       │   └── UrlSidebar.js   # Slide-in URL list
│       ├── pages/
│       │   ├── UploadPage.js   # Landing / upload screen
│       │   └── NavigatorPage.js# Main browsing view
│       ├── App.js
│       ├── index.js
│       └── index.css
│
├── package.json               # Root scripts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later
- **MongoDB** (optional — the app runs without it using an in-memory store)

---

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/website-navigator.git
cd website-navigator
```

### 2. Install dependencies

```bash
# Install root devDependencies (concurrently)
npm install

# Install backend + frontend dependencies
npm run install:all
```

Or manually:

```bash
cd backend  && npm install
cd ../frontend && npm install
```

### 3. Configure environment

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and adjust as needed:

```env
PORT=5000
CLIENT_URL=http://localhost:3000

# Optional — remove the comment to persist sessions in MongoDB
# MONGO_URI=mongodb://127.0.0.1:27017/website-navigator
```

### 4. Run in development

From the **root** directory:

```bash
npm run dev
```

This starts both servers concurrently:
- **Backend** → http://localhost:5000
- **Frontend** → http://localhost:3000

Or start them separately:

```bash
npm run start:backend    # terminal 1
npm run start:frontend   # terminal 2
```

---

## 📋 Preparing Your Spreadsheet

Any of these formats work:

| Format | Notes |
|---|---|
| `.xlsx` | Microsoft Excel (recommended) |
| `.xls`  | Legacy Excel |
| `.csv`  | Comma-separated values |

### URL placement rules

- URLs can be in **any column**, **any row**
- One URL per cell, or **embedded in text** (e.g., `Visit https://example.com today`)
- Duplicate URLs are automatically removed
- Non-URL cells are silently ignored

### Example spreadsheet

| Name | Website | Notes |
|---|---|---|
| Google | https://google.com | Search engine |
| GitHub | https://github.com | Code hosting |
| MDN    | https://developer.mozilla.org | Docs |

---

## 🔌 API Reference

### `POST /api/upload`
Upload a spreadsheet file.

**Request:** `multipart/form-data` with field `file`

**Response:**
```json
{
  "sessionId": "uuid-v4",
  "fileName": "sites.xlsx",
  "total": 12,
  "urls": [
    { "url": "https://example.com", "label": "https://example.com", "row": 2 }
  ]
}
```

---

### `GET /api/sessions/:id`
Retrieve a saved session.

---

### `PATCH /api/sessions/:id`
Update the current URL index.

**Request body:**
```json
{ "currentIndex": 3 }
```

---

### `DELETE /api/sessions/:id`
Remove a session.

---

### `GET /api/health`
Health check — returns `{ "ok": true }`.

---

## 🗄 Database

MongoDB is **optional**. The app works in two modes:

| Mode | How to activate | Behaviour |
|---|---|---|
| **In-memory** | Leave `MONGO_URI` commented out | Sessions live for 24 h or until server restart |
| **MongoDB** | Set `MONGO_URI` in `.env` | Sessions persisted with 24-hour TTL index |

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `←` Arrow Left | Previous site |
| `→` Arrow Right | Next site |
| `Esc` | Close URL sidebar |
| `Enter` (in jump input) | Jump to site number |

---

## 🏗 Building for Production

```bash
# Build the React app
cd frontend && npm run build

# Serve the static build from Express (add this to server.js):
# app.use(express.static(path.join(__dirname, '../frontend/build')));
# app.get('*', (req, res) =>
#   res.sendFile(path.join(__dirname, '../frontend/build/index.html')));
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, CSS Modules, Axios |
| Backend | Node.js 18, Express 4 |
| File Parsing | SheetJS (xlsx) |
| File Upload | Multer |
| Database | MongoDB + Mongoose (optional) |
| Session IDs | UUID v4 |

---

## 📝 License

MIT — free to use, modify and distribute.

---

*Built as a MERN Stack assignment — 2024*

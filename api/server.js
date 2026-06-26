const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// Database in /data volume (persistent)
const DATA_DIR = "/data";
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, "theoria.db"));

// ─── Schema ───────────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS philosophers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    years TEXT,
    color TEXT DEFAULT '#b5862a',
    description TEXT,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS works (
    id TEXT PRIMARY KEY,
    philosopher_id TEXT NOT NULL REFERENCES philosophers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subtitle TEXT,
    year TEXT,
    color TEXT DEFAULT '#b5862a',
    description TEXT,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS fragments (
    id TEXT PRIMARY KEY,
    work_id TEXT NOT NULL REFERENCES works(id) ON DELETE CASCADE,
    num INTEGER NOT NULL,
    title TEXT NOT NULL,
    annotation TEXT,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS utterances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fragment_id TEXT NOT NULL REFERENCES fragments(id) ON DELETE CASCADE,
    speaker TEXT NOT NULL,
    speech TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS insights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fragment_id TEXT NOT NULL REFERENCES fragments(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    text TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS notes (
    key TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS reading_list (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    author TEXT NOT NULL,
    work TEXT NOT NULL,
    year TEXT,
    chapter TEXT,
    why TEXT,
    topic TEXT,
    priority INTEGER DEFAULT 99
  );
`);

// ─── Seed data als DB leeg is ─────────────────────────────────────────────────
const philosopherCount = db.prepare("SELECT COUNT(*) as c FROM philosophers").get();
if (philosopherCount.c === 0) {
  console.log("Seeding database...");
  const seedPath = path.join(__dirname, "seed.js");
  if (fs.existsSync(seedPath)) require("./seed")(db);
  console.log("Seed done.");
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getFullLibrary() {
  const philosophers = db.prepare("SELECT * FROM philosophers ORDER BY sort_order, name").all();
  return philosophers.map(phil => {
    const works = db.prepare("SELECT * FROM works WHERE philosopher_id = ? ORDER BY sort_order, title").all(phil.id);
    return {
      ...phil,
      works: works.map(work => {
        const fragments = db.prepare("SELECT * FROM fragments WHERE work_id = ? ORDER BY sort_order, num").all(work.id);
        return {
          ...work,
          fragments: fragments.map(frag => ({
            ...frag,
            text: db.prepare("SELECT speaker, speech FROM utterances WHERE fragment_id = ? ORDER BY sort_order").all(frag.id),
            insights: db.prepare("SELECT label, text FROM insights WHERE fragment_id = ? ORDER BY sort_order").all(frag.id),
          }))
        };
      })
    };
  });
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// Library
app.get("/api/library", (req, res) => {
  try {
    res.json(getFullLibrary());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Philosophers ──
app.get("/api/philosophers", (req, res) => {
  res.json(db.prepare("SELECT * FROM philosophers ORDER BY sort_order, name").all());
});

app.post("/api/philosophers", (req, res) => {
  const { id, name, years, color, description, sort_order } = req.body;
  try {
    db.prepare("INSERT INTO philosophers (id, name, years, color, description, sort_order) VALUES (?, ?, ?, ?, ?, ?)")
      .run(id, name, years || "", color || "#b5862a", description || "", sort_order || 0);
    res.json({ ok: true });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.put("/api/philosophers/:id", (req, res) => {
  const { name, years, color, description, sort_order } = req.body;
  db.prepare("UPDATE philosophers SET name=?, years=?, color=?, description=?, sort_order=? WHERE id=?")
    .run(name, years, color, description, sort_order || 0, req.params.id);
  res.json({ ok: true });
});

app.delete("/api/philosophers/:id", (req, res) => {
  db.prepare("DELETE FROM philosophers WHERE id=?").run(req.params.id);
  res.json({ ok: true });
});

// ── Works ──
app.get("/api/philosophers/:philId/works", (req, res) => {
  res.json(db.prepare("SELECT * FROM works WHERE philosopher_id=? ORDER BY sort_order, title").all(req.params.philId));
});

app.post("/api/works", (req, res) => {
  const { id, philosopher_id, title, subtitle, year, color, description, sort_order } = req.body;
  try {
    db.prepare("INSERT INTO works (id, philosopher_id, title, subtitle, year, color, description, sort_order) VALUES (?,?,?,?,?,?,?,?)")
      .run(id, philosopher_id, title, subtitle || "", year || "", color || "#b5862a", description || "", sort_order || 0);
    res.json({ ok: true });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.put("/api/works/:id", (req, res) => {
  const { title, subtitle, year, color, description, sort_order } = req.body;
  db.prepare("UPDATE works SET title=?, subtitle=?, year=?, color=?, description=?, sort_order=? WHERE id=?")
    .run(title, subtitle, year, color, description, sort_order || 0, req.params.id);
  res.json({ ok: true });
});

app.delete("/api/works/:id", (req, res) => {
  db.prepare("DELETE FROM works WHERE id=?").run(req.params.id);
  res.json({ ok: true });
});

// ── Fragments ──
app.post("/api/fragments", (req, res) => {
  const { id, work_id, num, title, annotation, sort_order, text, insights } = req.body;
  const insert = db.transaction(() => {
    db.prepare("INSERT INTO fragments (id, work_id, num, title, annotation, sort_order) VALUES (?,?,?,?,?,?)")
      .run(id, work_id, num, title, annotation || "", sort_order || num);
    (text || []).forEach((u, i) =>
      db.prepare("INSERT INTO utterances (fragment_id, speaker, speech, sort_order) VALUES (?,?,?,?)").run(id, u.speaker, u.speech, i));
    (insights || []).forEach((ins, i) =>
      db.prepare("INSERT INTO insights (fragment_id, label, text, sort_order) VALUES (?,?,?,?)").run(id, ins.label, ins.text, i));
  });
  try { insert(); res.json({ ok: true }); }
  catch (e) { res.status(400).json({ error: e.message }); }
});

app.put("/api/fragments/:id", (req, res) => {
  const { num, title, annotation, sort_order, text, insights } = req.body;
  const update = db.transaction(() => {
    db.prepare("UPDATE fragments SET num=?, title=?, annotation=?, sort_order=? WHERE id=?")
      .run(num, title, annotation || "", sort_order || num, req.params.id);
    if (text !== undefined) {
      db.prepare("DELETE FROM utterances WHERE fragment_id=?").run(req.params.id);
      (text || []).forEach((u, i) =>
        db.prepare("INSERT INTO utterances (fragment_id, speaker, speech, sort_order) VALUES (?,?,?,?)").run(req.params.id, u.speaker, u.speech, i));
    }
    if (insights !== undefined) {
      db.prepare("DELETE FROM insights WHERE fragment_id=?").run(req.params.id);
      (insights || []).forEach((ins, i) =>
        db.prepare("INSERT INTO insights (fragment_id, label, text, sort_order) VALUES (?,?,?,?)").run(req.params.id, ins.label, ins.text, i));
    }
  });
  try { update(); res.json({ ok: true }); }
  catch (e) { res.status(400).json({ error: e.message }); }
});

app.delete("/api/fragments/:id", (req, res) => {
  db.prepare("DELETE FROM fragments WHERE id=?").run(req.params.id);
  res.json({ ok: true });
});

// ── Notes ──
app.get("/api/notes", (req, res) => {
  const rows = db.prepare("SELECT key, text FROM notes").all();
  const notes = {};
  rows.forEach(r => { notes[r.key] = r.text; });
  res.json(notes);
});

app.put("/api/notes/:key", (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    db.prepare("DELETE FROM notes WHERE key=?").run(req.params.key);
  } else {
    db.prepare("INSERT OR REPLACE INTO notes (key, text, updated_at) VALUES (?, ?, datetime('now'))").run(req.params.key, text);
  }
  res.json({ ok: true });
});

// ── Reading list ──
app.get("/api/reading-list", (req, res) => {
  res.json(db.prepare("SELECT * FROM reading_list ORDER BY priority").all());
});

app.post("/api/reading-list", (req, res) => {
  const { id, category, author, work, year, chapter, why, topic, priority } = req.body;
  try {
    db.prepare("INSERT INTO reading_list (id, category, author, work, year, chapter, why, topic, priority) VALUES (?,?,?,?,?,?,?,?,?)")
      .run(id, category, author, work, year || "", chapter || null, why || "", topic || "", priority || 99);
    res.json({ ok: true });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.put("/api/reading-list/:id", (req, res) => {
  const { category, author, work, year, chapter, why, topic, priority } = req.body;
  db.prepare("UPDATE reading_list SET category=?, author=?, work=?, year=?, chapter=?, why=?, topic=?, priority=? WHERE id=?")
    .run(category, author, work, year, chapter || null, why, topic, priority || 99, req.params.id);
  res.json({ ok: true });
});

app.delete("/api/reading-list/:id", (req, res) => {
  db.prepare("DELETE FROM reading_list WHERE id=?").run(req.params.id);
  res.json({ ok: true });
});

// ── Export/Import ──
app.get("/api/export", (req, res) => {
  res.json({
    version: "2.0",
    exportedAt: new Date().toISOString(),
    library: getFullLibrary(),
    readingList: db.prepare("SELECT * FROM reading_list ORDER BY priority").all(),
    notes: (() => {
      const rows = db.prepare("SELECT key, text FROM notes").all();
      const n = {}; rows.forEach(r => n[r.key] = r.text); return n;
    })()
  });
});

app.post("/api/import", (req, res) => {
  const { library, readingList, notes } = req.body;
  const importAll = db.transaction(() => {
    if (library) {
      library.forEach(phil => {
        db.prepare("INSERT OR REPLACE INTO philosophers (id, name, years, color, description, sort_order) VALUES (?,?,?,?,?,?)")
          .run(phil.id, phil.name, phil.years || "", phil.color || "#b5862a", phil.description || "", phil.sort_order || 0);
        (phil.works || []).forEach((work, wi) => {
          db.prepare("INSERT OR REPLACE INTO works (id, philosopher_id, title, subtitle, year, color, description, sort_order) VALUES (?,?,?,?,?,?,?,?)")
            .run(work.id, phil.id, work.title, work.subtitle || "", work.year || "", work.color || "#b5862a", work.description || "", wi);
          (work.fragments || []).forEach((frag, fi) => {
            db.prepare("INSERT OR REPLACE INTO fragments (id, work_id, num, title, annotation, sort_order) VALUES (?,?,?,?,?,?)")
              .run(frag.id || `${work.id}_f${fi+1}`, work.id, frag.num || fi+1, frag.title, frag.annotation || "", fi);
            const fragId = frag.id || `${work.id}_f${fi+1}`;
            db.prepare("DELETE FROM utterances WHERE fragment_id=?").run(fragId);
            db.prepare("DELETE FROM insights WHERE fragment_id=?").run(fragId);
            (frag.text || []).forEach((u, ui) =>
              db.prepare("INSERT INTO utterances (fragment_id, speaker, speech, sort_order) VALUES (?,?,?,?)").run(fragId, u.speaker, u.speech, ui));
            (frag.insights || []).forEach((ins, ii) =>
              db.prepare("INSERT INTO insights (fragment_id, label, text, sort_order) VALUES (?,?,?,?)").run(fragId, ins.label, ins.text, ii));
          });
        });
      });
    }
    if (readingList) {
      readingList.forEach(item => {
        db.prepare("INSERT OR REPLACE INTO reading_list (id, category, author, work, year, chapter, why, topic, priority) VALUES (?,?,?,?,?,?,?,?,?)")
          .run(item.id, item.category, item.author, item.work, item.year || "", item.chapter || null, item.why || "", item.topic || "", item.priority || 99);
      });
    }
    if (notes) {
      Object.entries(notes).forEach(([key, text]) => {
        db.prepare("INSERT OR REPLACE INTO notes (key, text) VALUES (?,?)").run(key, text);
      });
    }
  });
  try { importAll(); res.json({ ok: true }); }
  catch (e) { res.status(400).json({ error: e.message }); }
});

app.listen(3001, () => console.log("Theoria API running on :3001"));

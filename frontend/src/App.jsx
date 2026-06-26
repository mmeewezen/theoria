import { useState, useEffect, useRef } from "react";

const API = "/api";

// ─── STYLES ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #1a1610; --parchment: #f5f0e8; --aged: #e8e0ce;
    --gold: #b5862a; --gold-light: #e8c96a; --muted: #6b6257;
    --border: #d4c9b0; --anno-bg: #fffdf5;
  }
  html, body, #root { height: 100%; }
  body { background: var(--parchment); color: var(--ink); font-family: 'EB Garamond', Georgia, serif; font-size: 1.1rem; line-height: 1.85; }
  .app { display: flex; flex-direction: column; height: 100%; }
  .topnav { height: 64px; background: var(--ink); display: flex; align-items: center; padding: 0 1.5rem; gap: 1.5rem; border-bottom: 3px solid var(--gold); flex-shrink: 0; }
  .topnav-logo { font-family: 'EB Garamond', serif; font-size: 1.25rem; color: var(--parchment); letter-spacing: 0.08em; font-style: italic; flex: 1; cursor: pointer; }
  .topnav-logo span { color: var(--gold); font-style: normal; }
  .topnav-tabs { display: flex; gap: 0.25rem; align-items: center; }
  .topnav-tab { background: none; border: 1px solid transparent; color: #9e9080; font-family: 'Inter', sans-serif; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.4rem 0.9rem; cursor: pointer; border-radius: 3px; transition: all 0.15s; }
  .topnav-tab:hover { color: var(--parchment); border-color: #4a4030; }
  .topnav-tab.active { color: white; background: var(--gold); border-color: var(--gold); }
  .body { display: flex; flex: 1; overflow: hidden; }
  .sidebar { width: 260px; background: #141210; border-right: 1px solid #2a2418; display: flex; flex-direction: column; overflow: hidden; flex-shrink: 0; }
  .sidebar-works { overflow-y: auto; flex: 1; padding: 0.5rem 0; }
  .sidebar-label { font-family: 'Inter', sans-serif; font-size: 0.62rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #4a4030; padding: 0.75rem 1rem 0.4rem; }
  .sidebar-work { display: block; width: 100%; background: none; border: none; text-align: left; padding: 0.55rem 1rem; cursor: pointer; transition: background 0.1s; border-left: 3px solid transparent; }
  .sidebar-work:hover { background: rgba(255,255,255,0.04); }
  .sidebar-work.active { background: rgba(181,134,42,0.1); border-left-color: var(--gold); }
  .sidebar-work-title { font-family: 'EB Garamond', serif; font-size: 1rem; color: #d4c9b0; display: block; }
  .sidebar-work.active .sidebar-work-title { color: #e8c96a; }
  .sidebar-work-meta { font-family: 'Inter', sans-serif; font-size: 0.65rem; color: #5a5040; display: block; margin-top: 1px; }
  .sidebar-fragments { padding: 0.25rem 0 0.5rem; }
  .sidebar-frag { display: block; width: 100%; background: none; border: none; text-align: left; padding: 0.3rem 1rem 0.3rem 1.6rem; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 0.68rem; color: #5a5040; transition: color 0.1s; }
  .sidebar-frag:hover { color: #9a8060; }
  .sidebar-frag-num { color: var(--gold); margin-right: 0.4rem; opacity: 0.6; }
  .breadcrumb { display: flex; align-items: center; gap: 0.4rem; font-family: 'Inter', sans-serif; font-size: 0.68rem; color: var(--muted); padding: 0.6rem 1rem; border-bottom: 1px solid #2a2418; flex-wrap: wrap; }
  .breadcrumb-link { background: none; border: none; cursor: pointer; color: #9a8060; font-family: inherit; font-size: inherit; padding: 0; }
  .breadcrumb-link:hover { color: var(--gold); }
  .main { flex: 1; overflow-y: auto; }
  .home { flex: 1; overflow-y: auto; }
  .home-hero { background: var(--ink); color: var(--parchment); padding: 4rem 3rem 3.5rem; border-bottom: 3px solid var(--gold); text-align: center; }
  .home-hero-eyebrow { font-family: 'Inter', sans-serif; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase; color: var(--gold); margin-bottom: 1rem; }
  .home-hero h1 { font-size: 3.5rem; font-weight: 400; letter-spacing: 0.04em; margin-bottom: 0.75rem; font-style: italic; }
  .home-hero p { color: #9e9080; font-size: 1rem; max-width: 50ch; margin: 0 auto; line-height: 1.7; }
  .home-content { padding: 3rem; }
  .home-section-label { font-family: 'Inter', sans-serif; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); margin-bottom: 1.25rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border); }
  .philosopher-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; }
  .philosopher-card { background: white; border: 1px solid var(--border); padding: 2rem; cursor: pointer; transition: all 0.15s; position: relative; overflow: hidden; }
  .philosopher-card:hover { border-color: var(--gold); transform: translateY(-2px); box-shadow: 0 6px 24px rgba(0,0,0,0.10); }
  .philosopher-card-stripe { position: absolute; top: 0; left: 0; right: 0; height: 6px; }
  .philosopher-card-era { font-family: 'Inter', sans-serif; font-size: 0.62rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.5rem; margin-top: 0.5rem; }
  .philosopher-card-name { font-size: 2rem; font-weight: 500; margin-bottom: 0.25rem; }
  .philosopher-card-desc { font-size: 0.88rem; color: var(--muted); line-height: 1.65; margin-top: 0.75rem; }
  .philosopher-card-works { font-family: 'Inter', sans-serif; font-size: 0.65rem; color: var(--gold); margin-top: 1rem; font-weight: 500; }
  .philosopher-card-list { margin-top: 0.4rem; display: flex; flex-wrap: wrap; gap: 0.35rem; }
  .philosopher-card-pill { font-family: 'Inter', sans-serif; font-size: 0.62rem; background: var(--aged); color: var(--muted); padding: 0.15rem 0.55rem; border-radius: 2px; font-style: italic; }
  .lib-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }
  .lib-card { background: white; border: 1px solid var(--border); padding: 1.5rem; cursor: pointer; transition: all 0.15s; position: relative; }
  .lib-card:hover { border-color: var(--gold); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
  .lib-card-philosopher { font-family: 'Inter', sans-serif; font-size: 0.62rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.35rem; }
  .lib-card-title { font-size: 1.5rem; font-weight: 500; line-height: 1.2; margin-bottom: 0.2rem; }
  .lib-card-subtitle { font-style: italic; color: var(--muted); font-size: 0.9rem; margin-bottom: 0.75rem; }
  .lib-card-desc { font-size: 0.85rem; color: var(--muted); line-height: 1.6; }
  .lib-card-year { font-family: 'Inter', sans-serif; font-size: 0.65rem; color: var(--gold); margin-top: 0.75rem; font-weight: 500; }
  .lib-card-frags { font-family: 'Inter', sans-serif; font-size: 0.65rem; color: var(--border); margin-top: 0.25rem; }
  .work-header { padding: 3rem 3rem 2.5rem; border-bottom: 1px solid var(--border); position: relative; }
  .work-header-accent { width: 6px; height: 3rem; position: absolute; left: 0; top: 2rem; }
  .work-eyebrow { font-family: 'Inter', sans-serif; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.5rem; }
  .work-title { font-size: 3rem; font-weight: 500; line-height: 1.1; margin-bottom: 0.3rem; }
  .work-subtitle { font-style: italic; font-size: 1.2rem; color: var(--muted); margin-bottom: 1rem; }
  .work-desc { font-size: 1rem; color: var(--muted); max-width: 65ch; line-height: 1.7; }
  .work-year { font-family: 'Inter', sans-serif; font-size: 0.72rem; color: var(--gold); margin-top: 0.75rem; }
  .fragments { padding: 0 3rem 4rem; }
  .fragment { padding: 2.5rem 0; border-bottom: 1px solid var(--border); display: grid; grid-template-columns: 1fr 340px; gap: 2.5rem; align-items: start; scroll-margin-top: 1.5rem; }
  .fragment:last-child { border-bottom: none; }
  .fragment-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; }
  .fragment-num-badge { width: 28px; height: 28px; border-radius: 50%; color: white; font-family: 'Inter', sans-serif; font-size: 0.72rem; font-weight: 600; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .fragment-title-text { font-size: 1rem; font-weight: 500; font-family: 'Inter', sans-serif; color: var(--muted); }
  .dialogue { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1rem; }
  .utterance { display: flex; gap: 0.75rem; }
  .speaker { font-family: 'Inter', sans-serif; font-size: 0.68rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; flex-shrink: 0; width: 80px; padding-top: 0.2rem; }
  .speech { font-style: italic; color: #2a2210; flex: 1; }
  .fragment-side { display: flex; flex-direction: column; gap: 0.75rem; }
  .anno-card { background: var(--anno-bg); border: 1px solid #ddd5b5; border-left: 3px solid var(--gold); padding: 1rem 1.1rem; font-size: 0.92rem; line-height: 1.75; color: #2a2210; }
  .card-label { font-family: 'Inter', sans-serif; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 0.4rem; display: block; }
  .anno-card .card-label { color: var(--gold); }
  .insights-card { border: 1px solid #ddd5b5; overflow: hidden; }
  .insight-toggle { width: 100%; background: var(--aged); border: none; border-top: 1px solid var(--border); padding: 0.55rem 1rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; transition: background 0.1s; }
  .insight-toggle:hover { background: #ddd5b5; }
  .insight-toggle:first-child { border-top: none; }
  .insight-body { padding: 0.75rem 1rem; background: white; border-top: 1px solid var(--border); font-size: 0.88rem; line-height: 1.75; color: #2a2210; }
  .note-card { background: #fffef8; border: 1px solid var(--border); border-left: 3px solid #8b6914; padding: 1rem 1.1rem; }
  .note-card .card-label { color: #8b6914; }
  .note-textarea { width: 100%; font-family: 'EB Garamond', serif; font-size: 0.95rem; line-height: 1.7; border: 1px solid var(--border); padding: 0.5rem; background: white; color: var(--ink); resize: vertical; min-height: 80px; outline: none; }
  .note-textarea:focus { border-color: var(--gold); }
  .btn { font-family: 'Inter', sans-serif; font-size: 0.68rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.35rem 0.85rem; border: none; cursor: pointer; transition: all 0.1s; }
  .btn-gold { background: var(--gold); color: white; }
  .btn-gold:hover { background: #9a6e20; }
  .btn-ghost { background: none; border: 1px solid var(--border); color: var(--muted); }
  .btn-ghost:hover { border-color: var(--ink); color: var(--ink); }
  .btn-danger { background: none; border: 1px solid #c0392b; color: #c0392b; }
  .btn-danger:hover { background: #c0392b; color: white; }
  .btn-row { display: flex; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap; }
  .note-edit { font-family: 'Inter', sans-serif; font-size: 0.65rem; background: none; border: none; cursor: pointer; color: var(--gold); padding: 0; text-decoration: underline; margin-top: 0.4rem; display: inline-block; }
  .readinglist { padding: 2.5rem 3rem; }
  .readinglist h2 { font-size: 2rem; font-weight: 500; margin-bottom: 0.25rem; }
  .readinglist-intro { color: var(--muted); font-size: 0.95rem; margin-bottom: 2rem; }
  .rl-category { font-family: 'Inter', sans-serif; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); margin: 1.5rem 0 0.75rem; padding-bottom: 0.4rem; border-bottom: 1px solid var(--border); }
  .rl-item { background: white; border: 1px solid var(--border); padding: 1.25rem 1.5rem; margin-bottom: 0.75rem; }
  .rl-priority { font-family: 'Inter', sans-serif; font-size: 0.62rem; color: var(--gold); font-weight: 600; margin-bottom: 0.25rem; }
  .rl-title { font-size: 1.15rem; font-weight: 500; margin-bottom: 0.15rem; }
  .rl-author { font-family: 'Inter', sans-serif; font-size: 0.72rem; color: var(--muted); margin-bottom: 0.6rem; }
  .rl-why { font-size: 0.9rem; color: var(--muted); line-height: 1.65; margin-bottom: 0.5rem; }
  .rl-tags { display: flex; flex-wrap: wrap; gap: 0.3rem; }
  .rl-tag { font-family: 'Inter', sans-serif; font-size: 0.6rem; background: var(--aged); color: var(--muted); padding: 0.1rem 0.5rem; border-radius: 2px; }

  /* ── CMS ── */
  .cms { padding: 2.5rem 3rem; max-width: 900px; }
  .cms h2 { font-size: 2rem; font-weight: 500; margin-bottom: 0.25rem; }
  .cms-intro { color: var(--muted); font-size: 0.95rem; margin-bottom: 2rem; }
  .cms-section { margin-bottom: 2.5rem; }
  .cms-section-title { font-family: 'Inter', sans-serif; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-bottom: 1rem; padding-bottom: 0.4rem; border-bottom: 1px solid var(--border); }
  .field-group { margin-bottom: 1rem; }
  .field-label { font-family: 'Inter', sans-serif; font-size: 0.68rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.3rem; display: block; }
  .field-input { width: 100%; background: white; border: 1px solid var(--border); padding: 0.5rem 0.75rem; font-family: 'EB Garamond', serif; font-size: 1rem; color: var(--ink); outline: none; }
  .field-input:focus { border-color: var(--gold); }
  textarea.field-input { resize: vertical; min-height: 80px; }
  .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .cms-item { background: white; border: 1px solid var(--border); padding: 1rem 1.25rem; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center; }
  .cms-item-title { font-size: 1rem; font-weight: 500; }
  .cms-item-meta { font-family: 'Inter', sans-serif; font-size: 0.68rem; color: var(--muted); margin-top: 2px; }
  .cms-item-actions { display: flex; gap: 0.4rem; flex-shrink: 0; }
  .cms-form { background: #fffdf5; border: 1px solid var(--border); padding: 1.5rem; margin-bottom: 1rem; }
  .utterance-row { display: grid; grid-template-columns: 120px 1fr 32px; gap: 0.4rem; margin-bottom: 0.4rem; align-items: start; }
  .insight-row { display: grid; grid-template-columns: 200px 1fr 32px; gap: 0.4rem; margin-bottom: 0.4rem; align-items: start; }
  .remove-btn { background: none; border: 1px solid var(--border); color: var(--muted); cursor: pointer; width: 32px; height: 36px; font-size: 1rem; display: flex; align-items: center; justify-content: center; }
  .remove-btn:hover { border-color: #c0392b; color: #c0392b; }
  .toast { position: fixed; bottom: 2rem; right: 2rem; background: var(--ink); color: var(--parchment); font-family: 'Inter', sans-serif; font-size: 0.78rem; padding: 0.65rem 1.1rem; border-left: 3px solid var(--gold); z-index: 1000; animation: slideUp 0.2s ease; }
  .loading { display: flex; align-items: center; justify-content: center; height: 100%; color: var(--muted); font-family: 'Inter', sans-serif; font-size: 0.9rem; }
  @keyframes slideUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
  @media (max-width: 768px) {
    .fragment { grid-template-columns: 1fr; }
    .fragments, .home-content, .readinglist, .cms { padding: 1.5rem 1.25rem; }
    .work-header { padding: 2rem 1.25rem 1.5rem; }
    .field-grid { grid-template-columns: 1fr; }
  }
`;

// ─── API helpers ──────────────────────────────────────────────────────────────
async function apiFetch(path, opts = {}) {
  const res = await fetch(API + path, {
    headers: { "Content-Type": "application/json" },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function Toast({ msg }) {
  return <div className="toast">{msg}</div>;
}

function InsightCard({ insights, accentColor }) {
  const [open, setOpen] = useState({});
  if (!insights || insights.length === 0) return null;
  return (
    <div className="insights-card">
      {insights.map((ins, i) => (
        <div key={i}>
          <button className="insight-toggle" style={{ color: accentColor }}
            onClick={() => setOpen(p => ({ ...p, [i]: !p[i] }))}>
            {ins.label}
            <span style={{ fontFamily: "monospace" }}>{open[i] ? "−" : "+"}</span>
          </button>
          {open[i] && <div className="insight-body">{ins.text}</div>}
        </div>
      ))}
    </div>
  );
}

function NoteCard({ noteKey, notes, onSave }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(notes[noteKey] || "");
  const existing = notes[noteKey];

  async function handleSave() {
    await onSave(noteKey, text);
    setEditing(false);
  }

  return (
    <div className="note-card">
      <span className="card-label">Jouw aantekening</span>
      {editing ? (
        <>
          <textarea className="note-textarea" value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Schrijf hier je aantekening..." autoFocus />
          <div className="btn-row">
            <button className="btn btn-gold" onClick={handleSave}>Opslaan</button>
            <button className="btn btn-ghost" onClick={() => { setEditing(false); setText(existing || ""); }}>Annuleren</button>
          </div>
        </>
      ) : existing ? (
        <>
          <div style={{ fontSize: "0.92rem", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{existing}</div>
          <button className="note-edit" onClick={() => { setEditing(true); setText(existing); }}>Bewerken</button>
        </>
      ) : (
        <button className="btn btn-ghost" style={{ marginTop: "0.25rem" }}
          onClick={() => setEditing(true)}>+ Aantekening toevoegen</button>
      )}
    </div>
  );
}

function FragmentView({ frag, accentColor, noteKey, notes, onSaveNote }) {
  return (
    <div className="fragment" id={frag.id}>
      <div>
        <div className="fragment-header">
          <div className="fragment-num-badge" style={{ background: accentColor }}>{frag.num}</div>
          <span className="fragment-title-text">{frag.title}</span>
        </div>
        <div className="dialogue">
          {(frag.text || []).map((u, i) => (
            <div className="utterance" key={i}>
              <span className="speaker" style={{ color: accentColor }}>{u.speaker}</span>
              <span className="speech">"{u.speech}"</span>
            </div>
          ))}
        </div>
      </div>
      <div className="fragment-side">
        {frag.annotation && (
          <div className="anno-card">
            <span className="card-label" style={{ color: accentColor }}>Aantekening</span>
            {frag.annotation}
          </div>
        )}
        <InsightCard insights={frag.insights} accentColor={accentColor} />
        <NoteCard noteKey={noteKey} notes={notes} onSave={onSaveNote} />
      </div>
    </div>
  );
}

// ─── CMS ──────────────────────────────────────────────────────────────────────
function CmsView({ library, onRefresh, onToast }) {
  const [section, setSection] = useState("philosophers"); // philosophers | works | fragments
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [selectedPhil, setSelectedPhil] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);

  const philosophers = library;
  const works = selectedPhil ? (philosophers.find(p => p.id === selectedPhil)?.works || []) : [];
  const fragments = selectedWork
    ? (works.find(w => w.id === selectedWork)?.fragments || [])
    : [];

  function startNew(defaults) {
    setEditing("new");
    setForm(defaults || {});
  }

  function startEdit(item) {
    setEditing(item.id);
    setForm({ ...item });
  }

  function setF(k, v) { setForm(p => ({ ...p, [k]: v })); }

  async function savePhilosopher() {
    const payload = { id: form.id || uid(), name: form.name, years: form.years, color: form.color || "#b5862a", description: form.description };
    if (editing === "new") await apiFetch("/philosophers", { method: "POST", body: payload });
    else await apiFetch(`/philosophers/${editing}`, { method: "PUT", body: payload });
    setEditing(null); onRefresh(); onToast("Filosoof opgeslagen");
  }

  async function deletePhilosopher(id) {
    if (!confirm("Zeker weten? Dit verwijdert ook alle werken en fragmenten.")) return;
    await apiFetch(`/philosophers/${id}`, { method: "DELETE" });
    onRefresh(); onToast("Verwijderd");
  }

  async function saveWork() {
    const payload = { id: form.id || uid(), philosopher_id: selectedPhil, title: form.title, subtitle: form.subtitle, year: form.year, color: form.color || "#b5862a", description: form.description };
    if (editing === "new") await apiFetch("/works", { method: "POST", body: payload });
    else await apiFetch(`/works/${editing}`, { method: "PUT", body: payload });
    setEditing(null); onRefresh(); onToast("Werk opgeslagen");
  }

  async function deleteWork(id) {
    if (!confirm("Zeker weten?")) return;
    await apiFetch(`/works/${id}`, { method: "DELETE" });
    onRefresh(); onToast("Verwijderd");
  }

  async function saveFragment() {
    const payload = {
      id: form.id || uid(),
      work_id: selectedWork,
      num: parseInt(form.num) || fragments.length + 1,
      title: form.title,
      annotation: form.annotation || "",
      text: (form.text || [{ speaker: "", speech: "" }]).filter(u => u.speaker || u.speech),
      insights: (form.insights || []).filter(i => i.label || i.text),
    };
    if (editing === "new") await apiFetch("/fragments", { method: "POST", body: payload });
    else await apiFetch(`/fragments/${editing}`, { method: "PUT", body: payload });
    setEditing(null); onRefresh(); onToast("Fragment opgeslagen");
  }

  async function deleteFragment(id) {
    if (!confirm("Zeker weten?")) return;
    await apiFetch(`/fragments/${id}`, { method: "DELETE" });
    onRefresh(); onToast("Verwijderd");
  }

  function addUtterance() { setF("text", [...(form.text || []), { speaker: "", speech: "" }]); }
  function setUtterance(i, k, v) {
    const t = [...(form.text || [])]; t[i] = { ...t[i], [k]: v }; setF("text", t);
  }
  function removeUtterance(i) { setF("text", (form.text || []).filter((_, j) => j !== i)); }

  function addInsight() { setF("insights", [...(form.insights || []), { label: "", text: "" }]); }
  function setInsight(i, k, v) {
    const ins = [...(form.insights || [])]; ins[i] = { ...ins[i], [k]: v }; setF("insights", ins);
  }
  function removeInsight(i) { setF("insights", (form.insights || []).filter((_, j) => j !== i)); }

  async function handleExport() {
    const data = await apiFetch("/export");
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "theoria-export.json"; a.click();
    URL.revokeObjectURL(url);
    onToast("Geëxporteerd");
  }

  async function handleImport(e) {
    const file = e.target.files[0]; if (!file) return;
    const text = await file.text();
    const data = JSON.parse(text);
    await apiFetch("/import", { method: "POST", body: data });
    onRefresh(); onToast("Geïmporteerd");
    e.target.value = "";
  }

  return (
    <div className="main">
      <div className="cms">
        <h2>Beheer</h2>
        <p className="cms-intro">Voeg filosofen, werken en fragmenten toe of bewerk ze. Alle wijzigingen worden direct opgeslagen in de database.</p>

        <div className="btn-row" style={{ marginBottom: "2rem" }}>
          <button className="btn btn-gold" onClick={handleExport}>Exporteer JSON</button>
          <label className="btn btn-ghost" style={{ cursor: "pointer" }}>
            Importeer JSON
            <input type="file" accept=".json" onChange={handleImport} style={{ display: "none" }} />
          </label>
        </div>

        {/* ── Filosofen ── */}
        <div className="cms-section">
          <div className="cms-section-title">Filosofen</div>
          {philosophers.map(p => (
            <div key={p.id} className="cms-item">
              <div>
                <div className="cms-item-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: p.color, display: "inline-block", flexShrink: 0 }} />
                  {p.name}
                </div>
                <div className="cms-item-meta">{p.years} · {p.works?.length || 0} werken</div>
              </div>
              <div className="cms-item-actions">
                <button className="btn btn-ghost" onClick={() => { setSelectedPhil(p.id); setSection("works"); }}>Werken</button>
                <button className="btn btn-ghost" onClick={() => startEdit(p)}>Bewerken</button>
                <button className="btn btn-danger" onClick={() => deletePhilosopher(p.id)}>✕</button>
              </div>
            </div>
          ))}
          {editing !== "new" || section !== "philosophers" ? (
            <button className="btn btn-ghost" onClick={() => { setSection("philosophers"); startNew({ color: "#b5862a" }); }}>
              + Filosoof toevoegen
            </button>
          ) : null}

          {(editing === "new" || philosophers.find(p => p.id === editing)) && section === "philosophers" && (
            <div className="cms-form">
              <div className="field-grid">
                <div className="field-group">
                  <label className="field-label">ID (uniek, geen spaties)</label>
                  <input className="field-input" value={form.id || ""} onChange={e => setF("id", e.target.value)} placeholder="bijv. aristoteles" disabled={editing !== "new"} />
                </div>
                <div className="field-group">
                  <label className="field-label">Naam</label>
                  <input className="field-input" value={form.name || ""} onChange={e => setF("name", e.target.value)} />
                </div>
                <div className="field-group">
                  <label className="field-label">Jaren</label>
                  <input className="field-input" value={form.years || ""} onChange={e => setF("years", e.target.value)} placeholder="bijv. 384–322 v.Chr." />
                </div>
                <div className="field-group">
                  <label className="field-label">Kleur</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input type="color" value={form.color || "#b5862a"} onChange={e => setF("color", e.target.value)} style={{ width: 40, height: 36, border: "1px solid var(--border)", padding: 2 }} />
                    <input className="field-input" value={form.color || ""} onChange={e => setF("color", e.target.value)} style={{ flex: 1 }} />
                  </div>
                </div>
              </div>
              <div className="field-group">
                <label className="field-label">Beschrijving</label>
                <textarea className="field-input" value={form.description || ""} onChange={e => setF("description", e.target.value)} rows={3} />
              </div>
              <div className="btn-row">
                <button className="btn btn-gold" onClick={savePhilosopher}>Opslaan</button>
                <button className="btn btn-ghost" onClick={() => setEditing(null)}>Annuleren</button>
              </div>
            </div>
          )}
        </div>

        {/* ── Werken ── */}
        {selectedPhil && (
          <div className="cms-section">
            <div className="cms-section-title">
              Werken van {philosophers.find(p => p.id === selectedPhil)?.name}
            </div>
            {works.map(w => (
              <div key={w.id} className="cms-item">
                <div>
                  <div className="cms-item-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 12, height: 12, borderRadius: "50%", background: w.color, display: "inline-block", flexShrink: 0 }} />
                    {w.title}
                  </div>
                  <div className="cms-item-meta">{w.year} · {w.fragments?.length || 0} fragmenten</div>
                </div>
                <div className="cms-item-actions">
                  <button className="btn btn-ghost" onClick={() => { setSelectedWork(w.id); setSection("fragments"); }}>Fragmenten</button>
                  <button className="btn btn-ghost" onClick={() => { setSection("works"); startEdit(w); }}>Bewerken</button>
                  <button className="btn btn-danger" onClick={() => deleteWork(w.id)}>✕</button>
                </div>
              </div>
            ))}
            {editing !== "new" || section !== "works" ? (
              <button className="btn btn-ghost" onClick={() => { setSection("works"); startNew({ color: "#8b3a1e" }); }}>
                + Werk toevoegen
              </button>
            ) : null}

            {(editing === "new" || works.find(w => w.id === editing)) && section === "works" && (
              <div className="cms-form">
                <div className="field-grid">
                  <div className="field-group">
                    <label className="field-label">ID</label>
                    <input className="field-input" value={form.id || ""} onChange={e => setF("id", e.target.value)} placeholder="bijv. symposium" disabled={editing !== "new"} />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Titel</label>
                    <input className="field-input" value={form.title || ""} onChange={e => setF("title", e.target.value)} />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Ondertitel</label>
                    <input className="field-input" value={form.subtitle || ""} onChange={e => setF("subtitle", e.target.value)} />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Jaar</label>
                    <input className="field-input" value={form.year || ""} onChange={e => setF("year", e.target.value)} />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Kleur</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input type="color" value={form.color || "#8b3a1e"} onChange={e => setF("color", e.target.value)} style={{ width: 40, height: 36, border: "1px solid var(--border)", padding: 2 }} />
                      <input className="field-input" value={form.color || ""} onChange={e => setF("color", e.target.value)} style={{ flex: 1 }} />
                    </div>
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">Beschrijving</label>
                  <textarea className="field-input" value={form.description || ""} onChange={e => setF("description", e.target.value)} rows={3} />
                </div>
                <div className="btn-row">
                  <button className="btn btn-gold" onClick={saveWork}>Opslaan</button>
                  <button className="btn btn-ghost" onClick={() => setEditing(null)}>Annuleren</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Fragmenten ── */}
        {selectedWork && (
          <div className="cms-section">
            <div className="cms-section-title">
              Fragmenten van {works.find(w => w.id === selectedWork)?.title}
            </div>
            {fragments.map(f => (
              <div key={f.id} className="cms-item">
                <div>
                  <div className="cms-item-title">
                    <span style={{ fontFamily: "Inter", fontSize: "0.72rem", color: "var(--gold)", marginRight: 8 }}>{String(f.num).padStart(2, "0")}</span>
                    {f.title}
                  </div>
                  <div className="cms-item-meta">{f.text?.length || 0} regels · {f.insights?.length || 0} inzichten</div>
                </div>
                <div className="cms-item-actions">
                  <button className="btn btn-ghost" onClick={() => { setSection("fragments"); startEdit({ ...f, text: f.text || [], insights: f.insights || [] }); }}>Bewerken</button>
                  <button className="btn btn-danger" onClick={() => deleteFragment(f.id)}>✕</button>
                </div>
              </div>
            ))}
            {editing !== "new" || section !== "fragments" ? (
              <button className="btn btn-ghost" onClick={() => { setSection("fragments"); startNew({ num: fragments.length + 1, text: [{ speaker: "", speech: "" }], insights: [] }); }}>
                + Fragment toevoegen
              </button>
            ) : null}

            {(editing === "new" || fragments.find(f => f.id === editing)) && section === "fragments" && (
              <div className="cms-form">
                <div className="field-grid">
                  <div className="field-group">
                    <label className="field-label">Nummer</label>
                    <input className="field-input" type="number" value={form.num || ""} onChange={e => setF("num", e.target.value)} />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Titel</label>
                    <input className="field-input" value={form.title || ""} onChange={e => setF("title", e.target.value)} />
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">Aantekening</label>
                  <textarea className="field-input" value={form.annotation || ""} onChange={e => setF("annotation", e.target.value)} rows={4} />
                </div>

                <div className="field-group">
                  <label className="field-label" style={{ marginBottom: 8 }}>Dialoogtekst</label>
                  {(form.text || []).map((u, i) => (
                    <div key={i} className="utterance-row">
                      <input className="field-input" value={u.speaker} onChange={e => setUtterance(i, "speaker", e.target.value)} placeholder="Spreker" />
                      <input className="field-input" value={u.speech} onChange={e => setUtterance(i, "speech", e.target.value)} placeholder="Tekst..." />
                      <button className="remove-btn" onClick={() => removeUtterance(i)}>×</button>
                    </div>
                  ))}
                  <button className="btn btn-ghost" style={{ fontSize: "0.65rem" }} onClick={addUtterance}>+ Regel</button>
                </div>

                <div className="field-group">
                  <label className="field-label" style={{ marginBottom: 8 }}>Inzichten</label>
                  {(form.insights || []).map((ins, i) => (
                    <div key={i} className="insight-row">
                      <input className="field-input" value={ins.label} onChange={e => setInsight(i, "label", e.target.value)} placeholder="Label..." />
                      <textarea className="field-input" value={ins.text} onChange={e => setInsight(i, "text", e.target.value)} placeholder="Tekst..." rows={2} />
                      <button className="remove-btn" onClick={() => removeInsight(i)}>×</button>
                    </div>
                  ))}
                  <button className="btn btn-ghost" style={{ fontSize: "0.65rem" }} onClick={addInsight}>+ Inzicht</button>
                </div>

                <div className="btn-row">
                  <button className="btn btn-gold" onClick={saveFragment}>Opslaan</button>
                  <button className="btn btn-ghost" onClick={() => setEditing(null)}>Annuleren</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── READER VIEWS ─────────────────────────────────────────────────────────────
function HomeView({ library, onSelectPhilosopher }) {
  return (
    <div className="home">
      <div className="home-hero">
        <div className="home-hero-eyebrow">Filosofie Reader</div>
        <h1>Theoria</h1>
        <p>Klassieke teksten — gelezen, geannoteerd, begrepen.</p>
      </div>
      <div className="home-content">
        <div className="home-section-label">Filosofen</div>
        <div className="philosopher-grid">
          {library.map(phil => (
            <div key={phil.id} className="philosopher-card" onClick={() => onSelectPhilosopher(phil.id)}>
              <div className="philosopher-card-stripe" style={{ background: phil.color }} />
              <div className="philosopher-card-era">{phil.years}</div>
              <div className="philosopher-card-name">{phil.name}</div>
              <div className="philosopher-card-desc">{phil.description}</div>
              <div className="philosopher-card-works">{phil.works?.length || 0} werk{phil.works?.length !== 1 ? "en" : ""} bestudeerd</div>
              <div className="philosopher-card-list">
                {(phil.works || []).map(w => <span key={w.id} className="philosopher-card-pill">{w.title}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PhilosopherView({ philosopher, onSelectWork }) {
  return (
    <div className="home">
      <div className="home-hero" style={{ borderColor: philosopher.color }}>
        <div className="home-hero-eyebrow">{philosopher.years}</div>
        <h1>{philosopher.name}</h1>
        <p>{philosopher.description}</p>
      </div>
      <div className="home-content">
        <div className="home-section-label">Bestudeerde werken</div>
        <div className="lib-grid">
          {(philosopher.works || []).map(w => (
            <div key={w.id} className="lib-card" onClick={() => onSelectWork(w.id)}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: w.color || philosopher.color }} />
              <div className="lib-card-philosopher">{philosopher.name}</div>
              <div className="lib-card-title">{w.title}</div>
              <div className="lib-card-subtitle">{w.subtitle}</div>
              <div className="lib-card-desc">{w.description}</div>
              <div className="lib-card-year">{w.year}</div>
              <div className="lib-card-frags">{w.fragments?.length || 0} fragmenten</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReaderView({ philosopher, work, onSelectWork, notes, onSaveNote }) {
  const accentColor = work.color || philosopher.color || "#b5862a";

  function scrollTo(id) {
    setTimeout(() => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 50);
  }

  return (
    <>
      <aside className="sidebar">
        <div className="breadcrumb">
          <span style={{ color: "#5a5040", fontSize: "0.62rem" }}>Werken van {philosopher.name}</span>
        </div>
        <div className="sidebar-works">
          {(philosopher.works || []).map(w => (
            <div key={w.id}>
              <button className={`sidebar-work${w.id === work.id ? " active" : ""}`} onClick={() => onSelectWork(w.id)}>
                <span className="sidebar-work-title">{w.title}</span>
                <span className="sidebar-work-meta">{w.year}</span>
              </button>
              {w.id === work.id && (
                <div className="sidebar-fragments">
                  {(work.fragments || []).map(f => (
                    <button key={f.id} className="sidebar-frag" onClick={() => scrollTo(f.id)}>
                      <span className="sidebar-frag-num">{String(f.num).padStart(2, "0")}</span>
                      {f.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>
      <div className="main">
        <div className="work-header">
          <div className="work-header-accent" style={{ background: accentColor }} />
          <div className="work-eyebrow">{philosopher.name} · Filosofie</div>
          <h1 className="work-title">{work.title}</h1>
          <div className="work-subtitle">{work.subtitle}</div>
          <p className="work-desc">{work.description}</p>
          <div className="work-year">{work.year}</div>
        </div>
        <div className="fragments">
          {(work.fragments || []).map(f => (
            <FragmentView key={f.id} frag={f} accentColor={accentColor}
              noteKey={`${philosopher.id}-${work.id}-${f.id}`}
              notes={notes} onSaveNote={onSaveNote} />
          ))}
        </div>
      </div>
    </>
  );
}

function ReadingListView({ items }) {
  const categories = [...new Set(items.map(r => r.category))];
  return (
    <div className="main">
      <div className="readinglist">
        <h2>Leeslijst</h2>
        <p className="readinglist-intro">Teksten die aansluiten op onze gesprekken — om later samen door te nemen.</p>
        {categories.map(cat => (
          <div key={cat}>
            <div className="rl-category">{cat}</div>
            {items.filter(r => r.category === cat).sort((a, b) => a.priority - b.priority).map(item => (
              <div key={item.id} className="rl-item">
                <div className="rl-priority">#{item.priority}</div>
                <div className="rl-title">{item.work}</div>
                <div className="rl-author">{item.author} · {item.year}{item.chapter ? ` · ${item.chapter}` : ""}</div>
                <div className="rl-why">{item.why}</div>
                <div className="rl-tags">{(item.topic || "").split(" · ").map(t => <span key={t} className="rl-tag">{t}</span>)}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [library, setLibrary] = useState([]);
  const [readingList, setReadingList] = useState([]);
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("home");
  const [activePhilId, setActivePhilId] = useState(null);
  const [activeWorkId, setActiveWorkId] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  async function loadData() {
    const [lib, rl, n] = await Promise.all([
      apiFetch("/library"),
      apiFetch("/reading-list"),
      apiFetch("/notes"),
    ]);
    setLibrary(lib);
    setReadingList(rl);
    setNotes(n);
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  function showToast(msg) {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }

  async function handleSaveNote(key, text) {
    await apiFetch(`/notes/${encodeURIComponent(key)}`, { method: "PUT", body: { text } });
    setNotes(p => { const n = { ...p }; if (!text.trim()) delete n[key]; else n[key] = text; return n; });
    showToast("Aantekening opgeslagen");
  }

  function selectPhilosopher(id) { setActivePhilId(id); setView("philosopher"); }
  function selectWork(id) { setActiveWorkId(id); setView("reader"); }

  const activePhi = library.find(p => p.id === activePhilId);
  const activeWork = activePhi?.works?.find(w => w.id === activeWorkId);

  if (loading) return (
    <>
      <style>{css}</style>
      <div className="loading">Laden...</div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <nav className="topnav">
          <div className="topnav-logo" onClick={() => setView("home")}>Theo<span>ria</span></div>
          <div className="topnav-tabs">
            <button className={`topnav-tab${view === "home" ? " active" : ""}`} onClick={() => setView("home")}>Filosofen</button>
            {activePhi && <button className={`topnav-tab${view === "philosopher" ? " active" : ""}`} onClick={() => setView("philosopher")}>{activePhi.name}</button>}
            {activeWork && <button className={`topnav-tab${view === "reader" ? " active" : ""}`} onClick={() => setView("reader")}>{activeWork.title}</button>}
            <button className={`topnav-tab${view === "readinglist" ? " active" : ""}`} onClick={() => setView("readinglist")}>Leeslijst</button>
            <button className={`topnav-tab${view === "cms" ? " active" : ""}`} onClick={() => setView("cms")}>⚙</button>
          </div>
        </nav>

        <div className="body">
          {view === "home" && <HomeView library={library} onSelectPhilosopher={selectPhilosopher} />}
          {view === "philosopher" && activePhi && (
            <div className="main"><PhilosopherView philosopher={activePhi} onSelectWork={selectWork} /></div>
          )}
          {view === "reader" && activePhi && activeWork && (
            <ReaderView philosopher={activePhi} work={activeWork} onSelectWork={selectWork} notes={notes} onSaveNote={handleSaveNote} />
          )}
          {view === "readinglist" && <ReadingListView items={readingList} />}
          {view === "cms" && <CmsView library={library} onRefresh={loadData} onToast={showToast} />}
        </div>

        {toast && <Toast msg={toast} />}
      </div>
    </>
  );
}

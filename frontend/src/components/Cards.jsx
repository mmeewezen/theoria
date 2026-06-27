import { useState } from "react";

export function InsightCard({ insights, accentColor }) {
  const [open, setOpen] = useState({});
  if (!insights || insights.length === 0) return null;
  return (
    <div className="insights-card">
      {insights.map((ins, i) => (
        <div key={i}>
          <button
            className="insight-toggle"
            style={{ color: accentColor }}
            onClick={() => setOpen(p => ({ ...p, [i]: !p[i] }))}
          >
            {ins.label}
            <span style={{ fontFamily: "monospace" }}>{open[i] ? "−" : "+"}</span>
          </button>
          {open[i] && <div className="insight-body">{ins.text}</div>}
        </div>
      ))}
    </div>
  );
}

export function NoteCard({ noteKey, notes, onSave }) {
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
          <textarea
            className="note-textarea"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Schrijf hier je aantekening..."
            autoFocus
          />
          <div className="btn-row">
            <button className="btn btn-gold" onClick={handleSave}>Opslaan</button>
            <button className="btn btn-ghost" onClick={() => { setEditing(false); setText(existing || ""); }}>
              Annuleren
            </button>
          </div>
        </>
      ) : existing ? (
        <>
          <div style={{ fontSize: "0.92rem", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{existing}</div>
          <button className="note-edit" onClick={() => { setEditing(true); setText(existing); }}>
            Bewerken
          </button>
        </>
      ) : (
        <button className="btn btn-ghost" style={{ marginTop: "0.25rem" }} onClick={() => setEditing(true)}>
          + Aantekening toevoegen
        </button>
      )}
    </div>
  );
}

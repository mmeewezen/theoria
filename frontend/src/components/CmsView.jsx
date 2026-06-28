import { useState } from "react";
import { api, uid } from "../api.js";

export default function CmsView({ library, onRefresh, onToast }) {
  const [section, setSection] = useState("philosophers");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [selectedPhil, setSelectedPhil] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);

  const works = selectedPhil ? (library.find(p => p.id === selectedPhil)?.works || []) : [];
  const fragments = selectedWork ? (works.find(w => w.id === selectedWork)?.fragments || []) : [];

  function startNew(defaults) { setEditing("new"); setForm(defaults || {}); }
  function startEdit(item) { setEditing(item.id); setForm({ ...item }); }
  function setF(k, v) { setForm(p => ({ ...p, [k]: v })); }

  async function savePhilosopher() {
    const payload = { id: form.id || uid(), name: form.name, years: form.years, color: form.color || "#b5862a", description: form.description };
    if (editing === "new") await api.addPhilosopher(payload);
    else await api.updatePhilosopher(editing, payload);
    setEditing(null); onRefresh(); onToast("Filosoof opgeslagen");
  }

  async function deletePhilosopher(id) {
    if (!confirm("Zeker weten? Dit verwijdert ook alle werken en fragmenten.")) return;
    await api.deletePhilosopher(id);
    onRefresh(); onToast("Verwijderd");
  }

  async function saveWork() {
    const payload = { id: form.id || uid(), philosopher_id: selectedPhil, title: form.title, subtitle: form.subtitle, year: form.year, color: form.color || "#b5862a", description: form.description, video_url: form.video_url || null };
    if (editing === "new") await api.addWork(payload);
    else await api.updateWork(editing, payload);
    setEditing(null); onRefresh(); onToast("Werk opgeslagen");
  }

  async function deleteWork(id) {
    if (!confirm("Zeker weten?")) return;
    await api.deleteWork(id);
    onRefresh(); onToast("Verwijderd");
  }

  async function saveFragment() {
    const payload = {
      id: form.id || uid(),
      work_id: selectedWork,
      num: parseInt(form.num) || fragments.length + 1,
      title: form.title,
      annotation: form.annotation || "",
      text: (form.text || []).filter(u => u.speaker || u.speech),
      insights: (form.insights || []).filter(i => i.label || i.text),
    };
    if (editing === "new") await api.addFragment(payload);
    else await api.updateFragment(editing, payload);
    setEditing(null); onRefresh(); onToast("Fragment opgeslagen");
  }

  async function deleteFragment(id) {
    if (!confirm("Zeker weten?")) return;
    await api.deleteFragment(id);
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
    const data = await api.export();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "theoria-export.json"; a.click();
    URL.revokeObjectURL(url);
    onToast("Geëxporteerd");
  }

  async function handleImport(e) {
    const file = e.target.files[0]; if (!file) return;
    const data = JSON.parse(await file.text());
    await api.import(data);
    onRefresh(); onToast("Geïmporteerd");
    e.target.value = "";
  }

  return (
    <div className="main">
      <div className="cms">
        <h2>Beheer</h2>
        <p className="cms-intro">Voeg filosofen, werken en fragmenten toe of bewerk ze.</p>

        <div className="btn-row" style={{ marginBottom: "2rem" }}>
          <button className="btn btn-gold" onClick={handleExport}>Exporteer JSON</button>
          <label className="btn btn-ghost" style={{ cursor: "pointer" }}>
            Importeer JSON
            <input type="file" accept=".json" onChange={handleImport} style={{ display: "none" }} />
          </label>
        </div>

        {/* Filosofen */}
        <div className="cms-section">
          <div className="cms-section-title">Filosofen</div>
          {library.map(p => (
            <div key={p.id} className="cms-item">
              <div>
                <div className="cms-item-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: p.color, display: "inline-block" }} />
                  {p.name}
                </div>
                <div className="cms-item-meta">{p.years} · {p.works?.length || 0} werken</div>
              </div>
              <div className="cms-item-actions">
                <button className="btn btn-ghost" onClick={() => { setSelectedPhil(p.id); setSection("works"); setEditing(null); }}>Werken</button>
                <button className="btn btn-ghost" onClick={() => { setSection("philosophers"); startEdit(p); }}>Bewerken</button>
                <button className="btn btn-danger" onClick={() => deletePhilosopher(p.id)}>✕</button>
              </div>
            </div>
          ))}
          {(editing !== "new" || section !== "philosophers") && (
            <button className="btn btn-ghost" onClick={() => { setSection("philosophers"); startNew({ color: "#b5862a" }); }}>
              + Filosoof toevoegen
            </button>
          )}
          {section === "philosophers" && editing && (
            <div className="cms-form">
              <div className="field-grid">
                <div className="field-group">
                  <label className="field-label">ID</label>
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

        {/* Werken */}
        {selectedPhil && (
          <div className="cms-section">
            <div className="cms-section-title">
              Werken van {library.find(p => p.id === selectedPhil)?.name}
            </div>
            {works.map(w => (
              <div key={w.id} className="cms-item">
                <div>
                  <div className="cms-item-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 12, height: 12, borderRadius: "50%", background: w.color, display: "inline-block" }} />
                    {w.title}
                  </div>
                  <div className="cms-item-meta">{w.year} · {w.fragments?.length || 0} fragmenten</div>
                </div>
                <div className="cms-item-actions">
                  <button className="btn btn-ghost" onClick={() => { setSelectedWork(w.id); setSection("fragments"); setEditing(null); }}>Fragmenten</button>
                  <button className="btn btn-ghost" onClick={() => { setSection("works"); startEdit(w); }}>Bewerken</button>
                  <button className="btn btn-danger" onClick={() => deleteWork(w.id)}>✕</button>
                </div>
              </div>
            ))}
            {(editing !== "new" || section !== "works") && (
              <button className="btn btn-ghost" onClick={() => { setSection("works"); startNew({ color: "#8b3a1e" }); }}>
                + Werk toevoegen
              </button>
            )}
            {section === "works" && editing && (
              <div className="cms-form">
                <div className="field-grid">
                  <div className="field-group">
                    <label className="field-label">ID</label>
                    <input className="field-input" value={form.id || ""} onChange={e => setF("id", e.target.value)} disabled={editing !== "new"} />
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
                <div className="field-group">
                  <label className="field-label">YouTube URL (optioneel)</label>
                  <input className="field-input" value={form.video_url || ""} onChange={e => setF("video_url", e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
                </div>
                <div className="btn-row">
                  <button className="btn btn-gold" onClick={saveWork}>Opslaan</button>
                  <button className="btn btn-ghost" onClick={() => setEditing(null)}>Annuleren</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Fragmenten */}
        {selectedWork && (
          <div className="cms-section">
            <div className="cms-section-title">
              Fragmenten van {works.find(w => w.id === selectedWork)?.title}
            </div>
            {fragments.map(f => (
              <div key={f.id} className="cms-item">
                <div>
                  <div className="cms-item-title">
                    <span style={{ fontFamily: "Inter", fontSize: "0.72rem", color: "var(--gold)", marginRight: 8 }}>
                      {String(f.num).padStart(2, "0")}
                    </span>
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
            {(editing !== "new" || section !== "fragments") && (
              <button className="btn btn-ghost" onClick={() => { setSection("fragments"); startNew({ num: fragments.length + 1, text: [{ speaker: "", speech: "" }], insights: [] }); }}>
                + Fragment toevoegen
              </button>
            )}
            {section === "fragments" && editing && (
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

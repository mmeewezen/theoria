import { InsightCard, NoteCard } from "./Cards.jsx";

function FragmentView({ frag, accentColor, noteKey, notes, onSaveNote }) {
  return (
    <div className="fragment" id={frag.id}>
      <div>
        <div className="fragment-header">
          <div className="fragment-num-badge" style={{ background: accentColor }}>{frag.num}</div>
          <span className="fragment-title">{frag.title}</span>
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

export default function ReaderView({ philosopher, work, onSelectWork, notes, onSaveNote }) {
  const accentColor = work.color || philosopher.color || "#b5862a";

  function scrollTo(id) {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
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
              <button
                className={`sidebar-work${w.id === work.id ? " active" : ""}`}
                onClick={() => onSelectWork(w.id)}
              >
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
            <FragmentView
              key={f.id}
              frag={f}
              accentColor={accentColor}
              noteKey={`${philosopher.id}-${work.id}-${f.id}`}
              notes={notes}
              onSaveNote={onSaveNote}
            />
          ))}
        </div>
      </div>
    </>
  );
}

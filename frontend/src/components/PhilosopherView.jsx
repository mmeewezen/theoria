export default function PhilosopherView({ philosopher, onSelectWork }) {
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

export default function HomeView({ library, onSelectPhilosopher }) {
  return (
    <div className="home">
      <div className="home-hero">
        <div className="home-hero-bg-phi">Φ</div>
        <div className="home-hero-content">
          <h1>Theoria</h1>
          <p className="home-hero-sub">Filosofie Reader</p>
          <p>Klassieke teksten — gelezen, geannoteerd, begrepen.</p>
        </div>
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
              <div className="philosopher-card-works">
                {phil.works?.length || 0} werk{phil.works?.length !== 1 ? "en" : ""} bestudeerd
              </div>
              <div className="philosopher-card-list">
                {(phil.works || []).map(w => (
                  <span key={w.id} className="philosopher-card-pill">{w.title}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

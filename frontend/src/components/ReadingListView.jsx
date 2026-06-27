export default function ReadingListView({ items }) {
  const categories = [...new Set(items.map(r => r.category))];
  return (
    <div className="main">
      <div className="readinglist">
        <h2>Leeslijst</h2>
        <p className="readinglist-intro">
          Teksten die aansluiten op onze gesprekken — om later samen door te nemen.
        </p>
        {categories.map(cat => (
          <div key={cat}>
            <div className="rl-category">{cat}</div>
            {items
              .filter(r => r.category === cat)
              .sort((a, b) => a.priority - b.priority)
              .map(item => (
                <div key={item.id} className="rl-item">
                  <div className="rl-priority">#{item.priority}</div>
                  <div className="rl-title">{item.work}</div>
                  <div className="rl-author">
                    {item.author} · {item.year}{item.chapter ? ` · ${item.chapter}` : ""}
                  </div>
                  <div className="rl-why">{item.why}</div>
                  <div className="rl-tags">
                    {(item.topic || "").split(" · ").map(t => (
                      <span key={t} className="rl-tag">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

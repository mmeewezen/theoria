export const css = `
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

  /* ── Topnav ── */
  .topnav { height: 64px; background: var(--ink); display: flex; align-items: center; padding: 0 1.5rem; gap: 1.5rem; border-bottom: 3px solid var(--gold); flex-shrink: 0; }
  .topnav-logo { display: flex; align-items: center; gap: 0.65rem; flex: 1; cursor: pointer; }
  .topnav-wordmark { font-family: 'EB Garamond', serif; font-size: 1.2rem; font-style: italic; color: var(--parchment); letter-spacing: 0.05em; }
  .topnav-logo span { color: var(--gold); font-style: normal; }
  .topnav-tabs { display: flex; gap: 0.25rem; align-items: center; }
  .topnav-tab { background: none; border: 1px solid transparent; color: #9e9080; font-family: 'Inter', sans-serif; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.4rem 0.9rem; cursor: pointer; border-radius: 3px; transition: all 0.15s; }
  .topnav-tab:hover { color: var(--parchment); border-color: #4a4030; }
  .topnav-tab.active { color: white; background: var(--gold); border-color: var(--gold); }
  .topnav-tab-gear { font-size: 1rem; padding: 0.4rem 0.6rem; opacity: 0.6; }
  .topnav-tab-gear:hover { opacity: 1; }
  .topnav-tab-gear.active { opacity: 1; }

  /* ── Layout ── */
  .body { display: flex; flex: 1; overflow: hidden; }
  .main { flex: 1; overflow-y: auto; }
  .home { flex: 1; overflow-y: auto; }
  .loading { display: flex; align-items: center; justify-content: center; height: 100%; color: var(--muted); font-family: 'Inter', sans-serif; font-size: 0.9rem; }

  /* ── Sidebar ── */
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
  .breadcrumb { display: flex; align-items: center; gap: 0.4rem; font-family: 'Inter', sans-serif; font-size: 0.68rem; color: var(--muted); padding: 0.6rem 1rem; border-bottom: 1px solid #2a2418; }
  .breadcrumb-link { background: none; border: none; cursor: pointer; color: #9a8060; font-family: inherit; font-size: inherit; padding: 0; }
  .breadcrumb-link:hover { color: var(--gold); }

  /* ── Home ── */
  .home-hero { background: var(--ink); color: var(--parchment); border-bottom: 3px solid var(--gold); position: relative; overflow: hidden; min-height: 280px; display: flex; align-items: center; justify-content: center; }
  .home-hero-bg-phi { position: absolute; font-family: 'EB Garamond', Georgia, serif; font-size: 20rem; color: #b5862a; opacity: 0.12; line-height: 1; user-select: none; pointer-events: none; top: 50%; left: 50%; transform: translate(-50%, -44%); }
  .home-hero-content { position: relative; z-index: 1; padding: 3.5rem 3rem 3rem; text-align: center; width: 100%; }
  .home-hero h1 { font-size: 3.5rem; font-weight: 400; letter-spacing: 0.04em; margin-bottom: 0.5rem; font-style: italic; }
  .home-hero-sub { font-family: 'Inter', sans-serif; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.75rem; }
  .home-hero p { color: #9e9080; font-size: 1rem; max-width: 50ch; margin: 0 auto; line-height: 1.7; }
  .home-hero-phi { display: none; }
  .home-hero-eyebrow { display: none; }
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

  /* ── Bibliotheek kaarten ── */
  .lib-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }
  .lib-card { background: white; border: 1px solid var(--border); padding: 1.5rem; cursor: pointer; transition: all 0.15s; position: relative; }
  .lib-card:hover { border-color: var(--gold); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
  .lib-card-philosopher { font-family: 'Inter', sans-serif; font-size: 0.62rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.35rem; }
  .lib-card-title { font-size: 1.5rem; font-weight: 500; line-height: 1.2; margin-bottom: 0.2rem; }
  .lib-card-subtitle { font-style: italic; color: var(--muted); font-size: 0.9rem; margin-bottom: 0.75rem; }
  .lib-card-desc { font-size: 0.85rem; color: var(--muted); line-height: 1.6; }
  .lib-card-year { font-family: 'Inter', sans-serif; font-size: 0.65rem; color: var(--gold); margin-top: 0.75rem; font-weight: 500; }
  .lib-card-frags { font-family: 'Inter', sans-serif; font-size: 0.65rem; color: var(--border); margin-top: 0.25rem; }

  /* ── Reader ── */
  .work-header { padding: 3rem 3rem 2.5rem; border-bottom: 1px solid var(--border); position: relative; }
  .work-header-accent { width: 6px; height: 3rem; position: absolute; left: 0; top: 2rem; }
  .work-eyebrow { font-family: 'Inter', sans-serif; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.5rem; }
  .work-title { font-size: 3rem; font-weight: 500; line-height: 1.1; margin-bottom: 0.3rem; }
  .work-subtitle { font-style: italic; font-size: 1.2rem; color: var(--muted); margin-bottom: 1rem; }
  .work-desc { font-size: 1rem; color: var(--muted); max-width: 65ch; line-height: 1.7; }
  .work-year { font-family: 'Inter', sans-serif; font-size: 0.72rem; color: var(--gold); margin-top: 0.75rem; }

  /* ── Fragmenten ── */
  .fragments { padding: 0 3rem 4rem; }
  .fragment { padding: 2.5rem 0; border-bottom: 1px solid var(--border); display: grid; grid-template-columns: 1fr 340px; gap: 2.5rem; align-items: start; scroll-margin-top: 1.5rem; }
  .fragment:last-child { border-bottom: none; }
  .fragment-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; }
  .fragment-num-badge { width: 28px; height: 28px; border-radius: 50%; color: white; font-family: 'Inter', sans-serif; font-size: 0.72rem; font-weight: 600; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .fragment-title { font-size: 1rem; font-weight: 500; font-family: 'Inter', sans-serif; color: var(--muted); }
  .dialogue { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1rem; }
  .utterance { display: flex; gap: 0.75rem; }
  .speaker { font-family: 'Inter', sans-serif; font-size: 0.68rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; flex-shrink: 0; width: 80px; padding-top: 0.2rem; }
  .speech { font-style: italic; color: #2a2210; flex: 1; }
  .fragment-side { display: flex; flex-direction: column; gap: 0.75rem; }

  /* ── Kaarten ── */
  .anno-card { background: var(--anno-bg); border: 1px solid #ddd5b5; border-left: 3px solid var(--gold); padding: 1rem 1.1rem; font-size: 0.92rem; line-height: 1.75; color: #2a2210; }
  .card-label { font-family: 'Inter', sans-serif; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 0.4rem; display: block; }
  .anno-card .card-label { color: var(--gold); }
  .insights-card { border: 1px solid #ddd5b5; overflow: hidden; }
  .insight-toggle { width: 100%; background: var(--aged); border: none; border-top: 1px solid var(--border); padding: 0.55rem 1rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #8b3a1e; transition: background 0.1s; }
  .insight-toggle:hover { background: #ddd5b5; }
  .insight-toggle:first-child { border-top: none; }
  .insight-body { padding: 0.75rem 1rem; background: white; border-top: 1px solid var(--border); font-size: 0.88rem; line-height: 1.75; color: #2a2210; }
  .note-card { background: #fffef8; border: 1px solid var(--border); border-left: 3px solid #8b6914; padding: 1rem 1.1rem; }
  .note-card .card-label { color: #8b6914; }
  .note-textarea { width: 100%; font-family: 'EB Garamond', serif; font-size: 0.95rem; line-height: 1.7; border: 1px solid var(--border); padding: 0.5rem; background: white; color: var(--ink); resize: vertical; min-height: 80px; outline: none; }
  .note-textarea:focus { border-color: var(--gold); }

  /* ── Knoppen ── */
  .btn { font-family: 'Inter', sans-serif; font-size: 0.68rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.35rem 0.85rem; border: none; cursor: pointer; transition: all 0.1s; }
  .btn-gold { background: var(--gold); color: white; }
  .btn-gold:hover { background: #9a6e20; }
  .btn-ghost { background: none; border: 1px solid var(--border); color: var(--muted); }
  .btn-ghost:hover { border-color: var(--ink); color: var(--ink); }
  .btn-danger { background: none; border: 1px solid #c0392b; color: #c0392b; }
  .btn-danger:hover { background: #c0392b; color: white; }
  .btn-row { display: flex; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap; }
  .note-edit { font-family: 'Inter', sans-serif; font-size: 0.65rem; background: none; border: none; cursor: pointer; color: var(--gold); padding: 0; text-decoration: underline; margin-top: 0.4rem; display: inline-block; }

  /* ── Leeslijst ── */
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

  /* ── Video ── */
  .video-container { padding: 2rem 3rem; border-bottom: 1px solid var(--border); }
  .video-label { font-family: 'Inter', sans-serif; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); margin-bottom: 1rem; }
  .video-wrapper { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border: 1px solid var(--border); }
  .video-wrapper iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }

  /* ── Toast ── */
  .toast { position: fixed; bottom: 2rem; right: 2rem; background: var(--ink); color: var(--parchment); font-family: 'Inter', sans-serif; font-size: 0.78rem; padding: 0.65rem 1.1rem; border-left: 3px solid var(--gold); z-index: 1000; animation: slideUp 0.2s ease; }
  @keyframes slideUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  /* ── Responsive ── */
  @media (max-width: 768px) {

    /* Navigatie — tabs scrollen horizontaal */
    .topnav { padding: 0 1rem; gap: 0.75rem; }
    .topnav-tabs { overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; gap: 0.15rem; }
    .topnav-tabs::-webkit-scrollbar { display: none; }
    .topnav-tab { padding: 0.35rem 0.6rem; font-size: 0.65rem; white-space: nowrap; }
    .topnav-logo { font-size: 1rem; flex-shrink: 0; }

    /* Reader — zijbalk verbergen, tekst volle breedte */
    .sidebar { display: none; }
    .body { flex-direction: column; }
    .main { width: 100%; }

    /* Werk-header compacter */
    .work-header { padding: 1.5rem 1.25rem 1.25rem; }
    .work-title { font-size: 2rem; }
    .work-subtitle { font-size: 1rem; }

    /* Fragmenten — één kolom, minder padding */
    .fragment { grid-template-columns: 1fr; gap: 1.25rem; padding: 1.5rem 0; }
    .fragments { padding: 0 1.25rem 3rem; }

    /* Aantekeningen en inzichten onder de tekst */
    .fragment-side { margin-top: 0; }

    /* Home en bibliotheek */
    .home-hero { min-height: 200px; }
    .home-hero-content { padding: 2rem 1.25rem 1.75rem; }
    .home-hero h1 { font-size: 2.5rem; }
    .home-hero-bg-phi { font-size: 18rem; }
    .home-content { padding: 1.5rem 1.25rem; }
    .philosopher-grid { grid-template-columns: 1fr; }
    .philosopher-card { padding: 1.5rem; }
    .lib-grid { grid-template-columns: 1fr; }

    /* Leeslijst en CMS */
    .readinglist { padding: 1.5rem 1.25rem; }
    .cms { padding: 1.5rem 1.25rem; }
    .field-grid { grid-template-columns: 1fr; }
    .cms-item { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
    .cms-item-actions { width: 100%; justify-content: flex-start; }

    /* Formulierrijen in CMS */
    .utterance-row { grid-template-columns: 100px 1fr 32px; }
    .insight-row { grid-template-columns: 1fr 32px; }

    /* Toast onderaan iets hoger ivm browser-balk */
    .toast { bottom: 5rem; right: 1rem; left: 1rem; }
  }
`;

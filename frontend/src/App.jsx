import { useState, useEffect, useRef } from "react";
import { css } from "./styles.js";
import { api } from "./api.js";
import HomeView from "./components/HomeView.jsx";
import PhilosopherView from "./components/PhilosopherView.jsx";
import ReaderView from "./components/ReaderView.jsx";
import ReadingListView from "./components/ReadingListView.jsx";
import CmsView from "./components/CmsView.jsx";

function Toast({ msg }) {
  return <div className="toast">{msg}</div>;
}

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
      api.library(),
      api.readingList(),
      api.notes(),
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
    await api.saveNote(key, text);
    setNotes(p => {
      const n = { ...p };
      if (!text.trim()) delete n[key];
      else n[key] = text;
      return n;
    });
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
          <div className="topnav-logo" onClick={() => setView("home")}>
            <svg viewBox="0 0 512 512" height="36" width="36" style={{borderRadius: 6, flexShrink: 0}}>
              <rect width="512" height="512" rx="80" fill="#1a1610"/>
              <rect x="2" y="2" width="508" height="508" rx="78" fill="none" stroke="#b5862a" strokeWidth="4"/>
              <text x="256" y="330" textAnchor="middle" fontFamily="Georgia, serif" fontSize="300" fill="#b5862a">Φ</text>
              <text x="256" y="420" textAnchor="middle" fontFamily="Georgia, serif" fontSize="52" fill="#9e9080" letterSpacing="20">THEORIA</text>
            </svg>
          </div>
          <div className="topnav-tabs">
            <button className={`topnav-tab${view === "home" ? " active" : ""}`} onClick={() => setView("home")}>
              Filosofen
            </button>
            {activePhi && (
              <button className={`topnav-tab${view === "philosopher" ? " active" : ""}`} onClick={() => setView("philosopher")}>
                {activePhi.name}
              </button>
            )}
            {activeWork && (
              <button className={`topnav-tab${view === "reader" ? " active" : ""}`} onClick={() => setView("reader")}>
                {activeWork.title}
              </button>
            )}
            <button className={`topnav-tab${view === "readinglist" ? " active" : ""}`} onClick={() => setView("readinglist")}>
              Leeslijst
            </button>
            <button className={`topnav-tab${view === "cms" ? " active" : ""}`} onClick={() => setView("cms")}>
              ⚙
            </button>
          </div>
        </nav>

        <div className="body">
          {view === "home" && (
            <HomeView library={library} onSelectPhilosopher={selectPhilosopher} />
          )}
          {view === "philosopher" && activePhi && (
            <div className="main">
              <PhilosopherView philosopher={activePhi} onSelectWork={selectWork} />
            </div>
          )}
          {view === "reader" && activePhi && activeWork && (
            <ReaderView
              philosopher={activePhi}
              work={activeWork}
              onSelectWork={selectWork}
              notes={notes}
              onSaveNote={handleSaveNote}
            />
          )}
          {view === "readinglist" && (
            <ReadingListView items={readingList} />
          )}
          {view === "cms" && (
            <CmsView library={library} onRefresh={loadData} onToast={showToast} />
          )}
        </div>

        {toast && <Toast msg={toast} />}
      </div>
    </>
  );
}

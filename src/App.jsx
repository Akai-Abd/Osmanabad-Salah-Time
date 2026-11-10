import { useEffect, useState } from "react";
import { Home as HomeIcon, BookOpen, CalendarDays, Settings as SettingsIcon } from "lucide-react";
import Home from "./pages/Home";
import Calendar from "./components/Calendar";
import Images from "./components/Images";
import Settings from "./components/Settings";
import { LangProvider, useLang } from "./utils/i18n";
import { getTheme, applyTheme } from "./utils/settings";

const tabs = [
  { id: "home", key: "home", Icon: HomeIcon },
  { id: "timetable", key: "timetable", Icon: BookOpen },
  { id: "calendar", key: "calendar", Icon: CalendarDays },
  { id: "settings", key: "settings", Icon: SettingsIcon },
];

const validTab = (id) => (tabs.some((x) => x.id === id) ? id : "home");

function Shell() {
  const { lang, setLang, t } = useLang();
  const [page, setPage] = useState(validTab(window.history.state && window.history.state.tab));

  useEffect(() => {
    applyTheme(getTheme());
  }, []);

  // Back button ya gesture dabane par
  useEffect(() => {
    const onPop = (e) => setPage(validTab(e.state && e.state.tab));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function go(id) {
    if (id === page) return;

    if (id === "home") {
      if (window.history.state && window.history.state.tab) window.history.back();
      else setPage("home");
      return;
    }

    // Home se kisi tab par: nayi entry. Ek tab se doosre tab par: wahi entry badlo.
    if (page === "home") window.history.pushState({ tab: id }, "");
    else window.history.replaceState({ tab: id }, "");
    setPage(id);
  }

  // Pehli baar: bhasha chuno
  if (!lang) {
    return (
      <div className="app picker">
        <h1>Osmanabad Salah Time</h1>
        <p>Choose your language · भाषा चुनें · زبان منتخب کریں</p>
        <button className="pick-btn" onClick={() => setLang("en")}>English</button>
        <button className="pick-btn" onClick={() => setLang("hi")}>हिन्दी</button>
        <button className="pick-btn" onClick={() => setLang("ur")}>اردو</button>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1>Osmanabad Salah Time</h1>
      </header>

      <div key={page} className="page">
        {page === "home" && <Home />}
        {page === "timetable" && <Images />}
        {page === "calendar" && <Calendar />}
        {page === "settings" && <Settings />}
      </div>

      <nav className="footer">
        <div className="footer-inner">
          {tabs.map(({ id, key, Icon }) => (
            <button key={id} className={page === id ? "active" : ""} onClick={() => go(id)}>
              <Icon size={22} />
              {t(key)}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <LangProvider>
      <Shell />
    </LangProvider>
  );
}
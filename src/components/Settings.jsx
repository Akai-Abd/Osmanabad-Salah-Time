import { useState } from "react";
import { villages } from "../data/villages";
import { SHOW_CREDIT } from "../data/config";
import { getVillage, saveVillage, getTheme, saveTheme, applyTheme } from "../utils/settings";
import { useLang } from "../utils/i18n";

function Settings() {
  const { lang, setLang, t } = useLang();
  const [villageId, setVillageId] = useState(getVillage() ? getVillage().id : "");
  const [theme, setTheme] = useState(getTheme());
  const [checking, setChecking] = useState(false);
  const [updateStatus, setUpdateStatus] = useState("");

  const village = villages.find((v) => v.id === villageId);

  function chooseVillage(id) { setVillageId(id); saveVillage(id); }
  function chooseTheme(x) { setTheme(x); saveTheme(x); applyTheme(x); }

  function handleCheckUpdate() {
    setChecking(true);
    setUpdateStatus("");

    if (window.FlutterApp && typeof window.FlutterApp.postMessage === "function") {
      window.FlutterApp.postMessage("checkUpdate");
      setTimeout(() => setChecking(false), 2000);
    } else {
      fetch("https://raw.githubusercontent.com/Akai-Abd/Osmanabad-Salah-Time/main/version.json")
        .then((res) => res.json())
        .then((data) => {
          setChecking(false);
          if (data.version && data.version !== "1.0.2") {
            setUpdateStatus(`Update available: v${data.version}`);
          } else {
            setUpdateStatus("App is up to date (v1.0.2).");
          }
        })
        .catch(() => {
          setChecking(false);
          setUpdateStatus("Could not reach update server.");
        });
    }
  }

  let villageNote = t("noVillage");
  if (village) {
    villageNote =
      village.offset === 0
        ? t("sameAsCity")
        : t(village.offset < 0 ? "earlier" : "later", { n: Math.abs(village.offset) });
  }

  const languages = [["en", "English"], ["hi", "हिन्दी"], ["ur", "اردو"]];

  return (
    <div>
      <div className="setting">
        <h3>{t("language")}</h3>
        <div className="seg">
          {languages.map(([code, label]) => (
            <button key={code} className={lang === code ? "on" : ""} onClick={() => setLang(code)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="setting">
        <h3>{t("yourVillage")}</h3>
        <select className="select" value={villageId} onChange={(e) => chooseVillage(e.target.value)}>
          <option value="">{t("selectVillage")}</option>
          {villages.map((v) => (
            <option key={v.id} value={v.id}>{v[lang] || v.name}</option>
          ))}
        </select>
        <p className="setting-note">{villageNote}</p>
      </div>

      <div className="setting">
        <h3>{t("theme")}</h3>
        <div className="theme-grid">
          {[
            { id: "light", color: "#547FA5", labelKey: "themeClassic" },
            { id: "emerald", color: "#1E7E55", labelKey: "themeEmerald" },
            { id: "amber", color: "#9E6C20", labelKey: "themeAmber" },
            { id: "dark", color: "#172636", labelKey: "themeDark" },
            { id: "emerald-dark", color: "#142920", labelKey: "themeEmeraldDark" },
            { id: "amber-dark", color: "#261F14", labelKey: "themeAmberDark" },
            { id: "maroon-dark", color: "#261419", labelKey: "themeMaroonDark" },
          ].map(({ id, color, labelKey }) => (
            <button
              key={id}
              className={`theme-btn ${theme === id ? "active" : ""}`}
              onClick={() => chooseTheme(id)}
            >
              <span className="theme-dot" style={{ backgroundColor: color }} />
              <span>{t(labelKey)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="setting">
        <h3>{t("appUpdate")}</h3>
        <div className="update-row">
          <div>
            <span className="update-label">{t("appVersion")}</span>
            <span className="update-badge">v1.0.2</span>
          </div>
          <button
            type="button"
            className="update-btn"
            onClick={handleCheckUpdate}
            disabled={checking}
          >
            {checking ? t("checkingUpdate") : t("checkForUpdates")}
          </button>
        </div>
        {updateStatus && <p className="setting-note">{updateStatus}</p>}
      </div>

      <div className="setting">
        <h3>{t("about")}</h3>
        <p className="setting-note">{t("districtOnly")}</p>
        {SHOW_CREDIT && <p className="setting-note">{t("credit")}</p>}
        <p className="setting-note">{t("installNote")}</p>
      </div>

      <p className="setting-note">{t("savedNote")}</p>
    </div>
  );
}

export default Settings;
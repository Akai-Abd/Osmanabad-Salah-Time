import { useState } from "react";
import { villages } from "../data/villages";
import { SHOW_CREDIT } from "../data/config";
import { getVillage, saveVillage, getTheme, saveTheme, applyTheme } from "../utils/settings";
import { useLang } from "../utils/i18n";

function Settings() {
  const { lang, setLang, t } = useLang();
  const [villageId, setVillageId] = useState(getVillage() ? getVillage().id : "");
  const [theme, setTheme] = useState(getTheme());

  const village = villages.find((v) => v.id === villageId);

  function chooseVillage(id) { setVillageId(id); saveVillage(id); }
  function chooseTheme(x) { setTheme(x); saveTheme(x); applyTheme(x); }

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
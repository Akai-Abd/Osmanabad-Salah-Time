import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Download, X, Plus, Minus, Table, Image as ImageIcon, MapPin } from "lucide-react";
import { useLang } from "../utils/i18n";
import { getVillage } from "../utils/settings";
import { getMonthTimes } from "../utils/times";

const MAX_ZOOM = 4;

function formatCell(time24) {
  if (!time24) return "";
  const [h, m] = time24.split(":").map(Number);
  const h12 = h % 12 || 12;
  return `\u2066${h12}:${String(m).padStart(2, "0")}\u2069`;
}

function Images() {
  const { t, lang } = useLang();
  const village = getVillage();
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();
  const currentYear = now.getFullYear();

  const [month, setMonth] = useState(currentMonth);
  const [viewMode, setViewMode] = useState("table");
  const [open, setOpen] = useState(false);
  const [view, setView] = useState({ s: 1, x: 0, y: 0 });
  const box = useRef(null);
  const img = useRef(null);
  const pointers = useRef(new Map());
  const activeChipRef = useRef(null);
  const tableScrollRef = useRef(null);
  const todayRowRef = useRef(null);

  const rows = getMonthTimes(month, currentYear);

  // Month chips horizontal auto-scroll to active month
  useEffect(() => {
    activeChipRef.current?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "smooth",
    });
  }, [month]);

  // Today row vertical auto-scroll inside table container
  useEffect(() => {
    if (viewMode === "table" && month === currentMonth && todayRowRef.current && tableScrollRef.current) {
      const container = tableScrollRef.current;
      const row = todayRowRef.current;
      const timer = setTimeout(() => {
        container.scrollTop = row.offsetTop - container.clientHeight / 2 + row.clientHeight / 2;
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [month, viewMode, currentMonth]);

  // Aage-peeche ke mahine ki image pehle se load kar lo
  useEffect(() => {
    [month - 1, month + 1].forEach((m) => {
      if (m >= 1 && m <= 12) new window.Image().src = `/timetable/${lang}/${m}.jpg`;
    });
  }, [month, lang]);

  useEffect(() => {
    if (window.history.state && window.history.state.viewer) {
      window.history.replaceState({ tab: "timetable" }, "");
    }
    const onPop = (e) => {
      if (!(e.state && e.state.viewer)) setOpen(false);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function clamp(v) {
    const cw = box.current.clientWidth;
    const ch = box.current.clientHeight;
    const minX = Math.min(0, cw - cw * v.s);
    const minY = Math.min(0, ch - img.current.offsetHeight * v.s);
    return {
      s: v.s,
      x: Math.min(0, Math.max(minX, v.x)),
      y: Math.min(0, Math.max(minY, v.y)),
    };
  }

  function zoomAt(ratio, cx, cy) {
    setView((v) => {
      const s = Math.min(MAX_ZOOM, Math.max(1, v.s * ratio));
      const r = s / v.s;
      return clamp({ s, x: cx - (cx - v.x) * r, y: cy - (cy - v.y) * r });
    });
  }

  function panBy(dx, dy) {
    setView((v) => clamp({ ...v, x: v.x + dx, y: v.y + dy }));
  }

  function onPointerDown(e) {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
  }

  function onPointerMove(e) {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const cur = { x: e.clientX, y: e.clientY };

    if (pointers.current.size === 1) {
      panBy(cur.x - prev.x, cur.y - prev.y);
    } else if (pointers.current.size === 2) {
      const other = [...pointers.current.entries()].find(([id]) => id !== e.pointerId)[1];
      const before = Math.hypot(prev.x - other.x, prev.y - other.y);
      const after = Math.hypot(cur.x - other.x, cur.y - other.y);
      if (before > 0) zoomAt(after / before, (cur.x + other.x) / 2, (cur.y + other.y) / 2);
    }
    pointers.current.set(e.pointerId, cur);
  }

  function onPointerUp(e) {
    pointers.current.delete(e.pointerId);
  }

  function onWheel(e) {
    zoomAt(e.deltaY < 0 ? 1.2 : 1 / 1.2, e.clientX, e.clientY);
  }

  function zoomButton(ratio) {
    zoomAt(ratio, box.current.clientWidth / 2, box.current.clientHeight / 2);
  }

  function openViewer() {
    pointers.current.clear();
    setView({ s: 1, x: 0, y: 0 });
    window.history.pushState({ tab: "timetable", viewer: true }, "");
    setOpen(true);
  }

  const src = `/timetable/${lang}/${month}.jpg`;

  return (
    <div className="timetable-view">
      <div className="tt-top-bar">
        <div className="tt-toggle" role="tablist">
          <button
            type="button"
            className={viewMode === "table" ? "tt-toggle-btn active" : "tt-toggle-btn"}
            onClick={() => setViewMode("table")}
          >
            <Table size={16} />
            <span>{t("tableView")}</span>
          </button>
          <button
            type="button"
            className={viewMode === "poster" ? "tt-toggle-btn active" : "tt-toggle-btn"}
            onClick={() => setViewMode("poster")}
          >
            <ImageIcon size={16} />
            <span>{t("posterView")}</span>
          </button>
        </div>
      </div>

      <div className="chips">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
          <button
            key={m}
            ref={month === m ? activeChipRef : null}
            className={month === m ? "chip active" : "chip"}
            onClick={() => setMonth(m)}
          >
            {t("m" + m)}
          </button>
        ))}
      </div>

      <div className={`tt-village-banner ${village && village.offset !== 0 ? "has-offset" : ""}`}>
        <MapPin size={16} className="tt-village-icon" />
        <span className="tt-village-content">
          {village ? (
            <>
              <strong className="tt-village-name">{village[lang] || village.name}</strong>
              <span className="tt-village-sep">: </span>
              <span className="tt-village-offset">
                {village.offset === 0
                  ? t("sameAsCity")
                  : t(village.offset < 0 ? "earlier" : "later", { n: Math.abs(village.offset) })}
              </span>
            </>
          ) : (
            <span>{t("villageNotice")}</span>
          )}
        </span>
      </div>

      {viewMode === "table" ? (
        <div className="tt-table-wrapper">
          <div className="tt-table-scroll" ref={tableScrollRef}>
            <table className="tt-table">
              <thead>
                <tr>
                  <th className="tt-col-date">{t("date")}</th>
                  <th>{t("fajr")}</th>
                  <th>{t("sunriseShort")}</th>
                  <th>{t("zuhr")}</th>
                  <th>{t("asr")}</th>
                  <th>{t("maghrib")}</th>
                  <th>{t("isha")}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => {
                  const day = idx + 1;
                  const isToday = month === currentMonth && day === currentDay;
                  const [fajr, sunrise, zuhr, asr, maghrib, isha] = row;

                  return (
                    <tr
                      key={day}
                      ref={isToday ? todayRowRef : null}
                      className={isToday ? "tt-row-today" : ""}
                    >
                      <td className="tt-col-date">{day}</td>
                      <td>{formatCell(fajr)}</td>
                      <td>{formatCell(sunrise)}</td>
                      <td>{formatCell(zuhr)}</td>
                      <td>{formatCell(asr)}</td>
                      <td>{formatCell(maghrib)}</td>
                      <td>{formatCell(isha)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="hint tt-table-hint">
            {t("fajr")} / {t("sunriseShort")}: AM &nbsp;·&nbsp; {t("zuhr")} / {t("asr")} / {t("maghrib")} / {t("isha")}: PM
          </p>
        </div>
      ) : (
        <div className="tt-poster-view">
          <img className="tt-image" src={src} alt={t("m" + month)} onClick={openViewer} />
          <p className="hint">{t("tapToZoom")}</p>
        </div>
      )}

      <a className="pdf-btn" href={`/timetable/namaz-waqt-${lang}.pdf`} download>
        <Download size={18} /> {t("downloadPdf")}
      </a>

      {open &&
        createPortal(
          <div className="viewer">
            <div
              className="viewer-box"
              ref={box}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onWheel={onWheel}
            >
              <img
                ref={img}
                src={src}
                alt="Zoomed timetable"
                draggable={false}
                style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})` }}
              />
            </div>

            <button className="viewer-close" onClick={() => window.history.back()} aria-label="Close">
              <X size={24} />
            </button>

            <div className="viewer-controls">
              <button onClick={() => zoomButton(1 / 1.5)} aria-label="Zoom out"><Minus size={22} /></button>
              <button onClick={() => zoomButton(1.5)} aria-label="Zoom in"><Plus size={22} /></button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default Images;
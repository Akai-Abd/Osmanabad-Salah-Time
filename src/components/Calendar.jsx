import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { hijriFormat, hijriIsEstimated } from "../utils/hijri";
import { useLang } from "../utils/i18n";

const noon = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12);
const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
const hDay = (d) => Number(hijriFormat(d, { day: "numeric" }));
const monthStart = (d) => addDays(d, -(hDay(d) - 1));

function monthLength(start) {
  let n = 1;
  while (n < 31 && hDay(addDays(start, n)) !== 1) n++;
  return n;
}

function Calendar() {
  const { lang, t } = useLang();
  const today = noon(new Date());
  const [start, setStart] = useState(monthStart(today));

  const Prev = lang === "ur" ? ChevronRight : ChevronLeft;
  const Next = lang === "ur" ? ChevronLeft : ChevronRight;

  const len = monthLength(start);
  const end = addDays(start, len - 1);

  const cells = [];
  for (let i = 0; i < start.getDay(); i++) cells.push(null);
  for (let i = 0; i < len; i++) cells.push({ date: addDays(start, i), h: i + 1 });

  const estimated = cells.some((c) => c && hijriIsEstimated(c.date));
  const range =
    `${start.getDate()} ${t("m" + (start.getMonth() + 1))} – ` +
    `${end.getDate()} ${t("m" + (end.getMonth() + 1))} ${end.getFullYear()}`;

  return (
    <div>
      <div className="day-nav">
        <button onClick={() => setStart(monthStart(addDays(start, -1)))} aria-label="Previous month">
          <Prev size={22} />
        </button>
        <div className="cal-title">
          <strong>{hijriFormat(start, { month: "long", year: "numeric" }, t)}</strong>
          <small>{range}</small>
        </div>
        <button onClick={() => setStart(addDays(start, len))} aria-label="Next month">
          <Next size={22} />
        </button>
      </div>

      <div className="cal-grid">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="cal-head">{t("wd" + i)}</div>
        ))}
        {cells.map((c, i) =>
          c === null ? (
            <div key={i} />
          ) : (
            <div
              key={i}
              className={c.date.toDateString() === today.toDateString() ? "cal-cell today" : "cal-cell"}
            >
              <span>{c.h}</span>
              <small>{c.date.getDate()}</small>
            </div>
          )
        )}
      </div>

      {estimated && <p className="setting-note">{t("hijriEstimate")}</p>}
    </div>
  );
}

export default Calendar;
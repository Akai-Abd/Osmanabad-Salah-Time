import { useEffect, useMemo, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    CalendarDays,
    Sunrise,
    Sun,
    SunMedium,
    SunDim,
    Sunset,
    Moon,
    AlertTriangle,
    Clock,
    MapPin,
} from "lucide-react";
import PrayerCard from "../components/PrayerCard";
import { toMinutes } from "../utils/toMinutes";
import { formatTime } from "../utils/formatTime";
import { getTimesFor } from "../utils/times";
import { getPeriods, getCurrent } from "../utils/periods";
import { getVillage } from "../utils/settings";
import { hijriFormat } from "../utils/hijri";
import { useLang } from "../utils/i18n";

const toList = (times, friday) => [
    { id: "Fajr", key: "fajr", time: times.fajr, Icon: Sunrise },
    { id: "Sunrise", key: "sunrise", time: times.sunrise, Icon: Sun },
    { id: "Zuhr", key: friday ? "jumuah" : "zuhr", time: times.zuhr, Icon: SunMedium },
    { id: "Asr", key: "asr", time: times.asr, Icon: SunDim },
    { id: "Maghrib", key: "maghrib", time: times.maghrib, Icon: Sunset },
    { id: "Isha", key: "isha", time: times.isha, Icon: Moon },
];

const pad = (n) => String(n).padStart(2, "0");
const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

function Home() {
    const { lang, t } = useLang();
    const [now, setNow] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const Prev = lang === "ur" ? ChevronRight : ChevronLeft;
    const Next = lang === "ur" ? ChevronLeft : ChevronRight;

    const village = getVillage();
    const villageName = village
        ? (village[lang] || village.name)
        : (lang === "hi" ? "उस्मानाबाद शहर" : lang === "ur" ? "عثمان آباد شہر" : "Osmanabad City");
    const offsetLabel = village && village.offset !== 0
        ? (village.offset > 0 ? `+${village.offset}m` : `${village.offset}m`)
        : "";

    function goToSettings() {
        window.history.pushState({ tab: "settings" }, "");
        window.dispatchEvent(new PopStateEvent("popstate", { state: { tab: "settings" } }));
    }

    // Jo din screen pe dikh raha hai: agar manually chuna to wo, warna aaj
    const viewDate = selectedDate || now;
    const isToday = isSameDay(viewDate, now);

    const isFriday = now.getDay() === 5;
    const todayM = now.getMonth();
    const todayD = now.getDate();
    const todayTimes = useMemo(() => getTimesFor(todayM + 1, todayD), [todayM, todayD]);
    const todayPrayers = useMemo(() => toList(todayTimes, isFriday), [todayTimes, isFriday]);

    const viewM = viewDate.getMonth();
    const viewD = viewDate.getDate();
    const isViewFriday = viewDate.getDay() === 5;
    const prayers = useMemo(
        () => toList(getTimesFor(viewM + 1, viewD), isViewFriday),
        [viewM, viewD, isViewFriday]
    );

    // Current aur Upcoming hamesha aaj ke data se
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const current = getCurrent(getPeriods(todayTimes, now.getMonth(), isFriday), nowMinutes);

    let next = todayPrayers.find((p) => toMinutes(p.time) > nowMinutes);
    let diff;
    if (next) {
        diff = toMinutes(next.time) - nowMinutes;
    } else {
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        const tt = getTimesFor(tomorrow.getMonth() + 1, tomorrow.getDate());
        next = { key: "fajrTomorrow", time: tt.fajr };
        diff = 24 * 60 - nowMinutes + toMinutes(tt.fajr);
    }
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;

    const clock = formatTime(`${pad(now.getHours())}:${pad(now.getMinutes())}`);
    const hijri = hijriFormat(viewDate, { day: "numeric", month: "long", year: "numeric" }, t);
    const gregorian = `${viewDate.getDate()} ${t("m" + (viewDate.getMonth() + 1))} ${viewDate.getFullYear()}`;

    const pickedValue = `${viewDate.getFullYear()}-${pad(viewDate.getMonth() + 1)}-${pad(viewDate.getDate())}`;

    function pickDate(e) {
        if (!e.target.value) return;
        const [y, m, d] = e.target.value.split("-").map(Number);
        const picked = new Date(y, m - 1, d);
        setSelectedDate(isSameDay(picked, now) ? null : picked);
    }

    function shiftDay(delta) {
        const base = selectedDate || now;
        const target = new Date(base.getFullYear(), base.getMonth(), base.getDate() + delta);
        setSelectedDate(isSameDay(target, now) ? null : target);
    }

    const dNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dView = new Date(viewDate.getFullYear(), viewDate.getMonth(), viewDate.getDate());
    const dayDiff = Math.round((dView - dNow) / 86400000);

    let dayLabel = gregorian;
    if (dayDiff === -1) dayLabel = t("yesterday");
    if (dayDiff === 0) dayLabel = t("today");
    if (dayDiff === 1) dayLabel = t("tomorrow");

    const noteText = current.noteKey
        ? t(current.noteKey, current.noteZuhr ? { zuhr: t(current.noteZuhr) } : undefined)
        : "";

    return (
        <div>
            {!village && <p className="notice">{t("villageNotice")}</p>}

            <div className="hero-card">
                <div className="hero-top">
                    <div className="hero-clock-box">
                        <span className="hero-clock ltr">{clock}</span>
                        {isToday && (
                            <span className={`hero-status-pill ${current.danger ? "danger" : ""}`}>
                                {current.danger && <AlertTriangle size={13} />}
                                <span>{t("current")}: <strong>{t(current.key)}</strong></span>
                            </span>
                        )}
                    </div>
                    <div className="hero-dates">
                        <span className="hero-hijri">{hijri}</span>
                        <span className="hero-gregorian">{gregorian}</span>
                        <button
                            className="hero-village-pill"
                            onClick={goToSettings}
                            type="button"
                            title={t("settings")}
                        >
                            <MapPin size={11} />
                            <span className="hero-village-name">{villageName}</span>
                            {offsetLabel && <span className="hero-village-offset ltr">{offsetLabel}</span>}
                        </button>
                    </div>
                </div>

                {isToday ? (
                    <div className="hero-body">
                        <div>
                            <span className="hero-label">{t("upcoming")}</span>
                            <h2 className="hero-next-name">{t(next.key)}</h2>
                        </div>
                        <div className="hero-countdown-badge">
                            <span className="countdown-time ltr">{t("duration", { h: hours, m: mins })}</span>
                        </div>
                    </div>
                ) : (
                    <div className="hero-body">
                        <div>
                            <span className="hero-label">{t("calendar")}</span>
                            <h2 className="hero-next-name">{dayLabel}</h2>
                        </div>
                        <button className="hero-today-btn" onClick={() => setSelectedDate(null)}>
                            {t("today")}
                        </button>
                    </div>
                )}

                {isToday && noteText && (
                    <div className={`hero-note-strip ${current.danger ? "danger" : ""}`}>
                        {current.danger ? <AlertTriangle size={15} /> : <Clock size={15} />}
                        <span>{noteText}</span>
                    </div>
                )}
            </div>

            <div className="day-nav">
                <button onClick={() => shiftDay(-1)} aria-label="Previous day">
                    <Prev size={22} />
                </button>
                <div className="day-center">
                    <span>{dayLabel}</span>
                    <label className="cal-btn" aria-label="Pick a date">
                        <CalendarDays size={20} />
                        <input type="date" value={pickedValue} onChange={pickDate} />
                    </label>
                </div>
                <button onClick={() => shiftDay(1)} aria-label="Next day">
                    <Next size={22} />
                </button>
            </div>

            <div className="prayer-list">
                {prayers.map((p) => {
                    const isCurrent = isToday && p.id === current.card;
                    const prayerMin = toMinutes(p.time);
                    const isNext = isToday && !isCurrent && next && next.key === p.key;
                    const isPast = isToday && !isCurrent && !isNext && prayerMin <= nowMinutes;

                    return (
                        <PrayerCard
                            key={p.id}
                            name={t(p.key)}
                            time={p.time}
                            Icon={p.Icon}
                            isCurrent={isCurrent}
                            isNext={isNext}
                            isPast={isPast}
                            t={t}
                        />
                    );
                })}
            </div>

            {isViewFriday && <p className="note">{t("fridayNote")}</p>}
        </div>
    );
}

export default Home;
import { getTimes, prayerTimes } from "../data/prayerTimes.js";
import { getVillageOffset } from "./settings.js";
import { toMinutes } from "./toMinutes.js";

function shift(time, delta) {
    const norm = (((toMinutes(time) + delta) % 1440) + 1440) % 1440;
    const hh = String(Math.floor(norm / 60)).padStart(2, "0");
    const mm = String(norm % 60).padStart(2, "0");
    return `${hh}:${mm}`;
}

export function getTimesFor(month, day) {
    const t = getTimes(month, day);
    const delta = getVillageOffset();
    if (!delta) return t;
    return Object.fromEntries(
        Object.entries(t).map(([name, time]) => [name, shift(time, delta)])
    );
}

export function getMonthTimes(month, year = new Date().getFullYear()) {
    const base = prayerTimes[month] || [];
    const delta = getVillageOffset();
    const rows = [...base];
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    if (month === 2 && isLeap && rows.length === 28) {
        rows.push(rows[27]);
    }
    if (!delta) return rows;
    return rows.map((row) => row.map((t) => shift(t, delta)));
}
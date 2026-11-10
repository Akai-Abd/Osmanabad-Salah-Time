import { toMinutes } from "./toMinutes.js";
import { SUNRISE_MINUTES, ZAWAL_BY_MONTH, SUNSET_MINUTES } from "../data/config.js";

export function getPeriods(times, month, friday) {
    const sunrise = toMinutes(times.sunrise);
    const zuhr = toMinutes(times.zuhr);
    const maghrib = toMinutes(times.maghrib);
    const zawal = ZAWAL_BY_MONTH[month];
    const zuhrKey = friday ? "jumuah" : "zuhr";

    return [
        { key: "fajr", card: "Fajr", start: toMinutes(times.fajr) },
        { key: "sunrise", card: "Sunrise", start: sunrise, danger: true, noteKey: "sunriseNote" },
        { key: "ishraq", card: "", start: sunrise + SUNRISE_MINUTES, noteKey: "ishraqNote" },
        { key: "zawal", card: "", start: zuhr - zawal, danger: true, noteKey: "zawalNote", noteZuhr: zuhrKey },
        { key: zuhrKey, card: "Zuhr", start: zuhr },
        { key: "asr", card: "Asr", start: toMinutes(times.asr) },
        { key: "sunset", card: "", start: maghrib - SUNSET_MINUTES, danger: true, noteKey: "sunsetNote" },
        { key: "maghribAwwabin", card: "Maghrib", start: maghrib },
        { key: "ishaTahajjud", card: "Isha", start: toMinutes(times.isha) },
    ];
}

export function getCurrent(periods, nowMinutes) {
    const found = periods.findLast ? periods.findLast((p) => p.start <= nowMinutes) : [...periods].reverse().find((p) => p.start <= nowMinutes);
    return found || periods[periods.length - 1];
}
import { HIJRI_SHIFT } from "../data/config.js";
import { HIJRI_MONTH_STARTS } from "../data/hijriMonths.js";

const MONTHS = [
    "Muharram", "Safar", "Rabi I", "Rabi II", "Jumada I", "Jumada II",
    "Rajab", "Shaban", "Ramadan", "Shawwal", "Dhul Qadah", "Dhul Hijjah",
];
const DAY = 86400000;

const dayNumber = (y, m, d) => Math.floor(Date.UTC(y, m, d) / DAY);

const starts = HIJRI_MONTH_STARTS.map((s) => {
    const [y, m, d] = s.start.split("-").map(Number);
    return { ...s, day: dayNumber(y, m - 1, d) };
}).sort((a, b) => a.day - b.day);

// Jis tarikh ka data file me nahi, uske liye andaaza
function calculated(date) {
    const d = new Date(date);
    d.setDate(d.getDate() + HIJRI_SHIFT);
    const parts = new Intl.DateTimeFormat("en-US", {
        calendar: "islamic-umalqura",
        numberingSystem: "latn",
        day: "numeric",
        month: "numeric",
        year: "numeric",
    }).formatToParts(d);
    const get = (type) => Number(parts.find((p) => p.type === type).value);
    return { day: get("day"), month: get("month"), year: get("year") };
}

function hijriParts(date) {
    const today = dayNumber(date.getFullYear(), date.getMonth(), date.getDate());
    for (let i = starts.length - 1; i >= 0; i--) {
        if (starts[i].day <= today) {
            const offset = today - starts[i].day;
            const nextDay = i + 1 < starts.length ? starts[i + 1].day : null;
            // Aakhri mahine ke 30 din tak data pe bharosa, uske baad andaaza
            const known = nextDay !== null ? today < nextDay : offset <= 29;
            if (known) {
                return { day: offset + 1, month: starts[i].month, year: starts[i].year, estimated: false };
            }
            break;
        }
    }
    return { ...calculated(date), estimated: true };
}

export function hijriFormat(date, options, t) {
    const { day, month, year } = hijriParts(date);
    const name = t ? t("hm" + month) : MONTHS[month - 1];
    if (options.month && options.day) return `${day} ${name} ${year}`;
    if (options.month) return `${name} ${year}`;
    return String(day);
}

export function hijriIsEstimated(date) {
    return hijriParts(date).estimated;
}
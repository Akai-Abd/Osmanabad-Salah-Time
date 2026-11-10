// Har Hijri mahine ka pehla din (Gregorian date, "YYYY-MM-DD"), paper calendar ke hisaab se.
// Chaand ke elaan ke baad zaroorat ho to yahan tarikh badalna, phir git push.
// month: 1 Muharram, 2 Safar, 3 Rabi I, 4 Rabi II, 5 Jumada I, 6 Jumada II,
//        7 Rajab, 8 Shaban, 9 Ramadan, 10 Shawwal, 11 Dhul Qadah, 12 Dhul Hijjah
export const HIJRI_MONTH_STARTS = [
    { year: 1447, month: 8, start: "2026-01-21" },  // 1 Shaban
    { year: 1447, month: 9, start: "2026-02-19" },  // 1 Ramadan
    { year: 1447, month: 10, start: "2026-03-21" }, // 1 Shawwal
    { year: 1447, month: 11, start: "2026-04-19" }, // 1 Dhul Qadah
    { year: 1447, month: 12, start: "2026-05-19" }, // 1 Dhul Hijjah
    { year: 1448, month: 1, start: "2026-06-17" },  // 1 Muharram
    { year: 1448, month: 2, start: "2026-07-16" },  // 1 Safar
    { year: 1448, month: 3, start: "2026-08-15" },  // 1 Rabi I
    { year: 1448, month: 4, start: "2026-09-13" },  // 1 Rabi II
    { year: 1448, month: 5, start: "2026-10-13" },  // 1 Jumada I
    { year: 1448, month: 6, start: "2026-11-11" },  // 1 Jumada II
    { year: 1448, month: 7, start: "2026-12-11" },  // 1 Rajab
];
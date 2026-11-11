export function formatTime(time24, showPeriod = true) {
    if (!time24) return "";
    const [h, m] = time24.split(":").map(Number);
    const suffix = showPeriod ? (h >= 12 ? " PM" : " AM") : "";
    const hour12 = h % 12 || 12;
    // \u2066 aur \u2069 time ko ek alag left-to-right dabbe me band karte hain,
    // taaki Urdu me bhi "6:25 AM" waise hi dikhe jaise English me.
    return `\u2066${hour12}:${String(m).padStart(2, "0")}${suffix}\u2069`;
}
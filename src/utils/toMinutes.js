export function toMinutes(time24) {
    const [h, m] = time24.split(":").map(Number);
    return h * 60 + m;
}
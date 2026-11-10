import { villages } from "../data/villages.js";

const mem = new Map();

export function read(key, fallback) {
    try {
        const v = localStorage.getItem(key);
        return v === null ? fallback : v;
    } catch {
        return mem.has(key) ? mem.get(key) : fallback;
    }
}
export function write(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch {
        mem.set(key, value);
    }
}

let cachedVillageId = undefined;
let cachedVillage = null;

export function getVillage() {
    const id = read("village", "");
    if (id !== cachedVillageId) {
        cachedVillageId = id;
        cachedVillage = villages.find((v) => v.id === id) || null;
    }
    return cachedVillage;
}
export function getVillageOffset() {
    const v = getVillage();
    return v ? v.offset : 0;
}
export function saveVillage(id) {
    cachedVillageId = id;
    cachedVillage = villages.find((v) => v.id === id) || null;
    write("village", id);
}

export function getTheme() { return read("theme", "light"); }
export function saveTheme(theme) { write("theme", theme); }
export function applyTheme(theme) {
    if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-theme", theme);
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            const colors = {
                light: "#547FA5",
                emerald: "#1E7E55",
                amber: "#9E6C20",
                dark: "#0F1B27",
            };
            meta.setAttribute("content", colors[theme] || "#547FA5");
        }
    }
}

export function getLang() { return read("lang", ""); }
export function saveLang(l) { write("lang", l); }
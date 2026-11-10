import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { getLang } from "./utils/settings.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Offline ke liye: service worker, aur is mahine ki images pehle se save
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    await navigator.serviceWorker.register("/sw.js");
    const ready = await navigator.serviceWorker.ready;

    const month = new Date().getMonth() + 1;
    const nextMonth = (month % 12) + 1;
    const saved = getLang();
    const langs = saved ? [saved] : ["en", "hi", "ur"];

    const images = langs.flatMap((l) => [
      `${location.origin}/timetable/${l}/${month}.jpg`,
      `${location.origin}/timetable/${l}/${nextMonth}.jpg`,
    ]);

    const urls = performance
      .getEntriesByType("resource")
      .map((r) => r.name)
      .filter((u) => u.startsWith(location.origin))
      .concat([location.origin + "/", ...images]);

    ready.active?.postMessage({ type: "CACHE_URLS", urls });
  });
}
const CACHE = "salah-v4";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("message", (e) => {
    if (e.data && e.data.type === "CACHE_URLS") {
        e.waitUntil(
            caches.open(CACHE).then((cache) =>
                Promise.all(e.data.urls.map((u) => cache.add(u).catch(() => { })))
            )
        );
    }
});

function save(req, res) {
    if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
    }
}

// Page: pehle naya version, 2.5 second me na aaye to saved copy
function networkFirst(req, ms) {
    return new Promise((resolve) => {
        let settled = false;
        const finish = (res) => {
            if (!settled && res) {
                settled = true;
                resolve(res);
            }
        };
        const timer = setTimeout(async () => {
            const cached = (await caches.match(req)) || (await caches.match("/"));
            if (cached) finish(cached);
        }, ms);

        fetch(req)
            .then((res) => {
                clearTimeout(timer);
                save(req, res);
                finish(res);
            })
            .catch(async () => {
                clearTimeout(timer);
                const cached = (await caches.match(req)) || (await caches.match("/"));
                finish(cached || Response.error());
            });
    });
}

// Baaki files (js, css, images): saved copy turant, peeche se update
function staleWhileRevalidate(req) {
    return caches.match(req).then((cached) => {
        const network = fetch(req).then((res) => {
            save(req, res);
            return res;
        });
        if (cached) {
            network.catch(() => { });
            return cached;
        }
        return network.catch(() => Response.error());
    });
}

self.addEventListener("fetch", (e) => {
    const req = e.request;
    if (req.method !== "GET" || !req.url.startsWith(self.location.origin)) return;
    if (req.headers.has("range")) return;

    if (req.mode === "navigate") {
        e.respondWith(networkFirst(req, 2500));
        return;
    }
    e.respondWith(staleWhileRevalidate(req));
});
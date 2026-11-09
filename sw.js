const CACHE = "teaching-log-v6";
const FILES = ["./", "index.html", "manifest.json", "xlsx.full.min.js", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("teaching-log-") && k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// 只清除本 App 自己的舊快取（同網域還有其他 App，不可動到）
// 網路優先（拿得到新版就用新版），離線時用快取
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; })
      .catch(() => caches.open(CACHE).then(c => c.match(e.request, { ignoreSearch: true }).then(r => r || c.match("index.html"))))
  );
});

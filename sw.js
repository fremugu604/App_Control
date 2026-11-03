const V="gastos-v1";
const F=["./","index.html","manifest.webmanifest","icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const q=e.request,u=new URL(q.url);
  if(q.method!=="GET"||u.origin!==location.origin)return;
  e.respondWith(caches.match(q).then(r=>{
    const f=fetch(q).then(res=>{if(res.ok){const c=res.clone();caches.open(V).then(x=>x.put(q,c))}return res}).catch(()=>r);
    return r||f;
  }));
});

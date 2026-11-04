const V="gastos-v2";
const F=["./","index.html","manifest.webmanifest","icon.png"];
self.addEventListener("install",e=>{
  e.waitUntil(caches.open(V).then(c=>Promise.all(F.map(u=>c.add(u).catch(()=>{})))));
  self.skipWaiting();
});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",e=>{
  const q=e.request,u=new URL(q.url);
  if(q.method!=="GET")return;
  const fuente=/(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if(u.origin!==location.origin&&!fuente)return;
  e.respondWith(caches.match(q).then(r=>{
    const f=fetch(q).then(res=>{
      if(res&&(res.ok||res.type==="opaque")){const c=res.clone();caches.open(V).then(x=>x.put(q,c))}
      return res;
    }).catch(()=>r||(q.mode==="navigate"?caches.match("index.html"):undefined));
    return r||f;
  }));
});

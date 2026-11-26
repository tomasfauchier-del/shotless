// SHOTLESS – hors ligne. Change VERSION à chaque mise à jour.
const VERSION='shotless-v2';
const FILES=['./','./index.html','./manifest.webmanifest','./icon.svg','./apple-touch-icon.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VERSION).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.open(VERSION).then(c=>c.match(e.request).then(hit=>{const net=fetch(e.request).then(r=>{c.put(e.request,r.clone());return r}).catch(()=>hit);return hit||net})));return;
  }
  if(u.origin!==location.origin)return;
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(VERSION).then(x=>x.put('./index.html',c));return r}).catch(()=>caches.match('./index.html')));return;
  }
  e.respondWith(caches.match(e.request).then(h=>h||fetch(e.request)));
});

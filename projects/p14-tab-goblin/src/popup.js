const $=s=>document.querySelector(s);
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1200);} 
function fmtAgo(ms){ if(ms==null) return 'unknown'; const s=Math.floor(ms/1000); if(s<60) return s+'s ago'; const m=Math.floor(s/60); if(m<60) return m+'m ago'; const h=Math.floor(m/60); if(h<48) return h+'h ago'; const d=Math.floor(h/24); return d+'d ago'; }
async function getKeep(){ const {keep=[]}=await chrome.storage.local.get('keep'); return new Set(keep); }
async function setKeep(set){ await chrome.storage.local.set({keep:Array.from(set)}); }
function isKept(url, keep){ if(!url) return false; return keep.has(url); }
function goblinMood(n){ if(n<10) return {e:'😌', t:'Calm goblin. Nice and tidy.'}; if(n<20) return {e:'🙂', t:'Getting peckish.'}; if(n<35) return {e:'😬', t:'So many tabs…'}; if(n<50) return {e:'👹', t:'Goblin is stressed!'}; return {e:'🔥', t:'Goblin is overwhelmed. Feed me tabs!'}; }

async function load(){
  const tabs = await chrome.tabs.query({});
  const keep = await getKeep();
  const now = Date.now();
  const enriched = tabs.map(t=>({ ...t, ignored: (t.lastAccessed? (now - t.lastAccessed): null) }));
  enriched.sort((a,b)=> (b.ignored??-1) - (a.ignored??-1));
  const mood = goblinMood(tabs.length);
  $('#goblin').textContent=mood.e; $('#mood').textContent=mood.t;
  const asleepCount = tabs.filter(t=>t.discarded).length;
  $('#count').textContent = `${tabs.length} tabs open`;
  $('#asleep').textContent = `${asleepCount} asleep · goblin ${tabs.length>=30?'is full':'hungry'}`;
  renderTabs(enriched, keep, now);
  renderSessions();
}

function renderTabs(tabs, keep){
  const root=$('#tabs'); root.innerHTML='';
  tabs.forEach(t=>{
    const d=document.createElement('div'); d.className='tab';
    const kept=isKept(t.url, keep);
    const pills=[t.active?'active':null, t.discarded?'asleep':null, t.pinned?'pinned':null, t.audible?'audio':null, kept?'KEEP':null].filter(Boolean).map(p=>`<span class="pill">${p}</span>`).join(' ');
    d.innerHTML=`<div class="info"><div class="title" title="${esc(t.title||t.url||'')}">${esc(t.title||t.url||'(no title)')}</div>
      <div class="meta">Ignored: ${fmtAgo(t.ignored)} · ${pills}</div>
      <div class="row">
        <button class="small secondary sleep">Sleep</button>
        <button class="small secondary wake">Wake</button>
        <button class="small secondary keep">${kept?'Unkeep':'Keep'}</button>
      </div></div>`;
    d.querySelector('.sleep').onclick=async()=>{ if(t.active||t.audible||kept){toast('Skipped (active/audio/kept)');return;} try{await chrome.tabs.discard(t.id); toast('Tab asleep'); load();}catch(e){toast('Cannot sleep');} };
    d.querySelector('.wake').onclick=async()=>{ try{await chrome.tabs.update(t.id,{active:true});}catch(e){} };
    d.querySelector('.keep').onclick=async()=>{ const k=await getKeep(); if(k.has(t.url)) k.delete(t.url); else if(t.url) k.add(t.url); await setKeep(k); toast(k.has(t.url)?'Kept':'Unkept'); load(); };
    root.appendChild(d);
  });
}

async function feedGoblin(){
  const tabs = await chrome.tabs.query({active:false});
  const keep = await getKeep();
  // sleep most ignored first
  const now=Date.now();
  const candidates = tabs.filter(t=>!t.discarded && !t.pinned && !t.audible && !isKept(t.url,keep))
    .map(t=>({...t, ignored:t.lastAccessed?(now-t.lastAccessed):0}))
    .sort((a,b)=>b.ignored-a.ignored);
  let slept=0;
  for(const t of candidates.slice(0, Math.max(1, Math.ceil(candidates.length*0.5)))){
    try{ await chrome.tabs.discard(t.id); slept++; }catch(e){}
  }
  toast(`Goblin ate ${slept} tabs (slept)`); load();
}

async function saveSession(){
  const tabs = await chrome.tabs.query({currentWindow:true});
  const urls = tabs.map(t=>t.url).filter(u=>u && !u.startsWith('chrome://') && !u.startsWith('edge://'));
  const name = `Session ${new Date().toLocaleString()}`;
  const {sessions=[]}=await chrome.storage.local.get('sessions');
  sessions.unshift({id:String(Date.now()), name, urls, createdAt:new Date().toISOString()});
  await chrome.storage.local.set({sessions:sessions.slice(0,20)});
  toast('Session saved'); renderSessions();
}
async function renderSessions(){
  const {sessions=[]}=await chrome.storage.local.get('sessions');
  const root=$('#sessions'); root.innerHTML='';
  if(!sessions.length){ root.innerHTML='<div class="empty">No saved sessions.</div>'; return; }
  sessions.forEach(s=>{
    const d=document.createElement('div'); d.className='session';
    d.innerHTML=`<div class="title">${esc(s.name)}</div><div class="meta">${s.urls.length} tabs · ${new Date(s.createdAt).toLocaleString()}</div>
      <div class="row"><button class="small restore">Restore</button><button class="small secondary del">Delete</button></div>`;
    d.querySelector('.restore').onclick=async()=>{ for(const u of s.urls){ try{ await chrome.tabs.create({url:u, active:false}); }catch(e){} } toast('Session restored'); };
    d.querySelector('.del').onclick=async()=>{ const {sessions:ss=[]}=await chrome.storage.local.get('sessions'); await chrome.storage.local.set({sessions:ss.filter(x=>x.id!==s.id)}); renderSessions(); };
    root.appendChild(d);
  });
}
function esc(s){ return String(s||'').replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c])); }

$('#feed').onclick=feedGoblin; $('#saveSession').onclick=saveSession;
load();

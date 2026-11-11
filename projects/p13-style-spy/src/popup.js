let current = { colors: [], fonts: [], url: '', title: '' };
const $ = s => document.querySelector(s);
function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),1200); }
async function copyText(text){ try{ await navigator.clipboard.writeText(text); toast('Copied'); }catch{ const ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); toast('Copied'); } }

async function analyze(){
  $('#colors').innerHTML='<div class="empty">Analyzing…</div>'; $('#fonts').innerHTML='';
  try{
    const [tab] = await chrome.tabs.query({active:true,currentWindow:true});
    const [{result}] = await chrome.scripting.executeScript({ target:{tabId: tab.id}, files:['content.js'] });
    current = result || current; render();
  }catch(e){ $('#colors').innerHTML=`<div class="empty">Could not analyze: ${String(e.message||e)}</div>`; }
}
function render(){
  const c=$('#colors'); c.innerHTML = current.colors.length? '' : '<div class="empty">No colors found. Click Analyze.</div>';
  current.colors.forEach((x,i)=>{
    const d=document.createElement('div'); d.className='item';
    d.innerHTML=`<div class="swatch" style="background:${x.value}"></div><div class="meta"><div class="val">${x.value}</div><div class="sub">rank #${i+1} · usage ${x.score}</div></div>`;
    d.onclick=()=>copyText(x.value); c.appendChild(d);
  });
  const f=$('#fonts'); f.innerHTML = current.fonts.length? '' : '<div class="empty">No fonts found.</div>';
  current.fonts.forEach((x,i)=>{
    const label = `${x.family} — ${x.weight} / ${x.size}`;
    const d=document.createElement('div'); d.className='item';
    d.innerHTML=`<div class="meta"><div class="val">${label}</div><div class="sub">rank #${i+1}</div></div>`;
    d.onclick=()=>copyText(label); f.appendChild(d);
  });
}

function kitToCss(kit){
  const lines=[":root {"];
  (kit.colors||[]).forEach((c,i)=> lines.push(`  --color-${i+1}: ${c.value};`));
  (kit.fonts||[]).forEach((f,i)=>{ lines.push(`  --font-${i+1}-family: ${/[\s]/.test(f.family)?`'${f.family}'`:f.family};`); lines.push(`  --font-${i+1}-weight: ${f.weight};`); lines.push(`  --font-${i+1}-size: ${f.size};`); });
  lines.push("}"); return lines.join('\n');
}
async function saveKit(){
  const name = $('#kitName').value.trim(); if(!name){ toast('Enter a kit name'); return; }
  if(!current.colors.length && !current.fonts.length){ toast('Analyze a page first'); return; }
  const kit = { name, savedAt: new Date().toISOString(), url: current.url, colors: current.colors, fonts: current.fonts };
  const {kits={}} = await chrome.storage.local.get('kits'); kits[name]=kit; await chrome.storage.local.set({kits});
  $('#kitName').value=''; toast('Kit saved'); renderKits();
}
async function renderKits(){
  const {kits={}} = await chrome.storage.local.get('kits'); const wrap=$('#kits'); wrap.innerHTML='';
  const names=Object.keys(kits).sort(); if(!names.length){ wrap.innerHTML='<div class="empty">No saved kits.</div>'; return; }
  names.forEach(name=>{
    const d=document.createElement('div'); d.className='kit';
    d.innerHTML=`<div><div class="val">${name}</div><div class="sub">${(kits[name].colors||[]).length} colors, ${(kits[name].fonts||[]).length} fonts</div></div>
      <div class="actions"><button class="secondary load">Load</button><button class="secondary css">CSS</button><button class="secondary del">Del</button></div>`;
    d.querySelector('.load').onclick=()=>{ current = {colors:kits[name].colors||[], fonts:kits[name].fonts||[], url:kits[name].url||'', title:kits[name].name}; render(); toast('Kit loaded'); };
    d.querySelector('.css').onclick=()=>copyText(kitToCss(kits[name]));
    d.querySelector('.del').onclick=async()=>{ const {kits:k={}}=await chrome.storage.local.get('kits'); delete k[name]; await chrome.storage.local.set({kits:k}); renderKits(); };
    wrap.appendChild(d);
  });
}
$('#analyze').onclick=analyze;
$('#saveKit').onclick=saveKit;
$('#copyCss').onclick=()=>{ if(!current.colors.length && !current.fonts.length){ toast('Nothing to copy'); return; } copyText(kitToCss(current)); };
renderKits();

// Form Photo Fixer - offline, client-side only
const DEFAULT_PRESETS = [
  { id: 'ssc-photo', name: 'SSC photo (notice spec)', w: 413, h: 531, kb: 50, note: '3.5x4.5cm passport-style, JPEG 20-50KB per SSC notices (verify current notice).' },
  { id: 'gate-photo', name: 'GATE 2026 photo', w: 350, h: 450, kb: 200, note: 'Passport 3.5x4.5cm, 200x260-530x690px, 5-600KB JPEG (gate2026.iitg.ac.in).' },
  { id: 'ssc-signature', name: 'SSC signature (notice spec)', w: 709, h: 236, kb: 20, note: 'About 6.0x2.0cm, JPEG 10-20KB per SSC notices (signature output use-case).' }
];

const els = {
  photoInput: document.getElementById('photoInput'),
  sigInput: document.getElementById('sigInput'),
  loadSample: document.getElementById('loadSample'),
  photoMeta: document.getElementById('photoMeta'),
  presetSelect: document.getElementById('presetSelect'),
  presetInfo: document.getElementById('presetInfo'),
  cropCanvas: document.getElementById('cropCanvas'),
  zoom: document.getElementById('zoom'),
  centerBtn: document.getElementById('centerBtn'),
  fitBtn: document.getElementById('fitBtn'),
  customName: document.getElementById('customName'),
  customW: document.getElementById('customW'),
  customH: document.getElementById('customH'),
  customKB: document.getElementById('customKB'),
  addPreset: document.getElementById('addPreset'),
  customMsg: document.getElementById('customMsg'),
  photoOut: document.getElementById('photoOut'),
  sigOut: document.getElementById('sigOut'),
  photoOutMeta: document.getElementById('photoOutMeta'),
  sigOutMeta: document.getElementById('sigOutMeta'),
  downloadPhoto: document.getElementById('downloadPhoto'),
  downloadSig: document.getElementById('downloadSig'),
  refreshOut: document.getElementById('refreshOut'),
};

const state = {
  presets: [],
  presetId: null,
  photoImg: null,
  sigImg: null,
  offsetX: 0, offsetY: 0, scale: 1, minScale: 1,
  dragging: false, dragStart: null,
  lastPhotoBlob: null, lastSigBlob: null,
};

function loadPresets() {
  let custom = [];
  try { custom = JSON.parse(localStorage.getItem('ff_custom_presets') || '[]'); } catch {}
  state.presets = [...DEFAULT_PRESETS, ...custom.filter(p => p && p.id && p.name)];
}
function saveCustomPresets() {
  const custom = state.presets.filter(p => String(p.id).startsWith('custom-'));
  localStorage.setItem('ff_custom_presets', JSON.stringify(custom));
}
function currentPreset() { return state.presets.find(p => p.id === state.presetId) || state.presets[0]; }

function renderPresetSelect() {
  els.presetSelect.innerHTML = '';
  state.presets.forEach(p => {
    const o = document.createElement('option');
    o.value = p.id; o.textContent = `${p.name} (${p.w}x${p.h}, ${p.kb}KB)`;
    els.presetSelect.appendChild(o);
  });
  if (!state.presetId || !state.presets.find(p=>p.id===state.presetId)) state.presetId = state.presets[0].id;
  els.presetSelect.value = state.presetId;
  updatePresetInfo();
}
function updatePresetInfo() {
  const p = currentPreset();
  if (!p) return;
  els.presetInfo.textContent = `Required: ${p.w}×${p.h}px, max ${p.kb} KB. ${p.note || ''}`;
  computeFitScale();
  drawCrop();
  renderOutputs();
}

function computeFitScale() {
  const p = currentPreset(); if (!p || !state.photoImg) return;
  const sx = els.cropCanvas.width / p.w;
  const sy = els.cropCanvas.height / p.h;
  const viewScale = Math.min(sx, sy);
  state.minScale = Math.max(p.w / state.photoImg.width, p.h / state.photoImg.height);
  if (!state.scale || state.scale < state.minScale) state.scale = state.minScale;
  els.zoom.min = String(state.minScale);
  if (parseFloat(els.zoom.value) < state.minScale) els.zoom.value = String(state.minScale);
}
function clampOffsets() {
  const p = currentPreset(); if (!p || !state.photoImg) return;
  const drawW = state.photoImg.width * state.scale;
  const drawH = state.photoImg.height * state.scale;
  const minX = p.w - drawW, minY = p.h - drawH;
  state.offsetX = Math.min(0, Math.max(minX, state.offsetX));
  state.offsetY = Math.min(0, Math.max(minY, state.offsetY));
}
function centerImage() {
  const p = currentPreset(); if (!p || !state.photoImg) return;
  const drawW = state.photoImg.width * state.scale;
  const drawH = state.photoImg.height * state.scale;
  state.offsetX = (p.w - drawW) / 2;
  state.offsetY = (p.h - drawH) / 2;
  clampOffsets(); drawCrop(); renderOutputs();
}
function fitImage() {
  const p = currentPreset(); if (!p || !state.photoImg) return;
  state.scale = Math.max(p.w / state.photoImg.width, p.h / state.photoImg.height);
  els.zoom.value = String(state.scale);
  centerImage();
}

function drawCrop() {
  const ctx = els.cropCanvas.getContext('2d');
  const cw = els.cropCanvas.width, ch = els.cropCanvas.height;
  ctx.clearRect(0,0,cw,ch);
  ctx.fillStyle = '#1a1a1a'; ctx.fillRect(0,0,cw,ch);
  const p = currentPreset(); if (!p) return;
  const viewScale = Math.min(cw / p.w, ch / p.h);
  const ox = (cw - p.w * viewScale) / 2;
  const oy = (ch - p.h * viewScale) / 2;

  ctx.save();
  ctx.translate(ox, oy);
  ctx.beginPath(); ctx.rect(0,0,p.w*viewScale,p.h*viewScale); ctx.clip();
  ctx.fillStyle = '#fff'; ctx.fillRect(0,0,p.w*viewScale,p.h*viewScale);
  if (state.photoImg) {
    ctx.drawImage(state.photoImg, state.offsetX*viewScale, state.offsetY*viewScale, state.photoImg.width*state.scale*viewScale, state.photoImg.height*state.scale*viewScale);
  } else {
    ctx.fillStyle = '#999'; ctx.font = '16px sans-serif'; ctx.fillText('Upload a photo', 20*viewScale, 40*viewScale);
  }
  // face guide (oval)
  ctx.strokeStyle = 'rgba(11,95,255,0.9)'; ctx.lineWidth = 2;
  const fx = p.w*viewScale/2, fy = p.h*viewScale*0.42, rx = p.w*viewScale*0.28, ry = p.h*viewScale*0.28;
  ctx.beginPath(); ctx.ellipse(fx, fy, rx, ry, 0, 0, Math.PI*2); ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 2; ctx.strokeRect(ox,oy,p.w*viewScale,p.h*viewScale);
}

function getCropToCanvas(w, h) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#fff'; ctx.fillRect(0,0,w,h);
  if (state.photoImg) ctx.drawImage(state.photoImg, state.offsetX, state.offsetY, state.photoImg.width*state.scale, state.photoImg.height*state.scale);
  return c;
}

async function canvasToJpegUnderKB(canvas, maxKB) {
  const maxBytes = maxKB * 1024;
  let lo = 0.1, hi = 0.92, bestBlob = null;
  const toBlob = (q) => new Promise(res => canvas.toBlob(res, 'image/jpeg', q));
  // binary-like search for highest quality under limit
  for (let i=0;i<10;i++) {
    const q = (lo+hi)/2;
    const b = await toBlob(q);
    if (!b) break;
    if (b.size <= maxBytes) { bestBlob = b; lo = q; } else { hi = q; }
  }
  if (!bestBlob) {
    // try lower qualities
    for (let q=0.1; q>=0.02; q-=0.02) {
      const b = await toBlob(q); if (b && b.size <= maxBytes) { bestBlob = b; break; }
      if (!bestBlob) bestBlob = b; // keep last (smallest tried) even if over
    }
  }
  return bestBlob;
}

async function renderOutputs() {
  const p = currentPreset(); if (!p) return;
  // photo
  els.photoOut.width = p.w; els.photoOut.height = p.h;
  if (state.photoImg) {
    const src = getCropToCanvas(p.w, p.h);
    const blob = await canvasToJpegUnderKB(src, p.kb);
    state.lastPhotoBlob = blob;
    const img = await blobToImage(blob);
    const ctx = els.photoOut.getContext('2d');
    ctx.clearRect(0,0,p.w,p.h); ctx.drawImage(img,0,0,p.w,p.h);
    const kb = (blob.size/1024).toFixed(2);
    const ok = blob.size <= p.kb*1024;
    els.photoOutMeta.textContent = `${p.w}×${p.h}px, ${kb} KB (limit ${p.kb} KB) ${ok ? '✓ under limit' : '⚠ over limit'}`;
    els.photoOutMeta.style.color = ok ? '#1a7f37' : '#b54708';
  } else {
    const ctx = els.photoOut.getContext('2d'); ctx.clearRect(0,0,p.w,p.h);
    ctx.fillStyle='#eee'; ctx.fillRect(0,0,p.w,p.h);
    els.photoOutMeta.textContent = 'No photo uploaded.'; els.photoOutMeta.style.color='';
    state.lastPhotoBlob = null;
  }
  // signature (fit within reasonable box, export png)
  const sw = 400, sh = 160;
  els.sigOut.width = sw; els.sigOut.height = sh;
  const sctx = els.sigOut.getContext('2d'); sctx.clearRect(0,0,sw,sh); sctx.fillStyle='#fff'; sctx.fillRect(0,0,sw,sh);
  if (state.sigImg) {
    const scale = Math.min(sw / state.sigImg.width, sh / state.sigImg.height);
    const dw = state.sigImg.width*scale, dh = state.sigImg.height*scale;
    sctx.drawImage(state.sigImg, (sw-dw)/2, (sh-dh)/2, dw, dh);
    state.lastSigBlob = await new Promise(res => els.sigOut.toBlob(res, 'image/png'));
    els.sigOutMeta.textContent = `${state.sigImg.width}×${state.sigImg.height}px source → ${(state.lastSigBlob.size/1024).toFixed(2)} KB (PNG)`;
  } else {
    sctx.fillStyle='#999'; sctx.font='14px sans-serif'; sctx.fillText('No signature uploaded', 20, 40);
    els.sigOutMeta.textContent = 'No signature uploaded.'; state.lastSigBlob = null;
  }
}

function blobToImage(blob){ return new Promise((res,rej)=>{ const u=URL.createObjectURL(blob); const i=new Image(); i.onload=()=>{URL.revokeObjectURL(u);res(i)}; i.onerror=rej; i.src=u; }); }
function loadImageFile(file){ return new Promise((res,rej)=>{ const u=URL.createObjectURL(file); const i=new Image(); i.onload=()=>{URL.revokeObjectURL(u);res(i)}; i.onerror=rej; i.src=u; }); }

function downloadBlob(blob, name){ if(!blob) return; const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href), 2000); }

// events
els.presetSelect.addEventListener('change', e=>{ state.presetId = e.target.value; updatePresetInfo(); });
els.photoInput.addEventListener('change', async e=>{ const f=e.target.files[0]; if(!f) return; state.photoImg = await loadImageFile(f); els.photoMeta.textContent = `Photo: ${f.name} (${(f.size/1024).toFixed(1)} KB, ${state.photoImg.width}×${state.photoImg.height})`; fitImage(); });
els.sigInput.addEventListener('change', async e=>{ const f=e.target.files[0]; if(!f) return; state.sigImg = await loadImageFile(f); renderOutputs(); });
els.zoom.addEventListener('input', e=>{ const p=currentPreset(); if(!p||!state.photoImg) return; const old=state.scale; state.scale=parseFloat(e.target.value); // zoom toward center
  const cx=p.w/2, cy=p.h/2; state.offsetX = cx - (cx - state.offsetX)*(state.scale/old); state.offsetY = cy - (cy - state.offsetY)*(state.scale/old);
  clampOffsets(); drawCrop(); renderOutputs(); });
els.centerBtn.addEventListener('click', centerImage);
els.fitBtn.addEventListener('click', fitImage);
els.refreshOut.addEventListener('click', renderOutputs);
els.downloadPhoto.addEventListener('click', ()=>{ const p=currentPreset(); downloadBlob(state.lastPhotoBlob, `photo-${p.w}x${p.h}.jpg`); });
els.downloadSig.addEventListener('click', ()=> downloadBlob(state.lastSigBlob, 'signature.png'));

els.addPreset.addEventListener('click', ()=>{
  const name=els.customName.value.trim()||'Custom'; const w=parseInt(els.customW.value,10); const h=parseInt(els.customH.value,10); const kb=parseInt(els.customKB.value,10);
  if(!(w>0&&h>0&&kb>0)){ els.customMsg.textContent='Enter valid width, height, KB.'; return; }
  const preset={ id:'custom-'+Date.now(), name, w,h,kb, note:'Custom preset' };
  state.presets.push(preset); saveCustomPresets(); state.presetId=preset.id; renderPresetSelect(); updatePresetInfo();
  els.customMsg.textContent=`Saved preset "${name}".`;
});

function canvasPoint(evt){
  const rect=els.cropCanvas.getBoundingClientRect();
  const p=currentPreset(); if(!p) return {x:0,y:0};
  const viewScale=Math.min(els.cropCanvas.width/p.w, els.cropCanvas.height/p.h);
  const ox=(els.cropCanvas.width - p.w*viewScale)/2, oy=(els.cropCanvas.height - p.h*viewScale)/2;
  const clientX = evt.touches?evt.touches[0].clientX:evt.clientX;
  const clientY = evt.touches?evt.touches[0].clientY:evt.clientY;
  const cx = (clientX - rect.left) * (els.cropCanvas.width/rect.width);
  const cy = (clientY - rect.top) * (els.cropCanvas.height/rect.height);
  return { x:(cx-ox)/viewScale, y:(cy-oy)/viewScale };
}
function startDrag(e){ if(!state.photoImg) return; state.dragging=true; state.dragStart={p:canvasPoint(e), ox:state.offsetX, oy:state.offsetY}; e.preventDefault(); }
function moveDrag(e){ if(!state.dragging) return; const pt=canvasPoint(e); state.offsetX = state.dragStart.ox + (pt.x - state.dragStart.p.x); state.offsetY = state.dragStart.oy + (pt.y - state.dragStart.p.y); clampOffsets(); drawCrop(); e.preventDefault(); }
function endDrag(){ if(state.dragging){ state.dragging=false; renderOutputs(); } }
['mousedown','touchstart'].forEach(ev=>els.cropCanvas.addEventListener(ev,startDrag,{passive:false}));
['mousemove','touchmove'].forEach(ev=>window.addEventListener(ev,moveDrag,{passive:false}));
['mouseup','mouseleave','touchend','touchcancel'].forEach(ev=>window.addEventListener(ev,endDrag));

els.loadSample.addEventListener('click', ()=>{
  // generate a large sample image in-memory to test "large phone photo" offline
  const c=document.createElement('canvas'); c.width=4000; c.height=3000; const ctx=c.getContext('2d');
  const g=ctx.createLinearGradient(0,0,4000,3000); g.addColorStop(0,'#cfd8dc'); g.addColorStop(1,'#90a4ae'); ctx.fillStyle=g; ctx.fillRect(0,0,4000,3000);
  ctx.fillStyle='#37474f'; ctx.beginPath(); ctx.ellipse(2000,1200,650,820,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#263238'; ctx.fillRect(1200,1800,1600,900);
  ctx.fillStyle='#fff'; ctx.font='120px sans-serif'; ctx.fillText('SAMPLE 4000x3000 (offline)', 900, 2800);
  const img=new Image(); img.onload=()=>{ state.photoImg=img; els.photoMeta.textContent=`Sample large photo (${img.width}×${img.height}) generated locally`; fitImage(); };
  img.src=c.toDataURL('image/jpeg',0.92);
});

// init
loadPresets();
state.presetId = state.presets[0].id;
renderPresetSelect();
updatePresetInfo();
drawCrop();
renderOutputs();

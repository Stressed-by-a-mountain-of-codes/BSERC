// Bill Book - offline PWA
const $ = s => document.querySelector(s);
const storeKey = 'billbook_v1';
const state = loadState();

function loadState(){
  try { return JSON.parse(localStorage.getItem(storeKey)) || defaultState(); } catch { return defaultState(); }
}
function defaultState(){
  return { shop:{name:'My Shop', upi:'', payee:'', addr:''}, items:[{id:id(),name:'Rice 1kg',price:60},{id:id(),name:'Oil 1L',price:165}], bills:[], current:{lines:[]} };
}
function saveState(){ localStorage.setItem(storeKey, JSON.stringify(state)); }
function id(){ return Math.random().toString(36).slice(2,10); }
function money(n){ return (Math.round((Number(n)||0)*100)/100).toFixed(2); }
function todayStr(){ const d=new Date(); return d.toISOString().slice(0,10); }

function init(){
  // tabs
  document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(x=>x.classList.remove('active'));
    b.classList.add('active'); document.getElementById('tab-'+b.dataset.tab).classList.add('active');
    if(b.dataset.tab==='history') renderHistory();
  });
  $('#saveShop').onclick=saveShop;
  $('#saveItem').onclick=saveItem;
  $('#addLine').onclick=addLine;
  $('#clearBill').onclick=()=>{ state.current={lines:[]}; saveState(); renderBill(); };
  $('#saveBill').onclick=saveBill;
  $('#genQr').onclick=renderQr;
  $('#shareBill').onclick=shareBillImage;
  hydrateShop(); renderItems(); renderBillItemSelect(); renderBill(); renderHistory();
  if('serviceWorker' in navigator){ navigator.serviceWorker.register('./sw.js').catch(()=>{}); }
}

function hydrateShop(){ $('#shopName').value=state.shop.name||''; $('#shopUpi').value=state.shop.upi||''; $('#shopPayee').value=state.shop.payee||''; $('#shopAddr').value=state.shop.addr||''; }
function saveShop(){ state.shop={name:$('#shopName').value.trim()||'My Shop', upi:$('#shopUpi').value.trim(), payee:$('#shopPayee').value.trim(), addr:$('#shopAddr').value.trim()}; saveState(); renderBill(); alert('Shop profile saved.'); }

function renderItems(){
  const tb=$('#itemsTable tbody'); tb.innerHTML='';
  state.items.forEach(it=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${esc(it.name)}</td><td>₹ ${money(it.price)}</td><td><button data-id="${it.id}" class="danger del">Delete</button></td>`;
    tr.querySelector('.del').onclick=()=>{ state.items=state.items.filter(x=>x.id!==it.id); saveState(); renderItems(); renderBillItemSelect(); };
    tb.appendChild(tr);
  });
  renderBillItemSelect();
}
function renderBillItemSelect(){
  const sel=$('#billItem'); sel.innerHTML='';
  if(!state.items.length){ const o=document.createElement('option'); o.textContent='No items - add in Items tab'; sel.appendChild(o); return; }
  state.items.forEach(it=>{ const o=document.createElement('option'); o.value=it.id; o.textContent=`${it.name} (₹${money(it.price)})`; sel.appendChild(o); });
}
function saveItem(){
  const name=$('#itemName').value.trim(); const price=parseFloat($('#itemPrice').value);
  if(!name || !(price>=0)) { alert('Enter valid name and price.'); return; }
  state.items.push({id:id(),name,price}); saveState(); $('#itemName').value=''; $('#itemPrice').value=''; renderItems();
}

function addLine(){
  const itemId=$('#billItem').value; const qty=Math.max(1, parseInt($('#billQty').value||'1',10));
  const it=state.items.find(x=>x.id===itemId); if(!it){ alert('Add/select an item first.'); return; }
  state.current.lines.push({id:id(), itemId, name:it.name, price:it.price, qty, disc:0, tax:0});
  saveState(); renderBill();
}
function computeLine(l){
  const base = l.qty * l.price;
  const discAmt = base * (Number(l.disc)||0)/100;
  const taxable = base - discAmt;
  const taxAmt = taxable * (Number(l.tax)||0)/100;
  const total = taxable + taxAmt;
  return {base, discAmt, taxable, taxAmt, total};
}
function computeBill(){
  let sub=0, disc=0, tax=0, grand=0;
  state.current.lines.forEach(l=>{ const c=computeLine(l); sub+=c.base; disc+=c.discAmt; tax+=c.taxAmt; grand+=c.total; });
  return {sub,disc,tax,grand};
}
function renderBill(){
  const tb=$('#linesTable tbody'); tb.innerHTML='';
  state.current.lines.forEach(l=>{
    const c=computeLine(l); const tr=document.createElement('tr');
    tr.innerHTML=`<td>${esc(l.name)}</td>
      <td><input type="number" min="1" value="${l.qty}" data-k="qty" data-id="${l.id}"></td>
      <td>₹ ${money(l.price)}</td>
      <td><input type="number" min="0" step="0.1" value="${l.disc}" data-k="disc" data-id="${l.id}"></td>
      <td><input type="number" min="0" step="0.1" value="${l.tax}" data-k="tax" data-id="${l.id}"></td>
      <td>₹ ${money(c.total)}</td>
      <td><button class="danger rm" data-id="${l.id}">x</button></td>`;
    tr.querySelectorAll('input').forEach(inp=>inp.oninput=()=>{ const line=state.current.lines.find(x=>x.id===inp.dataset.id); if(!line) return; line[inp.dataset.k]=parseFloat(inp.value||'0'); saveState(); renderBillTotalsOnly(); drawBillCanvas(); });
    tr.querySelector('.rm').onclick=()=>{ state.current.lines=state.current.lines.filter(x=>x.id!==l.id); saveState(); renderBill(); };
    tb.appendChild(tr);
  });
  renderBillTotalsOnly(); drawBillCanvas();
}
function renderBillTotalsOnly(){
  const t=computeBill(); $('#subTotal').textContent=money(t.sub); $('#discTotal').textContent=money(t.disc); $('#taxTotal').textContent=money(t.tax); $('#grandTotal').textContent=money(t.grand);
}

function renderQr(){
  const t=computeBill(); const amt=money(t.grand);
  const pa=state.shop.upi||''; const pn=state.shop.payee||state.shop.name||'Shop'; const tn=`Bill ${Date.now()}`;
  const box=$('#qrBox'); box.innerHTML='';
  if(!(t.grand>0)) { $('#qrMeta').textContent='Add items to generate QR.'; return; }
  if(!pa){ $('#qrMeta').textContent='Set Shop UPI ID in Shop tab to generate a payable QR. Showing amount only.'; box.textContent='No UPI ID'; drawBillCanvas(); return; }
  const url=`upi://pay?pa=${encodeURIComponent(pa)}&pn=${encodeURIComponent(pn)}&am=${encodeURIComponent(amt)}&cu=INR&tn=${encodeURIComponent(tn)}`;
  try {
    const qr = SimpleQR.generate(url);
    const c=document.createElement('canvas'); SimpleQR.toCanvas(qr,c,4,4); box.appendChild(c);
    $('#qrMeta').textContent=`UPI: ${pa} · Amount: ₹ ${amt}`;
  } catch(e){ box.textContent='QR error'; $('#qrMeta').textContent=String(e.message||e); }
  drawBillCanvas();
}

function drawBillCanvas(billOverride){
  const c=$('#billCanvas'); const ctx=c.getContext('2d');
  const W=c.width, H=c.height; ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
  const shop=state.shop; const lines=billOverride?billOverride.lines:state.current.lines; const t=billOverride?billOverride.totals:computeBill();
  let y=40; ctx.fillStyle='#111'; ctx.textAlign='center'; ctx.font='bold 28px Arial'; ctx.fillText(shop.name||'Bill', W/2, y); y+=28;
  ctx.font='16px Arial'; ctx.fillStyle='#444'; if(shop.addr) {ctx.fillText(shop.addr, W/2, y); y+=22;}
  ctx.textAlign='left'; ctx.fillStyle='#111'; ctx.font='14px Arial';
  const when = billOverride? billOverride.date : new Date().toLocaleString();
  const num = billOverride? billOverride.number : '(unsaved)';
  ctx.fillText(`Bill: ${num}`, 40, y); ctx.fillText(`Date: ${when}`, 360, y); y+=16;
  ctx.strokeStyle='#ccc'; ctx.beginPath(); ctx.moveTo(40,y); ctx.lineTo(W-40,y); ctx.stroke(); y+=22;
  ctx.font='bold 14px Arial'; ctx.fillText('Item',40,y); ctx.fillText('Qty',300,y); ctx.fillText('Price',360,y); ctx.fillText('Total',560,y); y+=10;
  ctx.beginPath(); ctx.moveTo(40,y); ctx.lineTo(W-40,y); ctx.stroke(); y+=18; ctx.font='14px Arial';
  lines.forEach(l=>{ const cpt=billOverride?l.net:computeLine(l).total; const lineTxt=`${l.name} (D${Number(l.disc)||0}% T${Number(l.tax)||0}%)`;
    ctx.fillText(lineTxt.slice(0,28),40,y); ctx.fillText(String(l.qty),300,y); ctx.fillText(money(l.price),360,y); ctx.fillText(money(cpt),560,y); y+=22; if(y>H-220){y=H-220;} });
  y+=6; ctx.beginPath(); ctx.moveTo(40,y); ctx.lineTo(W-40,y); ctx.stroke(); y+=22;
  ctx.font='15px Arial'; ctx.fillText(`Subtotal: ₹ ${money(t.sub)}`,420,y); y+=20; ctx.fillText(`Discount: ₹ ${money(t.disc)}`,420,y); y+=20; ctx.fillText(`Tax: ₹ ${money(t.tax)}`,420,y); y+=24;
  ctx.font='bold 18px Arial'; ctx.fillText(`Grand Total: ₹ ${money(t.grand)}`,420,y); y+=30;
  // include QR if present
  const qrCanvas = $('#qrBox canvas');
  if(qrCanvas){ ctx.font='14px Arial'; ctx.fillStyle='#333'; ctx.fillText('Scan to pay (UPI)', 40, y); ctx.drawImage(qrCanvas, 40, y+8, 160,160); ctx.fillText(`Amount: ₹ ${money(t.grand)}`, 220, y+40); ctx.fillText(shop.upi||'', 220, y+62); }
}

function saveBill(){
  const t=computeBill(); if(!(t.grand>0) || !state.current.lines.length){ alert('Add at least one item.'); return; }
  const bill = { number: '#' + (100 + state.bills.length + 1), date: new Date().toLocaleString(), day: todayStr(), shop:{...state.shop}, lines: state.current.lines.map(l=>({...l, net: computeLine(l).total})), totals: t };
  state.bills.unshift(bill); state.current={lines:[]}; saveState(); renderBill(); renderHistory(); renderQr(); alert('Bill saved: '+bill.number);
}

function renderHistory(){
  const list=$('#historyList'); list.innerHTML='';
  const today=todayStr(); const todaySum=state.bills.filter(b=>b.day===today).reduce((s,b)=>s+b.totals.grand,0);
  $('#todayTotal').textContent=money(todaySum); $('#todayDate').textContent=today;
  if(!state.bills.length){ list.innerHTML='<div class="meta">No bills yet.</div>'; return; }
  state.bills.forEach(b=>{
    const d=document.createElement('div'); d.className='bill';
    d.innerHTML=`<div class="row wrap" style="justify-content:space-between"><strong>${b.number}</strong><span>${esc(b.date)}</span><span class="grand">₹ ${money(b.totals.grand)}</span></div>
      <div class="meta">${b.lines.map(l=>`${esc(l.name)} x${l.qty}`).join(', ')}</div>
      <div class="row"><button class="view" data-n="${b.number}">View</button></div>`;
    d.querySelector('.view').onclick=()=>{ drawBillCanvas(b); renderQrForBill(b); document.querySelector('[data-tab="billing"]').click(); window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'}); };
    list.appendChild(d);
  });
}
function renderQrForBill(b){
  const box=$('#qrBox'); box.innerHTML=''; const pa=b.shop.upi||''; const amt=money(b.totals.grand);
  if(pa){ try{ const qr=SimpleQR.generate(`upi://pay?pa=${encodeURIComponent(pa)}&pn=${encodeURIComponent(b.shop.payee||b.shop.name||'Shop')}&am=${encodeURIComponent(amt)}&cu=INR&tn=${encodeURIComponent('Bill '+b.number)}`); const c=document.createElement('canvas'); SimpleQR.toCanvas(qr,c,4,4); box.appendChild(c); $('#qrMeta').textContent=`UPI: ${pa} · Amount: ₹ ${amt}`; }catch(e){$('#qrMeta').textContent=String(e);} }
  else { $('#qrMeta').textContent='No UPI ID on this bill.'; }
}

async function shareBillImage(){
  drawBillCanvas(); const canvas=$('#billCanvas');
  const blob = await new Promise(res=>canvas.toBlob(res,'image/png'));
  const file = new File([blob], 'bill.png', {type:'image/png'});
  if(navigator.canShare && navigator.canShare({files:[file]})){
    try { await navigator.share({files:[file], title:'Bill', text:'Bill image'}); return; } catch(e) { /* fallback */ }
  }
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='bill.png'; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1500);
}

function esc(s){ return String(s||'').replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c])); }

init();

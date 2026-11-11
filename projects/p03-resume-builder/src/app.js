// Resume Builder - offline, client-side
const SECTION_DEFS = [
  { id: 'summary', label: 'Summary', enabled: true },
  { id: 'experience', label: 'Experience', enabled: true },
  { id: 'education', label: 'Education', enabled: true },
  { id: 'projects', label: 'Projects', enabled: true },
  { id: 'skills', label: 'Skills', enabled: true },
  { id: 'achievements', label: 'Achievements', enabled: true },
];

const state = {
  template: 'classic',
  sectionOrder: SECTION_DEFS.map(s => ({...s})),
  personal: { name:'', title:'', email:'', phone:'', location:'', links:'' },
  summary: '',
  experience: [],
  education: [],
  projects: [],
  skills: '',
  achievements: '',
};

const $ = id => document.getElementById(id);
const els = {
  templateSelect: $('templateSelect'), sectionOrder: $('sectionOrder'),
  name:$('name'), title:$('title'), email:$('email'), phone:$('phone'), location:$('location'), links:$('links'),
  summary:$('summary'), skills:$('skills'), achievements:$('achievements'),
  experienceList:$('experienceList'), educationList:$('educationList'), projectsList:$('projectsList'),
  resumePage:$('resumePage'), saveJson:$('saveJson'), loadJson:$('loadJson'), exportPdf:$('exportPdf')
};

function uid(){ return Math.random().toString(36).slice(2,9); }
function esc(s){ return String(s||'').replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c])); }
function lines(s){ return String(s||'').split(/\n+/).map(x=>x.trim()).filter(Boolean); }
function skillsList(s){ return String(s||'').split(/[,\n]+/).map(x=>x.trim()).filter(Boolean); }

function defaultItem(type){
  if(type==='experience') return {id:uid(), role:'', company:'', date:'', details:''};
  if(type==='education') return {id:uid(), degree:'', school:'', date:'', details:''};
  if(type==='projects') return {id:uid(), name:'', link:'', date:'', details:''};
  return {id:uid()};
}

function ensureAtLeastOne(){
  ['experience','education','projects'].forEach(t=>{ if(!state[t].length) state[t].push(defaultItem(t)); });
}

function bindPersonal(){
  ['name','title','email','phone','location','links'].forEach(k=>{
    els[k].value = state.personal[k] || '';
    els[k].oninput = e=>{ state.personal[k]=e.target.value; render(); };
  });
  ['summary','skills','achievements'].forEach(k=>{
    els[k].value = state[k] || '';
    els[k].oninput = e=>{ state[k]=e.target.value; render(); };
  });
}

function renderRepeat(type, container, fields){
  container.innerHTML='';
  state[type].forEach((item, idx)=>{
    const wrap=document.createElement('div'); wrap.className='repeat-item';
    fields.forEach(f=>{
      const label=document.createElement('label'); label.textContent=f.label;
      const input = f.multiline ? document.createElement('textarea') : document.createElement('input');
      if(f.multiline){ input.rows=3; } else { input.type='text'; }
      input.value = item[f.key] || '';
      input.placeholder = f.ph||'';
      input.oninput = e=>{ item[f.key]=e.target.value; render(); };
      label.appendChild(input);
      if(f.row){ /* handled below */ }
      wrap.appendChild(label);
    });
    const rm=document.createElement('button'); rm.type='button'; rm.className='small remove'; rm.textContent='Remove';
    rm.onclick=()=>{ state[type]=state[type].filter(x=>x.id!==item.id); if(!state[type].length) state[type].push(defaultItem(type)); renderRepeat(type,container,fields); render(); };
    wrap.appendChild(rm);
    container.appendChild(wrap);
  });
}
function renderAllRepeats(){
  renderRepeat('experience', els.experienceList, [
    {key:'role',label:'Role',ph:'Software Intern'},{key:'company',label:'Company',ph:'Company Name'},
    {key:'date',label:'Dates',ph:'Jun 2025 - Aug 2025'},{key:'details',label:'Details (one per line)',ph:'Built...\nImproved...',multiline:true}
  ]);
  renderRepeat('education', els.educationList, [
    {key:'degree',label:'Degree',ph:'B.Tech in CSE'},{key:'school',label:'School/University',ph:'Institute Name'},
    {key:'date',label:'Dates',ph:'2023 - 2027'},{key:'details',label:'Details (optional)',ph:'CGPA, coursework...',multiline:true}
  ]);
  renderRepeat('projects', els.projectsList, [
    {key:'name',label:'Project name',ph:'PDF Studio'},{key:'link',label:'Link (optional)',ph:'github.com/...'},
    {key:'date',label:'Date/Stack',ph:'2026 · JS, Canvas'},{key:'details',label:'Details (one per line)',ph:'What you built...',multiline:true}
  ]);
}

function renderOrder(){
  els.sectionOrder.innerHTML='';
  state.sectionOrder.forEach((sec, idx)=>{
    const li=document.createElement('li'); li.className='order-item'; li.draggable=true; li.dataset.id=sec.id;
    li.innerHTML = `<span class="name">${esc(sec.label)}</span><label><input type="checkbox" ${sec.enabled?'checked':''}> show</label>`;
    const cb=li.querySelector('input'); cb.onchange=e=>{ sec.enabled=e.target.checked; render(); };
    li.addEventListener('dragstart', e=>{ li.classList.add('dragging'); e.dataTransfer.setData('text/plain', sec.id); });
    li.addEventListener('dragend', ()=>li.classList.remove('dragging'));
    li.addEventListener('dragover', e=>{ e.preventDefault(); });
    li.addEventListener('drop', e=>{ e.preventDefault(); const from=e.dataTransfer.getData('text/plain'); const to=sec.id; if(from===to) return; const a=state.sectionOrder.findIndex(s=>s.id===from), b=state.sectionOrder.findIndex(s=>s.id===to); const [m]=state.sectionOrder.splice(a,1); state.sectionOrder.splice(b,0,m); renderOrder(); render(); });
    els.sectionOrder.appendChild(li);
  });
}

function contactLine(p){
  return [p.email,p.phone,p.location,p.links].map(x=>String(x||'').trim()).filter(Boolean);
}

function renderSection(id){
  if(id==='summary'){
    const t=state.summary.trim(); if(!t) return '';
    return `<section class="sec"><h2>Summary</h2><p>${esc(t)}</p></section>`;
  }
  if(id==='experience'){
    const items=state.experience.filter(i=>i.role||i.company||i.details);
    if(!items.length) return '';
    return `<section class="sec"><h2>Experience</h2>${items.map(i=>`<div class="entry"><div class="entry-head"><span>${esc(i.role||'Role')}${i.company?` · ${esc(i.company)}`:''}</span><span class="muted">${esc(i.date||'')}</span></div>${detailBlock(i.details)}</div>`).join('')}</section>`;
  }
  if(id==='education'){
    const items=state.education.filter(i=>i.degree||i.school||i.details);
    if(!items.length) return '';
    return `<section class="sec"><h2>Education</h2>${items.map(i=>`<div class="entry"><div class="entry-head"><span>${esc(i.degree||'Degree')}${i.school?` · ${esc(i.school)}`:''}</span><span class="muted">${esc(i.date||'')}</span></div>${detailBlock(i.details)}</div>`).join('')}</section>`;
  }
  if(id==='projects'){
    const items=state.projects.filter(i=>i.name||i.details);
    if(!items.length) return '';
    return `<section class="sec"><h2>Projects</h2>${items.map(i=>`<div class="entry"><div class="entry-head"><span>${esc(i.name||'Project')}${i.link?` · ${esc(i.link)}`:''}</span><span class="muted">${esc(i.date||'')}</span></div>${detailBlock(i.details)}</div>`).join('')}</section>`;
  }
  if(id==='skills'){
    const list=skillsList(state.skills); if(!list.length) return '';
    return `<section class="sec"><h2>Skills</h2><p>${list.map(esc).join(' · ')}</p></section>`;
  }
  if(id==='achievements'){
    const l=lines(state.achievements); if(!l.length) return '';
    return `<section class="sec"><h2>Achievements</h2><ul>${l.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section>`;
  }
  return '';
}
function detailBlock(text){
  const l=lines(text); if(!l.length) return '';
  if(l.length===1) return `<p>${esc(l[0])}</p>`;
  return `<ul>${l.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
}

function render(){
  const p=state.personal; const contacts=contactLine(p);
  const sections = state.sectionOrder.filter(s=>s.enabled).map(s=>renderSection(s.id)).filter(Boolean).join('');
  const page=els.resumePage;
  page.className = `resume template-${state.template}`;
  if(state.template==='modern'){
    const sideSecs = state.sectionOrder.filter(s=>s.enabled && (s.id==='skills'||s.id==='achievements'||s.id==='summary')).map(s=>renderSection(s.id)).join('');
    const mainSecs = state.sectionOrder.filter(s=>s.enabled && !(s.id==='skills'||s.id==='achievements'||s.id==='summary')).map(s=>renderSection(s.id)).join('');
    page.innerHTML = `
      <aside class="side">
        <div class="r-header"><h1>${esc(p.name||'Your Name')}</h1><div class="title">${esc(p.title||'')}</div></div>
        <section class="sec"><h2>Contact</h2><div class="contact">${contacts.map(c=>`<div>${esc(c)}</div>`).join('')||'<div class="muted">Add contact details</div>'}</div></section>
        ${sideSecs}
      </aside>
      <div class="main">${mainSecs || '<p class="muted">Add experience, education, or projects.</p>'}</div>`;
  } else if(state.template==='minimal'){
    page.innerHTML = `
      <header class="r-header"><div><h1>${esc(p.name||'Your Name')}</h1><div class="muted">${esc(p.title||'')}</div></div>
      <div class="contact">${contacts.map(esc).join('<br>')}</div></header>
      ${sections || '<p class="muted">Start filling the form to see your resume.</p>'}`;
  } else { // classic
    page.innerHTML = `
      <header class="r-header"><h1>${esc(p.name||'Your Name')}</h1><div class="muted">${esc(p.title||'')}</div>
      <div class="contact">${contacts.map(esc).join(' | ')}</div></header>
      ${sections || '<p class="muted">Start filling the form to see your resume.</p>'}`;
  }
}

function collect(){ return JSON.parse(JSON.stringify(state)); }
function applyData(data){
  if(!data || typeof data!=='object') return;
  if(data.template) state.template=data.template;
  if(Array.isArray(data.sectionOrder)){
    const byId = new Map(data.sectionOrder.map(s=>[s.id,s]));
    state.sectionOrder = SECTION_DEFS.map(d=>({id:d.id,label:d.label,enabled: byId.has(d.id)?!!byId.get(d.id).enabled:d.enabled}));
    // include any unknown? ignore; keep stable set
  }
  if(data.personal) state.personal = {...state.personal, ...data.personal};
  ['summary','skills','achievements'].forEach(k=>{ if(typeof data[k]==='string') state[k]=data[k]; });
  ['experience','education','projects'].forEach(k=>{ if(Array.isArray(data[k])) state[k]=data[k].map(x=>({...defaultItem(k), ...x, id:x.id||uid()})); });
  ensureAtLeastOne();
}

function saveJson(){
  const blob=new Blob([JSON.stringify(collect(), null, 2)], {type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='resume-data.json'; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1500);
}
async function loadJsonFile(file){
  const text = await file.text(); const data = JSON.parse(text); applyData(data); hydrateUI();
}
function hydrateUI(){
  els.templateSelect.value = state.template;
  bindPersonal(); renderAllRepeats(); renderOrder(); render();
}

els.templateSelect.onchange = e=>{ state.template=e.target.value; render(); };
els.saveJson.onclick = saveJson;
els.loadJson.onchange = async e=>{ const f=e.target.files[0]; if(f){ try{ await loadJsonFile(f);}catch(err){ alert('Could not load JSON: '+err.message);} e.target.value=''; } };
els.exportPdf.onclick = ()=>{ render(); window.print(); };
document.querySelectorAll('button.add').forEach(btn=> btn.onclick=()=>{ const t=btn.dataset.add; state[t].push(defaultItem(t)); renderAllRepeats(); render(); });

// init sample-ish empty state
ensureAtLeastOne();
hydrateUI();

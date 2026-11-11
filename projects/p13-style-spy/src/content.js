(() => {
  function rgbToHex(rgb){
    const m = rgb && rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
    if(!m) return null; const a = m[4]===undefined?1:parseFloat(m[4]); if(a===0) return null;
    const h = n => ('0'+parseInt(n,10).toString(16)).slice(-2);
    return '#' + h(m[1]) + h(m[2]) + h(m[3]);
  }
  function add(map, key, weight, extra){ if(!key) return; const k=key.toLowerCase(); if(!map.has(k)) map.set(k,{value:key, weight:0, extra:extra||{}}); const e=map.get(k); e.weight += (weight||1); }
  function isVisible(el){
    const r = el.getBoundingClientRect(); if(r.width<=0||r.height<=0) return false;
    const s = getComputedStyle(el); if(s.display==='none'||s.visibility==='hidden'||parseFloat(s.opacity)===0) return false; return true;
  }
  const colors = new Map(); const fonts = new Map();
  const els = Array.from(document.querySelectorAll('body, body *')).slice(0, 2500);
  for(const el of els){
    let vis=false, r; try{ vis=isVisible(el); r=el.getBoundingClientRect(); }catch{ continue; }
    if(!vis) continue; const area = Math.max(1, Math.min(r.width*r.height, 200000));
    const w = 1 + Math.log10(area); // weight by usage/area
    let s; try{ s=getComputedStyle(el); }catch{ continue; }
    ['color','backgroundColor','borderTopColor','borderBottomColor','borderLeftColor','borderRightColor'].forEach(p=> add(colors, rgbToHex(s[p]), w, {prop:p}));
    try{ const fill=rgbToHex(s.fill); const stroke=rgbToHex(s.stroke); add(colors, fill, w*0.5, {prop:'fill'}); add(colors, stroke, w*0.5, {prop:'stroke'});}catch{}
    const fam = (s.fontFamily||'').split(',')[0].replace(/["']/g,'').trim();
    const key = [fam, s.fontWeight, s.fontSize].join('|');
    if(fam){ const val=`${fam}`; if(!fonts.has(key)) fonts.set(key,{family:fam, weight:s.fontWeight, size:s.fontSize, weightN:0}); fonts.get(key).weightN += w; }
  }
  const colorList = Array.from(colors.values()).filter(x=>x.value).sort((a,b)=>b.weight-a.weight).slice(0,20).map(x=>({value:x.value, score:+x.weight.toFixed(2)}));
  const fontList = Array.from(fonts.values()).sort((a,b)=>b.weightN-a.weightN).slice(0,20).map(x=>({family:x.family, weight:x.weight, size:x.size, score:+x.weightN.toFixed(2)}));
  return { url: location.href, title: document.title, colors: colorList, fonts: fontList };
})();

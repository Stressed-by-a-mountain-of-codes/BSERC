(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const roadX = 70, roadW = W - 140;
  const player = { x: W/2, y: H - 140, w: 44, h: 64, vx: 0 };
  let state;
  const bestKey = 'autorally_best_ms';
  let best = Number(localStorage.getItem(bestKey)) || null;
  let muted = false, audioCtx = null;

  function beep(freq=440, dur=0.08, type='sine', vol=0.05){
    if(muted) return; try{ if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); const o=audioCtx.createOscillator(), g=audioCtx.createGain(); o.type=type; o.frequency.value=freq; g.gain.value=vol; o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime+dur);}catch(e){}
  }
  function fmt(ms){ if(ms==null) return '--'; const s=ms/1000; const m=Math.floor(s/60); const sec=(s%60).toFixed(1).padStart(4,'0'); return `${m}:${sec}`; }
  function reset(){
    state = {
      running:false, finished:false, t0:0, elapsed:0, laps:0, lapTarget:3,
      coins:0, shield:false, shieldUntil:0, slowUntil:0, invUntil:0,
      dist:0, speed:3.2, steer:0, objects:[], nextSpawn:200, finishDist:2200, crossed:0
    };
    player.x = W/2; player.vx=0;
    spawnInitial();
    updateHud();
  }
  function spawnInitial(){
    for(let d=300; d<state.finishDist*3.2; d+=140){ maybeSpawn(d); }
  }
  function maybeSpawn(d){
    const lanes = [roadX+roadW*0.25, roadX+roadW*0.5, roadX+roadW*0.75];
    const lane = lanes[Math.floor(Math.random()*lanes.length)];
    const r = Math.random();
    if(r < 0.35) state.objects.push({type:'coin', x:lane, d, r:12, hit:false});
    else if(r < 0.7) state.objects.push({type:'cone', x:lane, d, w:28, h:28, hit:false});
    else if(r < 0.82) state.objects.push({type:'shield', x:lane, d, r:14, hit:false});
  }
  function start(){
    if(audioCtx && audioCtx.state==='suspended') audioCtx.resume();
    reset(); state.running=true; state.t0=performance.now();
    document.getElementById('overlay').classList.remove('show');
    beep(660,0.08,'square'); beep(880,0.12,'square');
  }
  function endRace(){
    state.running=false; state.finished=true; const time=state.elapsed;
    if(best==null || time < best){ best=time; localStorage.setItem(bestKey,String(best)); beep(880,0.1); beep(1100,0.15); }
    const ov=document.getElementById('overlay'); ov.querySelector('h1').textContent='Race Finished!';
    ov.querySelector('p').textContent=`Time: ${fmt(time)} · Coins: ${state.coins}` + (time===best?' · New best!':'');
    ov.querySelector('ul').innerHTML = `<li>Best time: ${fmt(best)}</li><li>Tap Play to race again</li>`;
    ov.classList.add('show');
  }
  function updateHud(){
    document.getElementById('coins').textContent = state.coins;
    document.getElementById('lap').textContent = Math.min(state.laps+1, state.lapTarget);
    const t = state.running ? (performance.now()-state.t0) : state.elapsed;
    if(state.running) state.elapsed = t;
    document.getElementById('time').textContent = fmt(state.running? t : state.elapsed);
    document.getElementById('best').textContent = fmt(best);
  }

  function rectsOverlap(ax,ay,aw,ah,bx,by,bw,bh){ return ax<bx+bw && ax+aw>bx && ay<by+bh && ay+ah>by; }

  function update(now){
    if(!state.running) return;
    state.elapsed = now - state.t0;
    // speed progression and effects
    let spd = state.speed + Math.min(1.6, state.elapsed/60000*1.2);
    if(now < state.slowUntil) spd *= 0.45;
    state.dist += spd;
    // steering
    player.vx += state.steer * 0.9;
    player.vx *= 0.82;
    player.x += player.vx;
    player.x = Math.max(roadX+player.w/2, Math.min(roadX+roadW-player.w/2, player.x));
    // lap crossing
    const lapNow = Math.floor(state.dist / state.finishDist);
    if(lapNow > state.crossed){
      state.crossed = lapNow; state.laps = lapNow;
      if(state.laps < state.lapTarget){ beep(700,0.08); beep(900,0.1); }
    }
    if(state.laps >= state.lapTarget){ endRace(); return; }
    // collisions with visible objects
    const viewD = state.dist;
    for(const o of state.objects){
      if(o.hit) continue;
      const relY = H - 140 - (o.d - viewD); // object y relative
      if(relY < -60 || relY > H+60) continue;
      if(o.type==='coin'){
        const dx=player.x-o.x, dy=player.y-relY; if(dx*dx+dy*dy < (player.w*0.45 + o.r)*(player.w*0.45 + o.r)){ o.hit=true; state.coins++; beep(880,0.05,'triangle',0.04); }
      } else if(o.type==='shield'){
        const dx=player.x-o.x, dy=player.y-relY; if(dx*dx+dy*dy < (player.w*0.45 + o.r)*(player.w*0.45 + o.r)){ o.hit=true; state.shield=true; state.shieldUntil=now+6000; beep(520,0.07); beep(780,0.09); }
      } else if(o.type==='cone'){
        if(rectsOverlap(player.x-player.w/2, player.y-player.h/2, player.w, player.h, o.x-o.w/2, relY-o.h/2, o.w, o.h)){
          o.hit=true;
          if(state.shield && now < state.shieldUntil){ state.shield=false; state.invUntil=now+800; beep(300,0.08,'sawtooth'); }
          else if(now > state.invUntil){ state.slowUntil = now + 900; state.invUntil = now + 1200; beep(180,0.12,'sawtooth',0.06); }
        }
      }
    }
    if(state.shield && now > state.shieldUntil) state.shield=false;
    updateHud();
  }

  function drawRoad(now){
    ctx.fillStyle = '#4caf50'; ctx.fillRect(0,0,W,H);
    // road
    ctx.fillStyle = '#555'; ctx.fillRect(roadX,0,roadW,H);
    ctx.fillStyle = '#666'; ctx.fillRect(roadX+6,0,roadW-12,H);
    // edges
    ctx.strokeStyle='#fff'; ctx.lineWidth=4; ctx.strokeRect(roadX+2, -10, roadW-4, H+20);
    // dashed center
    ctx.strokeStyle='#ffd54f'; ctx.lineWidth=4; ctx.setLineDash([30,30]);
    const offset = (state? state.dist : 0) % 60;
    ctx.beginPath(); ctx.moveTo(W/2, -offset); ctx.lineTo(W/2, H+60); ctx.stroke(); ctx.setLineDash([]);
    // finish line marker when near
    if(state){
      for(let lap=1; lap<=state.lapTarget; lap++){
        const d = lap*state.finishDist; const relY = H - 140 - (d - state.dist);
        if(relY>-20 && relY<H+20){ drawFinish(relY, lap===state.lapTarget?'FINISH':'LAP '+lap); }
      }
    }
  }
  function drawFinish(y,label){
    for(let i=0;i<10;i++){ ctx.fillStyle = i%2? '#fff':'#111'; ctx.fillRect(roadX + i*(roadW/10), y-6, roadW/10, 12); }
    ctx.fillStyle='#fff'; ctx.font='bold 16px sans-serif'; ctx.textAlign='center'; ctx.fillText(label, W/2, y-12);
  }
  function drawObjects(){
    if(!state) return; const viewD=state.dist;
    for(const o of state.objects){ if(o.hit) continue; const relY = H - 140 - (o.d - viewD); if(relY<-40||relY>H+40) continue;
      if(o.type==='coin'){ ctx.beginPath(); ctx.fillStyle='#ffd54f'; ctx.arc(o.x,relY,o.r,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#b8860b'; ctx.font='bold 14px sans-serif'; ctx.textAlign='center'; ctx.fillText('₹',o.x,relY+5); }
      else if(o.type==='shield'){ ctx.beginPath(); ctx.fillStyle='#4fc3f7'; ctx.arc(o.x,relY,o.r,0,Math.PI*2); ctx.fill(); ctx.strokeStyle='#fff'; ctx.lineWidth=3; ctx.stroke(); ctx.fillStyle='#fff'; ctx.font='bold 12px sans-serif'; ctx.textAlign='center'; ctx.fillText('S',o.x,relY+4); }
      else if(o.type==='cone'){ ctx.fillStyle='#ff7043'; ctx.beginPath(); ctx.moveTo(o.x,relY-o.h/2); ctx.lineTo(o.x-o.w/2,relY+o.h/2); ctx.lineTo(o.x+o.w/2,relY+o.h/2); ctx.closePath(); ctx.fill(); ctx.fillStyle='#fff'; ctx.fillRect(o.x-o.w/3,relY-2,o.w*2/3,5); }
    }
  }
  function drawPlayer(now){
    const blink = now < (state?.invUntil||0) && Math.floor(now/100)%2===0;
    if(blink) return;
    const x=player.x, y=player.y;
    ctx.save(); ctx.translate(x,y);
    // auto-rickshaw body
    ctx.fillStyle = '#ffd54f'; ctx.beginPath(); ctx.roundRect(-20,-28,40,50,8); ctx.fill();
    ctx.fillStyle = '#81d4fa'; ctx.fillRect(-14,-22,28,16); // windshield
    ctx.fillStyle = '#333'; ctx.fillRect(-22,18,12,8); ctx.fillRect(10,18,12,8); // wheels
    ctx.fillStyle = '#2e7d32'; ctx.fillRect(-18,8,36,8); // stripe
    if(state && state.shield && now < state.shieldUntil){ ctx.strokeStyle='rgba(79,195,247,0.9)'; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(0,0,34,0,Math.PI*2); ctx.stroke(); }
    ctx.restore();
  }

  function loop(now){ drawRoad(now); drawObjects(); drawPlayer(now); update(now); requestAnimationFrame(loop); }

  // controls
  function setSteer(v){ if(state) state.steer=v; }
  window.addEventListener('keydown', e=>{ if(e.key==='ArrowLeft') setSteer(-1); if(e.key==='ArrowRight') setSteer(1); if(e.key===' '&&!state?.running) start(); });
  window.addEventListener('keyup', e=>{ if((e.key==='ArrowLeft'&&state?.steer<0)||(e.key==='ArrowRight'&&state?.steer>0)) setSteer(0); });
  const bindHold=(el,dir)=>{ const on=ev=>{ev.preventDefault(); setSteer(dir);}; const off=ev=>{ev.preventDefault(); if(state && Math.sign(state.steer)===Math.sign(dir)) setSteer(0);}; ['pointerdown','touchstart','mousedown'].forEach(ev=>el.addEventListener(ev,on)); ['pointerup','pointerleave','touchend','touchcancel','mouseup'].forEach(ev=>el.addEventListener(ev,off)); };
  bindHold(document.getElementById('leftBtn'), -1); bindHold(document.getElementById('rightBtn'), 1);
  document.getElementById('startBtn').onclick=start; document.getElementById('playBtn').onclick=start;
  document.getElementById('muteBtn').onclick=()=>{ muted=!muted; document.getElementById('muteBtn').textContent = muted?'🔇':'🔊'; };

  if('serviceWorker' in navigator){ navigator.serviceWorker.register('./sw.js').catch(()=>{}); }
  reset(); requestAnimationFrame(loop);
})();

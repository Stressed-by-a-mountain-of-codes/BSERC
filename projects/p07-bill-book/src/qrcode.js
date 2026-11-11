// Minimal QR Code generator (byte mode, ECC L, versions 1-10) for offline UPI strings.
// Based on standard QR model tables. Generates SVG/canvas.
(function(global){
  const EXP=new Array(512), LOG=new Array(256);
  (function(){let x=1;for(let i=0;i<255;i++){EXP[i]=x;LOG[x]=i;x<<=1;if(x&0x100)x^=0x11d;}for(let i=255;i<512;i++)EXP[i]=EXP[i-255];})();
  function mul(a,b){return a&&b?EXP[LOG[a]+LOG[b]]:0;}
  function polyMul(p,q){const r=new Array(p.length+q.length-1).fill(0);for(let i=0;i<p.length;i++)for(let j=0;j<q.length;j++)r[i+j]^=mul(p[i],q[j]);return r;}
  function polyRest(num,den){let r=num.slice();while(r.length>=den.length){if(r[0]!==0){const f=r[0];for(let i=0;i<den.length;i++)r[i]^=mul(den[i],f);}r.shift();}return r;}
  function rsGen(ec){let g=[1];for(let i=0;i<ec;i++){let p=[1];let x=1;for(let j=0;j<i;j++)x=mul(x,2);p.push(EXP[i]);g=polyMul(g,p);}return g;}
  // version info for L: [totalCodewords, ecPerBlock, blocksG1, dataG1, blocksG2, dataG2]
  const V=[
    null,
    [26,7,1,19,0,0],[44,10,1,34,0,0],[70,15,1,55,0,0],[100,20,1,80,0,0],
    [134,26,1,108,0,0],[172,18,2,68,0,0],[196,20,2,78,0,0],[242,24,2,97,0,0],
    [292,30,2,116,0,0],[346,18,2,68,2,69]
  ];
  const ALIGN=[null,[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50]];
  function fitVersion(bytes){for(let v=1;v<=10;v++){const cap=(V[v][2]*V[v][3]+V[v][4]*V[v][5]);if(bytes.length+3<=cap) return v;}throw new Error('Data too long');}
  function makeBytes(data,ver){const vi=V[ver];const dataCap=vi[2]*vi[3]+vi[4]*vi[5];let bits=[];
    function put(val,len){for(let i=len-1;i>=0;i--)bits.push((val>>>i)&1);}
    put(0b0100,4); // byte mode
    put(data.length, ver<10?8:16);
    for(let i=0;i<data.length;i++) put(data[i],8);
    put(0,4); // terminator (as much as fits)
    while(bits.length%8) bits.push(0);
    const bytes=[]; for(let i=0;i+7<bits.length;i+=8){let b=0;for(let j=0;j<8;j++)b=(b<<1)|bits[i+j];bytes.push(b);}
    const pad=[0xec,0x11]; let pi=0; while(bytes.length<dataCap) bytes.push(pad[pi++%2]);
    // blocks
    const blocks=[]; let off=0; const groups=[[vi[2],vi[3]],[vi[4],vi[5]]];
    for(const g of groups){for(let i=0;i<g[0];i++){blocks.push(bytes.slice(off,off+g[1])); off+=g[1];}}
    const ecBlocks=blocks.map(b=>polyRest(b.concat(new Array(vi[1]).fill(0)), rsGen(vi[1])));
    const res=[]; const maxD=Math.max(...blocks.map(b=>b.length));
    for(let i=0;i<maxD;i++) for(const b of blocks) if(i<b.length) res.push(b[i]);
    for(let i=0;i<vi[1];i++) for(const b of ecBlocks) res.push(b[i]);
    return res;
  }
  function createMatrix(ver){const n=ver*4+17;const m=Array.from({length:n},()=>Array(n).fill(null));const rsv=Array.from({length:n},()=>Array(n).fill(false));
    function set(x,y,v,res){if(x<0||y<0||x>=n||y>=n) return; m[y][x]=v; rsv[y][x]=!!res;}
    function box(x,y,s,v){for(let j=0;j<s;j++)for(let i=0;i<s;i++)set(x+i,y+j,v,true);}
    function finder(x,y){box(x,y,7,1);box(x+1,y+1,5,0);box(x+2,y+2,3,1);for(let i=0;i<8;i++){set(x+7,y+i,0,true);set(x+i,y+7,0,true);if(y>0)set(x+i,y-1,0,true);if(x>0)set(x-1,y+i,0,true);}set(x+7,y+7,0,true);if(y>0)set(x+7,y-1,0,true);if(x>0)set(x-1,y+7,0,true);}
    finder(0,0);finder(n-7,0);finder(0,n-7);
    // separators/format areas already partly set; reserve format
    for(let i=0;i<8;i++){if(m[8][i]==null)set(i,8,0,true);if(m[8][n-1-i]==null)set(n-1-i,8,0,true);if(m[i][8]==null)set(8,i,0,true);if(m[n-1-i][8]==null)set(8,n-1-i,0,true);} set(8,8,1,true); set(8,n-8,1,true);
    // timing
    for(let i=8;i<n-8;i++){if(m[6][i]==null)set(i,6,i%2===0?1:0,true); if(m[i][6]==null)set(6,i,i%2===0?1:0,true);}    
    // alignment
    const pos=ALIGN[ver]; for(let i=0;i<pos.length;i++)for(let j=0;j<pos.length;j++){const x=pos[j],y=pos[i];
      if((x<7&&y<7)||(x>n-8&&y<7)||(x<7&&y>n-8)) continue; for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const v=(Math.max(Math.abs(dx),Math.abs(dy))!==1)?1:0; set(x+dx,y+dy,v,true);} }
    // version info for 7-10
    if(ver>=7){const vs=verInfo(ver); for(let i=0;i<18;i++){const bit=(vs>>i)&1; set(Math.floor(i/3), n-11 + i%3, bit,true); set(n-11 + i%3, Math.floor(i/3), bit,true);}}
    return {m,rsv,n};
  }
  function bchDigit(d){let c=0; while(d!==0){c++; d>>>=1;} return c;}
  function bchEncode(data,poly,bits){let d=data<<(bits-bchDigit(poly)); while(bchDigit(d)>=bchDigit(poly)) d^=poly<<(bchDigit(d)-bchDigit(poly)); return (data<<(bits-bchDigit(poly)))|d;}
  function fmtBits(mask){const data=(0b01<<3)|mask; let b=bchEncode(data,0x537,10)^0x5412; return b;}
  function verInfo(ver){return bchEncode(ver,0x1f25,12);}
  function place(data,mat){let {m,rsv,n}=mat; let i=0, dir=-1, x=n-1, y=n-1; while(x>0){if(x===6) x--; while(y>=0 && y<n){for(let k=0;k<2;k++){const xx=x-k; if(!rsv[y][xx]){m[y][xx]=(i<data.length*8)?((data[Math.floor(i/8)]>>>(7-i%8))&1):0; i++;}} y+=dir;} dir=-dir; y+=dir; x-=2;} return mat;}
  function maskMat(mat,mask){const n=mat.n; const out=mat.m.map(r=>r.slice()); for(let y=0;y<n;y++)for(let x=0;x<n;x++) if(!mat.rsv[y][x]){let c=false; switch(mask){case 0:c=(x+y)%2===0;break;case 1:c=y%2===0;break;case 2:c=x%3===0;break;case 3:c=(x+y)%3===0;break;case 4:c=(Math.floor(y/2)+Math.floor(x/3))%2===0;break;case 5:c=((x*y)%2 + (x*y)%3)===0;break;case 6:c=(((x*y)%2 + (x*y)%3)%2)===0;break;case 7:c=(((x+y)%2 + (x*y)%3)%2)===0;break;} if(c) out[y][x]^=1; } return out;}
  function applyFormat(out,mat,mask){const n=mat.n; const bits=fmtBits(mask); function b(i){return (bits>>i)&1;}
    const coords1=[[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[7,8],[8,8],[8,7],[8,5],[8,4],[8,3],[8,2],[8,1],[8,0]];
    const coords2=[[8,n-1],[8,n-2],[8,n-3],[8,n-4],[8,n-5],[8,n-6],[8,n-7],[n-8,8],[n-7,8],[n-6,8],[n-5,8],[n-4,8],[n-3,8],[n-2,8],[n-1,8]];
    for(let i=0;i<15;i++){out[coords1[i][1]][coords1[i][0]]=b(14-i); out[coords2[i][1]][coords2[i][0]]=b(14-i);} return out;
  }
  function penalty(m){const n=m.length; let p=0; // N1
    for(let y=0;y<n;y++){let run=1; for(let x=1;x<n;x++){if(m[y][x]===m[y][x-1]){run++; if(run===5)p+=3; else if(run>5)p++;} else run=1;}}
    for(let x=0;x<n;x++){let run=1; for(let y=1;y<n;y++){if(m[y][x]===m[y-1][x]){run++; if(run===5)p+=3; else if(run>5)p++;} else run=1;}}
    // N3
    const pat1=[1,0,1,1,1,0,1,0,0,0,0], pat2=[0,0,0,0,1,0,1,1,1,0,1];
    for(let y=0;y<n;y++) for(let x=0;x<=n-11;x++){let ok1=true,ok2=true; for(let k=0;k<11;k++){if(m[y][x+k]!==pat1[k])ok1=false; if(m[y][x+k]!==pat2[k])ok2=false;} if(ok1||ok2)p+=40;}
    for(let x=0;x<n;x++) for(let y=0;y<=n-11;y++){let ok1=true,ok2=true; for(let k=0;k<11;k++){if(m[y+k][x]!==pat1[k])ok1=false; if(m[y+k][x]!==pat2[k])ok2=false;} if(ok1||ok2)p+=40;}
    // N4
    let dark=0; for(let y=0;y<n;y++) for(let x=0;x<n;x++) if(m[y][x]) dark++; const pct=dark*100/(n*n); const k=Math.floor(Math.abs(pct-50)/5); p+=k*10; return p;
  }
  function utf8Bytes(str){if(global.TextEncoder) return Array.from(new TextEncoder().encode(str)); const s=unescape(encodeURIComponent(str)); const a=[]; for(let i=0;i<s.length;i++) a.push(s.charCodeAt(i)); return a;}
  function generate(text){const bytes=utf8Bytes(text); const ver=fitVersion(bytes); const data=makeBytes(bytes,ver); let mat=createMatrix(ver); mat=place(data,mat);
    let best=null, bestP=1e9; for(let mask=0;mask<8;mask++){let out=maskMat(mat,mask); out=applyFormat(out,mat,mask); const p=penalty(out); if(p<bestP){bestP=p; best=out;}} return {modules:best, size:best.length, version:ver}; }
  function toCanvas(qr, canvas, scale=4, margin=4){const n=qr.size; const s=scale; canvas.width=canvas.height=(n+margin*2)*s; const ctx=canvas.getContext('2d'); ctx.fillStyle='#fff'; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.fillStyle='#000'; for(let y=0;y<n;y++)for(let x=0;x<n;x++) if(qr.modules[y][x]) ctx.fillRect((x+margin)*s,(y+margin)*s,s,s); return canvas;}
  global.SimpleQR = { generate, toCanvas };
})(typeof window!=='undefined'?window:globalThis);

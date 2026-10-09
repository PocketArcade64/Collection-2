const fs=require('fs');eval(fs.readFileSync(__dirname+'/../src/mux.js','utf8').replace(/^const Mux =/m,'global.Mux ='));
const h=fs.readFileSync('/tmp/t.h264'); const nals=[]; let i=0;
const sc=j=>h[j]===0&&h[j+1]===0&&(h[j+2]===1||(h[j+2]===0&&h[j+3]===1));
let starts=[];for(let j=0;j<h.length-4;j++){if(h[j]===0&&h[j+1]===0&&h[j+2]===1){starts.push([j+3, j>0&&h[j-1]===0?j-1:j]);j+=2;}}
for(let k=0;k<starts.length;k++){const s=starts[k][0],e=k+1<starts.length?starts[k+1][1]:h.length;nals.push(h.subarray(s,e));}
let sps,pps,aus=[],cur=null;
for(const n of nals){const t=n[0]&31;if(t===9){if(cur&&cur.n.length)aus.push(cur);cur={n:[],key:false};continue;}if(t===7){sps=n;continue;}if(t===8){pps=n;continue;}if(!cur)cur={n:[],key:false};if(t===5)cur.key=true;cur.n.push(n);}
if(cur&&cur.n.length)aus.push(cur);
const lp=au=>{const sz=au.n.reduce((s,n)=>s+4+n.length,0),o=new Uint8Array(sz);let p=0;for(const n of au.n){new DataView(o.buffer).setUint32(p,n.length);o.set(n,p+4);p+=4+n.length;}return o;};
const avcC=new Uint8Array([1,sps[1],sps[2],sps[3],0xff,0xe1,sps.length>>8,sps.length&255,...sps,1,pps.length>>8,pps.length&255,...pps]);
const video={kind:'video',codec:'avc',width:320,height:240,timescale:30000,description:avcC,samples:aus.map(a=>({data:lp(a),dur:1000,key:a.key}))};
// AAC
const a=fs.readFileSync('/tmp/t.aac');const frames=[];let asc=null;for(let p=0;p<a.length;){const len=((a[p+3]&3)<<11)|(a[p+4]<<3)|(a[p+5]>>5);const r=Mux.adts(a.subarray(p,p+len));asc=asc||r.asc;frames.push({data:r.payload,dur:1024});p+=len;}
const aac={kind:'audio',codec:'aac',sampleRate:48000,channels:2,timescale:48000,asc,samples:frames};
fs.writeFileSync('/tmp/m_aac.mp4',Mux.build([video,aac]));
const n=48000*3,pcm=new Int16Array(n*2);for(let k=0;k<n;k++){pcm[2*k]=pcm[2*k+1]=Math.round(Math.sin(2*Math.PI*440*k/48000)*12000);}
const pa={kind:'audio',codec:'pcm',sampleRate:48000,channels:2,pcm};
const video2={...video};fs.writeFileSync('/tmp/m_pcm.mp4',Mux.build([video2,pa]));
console.log('aus',aus.length,'aac frames',frames.length,'asc',Buffer.from(asc).toString('hex'));

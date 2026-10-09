global.document={createElement:()=>({getContext:()=>({})})};
const fs=require('fs');for(const f of ['util','story','rig','tex','world','audio'])eval(fs.readFileSync(__dirname+'/../src/'+f+'.js','utf8').replace(/^const (\w+) = \(\(\) =>/m,'global.$1 = (() =>'));
Rig.init(Story);
const st=Snd.render(); console.log(st);
const [L,R]=Snd.mixdown({music:1,fx:1,voice:1});
fs.writeFileSync('/tmp/mix.wav', Buffer.from(Snd.wav(L,R).arrayBuffer ? [] : []));
// write wav manually
const n=L.length,b=Buffer.alloc(44+n*4);b.write('RIFF',0);b.writeUInt32LE(36+n*4,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(2,22);b.writeUInt32LE(48000,24);b.writeUInt32LE(192000,28);b.writeUInt16LE(4,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(n*4,40);
for(let i=0;i<n;i++){b.writeInt16LE(Math.round(Math.max(-1,Math.min(1,L[i]))*32767),44+i*4);b.writeInt16LE(Math.round(Math.max(-1,Math.min(1,R[i]))*32767),46+i*4);}
fs.writeFileSync('/tmp/mix.wav',b);

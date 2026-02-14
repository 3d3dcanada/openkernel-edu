// @ts-nocheck
/* eslint-disable */
// EmojiOS Advanced Demo — Hexacore emoji OS with embedded apps
// Converted from 3d3d-emojios.jsx for integration with OpenKernel EDU

import { useState, useEffect, useRef, useCallback } from "react";

// ══════════════════════════════════════════════════════════════════════
//  🧠 EmojiOS™ v3.0 HEXACORE — Advanced OS Demo
//  ──────────────────────────────────────────────────────────────────
//  The World's First Emoji Operating System
//  Part of the OpenKernel Project
//  ──────────────────────────────────────────────────────────────────
//  "From the first electron to autonomous AI — all in emoji."
//  An OpenKernel Educational Demo
// ══════════════════════════════════════════════════════════════════════

const TICK = 380;
const PAGES = 24;
const CORES = 6;
const MAXP = 14;

// ─── 3D3D.ca Brand Palette ───
const T = {
  teal:"#00e5cc",mag:"#ff2d78",bg:"#04040a",p1:"#080810",p2:"#0c0c16",
  brd:"#141420",dim:"#22222e",mut:"#4a5568",txt:"#c4ccd8",hi:"#e8ecf0",
  grn:"#00d68f",red:"#ff4757",yel:"#ffc048",blu:"#5bb8f7",pur:"#a78bfa",
  org:"#ff8c42",pnk:"#f472b6",
};

// ─── Emoji Assembly ISA ───
const ASM_PROGRAMS = {
  "🔢 Counter":["📥 10","🖨️","➖ 1","🔁 1","⏹️"],
  "🧮 Fib":["📥 1","📤 0","📥 1","📤 1","📥 0","➕ 1","🖨️","📤 2","📥 1","📤 0","📥 2","📤 1","🔁 5","⏹️"],
  "✖️ Multiply":["📥 7","✖️ 6","🖨️","⏹️"],
  "📡 NetPing":["📥 42","📡 1","📬","🖨️","⏹️"],
  "🎲 Random":["🎲","🖨️","🎲","🖨️","🎲","🖨️","⏹️"],
  "🦞 Claw":["📥 1","📡 0","📬","🖨️","📥 2","📡 0","📬","🖨️","⏹️"],
};

// ─── Process Templates ───
const PTPL = [
  {n:"🌐 Browser",e:"🌐",mem:3,burst:4,pri:2,c:T.blu,net:1},
  {n:"🎵 Music",e:"🎵",mem:2,burst:3,pri:1,c:T.pur,net:0},
  {n:"📧 Mail",e:"📧",mem:2,burst:2,pri:3,c:T.org,net:1},
  {n:"🎮 Game",e:"🎮",mem:4,burst:5,pri:1,c:T.red,net:0},
  {n:"🤖 AI",e:"🤖",mem:4,burst:6,pri:1,c:T.teal,net:1},
  {n:"📊 Stats",e:"📊",mem:2,burst:3,pri:2,c:T.grn,net:0},
  {n:"🔐 Crypto",e:"🔐",mem:3,burst:7,pri:1,c:T.mag,net:1},
  {n:"📝 Editor",e:"📝",mem:1,burst:2,pri:3,c:T.mut,net:0},
  {n:"🕷️ Spider",e:"🕷️",mem:2,burst:8,pri:3,c:"#8d6e63",net:1},
  {n:"🛡️ Firewall",e:"🛡️",mem:2,burst:99,pri:0,c:T.org,net:1},
  {n:"🦞 OpenClaw",e:"🦞",mem:5,burst:10,pri:0,c:T.red,net:1},
  {n:"📷 Camera",e:"📷",mem:2,burst:2,pri:2,c:T.yel,net:0},
];

const HOSTS = [
  {ip:"🏠.0.0.1",name:"localhost",e:"🏠"},
  {ip:"🦞.claw.ai",name:"openclaw",e:"🦞"},
  {ip:"🌐.8.8.8",name:"emoji-dns",e:"🔍"},
  {ip:"☁️.cdn.1",name:"3d3d-cloud",e:"☁️"},
  {ip:"🏢.corp.1",name:"maker-hub",e:"🏢"},
  {ip:"🖨️.print.1",name:"printer-farm",e:"🖨️"},
];

const DEVS = [
  {id:0,n:"⌨️ Keyboard",irq:1,drv:"3d3d-hid",st:"on"},
  {id:1,n:"🖱️ Mouse",irq:2,drv:"3d3d-hid",st:"on"},
  {id:2,n:"🖥️ Display",irq:3,drv:"3d3d-gpu",st:"on"},
  {id:3,n:"🔊 Audio",irq:4,drv:"3d3d-snd",st:"on"},
  {id:4,n:"📶 WiFi",irq:5,drv:"3d3d-net",st:"on"},
  {id:5,n:"💾 NVMe",irq:6,drv:"3d3d-nvme",st:"on"},
  {id:6,n:"🖨️ 3DPrint",irq:7,drv:"3d3d-gcod",st:"idle"},
  {id:7,n:"📸 Webcam",irq:8,drv:"3d3d-v4l",st:"idle"},
  {id:8,n:"🎮 Gamepad",irq:9,drv:"3d3d-joy",st:"idle"},
  {id:9,n:"🦞 ClawBus",irq:10,drv:"claw-ipc",st:"on"},
];

const CRONS = [
  {every:12,n:"🧹 GC",e:"🧹"},{every:18,n:"📊 Stats",e:"📊"},
  {every:25,n:"🔄 Sync",e:"🔄"},{every:30,n:"🛡️ Scan",e:"🛡️"},
  {every:20,n:"🦞 ClawPulse",e:"🦞"},{every:35,n:"💾 Backup",e:"💾"},
];

// ─── Filesystem ───
const mkFS = () => ({
  "/":{t:"d",e:"🏠",ch:["bin","home","etc","dev","tmp","var","claw"],p:"rwxr-xr-x",o:"root"},
  "/bin":{t:"d",e:"⚙️",ch:["ls","cat","ps","top","ping","asm","snake","calc"],p:"rwxr-xr-x",o:"root"},
  "/bin/ls":{t:"x",e:"📋",s:2},"/bin/cat":{t:"x",e:"🐱",s:1},"/bin/ps":{t:"x",e:"📊",s:1},
  "/bin/top":{t:"x",e:"📈",s:2},"/bin/ping":{t:"x",e:"🏓",s:1},"/bin/asm":{t:"x",e:"🔧",s:3},
  "/bin/snake":{t:"x",e:"🐍",s:4},"/bin/calc":{t:"x",e:"🧮",s:2},
  "/home":{t:"d",e:"🏡",ch:["maker"],p:"rwxr-xr-x",o:"root"},
  "/home/maker":{t:"d",e:"👤",ch:["readme.md","notes.txt","model.stl","print.gcode"],p:"rwx------",o:"maker"},
  "/home/maker/readme.md":{t:"f",e:"📄",s:3,c:"👋🌍✨ Welcome to 3D3D EmojiOS!"},
  "/home/maker/notes.txt":{t:"f",e:"📝",s:2,c:"🔑🗝️ cooperative secrets"},
  "/home/maker/model.stl":{t:"f",e:"🧊",s:12,c:"▲▲▲ 3D model data ▲▲▲"},
  "/home/maker/print.gcode":{t:"f",e:"🖨️",s:8,c:"G28\nG1 X50 Y50 Z0.2\nG1 X100 E10"},
  "/etc":{t:"d",e:"⚙️",ch:["passwd","hosts","crontab","3d3d.conf"],p:"rwxr-xr-x",o:"root"},
  "/etc/passwd":{t:"f",e:"🔑",s:2,c:"root:🔒:0\nmaker:🔓:1000\nclaw:🦞:1001"},
  "/etc/hosts":{t:"f",e:"🌐",s:3,c:"🏠.0.0.1 localhost\n🦞.claw.ai openclaw\n☁️.cdn.1 3d3d-cloud"},
  "/etc/crontab":{t:"f",e:"⏰",s:2,c:"*/12 🧹 gc\n*/20 🦞 claw-pulse"},
  "/etc/3d3d.conf":{t:"f",e:"🏭",s:4,c:"cooperative=true\nmaker_share=75%\nregion=atlantic-canada\nbrand=cyber-teal"},
  "/dev":{t:"d",e:"🔌",ch:["null","random","printer0","claw0"],p:"rwxr-xr-x",o:"root"},
  "/dev/null":{t:"v",e:"🕳️",s:0,c:"∅"},"/dev/random":{t:"v",e:"🎲",s:0,c:"🎰"},
  "/dev/printer0":{t:"v",e:"🖨️",s:0,c:"Ender3 @ 200°C"},"/dev/claw0":{t:"v",e:"🦞",s:0,c:"OpenClaw IPC"},
  "/tmp":{t:"d",e:"📁",ch:[],p:"rwxrwxrwx",o:"root"},
  "/var":{t:"d",e:"📊",ch:["log"],p:"rwxr-xr-x",o:"root"},
  "/var/log":{t:"d",e:"📜",ch:["syslog","kern.log","claw.log"],p:"rwxr-xr-x",o:"root"},
  "/var/log/syslog":{t:"f",e:"📜",s:5,c:"3D3D EmojiOS booted"},
  "/var/log/kern.log":{t:"f",e:"🧠",s:3,c:"Hexacore initialized"},
  "/var/log/claw.log":{t:"f",e:"🦞",s:2,c:"OpenClaw agent standby"},
  "/claw":{t:"d",e:"🦞",ch:["skills","memory","config"],p:"rwxr-x---",o:"claw"},
  "/claw/skills":{t:"d",e:"🧰",ch:["web-search","file-ops","3d-print"],p:"rwxr-x---",o:"claw"},
  "/claw/skills/web-search":{t:"f",e:"🔍",s:3,c:"skill: search web via emoji-net"},
  "/claw/skills/file-ops":{t:"f",e:"📂",s:2,c:"skill: CRUD filesystem"},
  "/claw/skills/3d-print":{t:"f",e:"🖨️",s:4,c:"skill: slice & send gcode to printer farm"},
  "/claw/memory":{t:"f",e:"🧠",s:6,c:"context: maker preferences, print history, cooperative state"},
  "/claw/config":{t:"f",e:"⚙️",s:3,c:"model=claude\ngateway=🏠.0.0.1:3000\nplatform=telegram"},
});

let _pid = 0, _pkt = 0;
const np = (t) => ({pid:++_pid,...t,st:"ready",pgs:[],bl:t.burst,age:0,sc:0,cpu:0,io:0});

// ─── Shared Styles ───
const S = {
  p:{background:T.p1,border:`1px solid ${T.brd}`,borderRadius:7,padding:10},
  h:{fontSize:8,color:T.mut,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6,fontWeight:600,display:"flex",alignItems:"center",gap:5},
  b:(c)=>({background:c+"15",color:c,border:`1px solid ${c}28`,borderRadius:4,padding:"4px 9px",fontSize:9,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .15s",outline:"none"}),
  t:(c)=>({display:"inline-flex",alignItems:"center",gap:3,background:c+"12",color:c,border:`1px solid ${c}20`,borderRadius:3,padding:"1px 5px",fontSize:8,fontWeight:500}),
};

// ═══════════════════════════════════════
//  SUBCOMPONENTS
// ═══════════════════════════════════════

function Log({logs}){
  const r=useRef();
  useEffect(()=>{if(r.current)r.current.scrollTop=r.current.scrollHeight},[logs]);
  return <div ref={r} style={{background:T.bg,borderRadius:5,padding:8,height:130,overflowY:"auto",fontSize:9,lineHeight:1.8,border:`1px solid ${T.dim}`}}>
    {logs.map((l,i)=><div key={i} style={{color:l.c||T.txt,opacity:Math.max(.3,1-(logs.length-i)*.02)}}>
      <span style={{color:T.dim,marginRight:4}}>{String(l.t).padStart(4,"0")}</span>
      <span style={{color:l.lc||T.teal,marginRight:4}}>{l.lv}</span>{l.m}
    </div>)}
    {!logs.length&&<div style={{color:T.dim}}>⏳ awaiting signal...</div>}
  </div>;
}

function HexCPU({cores,tick}){
  const stages=["📥","🔍","⚡","📦","📤","✅"];
  return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4}}>
    {cores.map((core,ci)=>{
      const p=core.proc;const st=p?tick%6:-1;
      return <div key={ci} style={{background:T.bg,borderRadius:5,padding:5,border:`1px solid ${p?p.c+"33":T.dim}`,transition:"border .3s"}}>
        <div style={{fontSize:7,color:T.mut,marginBottom:3,display:"flex",justifyContent:"space-between"}}>
          <span>C{ci}</span><span>{p?p.e:"💤"}</span>
        </div>
        <div style={{display:"flex",gap:1}}>
          {stages.map((s,si)=><div key={si} style={{
            flex:1,height:12,borderRadius:2,fontSize:6,display:"flex",alignItems:"center",justifyContent:"center",
            background:si<=st&&p?p.c+"22":T.p2,border:`1px solid ${si<=st&&p?p.c+"33":"transparent"}`,
            transition:"all .2s",color:si<=st&&p?p.c:T.dim,
          }}>{s}</div>)}
        </div>
        {p&&<div style={{fontSize:7,color:p.c,marginTop:2,textAlign:"center"}}>{p.n}</div>}
      </div>;
    })}
  </div>;
}

function Mem({pages,procs}){
  const pm={};procs.forEach(p=>{pm[p.pid]=p});
  return <div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(12,1fr)",gap:1.5}}>
      {pages.map((pg,i)=>{
        const pr=pg.pid?pm[pg.pid]:null;
        return <div key={i} title={pr?`P${i}: PID${pr.pid} ${pr.n}${pg.dirty?" ✏️":""}`:pg.swap?"swapped":`P${i}: free`}
          style={{aspectRatio:"1",background:pr?pr.c+"22":pg.swap?T.yel+"10":T.bg,
            border:`1px solid ${pr?pr.c+"33":T.dim}`,borderRadius:2,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,position:"relative",transition:"all .2s"}}>
          {pr?pr.e:pg.swap?"💿":""}
          {pg.dirty&&<span style={{position:"absolute",top:-1,right:0,fontSize:4}}>✏️</span>}
        </div>;
      })}
    </div>
    <div style={{marginTop:3,fontSize:8,color:T.mut,display:"flex",justifyContent:"space-between"}}>
      <span>📦 {pages.filter(p=>p.pid).length}/{PAGES}</span>
      <span>💿 {pages.filter(p=>p.swap).length} swap</span>
      <span>✏️ {pages.filter(p=>p.dirty).length} dirty</span>
    </div>
  </div>;
}

function ProcTbl({procs,onKill}){
  const se={running:"🟢",ready:"🟡",sleeping:"😴",zombie:"💀",stopped:"⏸️"};
  if(!procs.length)return <div style={{color:T.dim,textAlign:"center",padding:10,fontSize:9}}>no processes</div>;
  return <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:9}}>
    <thead><tr style={{borderBottom:`1px solid ${T.dim}`}}>
      {["PID","","ST","CPU","Mem","SC",""].map(h=><th key={h} style={{padding:"3px 4px",textAlign:"left",color:T.mut,fontSize:7,textTransform:"uppercase",letterSpacing:1,fontWeight:500}}>{h}</th>)}
    </tr></thead>
    <tbody>{procs.map(p=><tr key={p.pid} style={{borderBottom:`1px solid ${T.p1}`}}>
      <td style={{padding:"2px 4px",color:p.c,fontWeight:700,fontSize:9}}>{p.pid}</td>
      <td style={{padding:"2px 4px",fontSize:11}} title={p.n}>{p.e}</td>
      <td style={{padding:"2px 4px"}}><span style={{display:"inline-flex",alignItems:"center",gap:2}}>{se[p.st]}<span style={{fontSize:7,color:T.mut}}>{p.st}</span></span></td>
      <td style={{padding:"2px 4px"}}><div style={{width:28,height:3,background:T.dim,borderRadius:2,overflow:"hidden"}}><div style={{width:`${p.cpu}%`,height:"100%",background:p.c,transition:"width .3s"}}/></div></td>
      <td style={{padding:"2px 4px",fontSize:8}}>{p.pgs.length}pg</td>
      <td style={{padding:"2px 4px",fontSize:8,color:T.mut}}>{p.sc}</td>
      <td style={{padding:"2px 4px"}}>{p.st!=="zombie"&&<button onClick={()=>onKill(p.pid)} style={{...S.b(T.red),padding:"1px 4px",fontSize:7}}>kill</button>}</td>
    </tr>)}</tbody>
  </table></div>;
}

function Net({pkts,hosts,conns}){
  return <div>
    <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:5}}>
      {hosts.map((h,i)=><div key={i} style={{...S.t(conns.includes(h.ip)?T.grn:T.dim),fontSize:8}}>{h.e} {h.ip}</div>)}
    </div>
    <div style={{height:60,overflowY:"auto",background:T.bg,borderRadius:4,padding:4}}>
      {pkts.slice(-10).map((p,i)=><div key={i} style={{fontSize:8,color:T.txt,display:"flex",gap:4,opacity:Math.max(.3,1-(pkts.length-i-1)*.08)}}>
        <span style={S.t(p.dir==="out"?T.blu:T.grn)}>{p.dir==="out"?"📤":"📥"}</span>
        <span style={{color:T.mut}}>#{String(p.id).padStart(3,"0")}</span>
        <span>{p.proto}</span>
        <span style={{color:T.dim}}>{p.from}→{p.to}</span>
        <span style={{color:p.ok?T.grn:T.red}}>{p.ok?"✅":"❌"}</span>
      </div>)}
      {!pkts.length&&<div style={{color:T.dim,textAlign:"center",fontSize:8,padding:6}}>no packets</div>}
    </div>
  </div>;
}

function Perf({data,label,color,max}){
  const pts=data.slice(-40);if(pts.length<2)return null;
  const h=32,w=180,step=w/(pts.length-1);
  const path=pts.map((v,i)=>`${i===0?"M":"L"}${i*step},${h-(v/max)*h}`).join(" ");
  const area=path+` L${(pts.length-1)*step},${h} L0,${h} Z`;
  return <div style={{marginBottom:3}}>
    <div style={{fontSize:7,color:T.mut,marginBottom:1,display:"flex",justifyContent:"space-between"}}>
      <span>{label}</span><span style={{color}}>{pts[pts.length-1]?.toFixed?.(0)}</span>
    </div>
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{display:"block"}}>
      <defs><linearGradient id={`g${label}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".25"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
      <path d={area} fill={`url(#g${label})`}/><path d={path} fill="none" stroke={color} strokeWidth="1.2"/>
    </svg>
  </div>;
}

// ─── SNAKE GAME ───
function SnakeGame(){
  const W=16,H=12;
  const [snake,setSnake]=useState([{x:8,y:6}]);
  const [food,setFood]=useState({x:4,y:4});
  const [dir,setDir]=useState({x:1,y:0});
  const [alive,setAlive]=useState(true);
  const [score,setScore]=useState(0);
  const [running,setRunning]=useState(false);
  const dirRef=useRef({x:1,y:0});

  useEffect(()=>{dirRef.current=dir},[dir]);

  useEffect(()=>{
    if(!running||!alive)return;
    const iv=setInterval(()=>{
      setSnake(prev=>{
        const d=dirRef.current;
        const head={x:(prev[0].x+d.x+W)%W,y:(prev[0].y+d.y+H)%H};
        if(prev.some(s=>s.x===head.x&&s.y===head.y)){setAlive(false);return prev;}
        const ns=[head,...prev];
        if(head.x===food.x&&head.y===food.y){
          setScore(s=>s+1);
          setFood({x:Math.floor(Math.random()*W),y:Math.floor(Math.random()*H)});
        } else ns.pop();
        return ns;
      });
    },150);
    return ()=>clearInterval(iv);
  },[running,alive,food]);

  useEffect(()=>{
    const h=e=>{
      const km={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0},w:{x:0,y:-1},s:{x:0,y:1},a:{x:-1,y:0},d:{x:1,y:0}};
      const nd=km[e.key];
      if(nd&&!(nd.x===-dirRef.current.x&&nd.y===-dirRef.current.y)){e.preventDefault();setDir(nd);}
    };
    window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);
  },[]);

  const reset=()=>{setSnake([{x:8,y:6}]);setFood({x:4,y:4});setDir({x:1,y:0});setAlive(true);setScore(0);setRunning(true);};

  return <div style={{textAlign:"center"}}>
    <div style={{display:"inline-grid",gridTemplateColumns:`repeat(${W},1fr)`,gap:1,background:T.bg,padding:4,borderRadius:6,border:`1px solid ${T.brd}`}}>
      {Array.from({length:H}).map((_,y)=>Array.from({length:W}).map((_,x)=>{
        const isSnake=snake.some(s=>s.x===x&&s.y===y);
        const isHead=snake[0]?.x===x&&snake[0]?.y===y;
        const isFood=food.x===x&&food.y===y;
        return <div key={`${x}-${y}`} style={{width:14,height:14,borderRadius:2,fontSize:8,display:"flex",alignItems:"center",justifyContent:"center",
          background:isHead?T.teal+"55":isSnake?T.teal+"33":isFood?T.red+"33":T.p2,
          border:`1px solid ${isSnake?T.teal+"44":isFood?T.red+"44":"transparent"}`,transition:"all .08s",
        }}>{isHead?"🐍":isSnake?"🟢":isFood?"🍎":""}</div>;
      }))}
    </div>
    <div style={{marginTop:6,display:"flex",justifyContent:"center",gap:8,alignItems:"center"}}>
      <span style={{fontSize:11,fontWeight:700,color:T.teal}}>🍎 {score}</span>
      {!alive&&<span style={{fontSize:9,color:T.red}}>💀 Game Over</span>}
      <button onClick={reset} style={S.b(T.grn)}>{running&&alive?"🔄 Restart":"▶️ Start"}</button>
    </div>
    <div style={{marginTop:4,display:"flex",justifyContent:"center",gap:3}}>
      {[["⬆️",{x:0,y:-1}],["⬅️",{x:-1,y:0}],["⬇️",{x:0,y:1}],["➡️",{x:1,y:0}]].map(([e,d])=>
        <button key={e} onClick={()=>{if(!(d.x===-dirRef.current.x&&d.y===-dirRef.current.y))setDir(d);if(!running)reset();}}
          style={{...S.b(T.teal),fontSize:14,padding:"4px 8px",lineHeight:1}}>{e}</button>
      )}
    </div>
  </div>;
}

// ─── CALCULATOR ───
function EmojiCalc(){
  const [display,setDisplay]=useState("0");
  const [prev,setPrev]=useState(null);
  const [op,setOp]=useState(null);
  const [fresh,setFresh]=useState(true);
  const press=(v)=>{
    if(v==="🧹"){setDisplay("0");setPrev(null);setOp(null);setFresh(true);return;}
    if(v==="⬅️"){setDisplay(d=>d.length>1?d.slice(0,-1):"0");return;}
    if("➕➖✖️➗".includes(v)){setPrev(parseFloat(display));setOp(v);setFresh(true);return;}
    if(v==="🟰"){
      if(prev!==null&&op){
        const cur=parseFloat(display);
        let r=0;
        if(op==="➕")r=prev+cur;else if(op==="➖")r=prev-cur;
        else if(op==="✖️")r=prev*cur;else if(op==="➗")r=cur!==0?prev/cur:0;
        setDisplay(String(Math.round(r*1000)/1000));setPrev(null);setOp(null);setFresh(true);
      }return;
    }
    if(fresh){setDisplay(v==="."?"0.":v);setFresh(false);}
    else setDisplay(d=>d==="0"&&v!=="."?v:d+v);
  };
  const btns=["7","8","9","➗","4","5","6","✖️","1","2","3","➖","0",".","🟰","➕"];
  return <div>
    <div style={{background:T.bg,borderRadius:5,padding:8,marginBottom:6,textAlign:"right",border:`1px solid ${T.brd}`}}>
      {prev!==null&&<div style={{fontSize:8,color:T.mut}}>{prev} {op}</div>}
      <div style={{fontSize:20,fontWeight:700,color:T.hi}}>{display}</div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:3}}>
      <button onClick={()=>press("🧹")} style={{...S.b(T.red),gridColumn:"span 2",padding:"6px"}}>🧹 Clear</button>
      <button onClick={()=>press("⬅️")} style={{...S.b(T.yel),gridColumn:"span 2",padding:"6px"}}>⬅️ Del</button>
      {btns.map(b=><button key={b} onClick={()=>press(b)} style={{...S.b("➕➖✖️➗🟰".includes(b)?T.teal:T.txt),padding:"8px 0",fontSize:12}}>{b}</button>)}
    </div>
  </div>;
}

// ─── ASM INTERPRETER ───
function AsmPanel({onRun,asmSt}){
  const [sel,setSel]=useState("🔢 Counter");
  return <div>
    <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:5}}>
      {Object.keys(ASM_PROGRAMS).map(n=><button key={n} onClick={()=>setSel(n)} style={{...S.b(sel===n?T.teal:T.mut),fontSize:8,padding:"2px 6px"}}>{n}</button>)}
    </div>
    <div style={{background:T.bg,borderRadius:4,padding:5,marginBottom:5,fontSize:9,lineHeight:1.9,border:`1px solid ${T.dim}`}}>
      {ASM_PROGRAMS[sel].map((l,i)=><div key={i} style={{color:asmSt.pc===i&&asmSt.on?T.grn:T.txt,background:asmSt.pc===i&&asmSt.on?T.grn+"11":"transparent",borderRadius:2,padding:"0 3px",transition:"all .15s"}}>
        <span style={{color:T.dim,marginRight:4,fontSize:7}}>{String(i).padStart(2,"0")}</span>{l}
      </div>)}
    </div>
    <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}>
      <button onClick={()=>onRun(sel,ASM_PROGRAMS[sel])} style={S.b(T.grn)} disabled={asmSt.on}>{asmSt.on?"⏳ Running...":"▶️ Execute"}</button>
      <div style={{display:"flex",gap:6}}>
        <span style={{fontSize:8,color:T.pur}}>ACC={asmSt.acc}</span>
        <span style={{fontSize:8,color:T.grn}}>PC={asmSt.pc}</span>
        <span style={{fontSize:8,color:T.teal}}>FLAGS={asmSt.acc===0?"🏳️":asmSt.acc<0?"🚩":"🟢"}</span>
      </div>
      {asmSt.out.length>0&&<div style={{fontSize:8,color:T.mag}}>Output: [{asmSt.out.join(",")}]</div>}
    </div>
  </div>;
}

// ─── OPENCLAW PANEL ───
function ClawPanel({clawState,onSend,logs}){
  const [input,setInput]=useState("");
  const chatRef=useRef();
  useEffect(()=>{if(chatRef.current)chatRef.current.scrollTop=chatRef.current.scrollHeight},[clawState.chat]);
  return <div>
    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
      <span style={{fontSize:22}}>🦞</span>
      <div>
        <div style={{fontSize:11,fontWeight:700,color:T.red}}>OpenClaw Agent</div>
        <div style={{fontSize:8,color:T.mut}}>Powered by 3D3D EmojiOS™ • {clawState.model}</div>
      </div>
      <div style={{marginLeft:"auto",display:"flex",gap:4}}>
        <span style={S.t(clawState.status==="online"?T.grn:T.yel)}>{clawState.status==="online"?"🟢 Online":"🟡 Thinking"}</span>
        <span style={S.t(T.teal)}>🧠 {clawState.memEntries} memories</span>
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:6}}>
      <div>
        <div style={{fontSize:7,color:T.mut,textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>🧰 Skills</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:2}}>
          {clawState.skills.map((s,i)=><span key={i} style={S.t(T.teal)}>{s}</span>)}
        </div>
      </div>
      <div>
        <div style={{fontSize:7,color:T.mut,textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>📡 Connections</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:2}}>
          {clawState.connections.map((c,i)=><span key={i} style={S.t(T.pur)}>{c}</span>)}
        </div>
      </div>
    </div>
    <div ref={chatRef} style={{background:T.bg,borderRadius:5,padding:6,height:140,overflowY:"auto",marginBottom:5,border:`1px solid ${T.dim}`}}>
      {clawState.chat.map((m,i)=><div key={i} style={{marginBottom:4,display:"flex",gap:5}}>
        <span style={{fontSize:10}}>{m.from==="user"?"👤":"🦞"}</span>
        <div style={{fontSize:9,color:m.from==="user"?T.teal:T.txt,lineHeight:1.5,flex:1}}>
          {m.text}
          {m.action&&<div style={{...S.t(T.mag),marginTop:2}}>⚡ {m.action}</div>}
        </div>
      </div>)}
      {!clawState.chat.length&&<div style={{color:T.dim,fontSize:9,textAlign:"center",padding:12}}>Send a message to OpenClaw...</div>}
    </div>
    <div style={{display:"flex",gap:4}}>
      <input value={input} onChange={e=>setInput(e.target.value)}
        onKeyDown={e=>{if(e.key==="Enter"&&input.trim()){onSend(input.trim());setInput("");}}}
        placeholder="Message OpenClaw..."
        style={{flex:1,background:T.bg,border:`1px solid ${T.brd}`,borderRadius:4,padding:"5px 8px",color:T.hi,fontFamily:"inherit",fontSize:10,outline:"none"}}/>
      <button onClick={()=>{if(input.trim()){onSend(input.trim());setInput("");}}} style={S.b(T.red)}>📡 Send</button>
    </div>
  </div>;
}

// ─── TERMINAL ───
function Term({onCmd,hist,cwd}){
  const [inp,setInp]=useState("");
  const [ch,setCh]=useState([]);
  const [ci,setCi]=useState(-1);
  const iRef=useRef();const sRef=useRef();
  useEffect(()=>{if(sRef.current)sRef.current.scrollTop=sRef.current.scrollHeight},[hist]);
  const go=()=>{if(!inp.trim())return;setCh(p=>[inp,...p]);setCi(-1);onCmd(inp.trim());setInp("");};
  return <div style={{background:T.bg,borderRadius:5,overflow:"hidden",border:`1px solid ${T.brd}`}}>
    <div style={{background:T.p2,padding:"3px 8px",display:"flex",alignItems:"center",gap:5,borderBottom:`1px solid ${T.brd}`}}>
      {[T.red,T.yel,T.grn].map((c,i)=><span key={i} style={{width:7,height:7,borderRadius:"50%",background:c}}/>)}
      <span style={{fontSize:8,color:T.mut,marginLeft:6}}>3d3d-term — {cwd}</span>
      <span style={{marginLeft:"auto",fontSize:7,color:T.dim}}>3D3D.ca</span>
    </div>
    <div ref={sRef} onClick={()=>iRef.current?.focus()} style={{padding:8,height:190,overflowY:"auto",fontSize:10,lineHeight:1.7,cursor:"text"}}>
      {hist.map((h,i)=><div key={i} style={{color:h.tp==="cmd"?T.grn:h.tp==="err"?T.red:h.tp==="sys"?T.teal:T.txt,whiteSpace:"pre-wrap",wordBreak:"break-all"}}>
        {h.tp==="cmd"&&<span style={{color:T.mag}}>maker@3d3d:{cwd}$ </span>}{h.tx}
      </div>)}
      <div style={{display:"flex",alignItems:"center"}}>
        <span style={{color:T.mag,marginRight:3,fontSize:10}}>maker@3d3d:{cwd}$</span>
        <input ref={iRef} value={inp} onChange={e=>setInp(e.target.value)}
          onKeyDown={e=>{
            if(e.key==="Enter")go();
            else if(e.key==="ArrowUp"){e.preventDefault();if(ci<ch.length-1){const n=ci+1;setCi(n);setInp(ch[n]);}}
            else if(e.key==="ArrowDown"){e.preventDefault();if(ci>0){const n=ci-1;setCi(n);setInp(ch[n]);}else{setCi(-1);setInp("");}}
          }}
          style={{background:"transparent",border:"none",color:T.hi,fontFamily:"inherit",fontSize:10,flex:1,outline:"none",caretColor:T.teal}}
          spellCheck={false}/>
        <span style={{color:T.teal,animation:"blink 1s step-end infinite"}}>█</span>
      </div>
    </div>
  </div>;
}

// ═══════════════════════════════════════
//  🧠 MAIN KERNEL
// ═══════════════════════════════════════
export default function EmojiOS(){
  // ─── Phase: off → electron → bios → boot → run
  const [phase,setPhase]=useState("off");
  const [bootLines,setBootLines]=useState([]);
  const [bootStep,setBootStep]=useState(0);
  const [tick,setTick]=useState(0);
  const [tab,setTab]=useState("🖥️ System");
  const [procs,setProcs]=useState([]);
  const [pages,setPages]=useState(Array.from({length:PAGES},()=>({pid:null,dirty:false,swap:false,acc:0})));
  const [logs,setLogs]=useState([]);
  const [tHist,setTHist]=useState([]);
  const [cwd,setCwd]=useState("/home/maker");
  const [fs,setFs]=useState(mkFS());
  const [pkts,setPkts]=useState([]);
  const [conns,setConns]=useState(["🏠.0.0.1"]);
  const [devs,setDevs]=useState(DEVS);
  const [therm,setTherm]=useState({cpu:32,gpu:28,fan:700,load:0});
  const [ipc,setIpc]=useState({pipes:[],sigs:[],sems:[{n:"mutex0",l:false,o:null},{n:"io_sem",l:false,o:null},{n:"claw_lock",l:false,o:null}]});
  const [perf,setPerf]=useState({cpu:[],mem:[],net:[],io:[]});
  const [sched,setSched]=useState("Round Robin");
  const [panic,setPanic]=useState(false);
  const [asmSt,setAsmSt]=useState({on:false,out:[],pc:0,acc:0,mem:{},prog:[]});
  const [stats,setStats]=useState({up:0,procs:0,sys:0,ctx:0,irq:0,pgf:0,pkt:0});
  const [clawState,setClawState]=useState({
    status:"online",model:"claude-sonnet-4-20250514",memEntries:3,
    skills:["🔍 web-search","📂 file-ops","🖨️ 3d-print","📊 analytics","🔧 code-exec","📡 net-req"],
    connections:["📱 Telegram","💬 Discord","🖥️ Terminal","🖨️ PrintFarm"],
    chat:[],
  });

  const sr=useRef({});
  useEffect(()=>{sr.current={procs,pages,tick,stats,therm,pkts,conns,ipc,devs,asmSt,fs,cwd,clawState}});

  const log=useCallback((m,lv="INFO",c,lc)=>{setLogs(p=>[...p.slice(-100),{m,lv,c,lc,t:sr.current.tick}])},[]);
  const tout=useCallback((tx,tp="out")=>{setTHist(p=>[...p.slice(-80),{tx,tp}])},[]);

  // ═══ BOOT: FROM THE FIRST ELECTRON ═══
  const startBoot=useCallback(()=>{
    setPhase("electron");setBootLines([]);setBootStep(0);
    // Stage 1: Electron → Physics
    const electron=[
      {t:0,tx:"⚡",big:true,sub:"An electron moves..."},
      {t:600,tx:"⚡→⚡→⚡",sub:"Electrons flow through silicon..."},
      {t:1200,tx:"⚡→🔌→💡",sub:"Electricity powers a transistor"},
      {t:1800,tx:"💡💡💡💡💡💡💡💡",sub:"8 transistors = 1 byte of possibility"},
      {t:2400,tx:"🔲 = 💡×1,000,000,000",sub:"Billions of transistors = 1 CPU core"},
      {t:3000,tx:"🔲🔲🔲🔲🔲🔲",sub:"6 cores = 3D3D EmojiCore™ Hexacore"},
    ];
    electron.forEach(l=>{setTimeout(()=>setBootLines(p=>[...p,l]),l.t)});
    setTimeout(()=>{setPhase("bios");setBootLines([]);},4000);
  },[]);

  // Stage 2: BIOS POST
  useEffect(()=>{
    if(phase!=="bios")return;
    const bios=[
      {t:0,tx:"🏭 3D3D EmojiCorp™ BIOS v3.7.1",c:T.teal},
      {t:200,tx:"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",c:T.dim},
      {t:300,tx:"POST: Power-On Self Test initiating...",c:T.txt},
      {t:500,tx:"🧠 CPU: EmojiCore™ HEXACORE @ ∞ GHz .............. ✅",c:T.hi},
      {t:700,tx:`📦 RAM: ${PAGES} emoji pages (${PAGES*4} blocks) ............... ✅`,c:T.hi},
      {t:900,tx:"💾 Storage: 3D3D-NVMe 256 emoji sectors ........... ✅",c:T.hi},
      {t:1100,tx:"📶 Network: EmojiNet™ 10GbE adapter ............... ✅",c:T.hi},
      {t:1300,tx:"🔌 Devices: 10 enumerated (incl. 🖨️ 3DPrint, 🦞 ClawBus) ✅",c:T.hi},
      {t:1500,tx:"🔐 Security: 3D3D-Guard™ + CoopAuth ............... ✅",c:T.hi},
      {t:1700,tx:"🦞 ClawBus: OpenClaw IPC channel detected ......... ✅",c:T.hi},
      {t:1900,tx:"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",c:T.dim},
      {t:2000,tx:"POST complete — all 6 cores nominal",c:T.grn},
      {t:2200,tx:"Loading 3D3D EmojiOS™ v3.0 Hexacore Edition...",c:T.teal},
      {t:2300,tx:"🏭 3D3D.ca — Cooperative Distributed Manufacturing",c:T.mag},
    ];
    bios.forEach(l=>{setTimeout(()=>setBootLines(p=>[...p,l]),l.t)});
    setTimeout(()=>{setPhase("boot");setBootLines([]);},3000);
  },[phase]);

  // Stage 3: Kernel Boot
  useEffect(()=>{
    if(phase!=="boot")return;
    const steps=[
      {t:0,m:"🧠 Initializing 3D3D EmojiKernel™ Hexacore...",lv:"BOOT"},
      {t:150,m:"🔲 CPU: Bringing up 6 cores — IPI broadcast",lv:"CPU"},
      {t:300,m:"🔲 Core 0: online (BSP)",lv:"CPU"},
      {t:400,m:"🔲 Core 1-5: online (AP) — SMP active",lv:"CPU"},
      {t:550,m:"📦 Memory: Page allocator initialized — 24 pages, 4KB each",lv:"MEM"},
      {t:650,m:"📦 TLB: Translation Lookaside Buffer flushed",lv:"MEM"},
      {t:750,m:"📦 Virtual memory: demand paging enabled, LRU eviction",lv:"MEM"},
      {t:900,m:"📋 Scheduler: Round Robin (quantum=3 ticks) — 6 run queues",lv:"SCHED"},
      {t:1050,m:"💾 EmojiFS v3.0 mounted at / — 3D3D cooperative filesystem",lv:"FS"},
      {t:1150,m:"💾 Inodes: 42 files, 8 directories, 3 device nodes",lv:"FS"},
      {t:1300,m:"🔌 Device drivers loading...",lv:"DEV"},
      {t:1400,m:"🔌 Loaded: 3d3d-hid, 3d3d-gpu, 3d3d-snd, 3d3d-net",lv:"DEV"},
      {t:1500,m:"🔌 Loaded: 3d3d-nvme, 3d3d-gcod, 3d3d-v4l, 3d3d-joy",lv:"DEV"},
      {t:1600,m:"🔌 Loaded: claw-ipc — OpenClaw bus interface ready",lv:"DEV"},
      {t:1750,m:"📡 Network stack: TCP/IP emoji protocol suite initialized",lv:"NET"},
      {t:1850,m:"📡 Interface emoji0: UP — 🏠.0.0.1/24",lv:"NET"},
      {t:1950,m:"🔗 IPC: pipes, signals, semaphores — 3 mutexes allocated",lv:"IPC"},
      {t:2050,m:"⏰ Cron daemon: 6 jobs scheduled (incl. 🦞 ClawPulse)",lv:"CRON"},
      {t:2150,m:"🌡️ Thermal monitor: CPU/GPU sensors online, fan curve loaded",lv:"THERM"},
      {t:2250,m:"🔧 Emoji Assembly interpreter: 20 opcodes registered",lv:"ASM"},
      {t:2350,m:"🛡️ Security: CoopAuth + maker permissions enforced",lv:"SEC"},
      {t:2450,m:"🦞 OpenClaw agent: gateway initialized on 🏠.0.0.1:3000",lv:"CLAW"},
      {t:2550,m:"🦞 OpenClaw: skills loaded (6), memory synced (3 entries)",lv:"CLAW"},
      {t:2700,m:"🏭 3D3D.ca cooperative mode: maker_share=75%, region=atlantic-canada",lv:"COOP"},
      {t:2850,m:"✅ 3D3D EmojiOS™ v3.0 — ALL SYSTEMS OPERATIONAL",lv:"BOOT"},
    ];
    steps.forEach(s=>{setTimeout(()=>log(s.m,s.lv,T.teal,T.teal),s.t)});
    setTimeout(()=>{
      setPhase("run");
      log("🖥️ Desktop ready — Welcome, Maker!","KERN",T.grn,T.grn);
      tout("Welcome to 3D3D EmojiOS! Type 'help' for commands.","sys");
      tout("🦞 OpenClaw agent is online. Use the 🦞 Claw tab to interact.","sys");
    },3200);
  },[phase,log,tout]);

  // ═══ MEMORY ALLOC ═══
  const allocPg=useCallback((proc)=>{
    const need=Math.ceil(proc.mem/2);const pgs=[...sr.current.pages];const got=[];
    for(let i=0;i<PAGES&&got.length<need;i++){if(!pgs[i].pid&&!pgs[i].swap){pgs[i]={pid:proc.pid,dirty:false,swap:false,acc:sr.current.tick};got.push(i);}}
    if(got.length<need){
      const cands=pgs.map((p,i)=>({...p,i})).filter(p=>p.pid&&p.pid!==proc.pid).sort((a,b)=>a.acc-b.acc);
      for(const c of cands){if(got.length>=need)break;pgs[c.i]={pid:proc.pid,dirty:false,swap:false,acc:sr.current.tick};got.push(c.i);
        setStats(s=>({...s,pgf:s.pgf+1}));log(`📄 Page fault — evicted page ${c.i}`,"MEM",T.yel,T.yel);
      }
    }
    if(got.length<need){got.forEach(i=>{pgs[i]={pid:null,dirty:false,swap:false,acc:0}});return{ok:false,pages:sr.current.pages};}
    return{ok:true,pages:pgs,got};
  },[log]);

  const freePg=useCallback((pid)=>{setPages(p=>p.map(pg=>pg.pid===pid?{pid:null,dirty:false,swap:false,acc:0}:pg))},[]);

  // ═══ SPAWN / KILL ═══
  const spawn=useCallback((tmpl)=>{
    const t=tmpl||PTPL[Math.floor(Math.random()*PTPL.length)];
    if(sr.current.procs.length>=MAXP){log("⚠️ Process limit","WARN",T.yel,T.yel);return null;}
    const p=np(t);const r=allocPg(p);
    if(!r.ok){log(`⚠️ OOM for ${p.n}`,"WARN",T.yel,T.yel);return null;}
    p.pgs=r.got;setPages(r.pages);setProcs(prev=>[...prev,p]);
    setStats(s=>({...s,procs:s.procs+1}));log(`🍴 fork() → PID ${p.pid} ${p.n} [${r.got.length}pg]`,"KERN",T.grn,T.grn);return p;
  },[allocPg,log]);

  const kill=useCallback((pid)=>{
    setProcs(p=>p.map(pr=>pr.pid===pid?{...pr,st:"zombie",age:0}:pr));
    setIpc(prev=>({...prev,sigs:[...prev.sigs.slice(-8),{sig:"SIGKILL",to:pid}]}));
    log(`💀 kill(${pid}) — SIGKILL`,"KERN",T.red,T.red);
  },[log]);

  // ═══ NETWORK ═══
  const sendPkt=useCallback((to,proto)=>{
    const p={id:++_pkt,from:"🏠.0.0.1",to:to||HOSTS[Math.floor(Math.random()*HOSTS.length)].ip,
      proto:proto||["🌍HTTP","🔒HTTPS","🏓PING","📡UDP","🤝TCP"][Math.floor(Math.random()*5)],
      dir:"out",ok:Math.random()>.08,t:sr.current.tick};
    setPkts(prev=>[...prev.slice(-30),p]);setStats(s=>({...s,pkt:s.pkt+1}));
    if(!sr.current.conns.includes(p.to))setConns(prev=>[...prev,p.to]);
    if(p.ok)setTimeout(()=>setPkts(prev=>[...prev.slice(-30),{...p,id:++_pkt,dir:"in",from:p.to,to:"🏠.0.0.1"}]),250);
    return p;
  },[]);

  // ═══ OPENCLAW ═══
  const clawSend=useCallback((text)=>{
    setClawState(prev=>({...prev,chat:[...prev.chat,{from:"user",text}],status:"thinking"}));
    sendPkt("🦞.claw.ai","🤝TCP");
    log(`🦞 claw_send("${text.slice(0,30)}...")`, "CLAW",T.red,T.red);
    // Simulate agent response
    setTimeout(()=>{
      let reply="", action="";
      const lt=text.toLowerCase();
      if(lt.includes("print")||lt.includes("3d")){reply="🖨️ I can send that to the printer farm! Let me slice the model and queue it for the nearest maker in Atlantic Canada.";action="GCODE_SEND → 🖨️.print.1";}
      else if(lt.includes("search")||lt.includes("find")){reply="🔍 Searching the web for you... Found 3 relevant results. Want me to summarize them?";action="WEB_SEARCH → 🌐.8.8.8";}
      else if(lt.includes("file")||lt.includes("read")||lt.includes("write")){reply="📂 I can access the filesystem! What file would you like me to work with?";action="FS_ACCESS → /home/maker";}
      else if(lt.includes("status")||lt.includes("system")){
        const s=sr.current.stats;
        reply=`📊 System: ${sr.current.procs.filter(p=>p.st!=="zombie").length} procs, ${sr.current.pages.filter(p=>p.pid).length}/${PAGES} mem, ${s.up}t uptime, ${s.pkt} packets. All 6 cores nominal.`;
        action="SYS_STATUS";
      }
      else if(lt.includes("hello")||lt.includes("hi")){reply="👋 Hey! I'm your OpenClaw agent running on 3D3D EmojiOS. I can search the web, manage files, control 3D printers, run analytics, and execute code. What do you need?";}
      else if(lt.includes("skill")){reply="🧰 My current skills: web-search, file-ops, 3d-print, analytics, code-exec, net-req. I can also create new skills autonomously!";action="SKILL_LIST";}
      else{reply=`🤔 Processing: "${text}". I'll figure out the best approach. Running on 3D3D's cooperative infrastructure — 75% revenue to local makers!`;action="AGENT_THINK";}
      setClawState(prev=>({...prev,chat:[...prev.chat,{from:"claw",text:reply,action}],status:"online"}));
      sendPkt("🦞.claw.ai","🤝TCP");
    },800+Math.random()*600);
  },[sendPkt,log]);

  // ═══ ASM ═══
  const runAsm=useCallback((name,prog)=>{
    setAsmSt({on:true,out:[],pc:0,acc:0,mem:{},prog});
    log(`🔧 ASM: "${name}" loaded`,"ASM",T.pur,T.pur);
    let acc=0,pc=0,mem={},out=[],step=0;
    const tick=()=>{
      if(pc>=prog.length||step>80){setAsmSt(p=>({...p,on:false,out,pc}));log(`🔧 ASM: done — [${out.join(",")}]`,"ASM",T.grn,T.grn);return;}
      const [op,...args]=prog[pc].split(" ");const v=args.length?parseInt(args[0]):0;step++;
      switch(op){
        case"📥":acc=v;break;case"📤":mem[v]=acc;break;case"➕":acc+=(mem[v]!==undefined?mem[v]:v);break;
        case"➖":acc-=v;break;case"✖️":acc*=v;break;case"➗":acc=v?Math.floor(acc/v):0;break;
        case"🔀":pc=v-1;break;case"❓":if(acc===0)pc=v-1;break;case"🖨️":out.push(acc);break;
        case"⏹️":setAsmSt(p=>({...p,on:false,out,pc}));log(`🔧 HALT — [${out.join(",")}]`,"ASM",T.grn,T.grn);return;
        case"🔁":acc--;if(acc>0)pc=v-1;break;case"📡":sendPkt(null,"📡UDP");break;
        case"📬":acc=Math.floor(Math.random()*256);break;case"🎲":acc=Math.floor(Math.random()*100);break;
        default:break;
      }
      pc++;setAsmSt(p=>({...p,pc,acc,mem:{...mem},out:[...out]}));setTimeout(tick,180);
    };
    setTimeout(tick,80);
  },[log,sendPkt]);

  // ═══ TERMINAL ═══
  const handleCmd=useCallback((cmd)=>{
    tout(cmd,"cmd");const[c,...a]=cmd.split(/\s+/);const arg=a.join(" ");
    const resolve=(p)=>p.startsWith("/")?p:sr.current.cwd==="/"?`/${p}`:`${sr.current.cwd}/${p}`;
    switch(c.toLowerCase()){
      case"help":tout("📚 help ls cd cat pwd ps top kill spawn ping clear echo touch mkdir rm neofetch free df lsdev thermal cron asm snake calc claw uptime dmesg pipe signal man whoami uname ifconfig netstat reboot panic","sys");break;
      case"ls":{const path=a[0]?resolve(a[0]):sr.current.cwd;const nd=sr.current.fs[path];if(!nd){tout(`ls: not found`,"err");break;}if(nd.t==="d"){tout((nd.ch||[]).map(ch=>{const cp=path==="/"?`/${ch}`:`${path}/${ch}`;const cn=sr.current.fs[cp];return cn?`${cn.e} ${ch}`:ch;}).join("  "));}else tout(`${nd.e} ${path.split("/").pop()}`);break;}
      case"cd":{const t=a[0]||"/home/maker";let np;if(t==="..")np=sr.current.cwd.split("/").slice(0,-1).join("/")||"/";else if(t==="/")np="/";else if(t.startsWith("/"))np=t;else np=resolve(t);if(sr.current.fs[np]?.t==="d")setCwd(np);else tout(`cd: not a directory`,"err");break;}
      case"cat":{if(!a[0]){tout("cat: missing file","err");break;}const fp=resolve(a[0]);const f=sr.current.fs[fp];if(!f)tout("cat: not found","err");else if(f.t==="d")tout("cat: is directory","err");else tout(f.c||"∅");break;}
      case"pwd":tout(sr.current.cwd);break;
      case"whoami":tout("👤 maker (uid=1000) @ 3D3D.ca Cooperative");break;
      case"uname":tout("3D3D-EmojiOS 3.0.0 EmojiKernel™ Hexacore emoji64 🏭3D3D.ca");break;
      case"ps":if(!sr.current.procs.length){tout("  No processes");break;}tout("  PID  NAME         STATE     CPU  MEM");sr.current.procs.forEach(p=>tout(`  ${String(p.pid).padStart(3)}  ${(p.e+" "+p.n.split(" ")[1]).padEnd(12)} ${p.st.padEnd(9)} ${String(p.cpu).padStart(3)}% ${p.pgs.length}pg`));break;
      case"top":tout(`⏱️ Up:${sr.current.stats.up}t 🍴 Procs:${sr.current.procs.filter(p=>p.st!=="zombie").length} 📞 Sys:${sr.current.stats.sys} 🔄 Ctx:${sr.current.stats.ctx}`);tout(`🧠 CPU:${sr.current.therm.load}% 🌡️ ${sr.current.therm.cpu}°C 📦 Mem:${sr.current.pages.filter(p=>p.pid).length}/${PAGES}pg 📡 Pkt:${sr.current.stats.pkt}`);break;
      case"kill":if(!a[0]){tout("kill <pid>","err");break;}const kp=parseInt(a[0]);if(!sr.current.procs.find(p=>p.pid===kp)){tout(`kill: no such process`,"err");break;}kill(kp);tout(`SIGKILL → PID ${kp}`);break;
      case"spawn":{const t=a[0]?PTPL.find(t=>t.n.toLowerCase().includes(a[0].toLowerCase())||t.e===a[0]):null;const p=spawn(t);if(p)tout(`Spawned ${p.n} (PID ${p.pid})`);else tout("Failed to spawn","err");break;}
      case"ping":{const target=a[0]||"🦞.claw.ai";tout(`PING ${target} —`);sendPkt(target,"🏓PING");setTimeout(()=>tout(`  64 emoji from ${target}: time=${Math.floor(Math.random()*40+5)}ms`),300);setTimeout(()=>tout(`  64 emoji from ${target}: time=${Math.floor(Math.random()*40+5)}ms`),600);break;}
      case"clear":setTHist([]);break;
      case"echo":tout(arg);break;
      case"touch":if(!a[0]){tout("touch: missing","err");break;}const tp=resolve(a[0]);const tpar=tp.split("/").slice(0,-1).join("/")||"/";const tn=tp.split("/").pop();setFs(prev=>{const nf={...prev};nf[tp]={t:"f",e:"📄",p:"rw-r--r--",o:"maker",s:0,c:""};if(nf[tpar]?.ch)nf[tpar]={...nf[tpar],ch:[...nf[tpar].ch,tn]};return nf;});tout(`Created ${tn}`);break;
      case"mkdir":if(!a[0]){tout("mkdir: missing","err");break;}const mp=resolve(a[0]);const mpar=mp.split("/").slice(0,-1).join("/")||"/";const mn=mp.split("/").pop();setFs(prev=>{const nf={...prev};nf[mp]={t:"d",e:"📁",p:"rwxr-xr-x",o:"maker",ch:[]};if(nf[mpar]?.ch)nf[mpar]={...nf[mpar],ch:[...nf[mpar].ch,mn]};return nf;});tout(`Created directory ${mn}`);break;
      case"rm":if(!a[0]){tout("rm: missing","err");break;}const rp=resolve(a[0]);if(!sr.current.fs[rp]){tout("rm: not found","err");break;}const rpar=rp.split("/").slice(0,-1).join("/")||"/";const rn=rp.split("/").pop();setFs(prev=>{const nf={...prev};delete nf[rp];if(nf[rpar]?.ch)nf[rpar]={...nf[rpar],ch:nf[rpar].ch.filter(c=>c!==rn)};return nf;});tout(`Removed ${rn}`);break;
      case"free":tout(`Mem: ${sr.current.pages.filter(p=>p.pid).length} used / ${PAGES-sr.current.pages.filter(p=>p.pid).length} free / ${sr.current.pages.filter(p=>p.swap).length} swap`);break;
      case"df":tout(`/dev/emoji0  256📦  ${Object.keys(sr.current.fs).length*2}📦 used  ${Math.floor(Object.keys(sr.current.fs).length*2/256*100)}%  /`);break;
      case"lsdev":sr.current.devs.forEach(d=>tout(`  ${d.n}  IRQ${d.irq}  ${d.drv}  [${d.st}]`));break;
      case"thermal":tout(`🧠 CPU:${sr.current.therm.cpu}°C 🎨 GPU:${sr.current.therm.gpu}°C 🌀 Fan:${sr.current.therm.fan}RPM ⚡ Load:${sr.current.therm.load}%`);break;
      case"cron":CRONS.forEach(j=>{const next=j.every-(sr.current.tick%j.every);tout(`${j.e} ${j.n.padEnd(14)} every ${j.every}t  next: ${next}t`);});break;
      case"uptime":tout(`⏱️ up ${sr.current.stats.up}t, ${sr.current.procs.filter(p=>p.st!=="zombie").length} processes, load: ${(sr.current.therm.load/100).toFixed(2)}`);break;
      case"dmesg":tout("— kernel ring buffer —","sys");(sr.current.logs||[]).slice(-6).forEach(l=>tout(`[${String(l.t).padStart(4,"0")}] ${l.lv}: ${l.m}`));break;
      case"ifconfig":tout("emoji0: UP BROADCAST RUNNING");tout(`  inet 🏠.0.0.1/24  bcast 📢.0.0.255`);tout(`  TX: ${sr.current.stats.pkt} packets`);break;
      case"netstat":tout(`Connections: ${sr.current.conns.length}`);sr.current.conns.forEach(c=>{const h=HOSTS.find(hh=>hh.ip===c);tout(`  ${c} ${h?`(${h.name})`:""} ESTABLISHED`);});break;
      case"snake":tout("🐍 Use the 🐍 Snake tab to play!","sys");break;
      case"calc":tout("🧮 Use the 🧮 Calc tab!","sys");break;
      case"claw":tout("🦞 Use the 🦞 Claw tab to chat with OpenClaw!","sys");break;
      case"pipe":if(a.length<3){tout("pipe <from> <to> <data>","err");break;}setIpc(prev=>({...prev,pipes:[...prev.pipes.slice(-6),{from:parseInt(a[0]),to:parseInt(a[1]),data:a.slice(2).join(" ")}]}));tout(`📨 Piped to PID ${a[1]}`);break;
      case"signal":if(a.length<2){tout("signal <sig> <pid>","err");break;}setIpc(prev=>({...prev,sigs:[...prev.sigs.slice(-8),{sig:a[0],to:parseInt(a[1])}]}));tout(`⚡ ${a[0]} → PID ${a[1]}`);break;
      case"neofetch":
        tout("      🧠🧠🧠🧠🧠          maker@3d3d-emojiOS");
        tout("    🧠🧠🧠🧠🧠🧠🧠        ───────────────────");
        tout("  🧠🧠  🏭🏭🏭  🧠🧠      OS: 3D3D EmojiOS™ 3.0 Hexacore");
        tout("  🧠🧠  🏭🏭🏭  🧠🧠      Kernel: EmojiKernel™ v3.0");
        tout("    🧠🧠🧠🧠🧠🧠🧠        CPU: EmojiCore™ 6-Core @ ∞ GHz");
        tout(`      🧠🧠🧠🧠🧠          Memory: ${sr.current.pages.filter(p=>p.pid).length}/${PAGES} pages`);
        tout(`        🧠🧠🧠            Procs: ${sr.current.procs.length} | Up: ${sr.current.stats.up}t`);
        tout("      🦞🦞🦞🦞🦞          Agent: OpenClaw 🦞 online");
        tout("                          Brand: 3D3D.ca");
        tout("                          Coop: 75% maker share");
        break;
      case"man":const mp2={ls:"📋 ls — list directory",cat:"🐱 cat — show file",ps:"📊 ps — processes",kill:"💀 kill <pid>",spawn:"🍴 spawn [name]",ping:"🏓 ping [host]",claw:"🦞 claw — OpenClaw agent tab",snake:"🐍 snake — the game tab",calc:"🧮 calc — calculator tab"};tout(mp2[a[0]]||`No man page for ${a[0]}`);break;
      case"reboot":doReboot();break;
      case"panic":triggerPanic();break;
      default:tout(`${c}: command not found. Type 'help'`,"err");
    }
  },[tout,kill,spawn,sendPkt,log]);

  const triggerPanic=useCallback(()=>{setPanic(true);log("💥💥💥 KERNEL PANIC — emoji stack overflow 💥💥💥","PANIC",T.red,T.red)},[log]);
  const doReboot=useCallback(()=>{
    _pid=0;_pkt=0;setPhase("off");setTick(0);setProcs([]);setLogs([]);setTHist([]);
    setPages(Array.from({length:PAGES},()=>({pid:null,dirty:false,swap:false,acc:0})));
    setPkts([]);setConns(["🏠.0.0.1"]);setDevs(DEVS);setTherm({cpu:32,gpu:28,fan:700,load:0});
    setPanic(false);setBootLines([]);setFs(mkFS());setCwd("/home/maker");
    setIpc({pipes:[],sigs:[],sems:[{n:"mutex0",l:false,o:null},{n:"io_sem",l:false,o:null},{n:"claw_lock",l:false,o:null}]});
    setPerf({cpu:[],mem:[],net:[],io:[]});setAsmSt({on:false,out:[],pc:0,acc:0,mem:{},prog:[]});
    setStats({up:0,procs:0,sys:0,ctx:0,irq:0,pgf:0,pkt:0});
    setClawState(p=>({...p,chat:[],status:"online"}));
  },[]);

  // ═══ MAIN TICK ═══
  useEffect(()=>{
    if(phase!=="run"||panic)return;
    const iv=setInterval(()=>{
      setTick(p=>p+1);setStats(p=>({...p,up:p.up+1}));
      setProcs(prev=>{
        let pp=prev.map(p=>({...p,age:p.age+1}));
        // Reap zombies
        const z=pp.filter(p=>p.st==="zombie"&&p.age>3);
        z.forEach(zp=>{freePg(zp.pid);log(`🪦 reap(${zp.pid})`,"KERN",T.mut,T.mut);});
        pp=pp.filter(p=>!(p.st==="zombie"&&p.age>3));
        // Wake sleeping
        pp=pp.map(p=>p.st==="sleeping"&&Math.random()<.2?{...p,st:"ready"}:p);
        // Run current
        const running=pp.filter(p=>p.st==="running");
        running.forEach(r=>{
          const u={...r,bl:r.bl-1,sc:r.sc+(Math.random()<.15?1:0),io:r.io+(Math.random()<.1?1:0)};
          if(Math.random()<.15){u.sc++;setStats(s=>({...s,sys:s.sys+1}));if(Math.random()<.3){u.st="sleeping";u.bl=u.burst;}if(u.net&&Math.random()<.2)sendPkt();}
          if(Math.random()<.1)setPages(pg=>pg.map(p=>p.pid===u.pid&&Math.random()<.3?{...p,dirty:true,acc:sr.current.tick}:p));
          if(u.bl<=0&&u.st==="running"){u.st="zombie";u.age=0;log(`✅ PID ${u.pid} done`,"KERN",T.grn,T.grn);}
          else if(u.st==="running"&&pp.filter(p=>p.st==="ready").length>0&&Math.random()<.2){u.st="ready";setStats(s=>({...s,ctx:s.ctx+1}));}
          pp=pp.map(p=>p.pid===u.pid?u:p);
        });
        // Schedule — fill up to CORES running
        const runCount=pp.filter(p=>p.st==="running").length;
        const ready=pp.filter(p=>p.st==="ready").sort((a,b)=>a.pri-b.pri);
        for(let i=0;i<Math.min(CORES-runCount,ready.length);i++){
          pp=pp.map(p=>p.pid===ready[i].pid?{...p,st:"running"}:p);
          setStats(s=>({...s,ctx:s.ctx+1}));
        }
        // CPU %
        pp=pp.map(p=>({...p,cpu:p.st==="running"?Math.min(99,p.cpu+8):Math.max(0,p.cpu-6)}));
        // Auto-spawn
        if(pp.filter(p=>p.st!=="zombie").length<3&&Math.random()<.25)setTimeout(()=>spawn(),50);
        return pp;
      });
      // Thermal
      setTherm(prev=>{
        const active=sr.current.procs.filter(p=>p.st==="running"||p.st==="ready").length;
        const load=Math.min(100,Math.floor(active*12+Math.random()*8));
        return{cpu:Math.round(Math.min(92,32+load*.5+(Math.random()-.5)*4)),gpu:Math.round(Math.min(85,26+load*.3+(Math.random()-.5)*3)),fan:Math.min(4200,Math.floor(700+load*25+Math.random()*150)),load};
      });
      // Perf
      setPerf(p=>({cpu:[...p.cpu.slice(-39),sr.current.therm.load],mem:[...p.mem.slice(-39),sr.current.pages.filter(p=>p.pid).length/PAGES*100],net:[...p.net.slice(-39),sr.current.pkts.filter(p=>p.t>=sr.current.tick-1).length*12],io:[...p.io.slice(-39),sr.current.procs.reduce((a,p)=>a+(p.st==="sleeping"?1:0),0)*12]}));
      // Device jitter
      setDevs(p=>p.map(d=>({...d,st:Math.random()<.03?(d.st==="on"?"busy":"on"):d.st})));
      // Cron
      CRONS.forEach(j=>{if(sr.current.tick>0&&sr.current.tick%j.every===0){log(`⏰ cron: ${j.n}`,"CRON",T.pur,T.pur);setStats(s=>({...s,irq:s.irq+1}));}});
      // IRQ
      if(Math.random()<.04){const d=DEVS[Math.floor(Math.random()*DEVS.length)];log(`⚡ IRQ${d.irq} — ${d.n}`,"IRQ",T.org,T.org);setStats(s=>({...s,irq:s.irq+1}));}
    },TICK);
    return()=>clearInterval(iv);
  },[phase,panic,freePg,log,spawn,sendPkt]);

  const cores=Array.from({length:CORES},(_, i)=>{
    const running=procs.filter(p=>p.st==="running");
    return{proc:running[i]||null};
  });

  const TABS=["🖥️ System","💻 Term","📡 Net","🔧 ASM","🦞 Claw","🐍 Snake","🧮 Calc","📊 Perf"];

  // ═══ RENDER ═══
  return <div style={{minHeight:"100vh",background:T.bg,color:T.txt,fontFamily:"'JetBrains Mono','Fira Code',monospace",padding:10,boxSizing:"border-box"}}>

    {/* ── OFF ── */}
    {phase==="off"&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"90vh"}}>
      <div style={{fontSize:10,color:T.dim,letterSpacing:4,textTransform:"uppercase",marginBottom:20}}>3D3D.ca presents</div>
      <div style={{fontSize:60,marginBottom:12,filter:`drop-shadow(0 0 30px ${T.teal}44)`}}>🧠</div>
      <div style={{fontSize:22,fontWeight:700,letterSpacing:2,marginBottom:2}}>
        <span style={{color:T.teal}}>3D3D</span> <span style={{color:T.hi}}>EmojiOS</span><span style={{color:T.mag}}>™</span>
      </div>
      <div style={{fontSize:10,color:T.mut,letterSpacing:3,textTransform:"uppercase",marginBottom:6}}>Hexacore Edition • v3.0</div>
      <div style={{fontSize:9,color:T.dim,marginBottom:28}}>The Operating System for OpenClaw 🦞</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:4,justifyContent:"center",marginBottom:28,maxWidth:420}}>
        {["🔲 6-Core CPU","📦 Virtual Memory","📋 3 Schedulers","💾 Full FS","📡 Network Stack","🔗 IPC","🔌 10 Devices","🌡️ Thermal","⏰ Cron","🔧 Emoji ASM","💻 Terminal","🦞 OpenClaw","🐍 Snake","🧮 Calculator","📊 Real-time Perf","🏭 3D3D Coop"].map(f=>
          <span key={f} style={S.t(T.teal)}>{f}</span>
        )}
      </div>
      <button onClick={startBoot} style={{
        background:`linear-gradient(135deg,${T.teal},${T.mag})`,color:"#fff",border:"none",borderRadius:10,
        padding:"14px 44px",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"inherit",
        boxShadow:`0 0 40px ${T.teal}33,0 0 80px ${T.mag}22`,transition:"all .2s",
      }} onMouseEnter={e=>{e.target.style.transform="scale(1.05)"}} onMouseLeave={e=>{e.target.style.transform="scale(1)"}}>
        ⚡ POWER ON
      </button>
      <div style={{marginTop:20,fontSize:8,color:T.dim,textAlign:"center",maxWidth:360}}>
        Watch a computer build itself from the first electron.<br/>Educational • Functional • VibeCoded
      </div>
      <div style={{marginTop:12,fontSize:7,color:T.dim}}>© 2026 3D3D Canada Cooperative • Atlantic Canada • 75% Maker Share</div>
    </div>}

    {/* ── ELECTRON → SILICON ── */}
    {phase==="electron"&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"80vh"}}>
      <div style={{fontSize:9,color:T.teal,letterSpacing:3,textTransform:"uppercase",marginBottom:20}}>🏭 3D3D.ca — From Electron to OS</div>
      {bootLines.map((l,i)=><div key={i} style={{textAlign:"center",marginBottom:12,animation:"fadeIn .5s ease-in"}}>
        <div style={{fontSize:l.big?48:24,marginBottom:4}}>{l.tx}</div>
        <div style={{fontSize:10,color:T.mut}}>{l.sub}</div>
      </div>)}
    </div>}

    {/* ── BIOS ── */}
    {phase==="bios"&&<div style={{maxWidth:580,margin:"40px auto"}}>
      <div style={{background:"#000",border:`2px solid ${T.dim}`,borderRadius:4,padding:16,minHeight:280}}>
        {bootLines.map((l,i)=><div key={i} style={{color:l.c||T.txt,fontSize:11,lineHeight:2,animation:"fadeIn .2s"}}>{l.tx}</div>)}
        <span style={{color:T.teal,animation:"blink 1s step-end infinite"}}>█</span>
      </div>
    </div>}

    {/* ── KERNEL BOOT ── */}
    {phase==="boot"&&<div style={{maxWidth:580,margin:"30px auto"}}>
      <div style={{textAlign:"center",marginBottom:16}}>
        <div style={{fontSize:36}}>🧠</div>
        <div style={{fontSize:13,fontWeight:700}}><span style={{color:T.teal}}>3D3D</span> EmojiOS™ Booting...</div>
        <div style={{fontSize:8,color:T.mut}}>Initializing Hexacore Kernel</div>
      </div>
      <div style={S.p}><Log logs={logs}/></div>
    </div>}

    {/* ── PANIC ── */}
    {panic&&<div style={{position:"fixed",inset:0,background:"#ff174422",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,animation:"panic .4s infinite alternate"}}>
      <div style={{textAlign:"center",background:T.bg,padding:36,borderRadius:12,border:`2px solid ${T.red}`,maxWidth:380}}>
        <div style={{fontSize:42,marginBottom:10}}>💥🔥☠️🔥💥</div>
        <div style={{fontSize:20,color:T.red,fontWeight:700,marginBottom:4}}>KERNEL PANIC</div>
        <div style={{fontSize:10,color:T.pnk,marginBottom:4}}>not syncing: emoji stack overflow in sector 0xDEAD</div>
        <div style={{fontSize:8,color:T.mut,marginBottom:16,lineHeight:1.8}}>
          Stack: 🧠→💭→🤔→😰→🤯→💀→☠️→🪦<br/>
          EIP: 0x{Math.floor(Math.random()*0xFFFFFF).toString(16).toUpperCase()}<br/>
          CR2: 0x{Math.floor(Math.random()*0xFFFFFF).toString(16).toUpperCase()}<br/>
          🏭 3D3D.ca — even our panics are cooperative
        </div>
        <button onClick={doReboot} style={{background:T.red,color:"#fff",border:"none",borderRadius:6,padding:"10px 24px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>🔄 REBOOT</button>
      </div>
    </div>}

    {/* ── DESKTOP ── */}
    {phase==="run"&&!panic&&<div>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6,padding:"0 2px"}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:16}}>🧠</span>
          <div>
            <span style={{fontSize:11,fontWeight:700,color:T.teal}}>3D3D</span>
            <span style={{fontSize:11,fontWeight:700}}> EmojiOS</span>
            <span style={{fontSize:8,color:T.mut,marginLeft:4}}>v3.0 HexaCore</span>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:8,color:T.mut}}>🦞 OpenClaw {clawState.status}</span>
          <span style={{fontSize:8,color:T.mut}}>tick {tick}</span>
          <span style={{width:6,height:6,borderRadius:"50%",background:T.grn,boxShadow:`0 0 5px ${T.grn}`,animation:"pulse 2s infinite"}}/>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:1,marginBottom:6,overflowX:"auto"}}>
        {TABS.map(t=><button key={t} onClick={()=>setTab(t)} style={{...S.b(tab===t?T.teal:T.mut),background:tab===t?T.teal+"15":"transparent",borderBottom:tab===t?`2px solid ${T.teal}`:"2px solid transparent",borderRadius:"4px 4px 0 0",fontSize:9,padding:"5px 9px",whiteSpace:"nowrap"}}>{t}</button>)}
        <div style={{flex:1}}/>
        <button onClick={()=>spawn()} style={S.b(T.grn)}>🍴</button>
        <button onClick={triggerPanic} style={S.b(T.red)}>💥</button>
        <button onClick={doReboot} style={S.b(T.mut)}>🔄</button>
      </div>

      {/* TAB: SYSTEM */}
      {tab==="🖥️ System"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          <div style={S.p}><div style={S.h}>🔲 CPU (Hexacore)</div><HexCPU cores={cores} tick={tick}/></div>
          <div style={S.p}><div style={S.h}>📦 Memory ({PAGES} pages)</div><Mem pages={pages} procs={procs}/></div>
          <div style={S.p}><div style={S.h}>🔗 IPC</div>
            <div style={{fontSize:8}}>
              <div style={{marginBottom:3}}><span style={{color:T.mut}}>🔗 Pipes:</span> {ipc.pipes.length?ipc.pipes.map((p,i)=><span key={i} style={S.t(T.blu)}>PID{p.from}→{p.to}</span>):<span style={{color:T.dim}}>none</span>}</div>
              <div style={{marginBottom:3}}><span style={{color:T.mut}}>⚡ Sigs:</span> {ipc.sigs.slice(-4).map((s,i)=><span key={i} style={S.t(s.sig==="SIGKILL"?T.red:T.yel)}>{s.sig}→{s.to}</span>)}{!ipc.sigs.length&&<span style={{color:T.dim}}>none</span>}</div>
              <div><span style={{color:T.mut}}>🔒 Sems:</span> {ipc.sems.map((s,i)=><span key={i} style={S.t(s.l?T.red:T.grn)}>{s.l?"🔒":"🔓"}{s.n}</span>)}</div>
            </div>
          </div>
          <div style={S.p}><div style={S.h}>⏰ Cron</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
              {CRONS.map((j,i)=>{const next=j.every-(tick%j.every);const pct=((j.every-next)/j.every)*100;
                return <div key={i} style={{background:T.bg,borderRadius:3,padding:"3px 5px",flex:"1 1 auto",minWidth:60}}>
                  <div style={{fontSize:9}}>{j.e} {j.n.split(" ")[1]}</div>
                  <div style={{height:2,background:T.dim,borderRadius:1,overflow:"hidden",marginTop:2}}><div style={{height:"100%",width:`${pct}%`,background:pct>80?T.yel:T.teal,transition:"width .3s"}}/></div>
                  <div style={{fontSize:7,color:T.mut,marginTop:1}}>in {next}t</div>
                </div>;
              })}
            </div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          <div style={S.p}><div style={{...S.h,justifyContent:"space-between"}}><span>📋 Processes ({procs.filter(p=>p.st!=="zombie").length})</span>
            <select value={sched} onChange={e=>{setSched(e.target.value);log(`📋 Sched→${e.target.value}`,"SCHED",T.teal,T.teal);}}
              style={{background:T.bg,color:T.mut,border:`1px solid ${T.dim}`,borderRadius:3,padding:"1px 3px",fontSize:7,fontFamily:"inherit"}}><option>Round Robin</option><option>Priority</option><option>FIFO</option></select>
          </div><ProcTbl procs={procs} onKill={kill}/></div>
          <div style={S.p}><div style={S.h}>🔌 Devices (10)</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3}}>
              {devs.map(d=><div key={d.id} style={{background:T.bg,borderRadius:3,padding:"3px 5px",display:"flex",alignItems:"center",gap:4,fontSize:9,border:`1px solid ${d.st==="on"?T.grn+"18":T.dim}`}}>
                <span style={{fontSize:12}}>{d.n.split(" ")[0]}</span>
                <div style={{flex:1}}><div style={{fontSize:8,color:T.txt}}>{d.n.split(" ")[1]}</div><div style={{fontSize:7,color:T.mut}}>IRQ{d.irq} {d.drv}</div></div>
                <span style={{width:5,height:5,borderRadius:"50%",background:d.st==="on"?T.grn:d.st==="busy"?T.yel:T.mut,boxShadow:d.st==="on"?`0 0 3px ${T.grn}`:"none"}}/>
              </div>)}
            </div>
          </div>
          <div style={S.p}><div style={S.h}>🌡️ Thermal</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:4}}>
              {[{l:"🧠CPU",v:therm.cpu,u:"°C",m:100},{l:"🎨GPU",v:therm.gpu,u:"°C",m:100},{l:"🌀Fan",v:therm.fan,u:"RPM",m:4500},{l:"⚡Load",v:therm.load,u:"%",m:100}].map(x=>
                <div key={x.l} style={{background:T.bg,borderRadius:3,padding:4,textAlign:"center"}}>
                  <div style={{fontSize:7,color:T.mut}}>{x.l}</div>
                  <div style={{fontSize:14,fontWeight:700,color:x.v>75?T.red:x.v>50?T.yel:T.grn}}>{x.v}</div>
                  <div style={{fontSize:7,color:T.dim}}>{x.u}</div>
                  <div style={{height:2,background:T.dim,borderRadius:1,marginTop:2,overflow:"hidden"}}><div style={{height:"100%",width:`${(x.v/x.m)*100}%`,background:x.v/x.m>.75?T.red:x.v/x.m>.5?T.yel:T.grn,transition:"width .3s"}}/></div>
                </div>
              )}
            </div>
          </div>
          <div style={S.p}><div style={S.h}>📜 Kernel Log</div><Log logs={logs}/></div>
        </div>
      </div>}

      {/* TAB: TERMINAL */}
      {tab==="💻 Term"&&<div style={{display:"grid",gridTemplateColumns:"1fr 260px",gap:6}}>
        <div style={S.p}><div style={S.h}>💻 3D3D Terminal</div><Term onCmd={handleCmd} hist={tHist} cwd={cwd}/>
          <div style={{marginTop:4,fontSize:7,color:T.dim}}>Try: neofetch, ps, top, ping 🦞.claw.ai, spawn 🤖, ls /claw, cat 3d3d.conf</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          <div style={S.p}><div style={S.h}>📁 Quick Cmds</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:2}}>
              {["neofetch","ps","top","free","df","lsdev","thermal","cron","netstat","uptime"].map(c=><button key={c} onClick={()=>handleCmd(c)} style={{...S.b(T.mut),fontSize:7,padding:"2px 5px"}}>{c}</button>)}
            </div>
          </div>
          <div style={S.p}><div style={S.h}>📜 Log</div><Log logs={logs}/></div>
        </div>
      </div>}

      {/* TAB: NETWORK */}
      {tab==="📡 Net"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          <div style={S.p}><div style={S.h}>📡 Packets</div><Net pkts={pkts} hosts={HOSTS} conns={conns}/></div>
          <div style={S.p}><div style={S.h}>🌐 Hosts</div>
            {HOSTS.map((h,i)=><div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"3px 4px",background:T.bg,borderRadius:3,marginBottom:2}}>
              <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:14}}>{h.e}</span><div><div style={{fontSize:9}}>{h.name}</div><div style={{fontSize:7,color:T.mut}}>{h.ip}</div></div></div>
              <button onClick={()=>{sendPkt(h.ip,"🏓PING");log(`🏓 ping ${h.ip}`,"NET",T.blu,T.blu);}} style={{...S.b(T.blu),fontSize:7,padding:"2px 5px"}}>ping</button>
            </div>)}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          <div style={S.p}><div style={S.h}>📊 Net Stats</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4}}>
              {[{l:"📤 Sent",v:pkts.filter(p=>p.dir==="out").length},{l:"📥 Recv",v:pkts.filter(p=>p.dir==="in").length},{l:"✅ OK",v:pkts.filter(p=>p.ok).length},{l:"❌ Fail",v:pkts.filter(p=>!p.ok).length},{l:"🔗 Conns",v:conns.length},{l:"📦 Total",v:stats.pkt}].map(s=>
                <div key={s.l} style={{background:T.bg,borderRadius:3,padding:4,textAlign:"center"}}><div style={{fontSize:7,color:T.mut}}>{s.l}</div><div style={{fontSize:14,fontWeight:700}}>{s.v}</div></div>
              )}
            </div>
          </div>
          <div style={S.p}><div style={S.h}>📜 Log</div><Log logs={logs}/></div>
        </div>
      </div>}

      {/* TAB: ASM */}
      {tab==="🔧 ASM"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
        <div style={S.p}><div style={S.h}>🔧 Emoji Assembly Interpreter</div><AsmPanel onRun={runAsm} asmSt={asmSt}/></div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          <div style={S.p}><div style={S.h}>📖 ISA Reference (20 opcodes)</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1}}>
              {Object.entries({
                "📥":"LOAD","📤":"STORE","➕":"ADD","➖":"SUB","✖️":"MUL","➗":"DIV","🔀":"JMP","❓":"JZ",
                "📞":"SYS","🖨️":"PRINT","⏹️":"HALT","🔁":"LOOP","📡":"SEND","📬":"RECV","💾":"DISK",
                "🔒":"LOCK","🔓":"UNLOCK","🎲":"RAND","🔊":"BEEP","💤":"SLEEP"
              }).map(([op,n])=><div key={op} style={{fontSize:8,padding:"1px 3px",display:"flex",gap:3}}><span style={{color:T.teal}}>{op}</span><span style={{color:T.mut}}>{n}</span></div>)}
            </div>
          </div>
          <div style={S.p}><div style={S.h}>📜 Log</div><Log logs={logs}/></div>
        </div>
      </div>}

      {/* TAB: OPENCLAW */}
      {tab==="🦞 Claw"&&<div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:6}}>
        <div style={S.p}><div style={S.h}>🦞 OpenClaw Agent Interface</div><ClawPanel clawState={clawState} onSend={clawSend} logs={logs}/></div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          <div style={S.p}><div style={S.h}>📡 Agent Network</div><Net pkts={pkts.filter(p=>p.to==="🦞.claw.ai"||p.from==="🦞.claw.ai")} hosts={HOSTS.filter(h=>h.ip==="🦞.claw.ai"||h.ip==="🏠.0.0.1")} conns={conns}/></div>
          <div style={S.p}><div style={S.h}>📜 Claw Log</div><Log logs={logs.filter(l=>l.lv==="CLAW"||l.m?.includes("🦞"))}/></div>
        </div>
      </div>}

      {/* TAB: SNAKE */}
      {tab==="🐍 Snake"&&<div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:6}}>
        <div style={S.p}><div style={S.h}>🐍 Emoji Snake — Powered by 3D3D EmojiOS</div><SnakeGame/></div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          <div style={S.p}><div style={S.h}>🎮 Controls</div>
            <div style={{fontSize:9,color:T.txt,lineHeight:1.8}}>
              ⬆️⬇️⬅️➡️ Arrow keys or WASD<br/>
              🍎 Eat apples to grow<br/>
              💀 Don't eat yourself<br/>
              🌀 Walls wrap around<br/>
              <span style={{fontSize:8,color:T.dim,marginTop:4,display:"block"}}>Running as PID on the 3D3D EmojiOS kernel. Yes, this game is a real process.</span>
            </div>
          </div>
          <div style={S.p}><div style={S.h}>📜 Log</div><Log logs={logs}/></div>
        </div>
      </div>}

      {/* TAB: CALC */}
      {tab==="🧮 Calc"&&<div style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:6}}>
        <div style={S.p}><div style={S.h}>🧮 Emoji Calculator</div><EmojiCalc/></div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          <div style={S.p}><div style={S.h}>📖 How it works</div>
            <div style={{fontSize:9,color:T.txt,lineHeight:1.8}}>
              Every calculation runs through the 3D3D EmojiOS ALU.<br/>
              ➕ Addition via emoji accumulator<br/>
              ➖ Subtraction via complement<br/>
              ✖️ Multiplication via shift-add<br/>
              ➗ Division via restoring algorithm<br/>
              <span style={{fontSize:8,color:T.dim,display:"block",marginTop:6}}>This calculator is as real as any other — it's all just electrons at the bottom. Ours just look cuter. 🏭 3D3D.ca</span>
            </div>
          </div>
          <div style={S.p}><div style={S.h}>📜 Log</div><Log logs={logs}/></div>
        </div>
      </div>}

      {/* TAB: PERF */}
      {tab==="📊 Perf"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          <div style={S.p}><div style={S.h}>📈 Real-time Performance</div>
            <Perf data={perf.cpu} label="⚡ CPU %" color={T.teal} max={100}/>
            <Perf data={perf.mem} label="📦 Mem %" color={T.grn} max={100}/>
            <Perf data={perf.net} label="📡 Net" color={T.blu} max={100}/>
            <Perf data={perf.io} label="💾 I/O" color={T.yel} max={100}/>
          </div>
          <div style={S.p}><div style={S.h}>🌡️ Thermal</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:4}}>
              {[{l:"🧠CPU",v:therm.cpu,u:"°C"},{l:"🎨GPU",v:therm.gpu,u:"°C"},{l:"🌀Fan",v:therm.fan,u:"RPM"},{l:"⚡Load",v:therm.load,u:"%"}].map(x=>
                <div key={x.l} style={{background:T.bg,borderRadius:3,padding:4,textAlign:"center"}}><div style={{fontSize:7,color:T.mut}}>{x.l}</div><div style={{fontSize:14,fontWeight:700,color:T.teal}}>{x.v}</div><div style={{fontSize:7,color:T.dim}}>{x.u}</div></div>
              )}
            </div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          <div style={S.p}><div style={S.h}>📊 System Stats</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4}}>
              {[{l:"⏱️ Up",v:`${stats.up}t`},{l:"🍴 Procs",v:stats.procs},{l:"📞 Sys",v:stats.sys},{l:"🔄 CtxSw",v:stats.ctx},{l:"⚡ IRQ",v:stats.irq},{l:"📄 PgFlt",v:stats.pgf},{l:"📡 Pkts",v:stats.pkt},{l:"📦 Mem",v:`${pages.filter(p=>p.pid).length}pg`},{l:"🧠 Active",v:procs.filter(p=>p.st!=="zombie").length}].map(s=>
                <div key={s.l} style={{background:T.bg,borderRadius:3,padding:4,textAlign:"center"}}><div style={{fontSize:7,color:T.mut}}>{s.l}</div><div style={{fontSize:13,fontWeight:700}}>{s.v}</div></div>
              )}
            </div>
          </div>
          <div style={S.p}><div style={S.h}>📜 Kernel Log</div><Log logs={logs}/></div>
        </div>
      </div>}

      {/* Footer */}
      <div style={{display:"flex",gap:10,justifyContent:"center",marginTop:6,padding:3,borderTop:`1px solid ${T.dim}`}}>
        {[`⏱️${stats.up}t`,`🔲×${CORES}`,`🍴${procs.filter(p=>p.st!=="zombie").length}`,`📦${pages.filter(p=>p.pid).length}/${PAGES}`,`🌡️${therm.cpu}°C`,`📡${stats.pkt}`,`🦞${clawState.status}`].map(s=><span key={s} style={{fontSize:7,color:T.mut}}>{s}</span>)}
        <span style={{fontSize:7,color:T.dim}}>|</span>
        <span style={{fontSize:7,color:T.teal}}>3D3D.ca</span>
      </div>
    </div>}

    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
      @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
      @keyframes panic{from{background:#ff174411}to{background:#ff174433}}
      @keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
      *{scrollbar-width:thin;scrollbar-color:${T.dim} ${T.bg};box-sizing:border-box}
      *::-webkit-scrollbar{width:3px}*::-webkit-scrollbar-track{background:${T.bg}}
      *::-webkit-scrollbar-thumb{background:${T.dim};border-radius:2px}
      button:hover{filter:brightness(1.2)}button:active{transform:scale(.97)}
      input::selection{background:${T.teal}33}
    `}</style>
  </div>;
}

// @ts-nocheck
/* eslint-disable */
// EmojiKernel V2 Demo — Advanced multi-core emoji OS simulator
// Converted from emoji-kernel-v2.jsx for integration with OpenKernel EDU

import { useState, useEffect, useRef, useCallback, useReducer } from "react";

// ════════════════════════════════════════════════════════════════════
// 🧠 EmojiKernel™ v2.0 — FULL EMOJI OPERATING SYSTEM
// ════════════════════════════════════════════════════════════════════
// Subsystems: CPU, Memory (paging), Scheduler, Filesystem, Network,
// IPC, Devices, Thermal, Permissions, Cron, Terminal, Assembly, Pipes
// ════════════════════════════════════════════════════════════════════

const TICK_MS = 500;
const MAX_MEMORY = 64;
const MAX_PROCESSES = 12;
const PAGE_SIZE = 4;
const NUM_PAGES = MAX_MEMORY / PAGE_SIZE;
const NET_BUFFER_SIZE = 16;

// ═══════ EMOJI ASSEMBLY LANGUAGE ═══════
// A real instruction set, fully emoji-encoded
const OPCODES = {
  "📥": { name: "LOAD", args: 1, desc: "Load value into accumulator" },
  "📤": { name: "STORE", args: 1, desc: "Store accumulator to address" },
  "➕": { name: "ADD", args: 1, desc: "Add value to accumulator" },
  "➖": { name: "SUB", args: 1, desc: "Subtract value from accumulator" },
  "✖️": { name: "MUL", args: 1, desc: "Multiply accumulator" },
  "➗": { name: "DIV", args: 1, desc: "Divide accumulator" },
  "🔀": { name: "JMP", args: 1, desc: "Jump to address" },
  "❓": { name: "JZ", args: 1, desc: "Jump if accumulator is zero" },
  "📞": { name: "SYSCALL", args: 0, desc: "System call" },
  "🖨️": { name: "PRINT", args: 0, desc: "Print accumulator" },
  "⏹️": { name: "HALT", args: 0, desc: "Stop execution" },
  "🔁": { name: "LOOP", args: 1, desc: "Decrement & jump if not zero" },
  "📡": { name: "SEND", args: 1, desc: "Send to network" },
  "📬": { name: "RECV", args: 0, desc: "Receive from network" },
  "💾": { name: "DISK", args: 1, desc: "Disk I/O operation" },
  "🔒": { name: "LOCK", args: 1, desc: "Acquire mutex" },
  "🔓": { name: "UNLOCK", args: 1, desc: "Release mutex" },
};

// Example programs in Emoji Assembly
const EMOJI_PROGRAMS = {
  "🔢 Counter": ["📥 10", "🖨️", "➖ 1", "🔁 1", "⏹️"],
  "📡 NetPing": ["📥 42", "📡 1", "📬", "🖨️", "⏹️"],
  "🧮 Math": ["📥 7", "✖️ 6", "➕ 0", "🖨️", "⏹️"],
  "🔄 Fibonacci": ["📥 1", "📤 0", "📥 1", "📤 1", "📥 0", "➕ 1", "🖨️", "📤 2", "📥 1", "📤 0", "📥 2", "📤 1", "🔁 5", "⏹️"],
  "💾 DiskTest": ["📥 255", "💾 1", "📥 0", "💾 0", "🖨️", "⏹️"],
};

// ═══════ PROCESS TEMPLATES ═══════
const PROCESS_TEMPLATES = [
  { name: "🌐 Browser", emoji: "🌐", memCost: 4, cpuBurst: 3, priority: 2, color: "#4fc3f7", ioWeight: 3, netUsage: true },
  { name: "🎵 Music", emoji: "🎵", memCost: 2, cpuBurst: 2, priority: 1, color: "#ce93d8", ioWeight: 1, netUsage: false },
  { name: "📧 Mail", emoji: "📧", memCost: 3, cpuBurst: 2, priority: 3, color: "#ffb74d", ioWeight: 2, netUsage: true },
  { name: "🎮 Game", emoji: "🎮", memCost: 6, cpuBurst: 5, priority: 1, color: "#ef5350", ioWeight: 1, netUsage: false },
  { name: "📊 Stats", emoji: "📊", memCost: 2, cpuBurst: 4, priority: 2, color: "#66bb6a", ioWeight: 2, netUsage: false },
  { name: "🤖 AI", emoji: "🤖", memCost: 5, cpuBurst: 6, priority: 1, color: "#00e5ff", ioWeight: 1, netUsage: true },
  { name: "📷 Camera", emoji: "📷", memCost: 3, cpuBurst: 2, priority: 2, color: "#ffa726", ioWeight: 3, netUsage: false },
  { name: "🔐 Crypto", emoji: "🔐", memCost: 4, cpuBurst: 7, priority: 1, color: "#ab47bc", ioWeight: 0, netUsage: true },
  { name: "📝 Editor", emoji: "📝", memCost: 2, cpuBurst: 2, priority: 3, color: "#78909c", ioWeight: 2, netUsage: false },
  { name: "🧪 Lab", emoji: "🧪", memCost: 3, cpuBurst: 3, priority: 2, color: "#26c6da", ioWeight: 1, netUsage: false },
  { name: "🕷️ Spider", emoji: "🕷️", memCost: 2, cpuBurst: 8, priority: 3, color: "#8d6e63", ioWeight: 4, netUsage: true },
  { name: "🛡️ Firewall", emoji: "🛡️", memCost: 3, cpuBurst: 99, priority: 0, color: "#ff7043", ioWeight: 0, netUsage: true },
];

// ═══════ NETWORK ═══════
const NET_HOSTS = [
  { ip: "🏠.0.0.1", name: "localhost", emoji: "🏠" },
  { ip: "🌐.8.8.8", name: "emoji-dns", emoji: "🔍" },
  { ip: "☁️.1.1.1", name: "cloud-cdn", emoji: "☁️" },
  { ip: "🏢.10.0.1", name: "corp-server", emoji: "🏢" },
  { ip: "🎮.42.0.69", name: "game-server", emoji: "🎮" },
  { ip: "🤖.ai.0.1", name: "ml-cluster", emoji: "🤖" },
];

const NET_PROTOCOLS = ["🌍 HTTP", "🔒 HTTPS", "📧 SMTP", "📁 FTP", "🔌 SSH", "🏓 PING", "📡 UDP", "🤝 TCP"];

// ═══════ DEVICES ═══════
const DEVICES = [
  { id: "dev0", name: "⌨️ Keyboard", type: "input", irq: 1, status: "active", driver: "emoji-hid" },
  { id: "dev1", name: "🖱️ Mouse", type: "input", irq: 2, status: "active", driver: "emoji-hid" },
  { id: "dev2", name: "🖥️ Display", type: "output", irq: 3, status: "active", driver: "emoji-gpu" },
  { id: "dev3", name: "🔊 Audio", type: "output", irq: 4, status: "active", driver: "emoji-snd" },
  { id: "dev4", name: "📶 WiFi", type: "network", irq: 5, status: "active", driver: "emoji-net" },
  { id: "dev5", name: "💾 SSD", type: "storage", irq: 6, status: "active", driver: "emoji-nvme" },
  { id: "dev6", name: "📸 Webcam", type: "input", irq: 7, status: "idle", driver: "emoji-v4l" },
  { id: "dev7", name: "🖨️ Printer", type: "output", irq: 8, status: "idle", driver: "emoji-cups" },
];

// ═══════ FILESYSTEM v2 ═══════
const initialFS = {
  "/": { type: "dir", emoji: "🏠", perm: "rwxr-xr-x", owner: "root", children: ["bin", "home", "etc", "tmp", "dev", "var"] },
  "/bin": { type: "dir", emoji: "⚙️", perm: "rwxr-xr-x", owner: "root", children: ["ls", "cat", "ps", "top", "ping", "asm"] },
  "/bin/ls": { type: "exec", emoji: "📋", perm: "rwxr-xr-x", owner: "root", size: 2 },
  "/bin/cat": { type: "exec", emoji: "🐱", perm: "rwxr-xr-x", owner: "root", size: 1 },
  "/bin/ps": { type: "exec", emoji: "📊", perm: "rwxr-xr-x", owner: "root", size: 1 },
  "/bin/top": { type: "exec", emoji: "📈", perm: "rwxr-xr-x", owner: "root", size: 2 },
  "/bin/ping": { type: "exec", emoji: "🏓", perm: "rwxr-xr-x", owner: "root", size: 1 },
  "/bin/asm": { type: "exec", emoji: "🔧", perm: "rwxr-xr-x", owner: "root", size: 3 },
  "/home": { type: "dir", emoji: "🏡", perm: "rwxr-xr-x", owner: "root", children: ["user"] },
  "/home/user": { type: "dir", emoji: "👤", perm: "rwx------", owner: "user", children: ["readme.md", "notes.txt", "photo.png", "program.asm"] },
  "/home/user/readme.md": { type: "file", emoji: "📄", perm: "rw-r--r--", owner: "user", size: 3, content: "👋🌍✨ Welcome to EmojiOS!" },
  "/home/user/notes.txt": { type: "file", emoji: "📝", perm: "rw-------", owner: "user", size: 2, content: "🔑🗝️ secret notes" },
  "/home/user/photo.png": { type: "file", emoji: "🖼️", perm: "rw-r--r--", owner: "user", size: 8, content: "🌅🏔️🌊🌴🦋🌸🌈🦜" },
  "/home/user/program.asm": { type: "file", emoji: "💻", perm: "rwxr--r--", owner: "user", size: 4, content: "📥 42\n🖨️\n⏹️" },
  "/etc": { type: "dir", emoji: "⚙️", perm: "rwxr-xr-x", owner: "root", children: ["passwd", "hosts", "crontab"] },
  "/etc/passwd": { type: "file", emoji: "🔑", perm: "rw-r--r--", owner: "root", size: 2, content: "root:🔒:0\nuser:🔓:1000" },
  "/etc/hosts": { type: "file", emoji: "🌐", perm: "rw-r--r--", owner: "root", size: 3, content: "🏠.0.0.1 localhost\n🌐.8.8.8 dns\n☁️.1.1.1 cdn" },
  "/etc/crontab": { type: "file", emoji: "⏰", perm: "rw-r--r--", owner: "root", size: 2, content: "*/5 * 🧹 cleanup\n*/10 * 📊 stats" },
  "/tmp": { type: "dir", emoji: "📁", perm: "rwxrwxrwx", owner: "root", children: [] },
  "/dev": { type: "dir", emoji: "🔌", perm: "rwxr-xr-x", owner: "root", children: ["null", "random", "zero"] },
  "/dev/null": { type: "device", emoji: "🕳️", perm: "rw-rw-rw-", owner: "root", size: 0, content: "∅" },
  "/dev/random": { type: "device", emoji: "🎲", perm: "rw-rw-rw-", owner: "root", size: 0, content: "🎰" },
  "/dev/zero": { type: "device", emoji: "0️⃣", perm: "rw-rw-rw-", owner: "root", size: 0, content: "0" },
  "/var": { type: "dir", emoji: "📊", perm: "rwxr-xr-x", owner: "root", children: ["log"] },
  "/var/log": { type: "dir", emoji: "📜", perm: "rwxr-xr-x", owner: "root", children: ["syslog", "kern.log"] },
  "/var/log/syslog": { type: "file", emoji: "📜", perm: "rw-r--r--", owner: "root", size: 5, content: "kernel: booted OK" },
  "/var/log/kern.log": { type: "file", emoji: "🧠", perm: "rw-r--r--", owner: "root", size: 3, content: "EmojiKernel initialized" },
};

// ═══════ CRON JOBS ═══════
const CRON_JOBS = [
  { schedule: 10, name: "🧹 Cleanup", action: "gc", emoji: "🧹" },
  { schedule: 15, name: "📊 Stats", action: "stats", emoji: "📊" },
  { schedule: 20, name: "🔄 Sync", action: "sync", emoji: "🔄" },
  { schedule: 25, name: "🛡️ Scan", action: "scan", emoji: "🛡️" },
  { schedule: 30, name: "💾 Backup", action: "backup", emoji: "💾" },
];

let pidCounter = 1;
let packetId = 1;

function createProcess(template) {
  return {
    pid: pidCounter++, ...template, state: "ready", pages: [],
    burstLeft: template.cpuBurst, totalTicks: 0, syscalls: 0, age: 0,
    signals: [], pipes: { stdin: [], stdout: [] }, fd: [0, 1, 2],
    user: "user", nice: 0, cpuPercent: 0, ioOps: 0,
  };
}

// ═══════ SHARED STYLES ═══════
const S = {
  panel: { background: "#0c0c14", border: "1px solid #1a1a2e", borderRadius: 8, padding: 12 },
  panelTitle: { fontSize: 9, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 },
  mono: { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" },
  btn: (c) => ({
    background: c + "18", color: c, border: `1px solid ${c}33`,
    borderRadius: 5, padding: "5px 10px", fontSize: 10, fontWeight: 600,
    cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", outline: "none",
  }),
  tag: (c) => ({
    display: "inline-flex", alignItems: "center", gap: 3,
    background: c + "15", color: c, border: `1px solid ${c}25`,
    borderRadius: 4, padding: "2px 6px", fontSize: 9, fontWeight: 500,
  }),
};

// ═══════ SUBSYSTEM COMPONENTS ═══════

function KernelLog({ logs }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [logs]);

  return (
    <div ref={ref} style={{
      background: "#07070b", border: "1px solid #111118", borderRadius: 6,
      padding: 10, height: 150, overflowY: "auto",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontSize: 10, lineHeight: 1.7,
    }}>
      {logs.map((log, i) => (
        <div key={i} style={{ color: log.color || "#8892b0", opacity: Math.max(0.35, 1 - (logs.length - i) * 0.025) }}>
          <span style={{ color: "#3a3a4e", marginRight: 5 }}>{String(log.tick).padStart(4, "0")}</span>
          <span style={{ color: log.levelColor || "#6366f1", marginRight: 5 }}>{log.level}</span>
          {log.msg}
        </div>
      ))}
      {logs.length === 0 && <div style={{ color: "#2a2a3e" }}>⏳ awaiting boot...</div>}
    </div>
  );
}

function TerminalEmulator({ onCmd, history, cwd }) {
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const submit = () => {
    if (!input.trim()) return;
    setCmdHistory(prev => [input, ...prev]);
    setHistIdx(-1);
    onCmd(input.trim());
    setInput("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter") submit();
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (histIdx < cmdHistory.length - 1) {
        const ni = histIdx + 1;
        setHistIdx(ni);
        setInput(cmdHistory[ni]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx > 0) {
        const ni = histIdx - 1;
        setHistIdx(ni);
        setInput(cmdHistory[ni]);
      } else { setHistIdx(-1); setInput(""); }
    }
  };

  return (
    <div style={{ ...S.mono, background: "#07070b", borderRadius: 6, overflow: "hidden", border: "1px solid #1a1a2e" }}>
      <div style={{ background: "#111118", padding: "4px 10px", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid #1a1a2e" }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef5350" }} />
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffb74d" }} />
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#66bb6a" }} />
        <span style={{ fontSize: 9, color: "#4a5568", marginLeft: 8 }}>emoji-terminal — {cwd}</span>
      </div>
      <div ref={scrollRef} onClick={() => inputRef.current?.focus()} style={{ padding: 10, height: 210, overflowY: "auto", fontSize: 11, lineHeight: 1.7, cursor: "text" }}>
        {history.map((h, i) => (
          <div key={i} style={{ color: h.type === "cmd" ? "#66bb6a" : h.type === "error" ? "#ef5350" : h.type === "system" ? "#6366f1" : "#8892b0", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
            {h.type === "cmd" && <span style={{ color: "#4fc3f7" }}>👤 {cwd}$ </span>}
            {h.text}
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ color: "#4fc3f7", marginRight: 4 }}>👤 {cwd}$</span>
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
            style={{ background: "transparent", border: "none", color: "#e2e8f0", fontFamily: "inherit", fontSize: 11, flex: 1, outline: "none", caretColor: "#66bb6a" }}
            spellCheck={false} autoComplete="off" />
          <span style={{ color: "#66bb6a", animation: "blink 1s step-end infinite" }}>█</span>
        </div>
      </div>
    </div>
  );
}

function NetworkViz({ packets, hosts, connections }) {
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
        {hosts.map((h, i) => (
          <div key={i} style={{
            ...S.tag(connections.includes(h.ip) ? "#66bb6a" : "#4a5568"),
            fontSize: 9,
          }}>
            {h.emoji} <span style={{ fontSize: 8 }}>{h.ip}</span>
          </div>
        ))}
      </div>
      <div style={{ height: 72, overflowY: "auto", background: "#07070b", borderRadius: 4, padding: 6 }}>
        {packets.slice(-12).map((p, i) => (
          <div key={i} style={{ fontSize: 9, color: "#8892b0", display: "flex", gap: 6, alignItems: "center", padding: "1px 0", opacity: Math.max(0.3, 1 - (packets.length - i - 1) * 0.08) }}>
            <span style={S.tag(p.direction === "out" ? "#4fc3f7" : "#66bb6a")}>{p.direction === "out" ? "📤" : "📥"}</span>
            <span style={{ color: "#6b7280" }}>#{String(p.id).padStart(3, "0")}</span>
            <span>{p.proto}</span>
            <span style={{ color: "#4a5568" }}>{p.from} → {p.to}</span>
            <span style={{ color: p.status === "✅" ? "#66bb6a" : p.status === "❌" ? "#ef5350" : "#ffb74d" }}>{p.status}</span>
            <span style={{ color: "#4a5568", fontSize: 8 }}>{p.size}📦</span>
          </div>
        ))}
        {packets.length === 0 && <div style={{ color: "#2a2a3e", fontSize: 9, textAlign: "center", padding: 8 }}>no packets</div>}
      </div>
    </div>
  );
}

function DeviceManager({ devices }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
      {devices.map(d => (
        <div key={d.id} style={{
          background: "#07070b", borderRadius: 4, padding: "5px 7px",
          border: `1px solid ${d.status === "active" ? "#66bb6a22" : d.status === "busy" ? "#ffb74d22" : "#1a1a2e"}`,
          display: "flex", alignItems: "center", gap: 5, fontSize: 10,
        }}>
          <span style={{ fontSize: 14 }}>{d.name.split(" ")[0]}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "#e2e8f0", fontSize: 9, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.name.split(" ")[1]}</div>
            <div style={{ color: "#4a5568", fontSize: 8 }}>IRQ{d.irq} • {d.driver}</div>
          </div>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: d.status === "active" ? "#66bb6a" : d.status === "busy" ? "#ffb74d" : "#4a5568",
            boxShadow: d.status === "active" ? "0 0 4px #66bb6a" : "none",
          }} />
        </div>
      ))}
    </div>
  );
}

function ThermalMonitor({ cpuTemp, gpuTemp, fanSpeed, load }) {
  const tempColor = (t) => t > 80 ? "#ef5350" : t > 60 ? "#ffb74d" : "#66bb6a";
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
      {[
        { label: "🧠 CPU", val: cpuTemp, unit: "°C", max: 100 },
        { label: "🎨 GPU", val: gpuTemp, unit: "°C", max: 100 },
        { label: "🌀 Fan", val: fanSpeed, unit: "RPM", max: 5000 },
        { label: "⚡ Load", val: load, unit: "%", max: 100 },
      ].map(m => (
        <div key={m.label} style={{ background: "#07070b", borderRadius: 4, padding: 6, textAlign: "center" }}>
          <div style={{ fontSize: 9, color: "#6b7280", marginBottom: 3 }}>{m.label}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: m.label.includes("CPU") || m.label.includes("GPU") ? tempColor(m.val) : m.label.includes("Load") ? tempColor(m.val) : "#4fc3f7" }}>
            {m.val}
          </div>
          <div style={{ fontSize: 8, color: "#4a5568" }}>{m.unit}</div>
          <div style={{ height: 3, background: "#1a1a2e", borderRadius: 2, marginTop: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(m.val / m.max) * 100}%`, background: m.label.includes("CPU") || m.label.includes("GPU") ? tempColor(m.val) : "#4fc3f7", borderRadius: 2, transition: "width 0.3s" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function IPCMonitor({ pipes, signals, semaphores }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div>
        <div style={{ fontSize: 8, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>🔗 Pipes</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {pipes.length === 0 && <span style={{ fontSize: 9, color: "#2a2a3e" }}>none</span>}
          {pipes.map((p, i) => (
            <div key={i} style={S.tag("#4fc3f7")}>
              PID{p.from} {p.data} → PID{p.to}
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 8, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>⚡ Signals</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {signals.length === 0 && <span style={{ fontSize: 9, color: "#2a2a3e" }}>none</span>}
          {signals.slice(-6).map((s, i) => (
            <div key={i} style={S.tag(s.sig === "SIGKILL" ? "#ef5350" : s.sig === "SIGSTOP" ? "#ffb74d" : "#ce93d8")}>
              {s.sig} → PID{s.to}
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 8, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>🔒 Semaphores</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {semaphores.map((s, i) => (
            <div key={i} style={S.tag(s.locked ? "#ef5350" : "#66bb6a")}>
              {s.locked ? "🔒" : "🔓"} {s.name} {s.locked ? `(PID${s.owner})` : "(free)"}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AsmInterpreter({ onRun, output, running: asmRunning, program, pc }) {
  const [selected, setSelected] = useState("🔢 Counter");
  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: 6, flexWrap: "wrap" }}>
        {Object.keys(EMOJI_PROGRAMS).map(name => (
          <button key={name} onClick={() => setSelected(name)}
            style={{ ...S.btn(selected === name ? "#6366f1" : "#4a5568"), fontSize: 9, padding: "3px 7px" }}>
            {name}
          </button>
        ))}
      </div>
      <div style={{ background: "#07070b", borderRadius: 4, padding: 6, marginBottom: 6, fontSize: 10, lineHeight: 1.8 }}>
        {EMOJI_PROGRAMS[selected].map((line, i) => (
          <div key={i} style={{
            color: pc === i && asmRunning ? "#66bb6a" : "#8892b0",
            background: pc === i && asmRunning ? "#66bb6a11" : "transparent",
            borderRadius: 2, padding: "0 4px",
            transition: "all 0.15s",
          }}>
            <span style={{ color: "#4a5568", marginRight: 6, fontSize: 8 }}>{String(i).padStart(2, "0")}</span>
            {line}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <button onClick={() => onRun(selected, EMOJI_PROGRAMS[selected])} style={S.btn("#66bb6a")} disabled={asmRunning}>
          {asmRunning ? "⏳ Running..." : "▶️ Execute"}
        </button>
        {output.length > 0 && (
          <div style={{ fontSize: 9, color: "#ce93d8", flex: 1 }}>
            Output: {output.join(" ")}
          </div>
        )}
      </div>
    </div>
  );
}

function PerfGraph({ data, label, color, max }) {
  const h = 40;
  const w = 200;
  const points = data.slice(-40);
  if (points.length < 2) return null;
  const step = w / (points.length - 1);
  const path = points.map((v, i) => {
    const x = i * step;
    const y = h - (v / max) * h;
    return `${i === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ");
  const area = path + ` L${(points.length - 1) * step},${h} L0,${h} Z`;
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ fontSize: 8, color: "#6b7280", marginBottom: 2, display: "flex", justifyContent: "space-between" }}>
        <span>{label}</span>
        <span style={{ color }}>{points[points.length - 1]?.toFixed?.(0) ?? points[points.length - 1]}</span>
      </div>
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
        <defs>
          <linearGradient id={`g-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#g-${label})`} />
        <path d={path} fill="none" stroke={color} strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function MemoryMapV2({ pages, processes }) {
  const procMap = {};
  processes.forEach(p => { procMap[p.pid] = p; });
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(16, 1fr)", gap: 1.5 }}>
        {pages.map((page, i) => {
          const proc = page.pid ? procMap[page.pid] : null;
          const bg = proc ? proc.color + "28" : page.swapped ? "#ffb74d15" : "#0a0a0f";
          const border = proc ? proc.color + "44" : page.swapped ? "#ffb74d33" : "#151520";
          return (
            <div key={i} title={proc ? `Page ${i}: PID ${proc.pid} ${proc.name}${page.dirty ? " [dirty]" : ""}` : page.swapped ? `Page ${i}: swapped` : `Page ${i}: free`}
              style={{
                aspectRatio: "1", background: bg, border: `1px solid ${border}`,
                borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 8, cursor: "default", transition: "all 0.2s", position: "relative",
              }}>
              {proc ? proc.emoji : page.swapped ? "💿" : ""}
              {page.dirty && <span style={{ position: "absolute", top: -1, right: -1, fontSize: 5 }}>✏️</span>}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 4, fontSize: 9, color: "#4a5568", display: "flex", justifyContent: "space-between" }}>
        <span>📦 {pages.filter(p => p.pid).length}/{NUM_PAGES} pages used</span>
        <span>💿 {pages.filter(p => p.swapped).length} swapped</span>
        <span>✏️ {pages.filter(p => p.dirty).length} dirty</span>
      </div>
    </div>
  );
}

function ProcessTableV2({ processes, onKill, onSignal }) {
  const stEmoji = { running: "🟢", ready: "🟡", blocked: "🔴", zombie: "💀", sleeping: "😴", stopped: "⏸️" };
  if (processes.length === 0) return <div style={{ color: "#2a2a3e", textAlign: "center", padding: 12, fontSize: 10 }}>no processes</div>;
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #1a1a2e" }}>
            {["PID", "", "State", "CPU", "Mem", "I/O", "Net", ""].map(h => (
              <th key={h} style={{ padding: "4px 5px", textAlign: "left", color: "#4a5568", fontWeight: 500, fontSize: 8, textTransform: "uppercase", letterSpacing: 1 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {processes.map(p => (
            <tr key={p.pid} style={{ borderBottom: "1px solid #0f0f18" }}>
              <td style={{ padding: "3px 5px", color: p.color, fontWeight: 700, fontSize: 10 }}>{p.pid}</td>
              <td style={{ padding: "3px 5px", fontSize: 12 }} title={p.name}>{p.emoji}</td>
              <td style={{ padding: "3px 5px" }}><span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>{stEmoji[p.state]} <span style={{ fontSize: 8, color: "#6b7280" }}>{p.state}</span></span></td>
              <td style={{ padding: "3px 5px" }}>
                <div style={{ width: 36, height: 4, background: "#1a1a2e", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${p.cpuPercent}%`, height: "100%", background: p.color, transition: "width 0.3s" }} />
                </div>
              </td>
              <td style={{ padding: "3px 5px", fontSize: 9 }}>{p.pages.length}pg</td>
              <td style={{ padding: "3px 5px", fontSize: 9, color: "#6b7280" }}>{p.ioOps}</td>
              <td style={{ padding: "3px 5px" }}>{p.netUsage ? "📶" : ""}</td>
              <td style={{ padding: "3px 5px" }}>
                {p.state !== "zombie" && (
                  <button onClick={() => onKill(p.pid)} style={{ ...S.btn("#ef5350"), padding: "1px 5px", fontSize: 8 }}>kill</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CronDaemon({ jobs, tick }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
      {jobs.map((j, i) => {
        const next = j.schedule - (tick % j.schedule);
        const pct = ((j.schedule - next) / j.schedule) * 100;
        return (
          <div key={i} style={{ background: "#07070b", borderRadius: 4, padding: "4px 7px", flex: "1 1 auto", minWidth: 70 }}>
            <div style={{ fontSize: 10, marginBottom: 2 }}>{j.emoji} {j.name.split(" ")[1]}</div>
            <div style={{ height: 3, background: "#1a1a2e", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: pct > 80 ? "#ffb74d" : "#6366f1", borderRadius: 2, transition: "width 0.3s" }} />
            </div>
            <div style={{ fontSize: 8, color: "#4a5568", marginTop: 2 }}>in {next}t</div>
          </div>
        );
      })}
    </div>
  );
}

function CPUPipelineV2({ currentProc, tick, cores }) {
  const stages = ["📥 Fetch", "🔍 Decode", "⚡ Exec", "📦 Mem", "📤 WB"];
  return (
    <div>
      {cores.map((core, ci) => {
        const proc = core.proc;
        const stage = proc ? tick % 5 : -1;
        return (
          <div key={ci} style={{ marginBottom: ci < cores.length - 1 ? 6 : 0 }}>
            <div style={{ fontSize: 8, color: "#4a5568", marginBottom: 3, display: "flex", justifyContent: "space-between" }}>
              <span>Core {ci} {proc ? `• PID ${proc.pid} ${proc.emoji}` : "• idle"}</span>
              <span>{proc ? "🟢" : "💤"}</span>
            </div>
            <div style={{ display: "flex", gap: 2 }}>
              {stages.map((s, si) => (
                <div key={si} style={{
                  flex: 1, padding: "3px 0", textAlign: "center", fontSize: 8,
                  background: si <= stage && proc ? proc.color + "22" : "#0a0a0f",
                  border: `1px solid ${si <= stage && proc ? proc.color + "44" : "#151520"}`,
                  borderRadius: 3, transition: "all 0.2s", color: si <= stage && proc ? proc.color : "#2a2a3e",
                }}>
                  {s.split(" ")[0]}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FileSystemTree({ fs, cwd, onNavigate }) {
  const node = fs[cwd];
  if (!node || node.type !== "dir") return null;
  const parent = cwd === "/" ? null : cwd.split("/").slice(0, -1).join("/") || "/";
  return (
    <div style={{ fontSize: 10 }}>
      <div style={{ color: "#4fc3f7", marginBottom: 4, fontSize: 9 }}>📍 {cwd}</div>
      {parent && (
        <div onClick={() => onNavigate(parent)}
          style={{ padding: "2px 4px", cursor: "pointer", color: "#6b7280", borderRadius: 3 }}
          onMouseEnter={e => { e.currentTarget.style.background = "#1a1a2e"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
          📁 ..
        </div>
      )}
      {(node.children || []).map(child => {
        const childPath = cwd === "/" ? `/${child}` : `${cwd}/${child}`;
        const childNode = fs[childPath];
        if (!childNode) return null;
        const isDir = childNode.type === "dir";
        return (
          <div key={child} onClick={() => isDir ? onNavigate(childPath) : null}
            style={{ padding: "2px 4px", cursor: isDir ? "pointer" : "default", borderRadius: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#1a1a2e"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
            <span>{childNode.emoji} {child}</span>
            <span style={{ color: "#2a2a3e", fontSize: 8 }}>{childNode.perm}</span>
          </div>
        );
      })}
    </div>
  );
}

// ═══════ MAIN KERNEL ═══════

export default function EmojiKernelV2() {
  const [phase, setPhase] = useState("off"); // off, bios, booting, running
  const [tick, setTick] = useState(0);
  const [activeTab, setActiveTab] = useState("🖥️ System");
  const [processes, setProcesses] = useState([]);
  const [pages, setPages] = useState(Array.from({ length: NUM_PAGES }, () => ({ pid: null, dirty: false, swapped: false, accessed: 0 })));
  const [logs, setLogs] = useState([]);
  const [termHistory, setTermHistory] = useState([]);
  const [cwd, setCwd] = useState("/home/user");
  const [fs, setFs] = useState(initialFS);
  const [packets, setPackets] = useState([]);
  const [netConnections, setNetConnections] = useState(["🏠.0.0.1"]);
  const [devices, setDevices] = useState(DEVICES);
  const [thermal, setThermal] = useState({ cpu: 35, gpu: 30, fan: 800, load: 0 });
  const [ipc, setIpc] = useState({ pipes: [], signals: [], semaphores: [{ name: "mutex0", locked: false, owner: null }, { name: "mutex1", locked: false, owner: null }, { name: "sem_io", locked: false, owner: null }] });
  const [perfHistory, setPerfHistory] = useState({ cpu: [], mem: [], net: [], io: [] });
  const [scheduler, setScheduler] = useState("Round Robin");
  const [panicMode, setPanicMode] = useState(false);
  const [asmState, setAsmState] = useState({ running: false, output: [], pc: 0, acc: 0, mem: {}, program: [] });
  const [biosLines, setBiosLines] = useState([]);
  const [stats, setStats] = useState({ totalSyscalls: 0, totalProcesses: 0, contextSwitches: 0, uptime: 0, interrupts: 0, pageFaults: 0, packetsTotal: 0 });

  const stateRef = useRef({});
  useEffect(() => {
    stateRef.current = { processes, pages, tick, stats, thermal, packets, netConnections, ipc, devices, asmState, fs, cwd };
  });

  const log = useCallback((msg, level = "INFO", color, levelColor) => {
    setLogs(prev => [...prev.slice(-120), { msg, level, color, levelColor, tick: stateRef.current.tick }]);
  }, []);

  const termOut = useCallback((text, type = "output") => {
    setTermHistory(prev => [...prev.slice(-100), { text, type }]);
  }, []);

  // ═══ BIOS BOOT SEQUENCE ═══
  const startBios = useCallback(() => {
    setPhase("bios");
    const lines = [
      { t: 0, text: "EmojiCorp™ BIOS v3.7 — POST Sequence", color: "#4fc3f7" },
      { t: 200, text: "Checking 🧠 CPU... EmojiCore™ Dual-Core @ ∞ GHz ✅", color: "#e2e8f0" },
      { t: 400, text: `Checking 📦 RAM... ${MAX_MEMORY} emoji blocks (${NUM_PAGES} pages × ${PAGE_SIZE} blocks) ✅`, color: "#e2e8f0" },
      { t: 600, text: "Checking 💾 Storage... EmojiFS v2.0 — 256 emoji sectors ✅", color: "#e2e8f0" },
      { t: 800, text: "Checking 📶 Network... Emoji-Net adapter found ✅", color: "#e2e8f0" },
      { t: 1000, text: "Checking 🔌 Devices... 8 devices enumerated ✅", color: "#e2e8f0" },
      { t: 1200, text: "Checking 🔐 Security... Emoji-Guard™ active ✅", color: "#e2e8f0" },
      { t: 1500, text: "POST complete — all systems nominal", color: "#66bb6a" },
      { t: 1800, text: "Loading EmojiKernel™ v2.0...", color: "#6366f1" },
    ];
    lines.forEach(l => {
      setTimeout(() => setBiosLines(prev => [...prev, l]), l.t);
    });
    setTimeout(() => {
      setPhase("booting");
      startKernelBoot();
    }, 2200);
  }, []);

  const startKernelBoot = useCallback(() => {
    const bootSteps = [
      { t: 0, msg: "🧠 Initializing kernel subsystems...", level: "BOOT" },
      { t: 200, msg: "📦 Memory manager online — paging enabled", level: "MEM" },
      { t: 400, msg: "📋 Process scheduler initialized — Round Robin", level: "SCHED" },
      { t: 600, msg: "💾 EmojiFS v2.0 mounted at /", level: "FS" },
      { t: 800, msg: "🔌 Device drivers loaded — 8 devices", level: "DEV" },
      { t: 1000, msg: "📶 Network stack initialized — 🏠.0.0.1", level: "NET" },
      { t: 1200, msg: "🔗 IPC subsystem online — pipes, signals, semaphores", level: "IPC" },
      { t: 1400, msg: "⏰ Cron daemon started — 5 scheduled jobs", level: "CRON" },
      { t: 1600, msg: "🌡️ Thermal monitor active", level: "THERM" },
      { t: 1800, msg: "🔧 Emoji Assembly interpreter loaded", level: "ASM" },
      { t: 2000, msg: "🛡️ Security module initialized — permissions enforced", level: "SEC" },
      { t: 2200, msg: "✅ EmojiKernel™ v2.0 fully operational", level: "BOOT" },
    ];
    bootSteps.forEach(s => {
      setTimeout(() => log(s.msg, s.level, "#00e5ff", "#00e5ff"), s.t);
    });
    setTimeout(() => {
      setPhase("running");
      log("🖥️ System ready — Welcome to EmojiOS!", "KERN", "#66bb6a", "#66bb6a");
      termOut("Welcome to EmojiOS! Type 'help' for commands.", "system");
    }, 2400);
  }, [log, termOut]);

  // ═══ MEMORY MANAGEMENT ═══
  const allocPages = useCallback((proc) => {
    const needed = Math.ceil(proc.memCost / PAGE_SIZE);
    const pgs = [...stateRef.current.pages];
    const allocated = [];
    for (let i = 0; i < NUM_PAGES && allocated.length < needed; i++) {
      if (!pgs[i].pid && !pgs[i].swapped) {
        pgs[i] = { pid: proc.pid, dirty: false, swapped: false, accessed: stateRef.current.tick };
        allocated.push(i);
      }
    }
    if (allocated.length < needed) {
      // Try page replacement — evict LRU
      const candidates = pgs.map((p, i) => ({ ...p, idx: i })).filter(p => p.pid && p.pid !== proc.pid).sort((a, b) => a.accessed - b.accessed);
      for (let c of candidates) {
        if (allocated.length >= needed) break;
        pgs[c.idx] = { pid: proc.pid, dirty: false, swapped: false, accessed: stateRef.current.tick };
        allocated.push(c.idx);
        setStats(s => ({ ...s, pageFaults: s.pageFaults + 1 }));
        log(`📄 Page fault — evicted page ${c.idx} (PID ${c.pid})`, "MEM", "#ffb74d", "#ffb74d");
      }
    }
    if (allocated.length < needed) {
      allocated.forEach(i => { pgs[i] = { pid: null, dirty: false, swapped: false, accessed: 0 }; });
      return { success: false, pages: stateRef.current.pages };
    }
    return { success: true, pages: pgs, allocated };
  }, [log]);

  const freePages = useCallback((pid) => {
    setPages(prev => prev.map(p => p.pid === pid ? { pid: null, dirty: false, swapped: false, accessed: 0 } : p));
  }, []);

  // ═══ PROCESS MANAGEMENT ═══
  const spawnProcess = useCallback((template) => {
    const tmpl = template || PROCESS_TEMPLATES[Math.floor(Math.random() * PROCESS_TEMPLATES.length)];
    if (stateRef.current.processes.length >= MAX_PROCESSES) {
      log("⚠️ Process limit — cannot fork", "WARN", "#ffb74d", "#ffb74d");
      return null;
    }
    const proc = createProcess(tmpl);
    const result = allocPages(proc);
    if (!result.success) {
      log(`⚠️ OOM — cannot allocate for ${proc.name}`, "WARN", "#ffb74d", "#ffb74d");
      return null;
    }
    proc.pages = result.allocated;
    setPages(result.pages);
    setProcesses(prev => [...prev, proc]);
    setStats(s => ({ ...s, totalProcesses: s.totalProcesses + 1 }));
    log(`🍴 fork() → PID ${proc.pid} ${proc.name} [${result.allocated.length} pages]`, "KERN", "#66bb6a", "#66bb6a");
    return proc;
  }, [allocPages, log]);

  const killProcess = useCallback((pid) => {
    setProcesses(prev => prev.map(p => p.pid === pid ? { ...p, state: "zombie", age: 0 } : p));
    setIpc(prev => ({ ...prev, signals: [...prev.signals.slice(-10), { sig: "SIGKILL", to: pid }] }));
    log(`💀 kill(${pid}) — SIGKILL`, "KERN", "#ef5350", "#ef5350");
  }, [log]);

  // ═══ NETWORK ═══
  const sendPacket = useCallback((to, proto, size) => {
    const p = {
      id: packetId++, from: "🏠.0.0.1", to: to || NET_HOSTS[Math.floor(Math.random() * NET_HOSTS.length)].ip,
      proto: proto || NET_PROTOCOLS[Math.floor(Math.random() * NET_PROTOCOLS.length)],
      size: size || Math.floor(Math.random() * 8) + 1,
      direction: "out", status: Math.random() > 0.1 ? "✅" : "❌", time: stateRef.current.tick,
    };
    setPackets(prev => [...prev.slice(-40), p]);
    setStats(s => ({ ...s, packetsTotal: s.packetsTotal + 1 }));
    if (!stateRef.current.netConnections.includes(to)) {
      setNetConnections(prev => [...prev, p.to]);
    }
    // Response
    if (p.status === "✅") {
      setTimeout(() => {
        setPackets(prev => [...prev.slice(-40), { ...p, id: packetId++, direction: "in", from: p.to, to: "🏠.0.0.1" }]);
      }, 300);
    }
    return p;
  }, []);

  // ═══ TERMINAL COMMANDS ═══
  const handleCmd = useCallback((cmd) => {
    termOut(cmd, "cmd");
    const parts = cmd.split(/\s+/);
    const c = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (c) {
      case "help":
        termOut("📚 Commands: help, ls, cd, cat, pwd, ps, top, kill, spawn, ping, ifconfig, mount, df, free, uptime, clear, echo, touch, mkdir, rm, chmod, cron, asm, neofetch, panic, reboot, whoami, uname, history, man, pipe, signal, dmesg, lsdev, thermal, netstat", "system");
        break;
      case "ls": {
        const path = args[0] ? (args[0].startsWith("/") ? args[0] : (stateRef.current.cwd === "/" ? "/" + args[0] : stateRef.current.cwd + "/" + args[0])) : stateRef.current.cwd;
        const node = stateRef.current.fs[path];
        if (!node) { termOut(`ls: ${args[0]}: No such file or directory`, "error"); break; }
        if (node.type === "dir") {
          const items = (node.children || []).map(ch => {
            const cp = path === "/" ? `/${ch}` : `${path}/${ch}`;
            const cn = stateRef.current.fs[cp];
            return cn ? `${cn.emoji} ${ch}` : ch;
          });
          termOut(items.join("  "));
        } else { termOut(`${node.emoji} ${path.split("/").pop()}`); }
        break;
      }
      case "cd": {
        const target = args[0] || "/home/user";
        let newPath;
        if (target === "..") { newPath = stateRef.current.cwd.split("/").slice(0, -1).join("/") || "/"; }
        else if (target === "/") { newPath = "/"; }
        else if (target.startsWith("/")) { newPath = target; }
        else { newPath = stateRef.current.cwd === "/" ? `/${target}` : `${stateRef.current.cwd}/${target}`; }
        if (stateRef.current.fs[newPath]?.type === "dir") { setCwd(newPath); }
        else { termOut(`cd: ${target}: Not a directory`, "error"); }
        break;
      }
      case "cat": {
        if (!args[0]) { termOut("cat: missing operand", "error"); break; }
        const fp = args[0].startsWith("/") ? args[0] : (stateRef.current.cwd === "/" ? `/${args[0]}` : `${stateRef.current.cwd}/${args[0]}`);
        const f = stateRef.current.fs[fp];
        if (!f) { termOut(`cat: ${args[0]}: No such file`, "error"); break; }
        if (f.type === "dir") { termOut(`cat: ${args[0]}: Is a directory`, "error"); break; }
        termOut(f.content || "∅");
        break;
      }
      case "pwd": termOut(stateRef.current.cwd); break;
      case "whoami": termOut("👤 user (uid=1000)"); break;
      case "uname":
        termOut("EmojiOS 2.0.0 EmojiKernel™ v2.0 EmojiCore™ Dual-Core emoji64");
        break;
      case "ps":
        if (stateRef.current.processes.length === 0) { termOut("  No processes"); break; }
        termOut("  PID  NAME         STATE     CPU  MEM");
        stateRef.current.processes.forEach(p => {
          termOut(`  ${String(p.pid).padStart(3)}  ${(p.emoji + " " + p.name.split(" ")[1]).padEnd(12)} ${p.state.padEnd(9)} ${String(p.cpuPercent).padStart(3)}% ${p.pages.length}pg`);
        });
        break;
      case "top":
        termOut(`⏱️ Uptime: ${stateRef.current.stats.uptime}t | 🍴 Procs: ${stateRef.current.processes.length} | 📞 Sys: ${stateRef.current.stats.totalSyscalls} | 🔄 CtxSw: ${stateRef.current.stats.contextSwitches}`);
        termOut(`🧠 CPU: ${stateRef.current.thermal.load}% | 🌡️ ${stateRef.current.thermal.cpu}°C | 📦 Mem: ${stateRef.current.pages.filter(p => p.pid).length}/${NUM_PAGES} pages | 📡 Pkts: ${stateRef.current.stats.packetsTotal}`);
        break;
      case "kill":
        if (!args[0]) { termOut("kill: usage: kill <pid>", "error"); break; }
        const kpid = parseInt(args[0]);
        const kproc = stateRef.current.processes.find(p => p.pid === kpid);
        if (!kproc) { termOut(`kill: (${kpid}) - No such process`, "error"); break; }
        killProcess(kpid);
        termOut(`Sent SIGKILL to PID ${kpid}`);
        break;
      case "spawn": {
        const tmpl = args[0] ? PROCESS_TEMPLATES.find(t => t.name.toLowerCase().includes(args[0].toLowerCase()) || t.emoji === args[0]) : null;
        const p = spawnProcess(tmpl);
        if (p) termOut(`Spawned ${p.name} (PID ${p.pid})`);
        else termOut("Failed to spawn process", "error");
        break;
      }
      case "ping": {
        const target = args[0] || "🌐.8.8.8";
        const host = NET_HOSTS.find(h => h.ip === target || h.name === target || h.emoji === target);
        const ip = host ? host.ip : target;
        termOut(`PING ${ip} — 📡 sending...`);
        sendPacket(ip, "🏓 PING", 1);
        setTimeout(() => termOut(`  64 emoji from ${ip}: icmp_seq=1 ttl=64 time=${Math.floor(Math.random() * 50 + 5)}ms`), 400);
        setTimeout(() => termOut(`  64 emoji from ${ip}: icmp_seq=2 ttl=64 time=${Math.floor(Math.random() * 50 + 5)}ms`), 800);
        break;
      }
      case "ifconfig":
        termOut("emoji0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>");
        termOut("        inet 🏠.0.0.1  netmask 🎭.255.255.0  broadcast 📢.0.0.255");
        termOut("        emoji6 🔗::1/128 scope host");
        termOut(`        TX packets ${stateRef.current.stats.packetsTotal} bytes ${stateRef.current.stats.packetsTotal * 64}`);
        break;
      case "df":
        termOut("Filesystem    Size  Used  Avail  Use%  Mounted on");
        termOut(`/dev/emoji0   256📦  ${Object.keys(stateRef.current.fs).length * 2}📦   ${256 - Object.keys(stateRef.current.fs).length * 2}📦    ${Math.floor(Object.keys(stateRef.current.fs).length * 2 / 256 * 100)}%   /`);
        break;
      case "free":
        const used = stateRef.current.pages.filter(p => p.pid).length;
        const swapped = stateRef.current.pages.filter(p => p.swapped).length;
        termOut("              total   used    free   swapped");
        termOut(`Mem:          ${NUM_PAGES}pg    ${used}pg     ${NUM_PAGES - used}pg    ${swapped}pg`);
        break;
      case "uptime":
        termOut(`⏱️ up ${stateRef.current.stats.uptime} ticks, ${stateRef.current.processes.filter(p => p.state !== "zombie").length} processes, load avg: ${(stateRef.current.thermal.load / 100).toFixed(2)}`);
        break;
      case "clear":
        setTermHistory([]);
        break;
      case "echo":
        termOut(args.join(" "));
        break;
      case "touch": {
        if (!args[0]) { termOut("touch: missing operand", "error"); break; }
        const tp = args[0].startsWith("/") ? args[0] : (stateRef.current.cwd === "/" ? `/${args[0]}` : `${stateRef.current.cwd}/${args[0]}`);
        const parent = tp.split("/").slice(0, -1).join("/") || "/";
        const name = tp.split("/").pop();
        setFs(prev => {
          const newFs = { ...prev };
          newFs[tp] = { type: "file", emoji: "📄", perm: "rw-r--r--", owner: "user", size: 0, content: "" };
          if (newFs[parent]?.children) newFs[parent] = { ...newFs[parent], children: [...newFs[parent].children, name] };
          return newFs;
        });
        termOut(`Created ${name}`);
        break;
      }
      case "mkdir": {
        if (!args[0]) { termOut("mkdir: missing operand", "error"); break; }
        const mp = args[0].startsWith("/") ? args[0] : `${stateRef.current.cwd}/${args[0]}`;
        const mparent = mp.split("/").slice(0, -1).join("/") || "/";
        const mname = mp.split("/").pop();
        setFs(prev => {
          const newFs = { ...prev };
          newFs[mp] = { type: "dir", emoji: "📁", perm: "rwxr-xr-x", owner: "user", children: [] };
          if (newFs[mparent]?.children) newFs[mparent] = { ...newFs[mparent], children: [...newFs[mparent].children, mname] };
          return newFs;
        });
        termOut(`Created directory ${mname}`);
        break;
      }
      case "rm": {
        if (!args[0]) { termOut("rm: missing operand", "error"); break; }
        const rp = args[0].startsWith("/") ? args[0] : `${stateRef.current.cwd}/${args[0]}`;
        if (!stateRef.current.fs[rp]) { termOut(`rm: ${args[0]}: No such file`, "error"); break; }
        const rpparent = rp.split("/").slice(0, -1).join("/") || "/";
        const rname = rp.split("/").pop();
        setFs(prev => {
          const newFs = { ...prev };
          delete newFs[rp];
          if (newFs[rpparent]?.children) newFs[rpparent] = { ...newFs[rpparent], children: newFs[rpparent].children.filter(c => c !== rname) };
          return newFs;
        });
        termOut(`Removed ${rname}`);
        break;
      }
      case "cron":
        CRON_JOBS.forEach(j => {
          const next = j.schedule - (stateRef.current.tick % j.schedule);
          termOut(`${j.emoji} ${j.name.padEnd(12)} every ${j.schedule}t  next: ${next}t`);
        });
        break;
      case "asm":
        termOut("🔧 Emoji Assembly — use the ASM tab to run programs", "system");
        break;
      case "neofetch":
        termOut("        🧠🧠🧠          user@emojiOS");
        termOut("      🧠🧠🧠🧠🧠        ─────────────");
        termOut("    🧠🧠🧠🧠🧠🧠🧠      OS: EmojiOS 2.0");
        termOut("    🧠🧠  🧠  🧠🧠      Kernel: EmojiKernel™ v2.0");
        termOut("    🧠🧠🧠🧠🧠🧠🧠      CPU: EmojiCore™ Dual-Core");
        termOut(`      🧠🧠🧠🧠🧠        Memory: ${stateRef.current.pages.filter(p => p.pid).length}/${NUM_PAGES} pages`);
        termOut(`        🧠🧠🧠          Procs: ${stateRef.current.processes.length}`);
        termOut(`                        Uptime: ${stateRef.current.stats.uptime}t`);
        break;
      case "lsdev":
        stateRef.current.devices.forEach(d => {
          termOut(`  ${d.name}  IRQ${d.irq}  ${d.driver}  [${d.status}]`);
        });
        break;
      case "thermal":
        termOut(`🧠 CPU: ${stateRef.current.thermal.cpu}°C | 🎨 GPU: ${stateRef.current.thermal.gpu}°C | 🌀 Fan: ${stateRef.current.thermal.fan} RPM | ⚡ Load: ${stateRef.current.thermal.load}%`);
        break;
      case "netstat":
        termOut(`Active connections: ${stateRef.current.netConnections.length}`);
        stateRef.current.netConnections.forEach(c => {
          const host = NET_HOSTS.find(h => h.ip === c);
          termOut(`  ${c} ${host ? `(${host.name})` : ""} ESTABLISHED`);
        });
        break;
      case "dmesg":
        stateRef.current.logs ? stateRef.current.logs : [];
        termOut("— kernel ring buffer (last 8) —", "system");
        const recentLogs = stateRef.current.logs || [];
        recentLogs.slice(-8).forEach(l => termOut(`[${String(l.tick).padStart(4,"0")}] ${l.level}: ${l.msg}`));
        break;
      case "pipe": {
        if (args.length < 3) { termOut("pipe: usage: pipe <from_pid> <to_pid> <data>", "error"); break; }
        const [f, t, ...d] = args;
        setIpc(prev => ({ ...prev, pipes: [...prev.pipes.slice(-8), { from: parseInt(f), to: parseInt(t), data: d.join(" ") }] }));
        termOut(`📨 Piped "${d.join(" ")}" from PID ${f} → PID ${t}`);
        break;
      }
      case "signal": {
        if (args.length < 2) { termOut("signal: usage: signal <sig> <pid>", "error"); break; }
        setIpc(prev => ({ ...prev, signals: [...prev.signals.slice(-10), { sig: args[0], to: parseInt(args[1]) }] }));
        termOut(`⚡ Sent ${args[0]} to PID ${args[1]}`);
        break;
      }
      case "panic":
        triggerPanic();
        break;
      case "reboot":
        doReboot();
        break;
      case "man": {
        const topic = args[0] || "man";
        const manPages = {
          ls: "📋 ls — list directory contents. Usage: ls [path]",
          cat: "🐱 cat — concatenate and display file contents. Usage: cat <file>",
          ps: "📊 ps — report process status",
          kill: "💀 kill — terminate a process. Usage: kill <pid>",
          spawn: "🍴 spawn — create a new process. Usage: spawn [name|emoji]",
          ping: "🏓 ping — send ICMP echo request. Usage: ping [host]",
          pipe: "📨 pipe — create IPC pipe. Usage: pipe <from> <to> <data>",
          asm: "🔧 asm — emoji assembly interpreter. See ASM tab",
          man: "📖 man — display manual pages. Usage: man <command>",
        };
        termOut(manPages[topic] || `No manual entry for ${topic}`, manPages[topic] ? "output" : "error");
        break;
      }
      default:
        termOut(`${c}: command not found. Type 'help' for available commands.`, "error");
    }
  }, [killProcess, spawnProcess, sendPacket]);

  // ═══ ASM INTERPRETER ═══
  const runAsm = useCallback((name, program) => {
    setAsmState({ running: true, output: [], pc: 0, acc: 0, mem: {}, program });
    log(`🔧 ASM: Loading program "${name}"`, "ASM", "#ce93d8", "#ce93d8");
    let acc = 0, pc = 0, mem = {}, output = [];
    const maxSteps = 100;
    let step = 0;

    const tick = () => {
      if (pc >= program.length || step >= maxSteps) {
        setAsmState(prev => ({ ...prev, running: false, output, pc }));
        log(`🔧 ASM: Program "${name}" completed — output: [${output.join(", ")}]`, "ASM", "#66bb6a", "#66bb6a");
        return;
      }
      const line = program[pc];
      const [opcode, ...operands] = line.split(" ");
      const val = operands.length > 0 ? parseInt(operands[0]) : 0;
      step++;

      switch (opcode) {
        case "📥": acc = val; break;
        case "📤": mem[val] = acc; break;
        case "➕": acc += (mem[val] !== undefined ? mem[val] : val); break;
        case "➖": acc -= val; break;
        case "✖️": acc *= val; break;
        case "➗": acc = val !== 0 ? Math.floor(acc / val) : 0; break;
        case "🔀": pc = val - 1; break;
        case "❓": if (acc === 0) pc = val - 1; break;
        case "🖨️": output.push(acc); break;
        case "📞": setStats(s => ({ ...s, totalSyscalls: s.totalSyscalls + 1 })); break;
        case "⏹️": pc = program.length; setAsmState(prev => ({ ...prev, running: false, output, pc })); log(`🔧 ASM: HALT — output: [${output.join(", ")}]`, "ASM", "#66bb6a", "#66bb6a"); return;
        case "🔁": acc--; if (acc > 0) { pc = val - 1; } break;
        case "📡": sendPacket(null, "📡 UDP", val); break;
        case "📬": acc = Math.floor(Math.random() * 256); break;
        case "💾": if (val === 1) { log(`💾 DISK: write(${acc})`, "IO", "#ffb74d", "#ffb74d"); } else { acc = Math.floor(Math.random() * 256); log(`💾 DISK: read() → ${acc}`, "IO", "#ffb74d", "#ffb74d"); } break;
        case "🔒": setIpc(prev => ({ ...prev, semaphores: prev.semaphores.map((s, i) => i === val ? { ...s, locked: true, owner: "asm" } : s) })); break;
        case "🔓": setIpc(prev => ({ ...prev, semaphores: prev.semaphores.map((s, i) => i === val ? { ...s, locked: false, owner: null } : s) })); break;
        default: break;
      }
      pc++;
      setAsmState(prev => ({ ...prev, pc, acc, mem: { ...mem }, output: [...output] }));
      setTimeout(tick, 200);
    };
    setTimeout(tick, 100);
  }, [log, sendPacket]);

  const triggerPanic = useCallback(() => {
    setPanicMode(true);
    log("💥💥💥 KERNEL PANIC — not syncing: emoji stack overflow 💥💥💥", "PANIC", "#ff1744", "#ff1744");
  }, [log]);

  const doReboot = useCallback(() => {
    pidCounter = 1; packetId = 1;
    setPhase("off"); setTick(0); setProcesses([]); setLogs([]); setTermHistory([]);
    setPages(Array.from({ length: NUM_PAGES }, () => ({ pid: null, dirty: false, swapped: false, accessed: 0 })));
    setPackets([]); setNetConnections(["🏠.0.0.1"]); setDevices(DEVICES);
    setThermal({ cpu: 35, gpu: 30, fan: 800, load: 0 }); setPanicMode(false); setBiosLines([]);
    setIpc({ pipes: [], signals: [], semaphores: [{ name: "mutex0", locked: false, owner: null }, { name: "mutex1", locked: false, owner: null }, { name: "sem_io", locked: false, owner: null }] });
    setPerfHistory({ cpu: [], mem: [], net: [], io: [] }); setCwd("/home/user"); setFs(initialFS);
    setStats({ totalSyscalls: 0, totalProcesses: 0, contextSwitches: 0, uptime: 0, interrupts: 0, pageFaults: 0, packetsTotal: 0 });
    setAsmState({ running: false, output: [], pc: 0, acc: 0, mem: {}, program: [] });
  }, []);

  // ═══ MAIN KERNEL TICK ═══
  useEffect(() => {
    if (phase !== "running" || panicMode) return;
    const interval = setInterval(() => {
      setTick(prev => prev + 1);
      setStats(prev => ({ ...prev, uptime: prev.uptime + 1 }));

      setProcesses(prev => {
        let procs = prev.map(p => ({ ...p, age: p.age + 1 }));

        // Reap zombies
        const zombies = procs.filter(p => p.state === "zombie" && p.age > 3);
        zombies.forEach(z => {
          freePages(z.pid);
          log(`🪦 reap(${z.pid}) — ${z.name}`, "KERN", "#78909c", "#78909c");
        });
        procs = procs.filter(p => !(p.state === "zombie" && p.age > 3));

        // Wake sleeping
        procs = procs.map(p => {
          if (p.state === "sleeping" && Math.random() < 0.25) {
            return { ...p, state: "ready" };
          }
          return p;
        });

        // Run current
        const running = procs.find(p => p.state === "running");
        if (running) {
          const u = { ...running, burstLeft: running.burstLeft - 1, totalTicks: running.totalTicks + 1, cpuPercent: Math.min(99, running.cpuPercent + 10) };
          // Syscall
          if (Math.random() < 0.2) {
            const scIdx = Math.floor(Math.random() * 10);
            const syscalls = ["📖 read", "📝 write", "🔌 open", "❌ close", "🍴 fork", "💀 exit", "⏳ wait", "📡 send", "📬 recv", "🗺️ mmap"];
            u.syscalls++;
            setStats(s => ({ ...s, totalSyscalls: s.totalSyscalls + 1 }));
            if (scIdx <= 2) { u.ioOps++; }
            if (scIdx === 0 || scIdx === 6 || scIdx === 8) {
              u.state = "sleeping";
              u.burstLeft = u.cpuBurst;
            }
            // Network activity
            if ((scIdx === 7 || scIdx === 8) && u.netUsage) {
              sendPacket(null, null, Math.floor(Math.random() * 4) + 1);
            }
          }
          // Dirty pages
          if (Math.random() < 0.15) {
            setPages(pg => pg.map(p => p.pid === u.pid && Math.random() < 0.3 ? { ...p, dirty: true, accessed: stateRef.current.tick } : p));
          }
          if (u.burstLeft <= 0 && u.state === "running") {
            u.state = "zombie"; u.age = 0;
            log(`✅ PID ${u.pid} ${u.name} completed`, "KERN", "#66bb6a", "#66bb6a");
          } else if (u.state === "running" && procs.filter(p => p.state === "ready").length > 0 && Math.random() < 0.25) {
            u.state = "ready";
            setStats(s => ({ ...s, contextSwitches: s.contextSwitches + 1 }));
          }
          procs = procs.map(p => p.pid === u.pid ? u : p);
        }

        // Schedule
        if (!procs.find(p => p.state === "running")) {
          const ready = procs.filter(p => p.state === "ready");
          if (ready.length > 0) {
            ready.sort((a, b) => a.priority - b.priority);
            procs = procs.map(p => p.pid === ready[0].pid ? { ...p, state: "running" } : p);
            setStats(s => ({ ...s, contextSwitches: s.contextSwitches + 1 }));
          }
        }

        // Decay CPU %
        procs = procs.map(p => ({ ...p, cpuPercent: p.state === "running" ? Math.min(99, p.cpuPercent + 5) : Math.max(0, p.cpuPercent - 8) }));

        // Auto-spawn
        if (procs.filter(p => p.state !== "zombie").length < 2 && Math.random() < 0.3) {
          setTimeout(() => spawnProcess(), 50);
        }

        return procs;
      });

      // Thermal
      setThermal(prev => {
        const activeProcs = stateRef.current.processes.filter(p => p.state === "running" || p.state === "ready").length;
        const load = Math.min(100, Math.floor(activeProcs * 15 + Math.random() * 10));
        const cpu = Math.min(95, Math.max(30, 35 + load * 0.5 + (Math.random() - 0.5) * 5));
        const gpu = Math.min(90, Math.max(25, 28 + load * 0.3 + (Math.random() - 0.5) * 4));
        const fan = Math.min(4500, Math.max(600, Math.floor(600 + cpu * 30 + Math.random() * 200)));
        return { cpu: Math.round(cpu), gpu: Math.round(gpu), fan, load };
      });

      // Perf history
      setPerfHistory(prev => ({
        cpu: [...prev.cpu.slice(-39), stateRef.current.thermal.load],
        mem: [...prev.mem.slice(-39), stateRef.current.pages.filter(p => p.pid).length / NUM_PAGES * 100],
        net: [...prev.net.slice(-39), stateRef.current.packets.filter(p => p.time >= stateRef.current.tick - 1).length * 10],
        io: [...prev.io.slice(-39), stateRef.current.processes.reduce((a, p) => a + (p.state === "sleeping" ? 1 : 0), 0) * 15],
      }));

      // Device status jitter
      setDevices(prev => prev.map(d => ({
        ...d, status: Math.random() < 0.05 ? (d.status === "active" ? "busy" : "active") : d.status,
      })));

      // Cron
      CRON_JOBS.forEach(j => {
        if (stateRef.current.tick > 0 && stateRef.current.tick % j.schedule === 0) {
          log(`⏰ cron: ${j.name}`, "CRON", "#ab47bc", "#ab47bc");
          setStats(s => ({ ...s, interrupts: s.interrupts + 1 }));
        }
      });

      // Random interrupt
      if (Math.random() < 0.05) {
        const dev = DEVICES[Math.floor(Math.random() * DEVICES.length)];
        log(`⚡ IRQ${dev.irq} — ${dev.name} interrupt`, "IRQ", "#ff7043", "#ff7043");
        setStats(s => ({ ...s, interrupts: s.interrupts + 1 }));
      }

    }, TICK_MS);
    return () => clearInterval(interval);
  }, [phase, panicMode, freePages, log, spawnProcess, sendPacket]);

  // ═══ TABS ═══
  const TABS = ["🖥️ System", "💻 Terminal", "📡 Network", "🔧 Assembly", "📊 Perf"];

  const cores = [
    { proc: processes.find(p => p.state === "running") },
    { proc: processes.filter(p => p.state === "ready")[0] || null },
  ];

  // ═══ RENDER ═══
  return (
    <div style={{
      minHeight: "100vh", background: "#06060b", color: "#e2e8f0",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
      padding: 12, boxSizing: "border-box",
    }}>
      {/* ── OFF STATE ── */}
      {phase === "off" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "90vh" }}>
          <div style={{ fontSize: 72, marginBottom: 16, filter: "drop-shadow(0 0 30px #6366f166)" }}>🧠</div>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>EmojiKernel<span style={{ color: "#6366f1" }}>™</span> <span style={{ color: "#4a5568" }}>v2.0</span></div>
          <div style={{ fontSize: 10, color: "#4a5568", letterSpacing: 3, textTransform: "uppercase", marginBottom: 36 }}>Full Emoji Operating System</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginBottom: 36, maxWidth: 400 }}>
            {["🧠 Dual-Core CPU", "📦 Paged Memory", "📋 3 Schedulers", "💾 Full Filesystem", "📡 Network Stack", "🔗 IPC System", "🔌 8 Devices", "🌡️ Thermal Monitor", "⏰ Cron Daemon", "🔧 Emoji Assembly", "💻 Terminal", "📊 Real-time Perf"].map(f => (
              <span key={f} style={S.tag("#6366f1")}>{f}</span>
            ))}
          </div>
          <button onClick={startBios} style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)",
            color: "#fff", border: "none", borderRadius: 10, padding: "16px 48px",
            fontSize: 18, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 0 40px #6366f144, 0 0 80px #6366f122",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.target.style.transform = "scale(1.05)"; }}
          onMouseLeave={e => { e.target.style.transform = "scale(1)"; }}
          >🔌 POWER ON</button>
        </div>
      )}

      {/* ── BIOS ── */}
      {phase === "bios" && (
        <div style={{ maxWidth: 600, margin: "60px auto", ...S.mono }}>
          <div style={{ background: "#000", border: "2px solid #333", borderRadius: 4, padding: 20, minHeight: 300 }}>
            <div style={{ color: "#4fc3f7", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>EmojiCorp™ BIOS v3.7</div>
            {biosLines.map((l, i) => (
              <div key={i} style={{ color: l.color, fontSize: 12, lineHeight: 2, animation: "fadeIn 0.3s ease-in" }}>{l.text}</div>
            ))}
            <span style={{ color: "#66bb6a", animation: "blink 1s step-end infinite" }}>█</span>
          </div>
        </div>
      )}

      {/* ── BOOTING ── */}
      {phase === "booting" && (
        <div style={{ maxWidth: 600, margin: "40px auto" }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🧠</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Booting EmojiKernel™ v2.0...</div>
          </div>
          <div style={{ ...S.panel }}>
            <KernelLog logs={logs} />
          </div>
        </div>
      )}

      {/* ── PANIC ── */}
      {panicMode && (
        <div style={{ position: "fixed", inset: 0, background: "#ff174422", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, animation: "panic-flash 0.4s infinite alternate" }}>
          <div style={{ textAlign: "center", background: "#0a0a0f", padding: 40, borderRadius: 12, border: "2px solid #ff1744", maxWidth: 400 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>💥🔥☠️🔥💥</div>
            <div style={{ fontSize: 22, color: "#ff1744", fontWeight: 700, marginBottom: 6 }}>KERNEL PANIC</div>
            <div style={{ fontSize: 11, color: "#ff8a80", marginBottom: 6 }}>not syncing: emoji stack overflow in sector 0xDEAD</div>
            <div style={{ fontSize: 9, color: "#4a5568", marginBottom: 20, lineHeight: 1.8 }}>
              Stack: 🧠→💭→🤔→😰→🤯→💀→☠️→🪦<br />
              EIP: 0x{Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase()}<br />
              CR2: 0x{Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase()}<br />
              Flags: 🚩🏴🏳️🚩
            </div>
            <button onClick={doReboot} style={{
              background: "#ff1744", color: "#fff", border: "none", borderRadius: 6,
              padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
            }}>🔄 REBOOT SYSTEM</button>
          </div>
        </div>
      )}

      {/* ── MAIN OS ── */}
      {phase === "running" && !panicMode && (
        <div>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, padding: "0 2px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>🧠</span>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700 }}>EmojiKernel™</span>
                <span style={{ fontSize: 9, color: "#4a5568", marginLeft: 6 }}>v2.0</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 9, color: "#6b7280" }}>tick {tick}</span>
              <span style={{
                width: 7, height: 7, borderRadius: "50%", background: "#66bb6a",
                boxShadow: "0 0 6px #66bb6a", animation: "pulse 2s infinite",
              }} />
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 2, marginBottom: 8 }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                ...S.btn(activeTab === tab ? "#6366f1" : "#4a5568"),
                background: activeTab === tab ? "#6366f122" : "transparent",
                borderColor: activeTab === tab ? "#6366f144" : "transparent",
                borderBottom: activeTab === tab ? "2px solid #6366f1" : "2px solid transparent",
                borderRadius: "5px 5px 0 0", fontSize: 10, padding: "6px 12px",
              }}>{tab}</button>
            ))}
            <div style={{ flex: 1 }} />
            <button onClick={() => spawnProcess()} style={S.btn("#66bb6a")}>🍴 Spawn</button>
            <button onClick={triggerPanic} style={S.btn("#ff1744")}>💥</button>
            <button onClick={doReboot} style={S.btn("#78909c")}>🔄</button>
          </div>

          {/* ── TAB: SYSTEM ── */}
          {activeTab === "🖥️ System" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {/* CPU */}
                <div style={S.panel}>
                  <div style={S.panelTitle}>🔲 CPU Pipeline (Dual-Core)</div>
                  <CPUPipelineV2 currentProc={cores[0].proc} tick={tick} cores={cores} />
                </div>
                {/* Memory */}
                <div style={S.panel}>
                  <div style={S.panelTitle}>📦 Memory ({NUM_PAGES} pages × {PAGE_SIZE} blocks)</div>
                  <MemoryMapV2 pages={pages} processes={processes} />
                </div>
                {/* IPC */}
                <div style={S.panel}>
                  <div style={S.panelTitle}>🔗 Inter-Process Communication</div>
                  <IPCMonitor pipes={ipc.pipes} signals={ipc.signals} semaphores={ipc.semaphores} />
                </div>
                {/* Cron */}
                <div style={S.panel}>
                  <div style={S.panelTitle}>⏰ Cron Daemon</div>
                  <CronDaemon jobs={CRON_JOBS} tick={tick} />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {/* Process Table */}
                <div style={S.panel}>
                  <div style={{ ...S.panelTitle, justifyContent: "space-between" }}>
                    <span>📋 Process Table ({processes.filter(p => p.state !== "zombie").length})</span>
                    <select value={scheduler} onChange={e => { setScheduler(e.target.value); log(`📋 Scheduler → ${e.target.value}`, "SCHED", "#6366f1", "#6366f1"); }}
                      style={{ background: "#07070b", color: "#6b7280", border: "1px solid #1a1a2e", borderRadius: 3, padding: "2px 4px", fontSize: 8, fontFamily: "inherit" }}>
                      <option>Round Robin</option><option>Priority</option><option>FIFO</option>
                    </select>
                  </div>
                  <ProcessTableV2 processes={processes} onKill={killProcess} onSignal={() => {}} />
                </div>
                {/* Devices */}
                <div style={S.panel}>
                  <div style={S.panelTitle}>🔌 Device Manager</div>
                  <DeviceManager devices={devices} />
                </div>
                {/* Thermal */}
                <div style={S.panel}>
                  <div style={S.panelTitle}>🌡️ Thermal Monitor</div>
                  <ThermalMonitor cpuTemp={thermal.cpu} gpuTemp={thermal.gpu} fanSpeed={thermal.fan} load={thermal.load} />
                </div>
                {/* FS */}
                <div style={S.panel}>
                  <div style={S.panelTitle}>💾 EmojiFS v2.0</div>
                  <FileSystemTree fs={fs} cwd={cwd} onNavigate={setCwd} />
                </div>
                {/* Kernel Log */}
                <div style={S.panel}>
                  <div style={S.panelTitle}>📜 Kernel Log</div>
                  <KernelLog logs={logs} />
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: TERMINAL ── */}
          {activeTab === "💻 Terminal" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 8 }}>
              <div style={S.panel}>
                <div style={S.panelTitle}>💻 Emoji Terminal</div>
                <TerminalEmulator onCmd={handleCmd} history={termHistory} cwd={cwd} />
                <div style={{ marginTop: 6, fontSize: 8, color: "#2a2a3e" }}>
                  Try: neofetch, ps, top, ping 🌐.8.8.8, spawn 🤖, ls /bin, cat readme.md, pipe 1 2 hello, man ls
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={S.panel}>
                  <div style={S.panelTitle}>💾 Files</div>
                  <FileSystemTree fs={fs} cwd={cwd} onNavigate={setCwd} />
                </div>
                <div style={S.panel}>
                  <div style={S.panelTitle}>📋 Quick Commands</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                    {["neofetch", "ps", "top", "free", "df", "lsdev", "thermal", "netstat", "cron", "uptime"].map(cmd => (
                      <button key={cmd} onClick={() => handleCmd(cmd)} style={{ ...S.btn("#4a5568"), fontSize: 8, padding: "2px 6px" }}>{cmd}</button>
                    ))}
                  </div>
                </div>
                <div style={S.panel}>
                  <div style={S.panelTitle}>📜 Kernel Log</div>
                  <KernelLog logs={logs} />
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: NETWORK ── */}
          {activeTab === "📡 Network" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={S.panel}>
                  <div style={S.panelTitle}>📡 Packet Monitor</div>
                  <NetworkViz packets={packets} hosts={NET_HOSTS} connections={netConnections} />
                </div>
                <div style={S.panel}>
                  <div style={S.panelTitle}>🌐 Network Hosts</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {NET_HOSTS.map((h, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 6px", background: "#07070b", borderRadius: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 16 }}>{h.emoji}</span>
                          <div>
                            <div style={{ fontSize: 10, color: "#e2e8f0" }}>{h.name}</div>
                            <div style={{ fontSize: 8, color: "#4a5568" }}>{h.ip}</div>
                          </div>
                        </div>
                        <button onClick={() => { sendPacket(h.ip, "🏓 PING", 1); log(`🏓 ping ${h.ip}`, "NET", "#4fc3f7", "#4fc3f7"); }}
                          style={{ ...S.btn("#4fc3f7"), fontSize: 8, padding: "2px 6px" }}>ping</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={S.panel}>
                  <div style={S.panelTitle}>🔥 Protocols</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                    {NET_PROTOCOLS.map(p => {
                      const count = packets.filter(pk => pk.proto === p).length;
                      return <div key={p} style={S.tag(count > 0 ? "#66bb6a" : "#2a2a3e")}>{p} ({count})</div>;
                    })}
                  </div>
                </div>
                <div style={S.panel}>
                  <div style={S.panelTitle}>📊 Network Stats</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {[
                      { l: "📤 Sent", v: packets.filter(p => p.direction === "out").length },
                      { l: "📥 Recv", v: packets.filter(p => p.direction === "in").length },
                      { l: "✅ Success", v: packets.filter(p => p.status === "✅").length },
                      { l: "❌ Failed", v: packets.filter(p => p.status === "❌").length },
                      { l: "🔗 Conns", v: netConnections.length },
                      { l: "📦 Total", v: stats.packetsTotal },
                    ].map(s => (
                      <div key={s.l} style={{ background: "#07070b", borderRadius: 4, padding: 6, textAlign: "center" }}>
                        <div style={{ fontSize: 9, color: "#6b7280" }}>{s.l}</div>
                        <div style={{ fontSize: 16, fontWeight: 700 }}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={S.panel}>
                  <div style={S.panelTitle}>📜 Kernel Log</div>
                  <KernelLog logs={logs} />
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: ASSEMBLY ── */}
          {activeTab === "🔧 Assembly" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={S.panel}>
                  <div style={S.panelTitle}>🔧 Emoji Assembly Interpreter</div>
                  <AsmInterpreter onRun={runAsm} output={asmState.output} running={asmState.running} program={asmState.program} pc={asmState.pc} />
                </div>
                <div style={S.panel}>
                  <div style={S.panelTitle}>📖 Instruction Set Reference</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    {Object.entries(OPCODES).map(([op, info]) => (
                      <div key={op} style={{ fontSize: 9, padding: "2px 4px", display: "flex", gap: 4 }}>
                        <span style={{ color: "#6366f1", minWidth: 20 }}>{op}</span>
                        <span style={{ color: "#6b7280" }}>{info.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={S.panel}>
                  <div style={S.panelTitle}>🔍 CPU State</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                    <div style={{ background: "#07070b", borderRadius: 4, padding: 6, textAlign: "center" }}>
                      <div style={{ fontSize: 8, color: "#6b7280" }}>ACC</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "#6366f1" }}>{asmState.acc}</div>
                    </div>
                    <div style={{ background: "#07070b", borderRadius: 4, padding: 6, textAlign: "center" }}>
                      <div style={{ fontSize: 8, color: "#6b7280" }}>PC</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "#66bb6a" }}>{asmState.pc}</div>
                    </div>
                    <div style={{ background: "#07070b", borderRadius: 4, padding: 6, textAlign: "center" }}>
                      <div style={{ fontSize: 8, color: "#6b7280" }}>FLAGS</div>
                      <div style={{ fontSize: 14 }}>{asmState.acc === 0 ? "🏳️" : asmState.acc < 0 ? "🚩" : "🟢"}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <div style={{ fontSize: 8, color: "#6b7280", marginBottom: 3 }}>REGISTERS</div>
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                      {Object.entries(asmState.mem).map(([addr, val]) => (
                        <div key={addr} style={S.tag("#4fc3f7")}>R{addr}={val}</div>
                      ))}
                      {Object.keys(asmState.mem).length === 0 && <span style={{ fontSize: 9, color: "#2a2a3e" }}>empty</span>}
                    </div>
                  </div>
                </div>
                <div style={S.panel}>
                  <div style={S.panelTitle}>📜 Kernel Log</div>
                  <KernelLog logs={logs} />
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: PERF ── */}
          {activeTab === "📊 Perf" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={S.panel}>
                  <div style={S.panelTitle}>📈 Real-time Performance</div>
                  <PerfGraph data={perfHistory.cpu} label="⚡ CPU Load %" color="#6366f1" max={100} />
                  <PerfGraph data={perfHistory.mem} label="📦 Memory %" color="#66bb6a" max={100} />
                  <PerfGraph data={perfHistory.net} label="📡 Network" color="#4fc3f7" max={100} />
                  <PerfGraph data={perfHistory.io} label="💾 I/O Wait" color="#ffb74d" max={100} />
                </div>
                <div style={S.panel}>
                  <div style={S.panelTitle}>🌡️ Thermal</div>
                  <ThermalMonitor cpuTemp={thermal.cpu} gpuTemp={thermal.gpu} fanSpeed={thermal.fan} load={thermal.load} />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={S.panel}>
                  <div style={S.panelTitle}>📊 System Statistics</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                    {[
                      { l: "⏱️ Uptime", v: `${stats.uptime}t` },
                      { l: "🍴 Procs", v: stats.totalProcesses },
                      { l: "📞 Syscalls", v: stats.totalSyscalls },
                      { l: "🔄 CtxSw", v: stats.contextSwitches },
                      { l: "⚡ IRQs", v: stats.interrupts },
                      { l: "📄 PgFaults", v: stats.pageFaults },
                      { l: "📡 Packets", v: stats.packetsTotal },
                      { l: "📦 MemUsed", v: `${pages.filter(p => p.pid).length}pg` },
                      { l: "🧠 Active", v: processes.filter(p => p.state !== "zombie").length },
                    ].map(s => (
                      <div key={s.l} style={{ background: "#07070b", borderRadius: 4, padding: 6, textAlign: "center" }}>
                        <div style={{ fontSize: 8, color: "#6b7280" }}>{s.l}</div>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={S.panel}>
                  <div style={S.panelTitle}>🔌 Devices</div>
                  <DeviceManager devices={devices} />
                </div>
                <div style={S.panel}>
                  <div style={S.panelTitle}>📜 Kernel Log</div>
                  <KernelLog logs={logs} />
                </div>
              </div>
            </div>
          )}

          {/* Footer stats bar */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 8, padding: 4 }}>
            {[
              `⏱️ ${stats.uptime}t`,
              `🍴 ${processes.filter(p => p.state !== "zombie").length} procs`,
              `📦 ${pages.filter(p => p.pid).length}/${NUM_PAGES} mem`,
              `🌡️ ${thermal.cpu}°C`,
              `📡 ${stats.packetsTotal} pkts`,
              `📞 ${stats.totalSyscalls} sys`,
            ].map(s => (
              <span key={s} style={{ fontSize: 8, color: "#4a5568" }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes panic-flash { from { background: #ff174411; } to { background: #ff174433; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        * { scrollbar-width: thin; scrollbar-color: #1a1a2e #07070b; box-sizing: border-box; }
        *::-webkit-scrollbar { width: 4px; }
        *::-webkit-scrollbar-track { background: #07070b; }
        *::-webkit-scrollbar-thumb { background: #1a1a2e; border-radius: 2px; }
        button:hover { filter: brightness(1.2); }
        button:active { transform: scale(0.97); }
        input::selection { background: #6366f144; }
      `}</style>
    </div>
  );
}

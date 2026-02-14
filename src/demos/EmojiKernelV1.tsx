// @ts-nocheck
/* eslint-disable */
// EmojiKernel V1 Demo — Self-contained emoji OS simulator
// Converted from emoji-kernel.jsx for integration with OpenKernel EDU

import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════
// 🧠 EmojiKernel™ — The World's First Emoji Operating System
// ═══════════════════════════════════════════════════════════

// Kernel constants
const TICK_MS = 600;
const MAX_MEMORY = 32;
const MAX_PROCESSES = 8;

// Process definitions — each is a real "program" with emoji opcodes
const PROCESS_TEMPLATES = [
  { name: "🌐 Browser", emoji: "🌐", memCost: 4, cpuBurst: 3, priority: 2, color: "#4fc3f7" },
  { name: "🎵 Music", emoji: "🎵", memCost: 2, cpuBurst: 2, priority: 1, color: "#ce93d8" },
  { name: "📧 Mail", emoji: "📧", memCost: 3, cpuBurst: 2, priority: 3, color: "#ffb74d" },
  { name: "🎮 Game", emoji: "🎮", memCost: 6, cpuBurst: 5, priority: 1, color: "#ef5350" },
  { name: "📊 Stats", emoji: "📊", memCost: 2, cpuBurst: 4, priority: 2, color: "#66bb6a" },
  { name: "🤖 AI", emoji: "🤖", memCost: 5, cpuBurst: 6, priority: 1, color: "#00e5ff" },
  { name: "📷 Camera", emoji: "📷", memCost: 3, cpuBurst: 2, priority: 2, color: "#ffa726" },
  { name: "🔐 Crypto", emoji: "🔐", memCost: 4, cpuBurst: 7, priority: 1, color: "#ab47bc" },
  { name: "📝 Editor", emoji: "📝", memCost: 2, cpuBurst: 2, priority: 3, color: "#78909c" },
  { name: "🧪 Lab", emoji: "🧪", memCost: 3, cpuBurst: 3, priority: 2, color: "#26c6da" },
];

const SYSCALLS = ["📖 read", "📝 write", "🔌 open", "❌ close", "🍴 fork", "💀 exit", "⏳ wait", "📡 send", "📬 recv", "🗺️ mmap"];

const FILE_SYSTEM = {
  "🏠": { type: "dir", children: ["📄", "📂", "🗑️", "💾"] },
  "📄": { type: "file", name: "readme.txt", size: 2, content: "👋🌍" },
  "📂": { type: "dir", name: "docs", children: ["📊", "📈"] },
  "🗑️": { type: "file", name: "trash", size: 0, content: "" },
  "💾": { type: "file", name: "save.dat", size: 4, content: "🔑🗝️🔒🔓" },
  "📊": { type: "file", name: "data.csv", size: 3, content: "1️⃣2️⃣3️⃣" },
  "📈": { type: "file", name: "chart.png", size: 5, content: "📉📊📈📉📊" },
};

// State emoji representations
const STATE_EMOJI = {
  running: "🟢",
  ready: "🟡",
  blocked: "🔴",
  zombie: "💀",
  sleeping: "😴",
};

let pidCounter = 1;

function createProcess(template) {
  return {
    pid: pidCounter++,
    ...template,
    state: "ready",
    memStart: -1,
    burstLeft: template.cpuBurst,
    totalTicks: 0,
    syscalls: 0,
    age: 0,
  };
}

// ═══════ COMPONENTS ═══════

function KernelLog({ logs }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [logs]);

  return (
    <div ref={ref} style={{
      background: "#0a0a0f",
      border: "1px solid #1a1a2e",
      borderRadius: 8,
      padding: 12,
      height: 180,
      overflowY: "auto",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontSize: 11,
      lineHeight: 1.6,
    }}>
      {logs.map((log, i) => (
        <div key={i} style={{ color: log.color || "#8892b0", opacity: Math.max(0.4, 1 - (logs.length - i) * 0.03) }}>
          <span style={{ color: "#4a5568", marginRight: 6 }}>{String(log.tick).padStart(4, "0")}</span>
          <span style={{ color: log.levelColor || "#6366f1", marginRight: 6 }}>{log.level}</span>
          {log.msg}
        </div>
      ))}
      {logs.length === 0 && <div style={{ color: "#4a5568" }}>⏳ kernel idle — awaiting boot sequence...</div>}
    </div>
  );
}

function MemoryMap({ memory, processes }) {
  const procMap = {};
  processes.forEach(p => { procMap[p.pid] = p; });

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(16, 1fr)", gap: 2 }}>
        {memory.map((cell, i) => {
          const proc = cell ? procMap[cell] : null;
          const bg = proc ? proc.color + "33" : "#111118";
          const border = proc ? proc.color + "66" : "#1a1a2e";
          return (
            <div key={i} title={proc ? `PID ${proc.pid} ${proc.name}` : `Block ${i} — free`} style={{
              width: "100%",
              aspectRatio: "1",
              background: bg,
              border: `1px solid ${border}`,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              cursor: "default",
              transition: "all 0.2s",
            }}>
              {proc ? proc.emoji : "⬛"}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 6, fontSize: 10, color: "#6b7280", display: "flex", justifyContent: "space-between" }}>
        <span>📦 {memory.filter(m => m !== null).length}/{MAX_MEMORY} blocks used</span>
        <span>🆓 {memory.filter(m => m === null).length} free</span>
      </div>
    </div>
  );
}

function ProcessTable({ processes, onKill }) {
  if (processes.length === 0) return <div style={{ color: "#4a5568", textAlign: "center", padding: 20 }}>No processes running</div>;

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #1e1e2e" }}>
            {["PID", "Process", "State", "CPU", "Mem", "Sys", "Age", ""].map(h => (
              <th key={h} style={{ padding: "6px 8px", textAlign: "left", color: "#6b7280", fontWeight: 500, fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {processes.map(p => (
            <tr key={p.pid} style={{ borderBottom: "1px solid #111118", transition: "background 0.2s" }}>
              <td style={{ padding: "6px 8px", color: p.color, fontWeight: 700 }}>{p.pid}</td>
              <td style={{ padding: "6px 8px" }}>{p.emoji} {p.name.split(" ")[1]}</td>
              <td style={{ padding: "6px 8px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  {STATE_EMOJI[p.state]} <span style={{ fontSize: 10, color: "#8892b0" }}>{p.state}</span>
                </span>
              </td>
              <td style={{ padding: "6px 8px" }}>
                <div style={{ width: 50, height: 6, background: "#1a1a2e", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${(1 - p.burstLeft / p.cpuBurst) * 100}%`, height: "100%", background: p.color, borderRadius: 3, transition: "width 0.3s" }} />
                </div>
              </td>
              <td style={{ padding: "6px 8px", fontSize: 11 }}>{p.memCost}📦</td>
              <td style={{ padding: "6px 8px", fontSize: 11 }}>{p.syscalls}</td>
              <td style={{ padding: "6px 8px", fontSize: 11, color: "#6b7280" }}>{p.age}t</td>
              <td style={{ padding: "6px 8px" }}>
                {p.state !== "zombie" && (
                  <button onClick={() => onKill(p.pid)} style={{
                    background: "none", border: "1px solid #ef535044", borderRadius: 4,
                    color: "#ef5350", cursor: "pointer", padding: "2px 6px", fontSize: 11,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.target.style.background = "#ef535022"; }}
                  onMouseLeave={e => { e.target.style.background = "none"; }}
                  >kill</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CPUViz({ currentProc, scheduler, tick }) {
  const pipes = ["⬜","⬜","⬜","⬜","⬜"];
  if (currentProc) {
    const stage = tick % 5;
    for (let i = 0; i <= stage; i++) pipes[i] = currentProc.emoji;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 28, marginBottom: 4 }}>{currentProc ? currentProc.emoji : "💤"}</div>
      <div style={{ fontSize: 10, color: "#8892b0", marginBottom: 8 }}>
        {currentProc ? `PID ${currentProc.pid} — ${currentProc.name}` : "idle"}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 2, marginBottom: 8 }}>
        {pipes.map((p, i) => (
          <div key={i} style={{
            width: 22, height: 22, borderRadius: 4,
            background: p === "⬜" ? "#111118" : currentProc?.color + "33",
            border: `1px solid ${p === "⬜" ? "#1a1a2e" : currentProc?.color + "66"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, transition: "all 0.3s",
          }}>{p === "⬜" ? "" : p}</div>
        ))}
      </div>
      <div style={{ fontSize: 9, color: "#4a5568", textTransform: "uppercase", letterSpacing: 1 }}>
        fetch → decode → exec → mem → wb
      </div>
      <div style={{ marginTop: 8, fontSize: 10, color: "#6366f1" }}>
        📋 {scheduler}
      </div>
    </div>
  );
}

function FileExplorer({ fs, onAccess }) {
  const root = fs["🏠"];
  return (
    <div style={{ fontSize: 12 }}>
      <div style={{ color: "#ffb74d", marginBottom: 6 }}>🏠 /root</div>
      <div style={{ paddingLeft: 16 }}>
        {root.children.map(key => {
          const node = fs[key];
          return (
            <div key={key}
              onClick={() => onAccess(key)}
              style={{
                padding: "3px 6px", borderRadius: 4, cursor: "pointer",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#1a1a2e"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >
              <span>{key} {node.name}</span>
              <span style={{ color: "#4a5568", fontSize: 10 }}>
                {node.type === "dir" ? "📂" : `${node.size}📦`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════ MAIN KERNEL ═══════

export default function EmojiKernel() {
  const [booted, setBooted] = useState(false);
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const [processes, setProcesses] = useState([]);
  const [memory, setMemory] = useState(Array(MAX_MEMORY).fill(null));
  const [logs, setLogs] = useState([]);
  const [currentPid, setCurrentPid] = useState(null);
  const [scheduler, setScheduler] = useState("Round Robin");
  const [panicMode, setPanicMode] = useState(false);
  const [stats, setStats] = useState({ totalSyscalls: 0, totalProcesses: 0, contextSwitches: 0, uptime: 0 });

  const stateRef = useRef({ processes: [], memory: Array(MAX_MEMORY).fill(null), currentPid: null, tick: 0, stats: { totalSyscalls: 0, totalProcesses: 0, contextSwitches: 0, uptime: 0 } });

  useEffect(() => {
    stateRef.current = { processes, memory, currentPid, tick, stats };
  }, [processes, memory, currentPid, tick, stats]);

  const log = useCallback((msg, level = "INFO", color, levelColor) => {
    setLogs(prev => [...prev.slice(-80), { msg, level, color, levelColor, tick: stateRef.current.tick }]);
  }, []);

  const allocateMemory = useCallback((proc, mem) => {
    const newMem = [...mem];
    let allocated = 0;
    for (let i = 0; i < MAX_MEMORY && allocated < proc.memCost; i++) {
      if (newMem[i] === null) {
        newMem[i] = proc.pid;
        allocated++;
      }
    }
    if (allocated < proc.memCost) {
      // rollback
      for (let i = 0; i < MAX_MEMORY; i++) {
        if (newMem[i] === proc.pid) newMem[i] = null;
      }
      return null;
    }
    return newMem;
  }, []);

  const freeMemory = useCallback((pid, mem) => {
    return mem.map(cell => cell === pid ? null : cell);
  }, []);

  const spawnProcess = useCallback(() => {
    const { processes: procs, memory: mem } = stateRef.current;
    if (procs.length >= MAX_PROCESSES) {
      log("⚠️ Max processes reached — cannot spawn", "WARN", "#ffb74d", "#ffb74d");
      return;
    }
    const template = PROCESS_TEMPLATES[Math.floor(Math.random() * PROCESS_TEMPLATES.length)];
    const proc = createProcess(template);
    const newMem = allocateMemory(proc, mem);
    if (!newMem) {
      log(`⚠️ OOM — cannot allocate ${proc.memCost} blocks for ${proc.name}`, "WARN", "#ffb74d", "#ffb74d");
      return;
    }
    proc.memStart = newMem.indexOf(proc.pid);
    setMemory(newMem);
    setProcesses(prev => [...prev, proc]);
    setStats(prev => ({ ...prev, totalProcesses: prev.totalProcesses + 1 }));
    log(`🍴 fork() → PID ${proc.pid} ${proc.name} [${proc.memCost}📦]`, "KERN", "#66bb6a", "#66bb6a");
  }, [allocateMemory, log]);

  const killProcess = useCallback((pid) => {
    setProcesses(prev => prev.map(p => p.pid === pid ? { ...p, state: "zombie" } : p));
    log(`💀 kill(${pid}) — signal SIGTERM`, "KERN", "#ef5350", "#ef5350");
  }, [log]);

  const kernelPanic = useCallback(() => {
    setPanicMode(true);
    setRunning(false);
    log("💥💥💥 KERNEL PANIC — not syncing: emoji overflow 💥💥💥", "PANIC", "#ff1744", "#ff1744");
    log("🔥 Stack trace: 🧠→💭→🤯→💀→☠️→🪦", "PANIC", "#ff1744", "#ff1744");
    log("Press REBOOT to restore system", "PANIC", "#ff8a80", "#ff1744");
  }, [log]);

  const reboot = useCallback(() => {
    pidCounter = 1;
    setProcesses([]);
    setMemory(Array(MAX_MEMORY).fill(null));
    setLogs([]);
    setCurrentPid(null);
    setTick(0);
    setPanicMode(false);
    setRunning(false);
    setBooted(false);
    setStats({ totalSyscalls: 0, totalProcesses: 0, contextSwitches: 0, uptime: 0 });
  }, []);

  const boot = useCallback(() => {
    setBooted(true);
    log("🔌 Power on — POST check...", "BOOT", "#00e5ff", "#00e5ff");
    setTimeout(() => log("🧠 CPU: EmojiCore™ v4.2.0 — 1 core @ ∞ MHz", "BOOT", "#00e5ff", "#00e5ff"), 200);
    setTimeout(() => log(`📦 RAM: ${MAX_MEMORY} emoji blocks detected`, "BOOT", "#00e5ff", "#00e5ff"), 400);
    setTimeout(() => log("💾 Disk: EmojiFS v1.0 mounted at 🏠/", "BOOT", "#00e5ff", "#00e5ff"), 600);
    setTimeout(() => log("🛡️ Security: emoji firewall active 🔥🧱", "BOOT", "#00e5ff", "#00e5ff"), 800);
    setTimeout(() => {
      log("✅ EmojiKernel™ ready — type 'spawn' or press ▶️", "BOOT", "#66bb6a", "#66bb6a");
      setRunning(true);
    }, 1000);
  }, [log]);

  // Main kernel tick
  useEffect(() => {
    if (!running || panicMode) return;

    const interval = setInterval(() => {
      setTick(prev => prev + 1);
      setStats(prev => ({ ...prev, uptime: prev.uptime + 1 }));

      setProcesses(prev => {
        let procs = prev.map(p => ({ ...p, age: p.age + 1 }));

        // Reap zombies older than 3 ticks in zombie state
        const zombies = procs.filter(p => p.state === "zombie" && p.age > 3);
        if (zombies.length > 0) {
          zombies.forEach(z => {
            setMemory(mem => freeMemory(z.pid, mem));
            log(`🪦 reap(${z.pid}) — ${z.name} freed`, "KERN", "#78909c", "#78909c");
          });
          procs = procs.filter(p => !(p.state === "zombie" && p.age > 3));
        }

        // Wake sleeping processes randomly
        procs = procs.map(p => {
          if (p.state === "sleeping" && Math.random() < 0.3) {
            log(`⏰ wake(${p.pid}) — ${p.name} unblocked`, "SCHED", "#ce93d8", "#ce93d8");
            return { ...p, state: "ready" };
          }
          return p;
        });

        // Scheduler: pick next process
        const ready = procs.filter(p => p.state === "ready");
        const runningProc = procs.find(p => p.state === "running");

        if (runningProc) {
          // Decrement burst
          const updated = { ...runningProc, burstLeft: runningProc.burstLeft - 1 };

          // Random syscall
          if (Math.random() < 0.25) {
            const sc = SYSCALLS[Math.floor(Math.random() * SYSCALLS.length)];
            updated.syscalls++;
            setStats(s => ({ ...s, totalSyscalls: s.totalSyscalls + 1 }));
            log(`📞 syscall(${updated.pid}): ${sc}`, "SYS", "#a78bfa", "#a78bfa");

            // Some syscalls block
            if (sc === "📖 read" || sc === "⏳ wait" || sc === "📬 recv") {
              updated.state = "sleeping";
              updated.burstLeft = updated.cpuBurst; // reset on wake
              log(`😴 PID ${updated.pid} blocked on I/O`, "SCHED", "#ffa726", "#ffa726");
            }
          }

          if (updated.burstLeft <= 0 && updated.state === "running") {
            // Process complete — becomes zombie
            updated.state = "zombie";
            updated.age = 0;
            log(`✅ PID ${updated.pid} ${updated.name} completed`, "KERN", "#66bb6a", "#66bb6a");
            setCurrentPid(null);
          } else if (updated.state === "running" && ready.length > 0 && Math.random() < 0.3) {
            // Preempt (round robin)
            updated.state = "ready";
            setStats(s => ({ ...s, contextSwitches: s.contextSwitches + 1 }));
            log(`🔄 preempt PID ${updated.pid} → ready queue`, "SCHED", "#ffd54f", "#ffd54f");
            setCurrentPid(null);
          }

          procs = procs.map(p => p.pid === updated.pid ? updated : p);
        }

        // If nothing running, schedule next
        if (!procs.find(p => p.state === "running")) {
          const candidates = procs.filter(p => p.state === "ready");
          if (candidates.length > 0) {
            // Sort by priority (lower = higher priority)
            candidates.sort((a, b) => a.priority - b.priority);
            const next = candidates[0];
            procs = procs.map(p => p.pid === next.pid ? { ...p, state: "running" } : p);
            setCurrentPid(next.pid);
            setStats(s => ({ ...s, contextSwitches: s.contextSwitches + 1 }));
            log(`▶️ schedule PID ${next.pid} ${next.name}`, "SCHED", "#4fc3f7", "#4fc3f7");
          }
        }

        // Auto-spawn sometimes
        if (procs.filter(p => p.state !== "zombie").length < 2 && Math.random() < 0.4) {
          setTimeout(() => spawnProcess(), 100);
        }

        return procs;
      });
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [running, panicMode, freeMemory, log, spawnProcess]);

  const currentProc = processes.find(p => p.pid === currentPid);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#07070d",
      color: "#e2e8f0",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
      padding: "16px",
      boxSizing: "border-box",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #1a1a2e",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 28 }}>🧠</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 1 }}>
              EmojiKernel<span style={{ color: "#6366f1" }}>™</span>
            </div>
            <div style={{ fontSize: 9, color: "#4a5568", letterSpacing: 2, textTransform: "uppercase" }}>
              The world's first emoji operating system
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            display: "inline-block", width: 8, height: 8, borderRadius: "50%",
            background: panicMode ? "#ff1744" : running ? "#66bb6a" : "#ffa726",
            boxShadow: `0 0 8px ${panicMode ? "#ff1744" : running ? "#66bb6a" : "#ffa726"}`,
            animation: running && !panicMode ? "pulse 2s infinite" : "none",
          }} />
          <span style={{ fontSize: 10, color: "#6b7280" }}>
            {panicMode ? "PANIC" : running ? `tick ${tick}` : "offline"}
          </span>
        </div>
      </div>

      {/* Panic overlay */}
      {panicMode && (
        <div style={{
          position: "fixed", inset: 0, background: "#ff174422", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 100,
          animation: "panic-flash 0.5s infinite alternate",
        }}>
          <div style={{ textAlign: "center", background: "#0a0a0f", padding: 40, borderRadius: 12, border: "2px solid #ff1744" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💥🔥☠️🔥💥</div>
            <div style={{ fontSize: 20, color: "#ff1744", fontWeight: 700, marginBottom: 8 }}>KERNEL PANIC</div>
            <div style={{ fontSize: 12, color: "#ff8a80", marginBottom: 20 }}>not syncing: emoji overflow in sector 0xDEAD</div>
            <button onClick={reboot} style={{
              background: "#ff1744", color: "#fff", border: "none", borderRadius: 6,
              padding: "10px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer",
              fontFamily: "inherit",
            }}>🔄 REBOOT</button>
          </div>
        </div>
      )}

      {/* Boot screen */}
      {!booted && (
        <div style={{ textAlign: "center", marginTop: 80 }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🧠</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>EmojiKernel™ v4.2.0</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 32 }}>A fully functional emoji-based operating system kernel</div>
          <button onClick={boot} style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff", border: "none", borderRadius: 8, padding: "14px 40px",
            fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 0 30px #6366f166",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={e => { e.target.style.transform = "scale(1.05)"; e.target.style.boxShadow = "0 0 40px #6366f188"; }}
          onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "0 0 30px #6366f166"; }}
          >🔌 POWER ON</button>
          <div style={{ marginTop: 40, fontSize: 11, color: "#374151", maxWidth: 400, margin: "40px auto 0" }}>
            A real kernel simulator: process scheduling, memory allocation, syscalls, file system, and context switching — all in emojis.
          </div>
        </div>
      )}

      {/* Main UI */}
      {booted && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* CPU */}
            <div style={{ background: "#0d0d15", border: "1px solid #1a1a2e", borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>🔲 CPU Pipeline</div>
              <CPUViz currentProc={currentProc} scheduler={scheduler} tick={tick} />
            </div>

            {/* Memory */}
            <div style={{ background: "#0d0d15", border: "1px solid #1a1a2e", borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>📦 Memory Map ({MAX_MEMORY} blocks)</div>
              <MemoryMap memory={memory} processes={processes} />
            </div>

            {/* File System */}
            <div style={{ background: "#0d0d15", border: "1px solid #1a1a2e", borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>💾 EmojiFS</div>
              <FileExplorer fs={FILE_SYSTEM} onAccess={(key) => {
                const node = FILE_SYSTEM[key];
                if (node.type === "file") {
                  log(`📖 read("${node.name}") → ${node.content || "∅"}`, "FS", "#ffb74d", "#ffb74d");
                } else {
                  log(`📂 ls("${node.name}") → [${node.children.join(", ")}]`, "FS", "#ffb74d", "#ffb74d");
                }
              }} />
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Controls */}
            <div style={{ background: "#0d0d15", border: "1px solid #1a1a2e", borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>⚡ Controls</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button onClick={() => setRunning(r => !r)} style={btnStyle(running ? "#ef5350" : "#66bb6a")}>
                  {running ? "⏸ Pause" : "▶️ Run"}
                </button>
                <button onClick={spawnProcess} style={btnStyle("#6366f1")}>🍴 Spawn</button>
                <button onClick={kernelPanic} style={btnStyle("#ff1744")}>💥 Panic!</button>
                <button onClick={reboot} style={btnStyle("#78909c")}>🔄 Reboot</button>
                <select value={scheduler} onChange={e => {
                  setScheduler(e.target.value);
                  log(`📋 Scheduler → ${e.target.value}`, "KERN", "#6366f1", "#6366f1");
                }} style={{
                  background: "#111118", color: "#e2e8f0", border: "1px solid #1e1e2e",
                  borderRadius: 6, padding: "6px 10px", fontSize: 11, fontFamily: "inherit",
                  cursor: "pointer",
                }}>
                  <option>Round Robin</option>
                  <option>Priority</option>
                  <option>FIFO</option>
                </select>
              </div>
              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
                {[
                  { label: "Procs", value: stats.totalProcesses, icon: "🍴" },
                  { label: "Syscalls", value: stats.totalSyscalls, icon: "📞" },
                  { label: "Ctx Sw", value: stats.contextSwitches, icon: "🔄" },
                  { label: "Uptime", value: `${stats.uptime}t`, icon: "⏱️" },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: "center", padding: 6, background: "#111118", borderRadius: 6 }}>
                    <div style={{ fontSize: 14 }}>{s.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{s.value}</div>
                    <div style={{ fontSize: 8, color: "#4a5568", textTransform: "uppercase" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Process Table */}
            <div style={{ background: "#0d0d15", border: "1px solid #1a1a2e", borderRadius: 8, padding: 14, flex: 1 }}>
              <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                📋 Process Table ({processes.filter(p => p.state !== "zombie").length} active)
              </div>
              <ProcessTable processes={processes} onKill={killProcess} />
            </div>

            {/* Kernel Log */}
            <div style={{ background: "#0d0d15", border: "1px solid #1a1a2e", borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>📜 Kernel Log</div>
              <KernelLog logs={logs} />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes panic-flash { from { background: #ff174411; } to { background: #ff174433; } }
        * { scrollbar-width: thin; scrollbar-color: #1e1e2e #0a0a0f; }
        *::-webkit-scrollbar { width: 4px; }
        *::-webkit-scrollbar-track { background: #0a0a0f; }
        *::-webkit-scrollbar-thumb { background: #1e1e2e; border-radius: 2px; }
      `}</style>
    </div>
  );
}

function btnStyle(color) {
  return {
    background: color + "22",
    color: color,
    border: `1px solid ${color}44`,
    borderRadius: 6,
    padding: "6px 12px",
    fontSize: 11,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.2s",
  };
}

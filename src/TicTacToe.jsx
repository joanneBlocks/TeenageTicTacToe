import { useState, useCallback } from "react";

// ── Palette definitions ──────────────────────────────────────────────────────
const PALETTES = {
  neon: {
    id: "neon", name: "Neon Gamer", emoji: "🎮", description: "Sleek gaming UI",
    bg: "#0F172A", grid: "#334155", x: "#22C55E", o: "#38BDF8", accent: "#A78BFA",
    textPrimary: "#F1F5F9", textMuted: "#64748B", isDark: true,
  },
  pastel: {
    id: "pastel", name: "Pastel Pop", emoji: "🌈", description: "Friendly & aesthetic",
    bg: "#FFF7ED", grid: "#FED7AA", x: "#FB7185", o: "#60A5FA", accent: "#34D399",
    textPrimary: "#1C1917", textMuted: "#A8A29E", isDark: false,
  },
  cosmic: {
    id: "cosmic", name: "Cosmic Vibe", emoji: "🌌", description: "Space + TikTok aesthetic",
    bg: "#020617", grid: "#1E293B", x: "#F472B6", o: "#818CF8", accent: "#FACC15",
    textPrimary: "#E2E8F0", textMuted: "#475569", isDark: true,
  },
  bold: {
    id: "bold", name: "Bold & Energetic", emoji: "🔥", description: "High contrast, punchy",
    bg: "#111827", grid: "#374151", x: "#EF4444", o: "#3B82F6", accent: "#F59E0B",
    textPrimary: "#F9FAFB", textMuted: "#6B7280", isDark: true,
  },
};

const WINNING_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

function checkWinner(board) {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return { winner: board[a], line: [a, b, c] };
  }
  return null;
}

function rgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ── Palette Picker ───────────────────────────────────────────────────────────
function PalettePicker({ onPick }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{ height:"100vh", width:"100%", background:"#0A0A0F", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"1.5rem", overflow:"hidden", position:"relative" }}>
      <div style={{ position:"absolute", inset:0, opacity:0.03, pointerEvents:"none", backgroundImage:"linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)", backgroundSize:"40px 40px" }} />
      <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:480, display:"flex", flexDirection:"column", alignItems:"center", gap:"1.5rem" }}>
        <div style={{ textAlign:"center" }}>
          <h2 style={{ margin:0, fontSize:"clamp(1.4rem,4vw,2rem)", fontWeight:900, letterSpacing:"0.15em", textTransform:"uppercase", background:"linear-gradient(135deg,#F472B6,#A78BFA,#38BDF8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
            Pick Your Palette
          </h2>
          <p style={{ margin:"0.4rem 0 0", fontSize:"0.7rem", letterSpacing:"0.25em", color:"rgba(255,255,255,0.3)", textTransform:"uppercase" }}>
            Choose a vibe for your game board
          </p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem", width:"100%" }}>
          {Object.values(PALETTES).map(pal => {
            const isHov = hovered === pal.id;
            return (
              <button key={pal.id} onClick={() => onPick(pal.id)}
                onMouseEnter={() => setHovered(pal.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ background: isHov ? rgba(pal.accent,0.08) : "rgba(255,255,255,0.03)", border:`1.5px solid ${isHov ? rgba(pal.accent,0.6) : "rgba(255,255,255,0.08)"}`, borderRadius:"1.25rem", padding:"1rem", cursor:"pointer", textAlign:"left", transition:"all 0.2s ease", transform: isHov ? "scale(1.03)" : "scale(1)", boxShadow: isHov ? `0 0 24px ${rgba(pal.accent,0.2)}` : "none", display:"flex", flexDirection:"column", gap:"0.6rem" }}>
                {/* Mini board preview */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"3px", background:pal.grid, borderRadius:"8px", padding:"4px", aspectRatio:"1/1", width:"100%" }}>
                  {["X","","O","","X","","O","",""].map((v,i) => (
                    <div key={i} style={{ background:pal.bg, borderRadius:"4px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"clamp(0.5rem,2.5vw,0.85rem)", fontWeight:900, color: v==="X" ? pal.x : v==="O" ? pal.o : "transparent", aspectRatio:"1/1", boxShadow: v ? `0 0 6px ${rgba(v==="X" ? pal.x : pal.o,0.5)}` : "none" }}>{v||"·"}</div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize:"0.75rem", fontWeight:700, color:"rgba(255,255,255,0.85)", marginBottom:"0.15rem" }}>{pal.emoji} {pal.name}</div>
                  <div style={{ fontSize:"0.6rem", color:"rgba(255,255,255,0.35)", letterSpacing:"0.05em" }}>{pal.description}</div>
                  <div style={{ display:"flex", gap:"4px", marginTop:"0.4rem" }}>
                    {[pal.x, pal.o, pal.accent].map((c,i) => (
                      <div key={i} style={{ width:12, height:12, borderRadius:"50%", background:c, boxShadow:`0 0 4px ${rgba(c,0.6)}` }} />
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main Game ────────────────────────────────────────────────────────────────
export default function TicTacToe({ onBack }) {
  const [paletteId,   setPaletteId]   = useState(null);
  const [committed,   setCommitted]   = useState(Array(9).fill(null));
  const [working,     setWorking]     = useState(Array(9).fill(null));
  const [current,     setCurrent]     = useState("X");
  const [winResult,   setWinResult]   = useState(null);
  const [isDraw,      setIsDraw]      = useState(false);
  const [scores,      setScores]      = useState({ X: 0, O: 0 });
  const [celebrate,   setCelebrate]   = useState(false);
  const [moveError,   setMoveError]   = useState(null);
  const [dragSrc,     setDragSrc]     = useState(null);
  const [dragOver,    setDragOver]    = useState(null);
  const [touchedCell, setTouchedCell] = useState(null);
  const [hasMoved,    setHasMoved]    = useState(false);

  if (!paletteId) return <PalettePicker onPick={id => setPaletteId(id)} />;

  const pal         = PALETTES[paletteId];
  const isDone      = !!(winResult || isDraw);
  const playerColor = { X: pal.x, O: pal.o };
  const currentColor = playerColor[current];

  const flashError = (msg) => { setMoveError(msg); setTimeout(() => setMoveError(null), 1700); };

  const handleDragStart = (source) => {
    if (isDone) return;
    if (typeof source === "number" && working[source] !== current) { flashError("That's not your piece!"); return; }
    setDragSrc(source);
  };

  const handleDrop = (targetIdx) => {
    if (isDone || dragSrc === null) return;
    if (dragSrc === targetIdx) { setDragOver(null); setDragSrc(null); return; }
    const next = [...working];
    if (dragSrc === "tray") {
      if (next[targetIdx]) { flashError("Cell is occupied!"); setDragSrc(null); setDragOver(null); return; }
      next[targetIdx] = current;
    } else {
      const piece = next[dragSrc];
      if (piece !== current) { flashError("That's not your piece!"); setDragSrc(null); setDragOver(null); return; }
      if (next[targetIdx] && next[targetIdx] !== current) { flashError("Can't move there!"); setDragSrc(null); setDragOver(null); return; }
      if (next[targetIdx] === current) { setDragSrc(null); setDragOver(null); return; }
      next[dragSrc] = null; next[targetIdx] = piece;
    }
    setWorking(next); setTouchedCell(targetIdx); setHasMoved(true); setDragOver(null); setDragSrc(null);
  };

  const handleClick = (idx) => {
    if (isDone || working[idx]) return;
    const next = [...working]; next[idx] = current;
    setWorking(next); setTouchedCell(idx); setHasMoved(true);
  };

  const confirmTurn = () => {
    if (!hasMoved) { flashError("Make a move first!"); return; }
    const result = checkWinner(working);
    const draw   = !result && working.every(Boolean);
    setCommitted([...working]);
    if (result) {
      setWinResult(result); setScores(s => ({ ...s, [result.winner]: s[result.winner]+1 }));
      setCelebrate(true); setTimeout(() => setCelebrate(false), 1500);
    } else if (draw) {
      setIsDraw(true);
    } else {
      setCurrent(p => p==="X"?"O":"X"); setHasMoved(false); setTouchedCell(null);
    }
  };

  const undoMove = () => { setWorking([...committed]); setHasMoved(false); setTouchedCell(null); };

  const reset = () => {
    const e = Array(9).fill(null);
    setCommitted(e); setWorking(e); setCurrent("X"); setWinResult(null); setIsDraw(false);
    setHasMoved(false); setTouchedCell(null); setDragOver(null); setDragSrc(null); setMoveError(null);
  };
  const resetAll = () => { reset(); setScores({ X:0, O:0 }); };

  const display = isDone ? committed : working;

  const borderBtn = { background:"transparent", border:`1px solid ${rgba(pal.textPrimary,0.15)}`, color:rgba(pal.textPrimary,0.45), borderRadius:"999px", padding:"0.3rem 0.9rem", fontSize:"0.63rem", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s" };

  return (
    <div style={{ height:"100vh", width:"100%", background:pal.bg, display:"flex", flexDirection:"column", overflow:"hidden", position:"relative" }}>
      {/* grid bg */}
      <div style={{ position:"absolute", inset:0, opacity:0.07, pointerEvents:"none", backgroundImage:`linear-gradient(${pal.grid} 1px,transparent 1px),linear-gradient(90deg,${pal.grid} 1px,transparent 1px)`, backgroundSize:"40px 40px" }} />

      {celebrate && <Confetti pal={pal} />}

      {/* TOP BAR */}
      <div style={{ position:"relative", zIndex:10, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.75rem 1rem 0.5rem", flexShrink:0 }}>
        <div style={{ display:"flex", gap:"0.4rem" }}>
          <button onClick={onBack} style={borderBtn}>← Back</button>
          <button onClick={() => { reset(); setPaletteId(null); }} style={{ ...borderBtn, borderColor:rgba(pal.accent,0.45), color:rgba(pal.accent,0.75) }}>🎨 Theme</button>
        </div>
        <h1 style={{ position:"absolute", left:"50%", transform:"translateX(-50%)", margin:0, fontSize:"clamp(1rem,3.5vw,1.4rem)", fontWeight:900, letterSpacing:"0.15em", textTransform:"uppercase", color:pal.textPrimary, whiteSpace:"nowrap", textShadow:`0 0 20px ${rgba(pal.accent,0.45)}` }}>
          Tic Tac Drop
        </h1>
        <div style={{ display:"flex", gap:"0.4rem" }}>
          {["X","O"].map(p => {
            const col = playerColor[p]; const active = current===p && !isDone;
            return (
              <div key={p} style={{ display:"flex", alignItems:"center", gap:"4px", padding:"0.25rem 0.65rem", borderRadius:"999px", border:`1.5px solid ${active?rgba(col,0.7):rgba(col,0.25)}`, background:active?rgba(col,0.15):rgba(col,0.05), color:col, fontSize:"0.7rem", fontWeight:700, boxShadow:active?`0 0 12px ${rgba(col,0.35)}`:"none", transition:"all 0.3s" }}>
                {p} <span style={{ fontSize:"0.9rem", fontWeight:900 }}>{scores[p]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* divider */}
      <div style={{ height:"1px", margin:"0 1rem", background:`linear-gradient(90deg,transparent,${rgba(pal.accent,0.35)},transparent)`, flexShrink:0 }} />

      {/* MAIN */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"space-evenly", padding:"0.5rem 1rem", minHeight:0, position:"relative", zIndex:1 }}>

        {/* Status */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"0.4rem", flexShrink:0 }}>
          {!isDone && (<>
            <div style={{ padding:"0.3rem 1.2rem", borderRadius:"999px", border:`1.5px solid ${rgba(currentColor,0.55)}`, background:rgba(currentColor,0.12), color:currentColor, fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.1em", boxShadow:`0 0 14px ${rgba(currentColor,0.25)}` }}>
              Player {current}'s Turn
            </div>
            <div style={{ padding:"0.2rem 0.8rem", borderRadius:"999px", border:`1px solid ${hasMoved?rgba(currentColor,0.4):rgba(pal.textPrimary,0.1)}`, background:hasMoved?rgba(currentColor,0.1):rgba(pal.textPrimary,0.04), color:hasMoved?currentColor:pal.textMuted, fontSize:"0.58rem", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase" }}>
              {hasMoved ? "✦ Ready to Confirm" : "○ Waiting for Move"}
            </div>
          </>)}
          {winResult && (
            <div style={{ padding:"0.35rem 1.4rem", borderRadius:"999px", border:`2px solid ${playerColor[winResult.winner]}`, background:rgba(playerColor[winResult.winner],0.15), color:playerColor[winResult.winner], fontSize:"0.85rem", fontWeight:900, letterSpacing:"0.1em", boxShadow:`0 0 24px ${rgba(playerColor[winResult.winner],0.45)}`, animation:"statusPulse 0.8s ease infinite alternate" }}>
              🏆 Player {winResult.winner} Wins!
            </div>
          )}
          {isDraw && (
            <div style={{ padding:"0.35rem 1.4rem", borderRadius:"999px", border:`1px solid ${rgba(pal.textPrimary,0.25)}`, background:rgba(pal.textPrimary,0.06), color:pal.textMuted, fontSize:"0.85rem", fontWeight:700, letterSpacing:"0.1em" }}>
              🤝 It's a Draw!
            </div>
          )}
        </div>

        {/* Board */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"8px", padding:"12px", borderRadius:"1.5rem", background:rgba(pal.grid,0.2), border:`1px solid ${rgba(pal.grid,0.55)}`, boxShadow:`0 8px 32px ${rgba(pal.bg,0.6)}`, width:"100%", maxWidth:"300px", flexShrink:0 }}>
          {display.map((cell, i) => {
            const isWin     = winResult?.line.includes(i);
            const isMyPiece = cell === current && !isDone;
            const isDragSrc = dragSrc === i;
            const isHovered = dragOver === i;
            const isEnemy   = !!(cell && cell !== current);
            const isPending = i === touchedCell && hasMoved && !isDone;
            const cellColor = cell ? playerColor[cell] : null;

            const cellStyle = {
              aspectRatio:"1/1", borderRadius:"0.75rem",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"clamp(1.3rem,5vw,1.9rem)", fontWeight:900,
              border:"2px solid", transition:"all 0.15s ease",
              userSelect:"none", opacity: isDragSrc ? 0.3 : 1,
              ...(isWin ? {
                background:rgba(cellColor,0.22), borderColor:cellColor, color:cellColor,
                boxShadow:`0 0 20px ${rgba(cellColor,0.65)}, inset 0 0 10px ${rgba(cellColor,0.15)}`,
                animation:"winPulse 0.7s ease infinite alternate",
              } : isPending ? {
                background:rgba(currentColor,0.14), borderColor:rgba(currentColor,0.65), color:currentColor,
                boxShadow:`0 0 10px ${rgba(currentColor,0.3)}`,
              } : isHovered && !isEnemy ? {
                background:rgba(currentColor,0.1), borderColor:rgba(currentColor,0.5), color:currentColor,
                transform:"scale(1.06)",
              } : cell ? {
                background:rgba(cellColor,0.1), borderColor:rgba(cellColor,0.35), color:cellColor,
                boxShadow: isMyPiece ? `0 0 10px ${rgba(cellColor,0.3)}` : "none",
                cursor: isMyPiece ? "grab" : "default",
              } : {
                background:rgba(pal.grid,0.18), borderColor:rgba(pal.grid,0.45), color:"transparent",
                cursor:"pointer",
              }),
            };

            return (
              <div key={i} draggable={isMyPiece} style={cellStyle}
                onClick={() => handleClick(i)}
                onDragStart={() => handleDragStart(i)}
                onDragOver={e => { e.preventDefault(); setDragOver(i); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={e => { e.preventDefault(); handleDrop(i); }}
                onDragEnd={() => { setDragOver(null); setDragSrc(null); }}
              >
                {cell && <span style={{ pointerEvents:"none", lineHeight:1, textShadow:`0 0 14px ${rgba(cellColor,0.75)}` }}>{cell}</span>}
              </div>
            );
          })}
        </div>

        {/* Token trays */}
        {!isDone && (
          <div style={{ display:"flex", gap:"2rem", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            {["X","O"].map(p => {
              const col = playerColor[p]; const isActive = current===p;
              const count = working.filter(v => v===p).length;
              return (
                <div key={p} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"4px", opacity:isActive?1:0.2, transition:"opacity 0.3s" }}>
                  <div draggable={isActive}
                    onDragStart={e => { if (!isActive){e.preventDefault();return;} handleDragStart("tray"); }}
                    onDragEnd={() => { setDragOver(null); setDragSrc(null); }}
                    style={{ width:"3rem", height:"3rem", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.2rem", fontWeight:900, border:`2px solid ${isActive?rgba(col,0.7):rgba(col,0.25)}`, background:rgba(col,0.12), color:col, boxShadow:isActive?`0 0 16px ${rgba(col,0.4)}`:"none", cursor:isActive?"grab":"not-allowed", transition:"all 0.15s", textShadow:`0 0 10px ${rgba(col,0.8)}` }}>
                    {p}
                  </div>
                  <span style={{ fontSize:"0.57rem", letterSpacing:"0.15em", color:rgba(col,0.55), textTransform:"uppercase", fontWeight:600 }}>{p==="X"?"P1":"P2"}</span>
                  {count>0&&isActive&&<span style={{ fontSize:"0.54rem", color:rgba(col,0.4) }}>{count} placed</span>}
                </div>
              );
            })}
          </div>
        )}

        {/* Confirm + Undo */}
        {!isDone && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"0.5rem", width:"100%", flexShrink:0 }}>
            <button disabled={!hasMoved} onClick={confirmTurn} style={{ width:"100%", maxWidth:"280px", padding:"0.6rem 1.5rem", borderRadius:"999px", border:"none", fontSize:"0.7rem", fontWeight:900, letterSpacing:"0.18em", textTransform:"uppercase", cursor:hasMoved?"pointer":"not-allowed", transition:"all 0.2s", ...(hasMoved?{ background:`linear-gradient(135deg,${currentColor},${rgba(currentColor,0.7)})`, color:pal.isDark?"#050505":"#fff", boxShadow:`0 0 22px ${rgba(currentColor,0.5)}` }:{ background:rgba(pal.textPrimary,0.05), color:rgba(pal.textPrimary,0.2), border:`1px solid ${rgba(pal.textPrimary,0.1)}` }) }}>
              {hasMoved ? "✔ Lock It In — End Turn" : "Place or move a piece first"}
            </button>
            <button disabled={!hasMoved} onClick={undoMove} style={{ ...borderBtn, opacity:hasMoved?1:0.25, cursor:hasMoved?"pointer":"not-allowed" }}>
              ↩ Undo This Turn
            </button>
          </div>
        )}

        {/* Rematch / Reset / Theme */}
        <div style={{ display:"flex", gap:"0.5rem", flexShrink:0, flexWrap:"wrap", justifyContent:"center" }}>
          <button onClick={reset} style={borderBtn}>↺ Rematch</button>
          <button onClick={resetAll} style={{ ...borderBtn, borderColor:rgba("#EF4444",0.3), color:rgba("#EF4444",0.6) }}>✕ Reset All</button>
        </div>

      </div>

      {moveError && (
        <div style={{ position:"fixed", bottom:"1.5rem", left:"50%", transform:"translateX(-50%)", background:rgba("#EF4444",0.15), border:`1px solid ${rgba("#EF4444",0.5)}`, color:"#FCA5A5", padding:"0.45rem 1.2rem", borderRadius:"999px", fontSize:"0.7rem", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", pointerEvents:"none", zIndex:200, whiteSpace:"nowrap", animation:"fadeUp 0.2s ease" }}>
          {moveError}
        </div>
      )}

      <style>{`
        @keyframes winPulse    { from{transform:scale(1)} to{transform:scale(1.09)} }
        @keyframes statusPulse { from{opacity:1} to{opacity:0.65} }
        @keyframes fadeUp      { from{opacity:0;transform:translateX(-50%) translateY(8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes confettiFall{ 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(430px) rotate(720deg);opacity:0} }
      `}</style>
    </div>
  );
}

function Confetti({ pal }) {
  const colors = [pal.x, pal.o, pal.accent, "#FACC15", "#34D399", "#F472B6"];
  const particles = Array.from({ length:32 }, (_,i) => ({ id:i, left:`${4+Math.random()*92}%`, delay:`${Math.random()*0.6}s`, color:colors[i%colors.length], size:`${6+Math.random()*7}px`, shape:Math.random()>0.5?"50%":"3px" }));
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:99 }}>
      {particles.map(p => (
        <div key={p.id} style={{ position:"absolute", width:p.size, height:p.size, background:p.color, borderRadius:p.shape, left:p.left, top:"15%", animation:`confettiFall 1.3s ease-out ${p.delay} forwards` }} />
      ))}
    </div>
  );
}
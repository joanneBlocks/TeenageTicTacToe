import { useState, useCallback } from "react";

const WINNING_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function checkWinner(board) {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return { winner: board[a], line: [a, b, c] };
  }
  return null;
}

const P = {
  X: { emoji: "⚡", label: "Player X", tray: "bg-pink-500/10 border-pink-500/40 hover:border-pink-400",  badge: "bg-pink-500/10 border-pink-500/30 text-pink-400",  activeBadge: "bg-pink-500/20 border-pink-500/60 text-pink-300",  confirm: "bg-gradient-to-r from-pink-500 to-pink-400 text-gray-950", pill: "bg-pink-500/20 border-pink-500/40 text-pink-300", cell: "border-pink-500/30 bg-pink-500/10", pendingCell: "border-pink-400/60 bg-pink-500/15", winCell: "border-pink-400 bg-pink-500/20", glow: "shadow-pink-500/30" },
  O: { emoji: "🔥", label: "Player O", tray: "bg-cyan-500/10 border-cyan-500/40 hover:border-cyan-400",   badge: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",   activeBadge: "bg-cyan-500/20 border-cyan-500/60 text-cyan-300",   confirm: "bg-gradient-to-r from-cyan-400 to-cyan-300 text-gray-950", pill: "bg-cyan-500/20 border-cyan-500/40 text-cyan-300",  cell: "border-cyan-500/30 bg-cyan-500/10",  pendingCell: "border-cyan-400/60 bg-cyan-500/15",  winCell: "border-cyan-400 bg-cyan-500/20",  glow: "shadow-cyan-500/30"  },
};

export default function TicTacToe({ onBack }) {
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

  const isDone = !!(winResult || isDraw);
  const player = P[current];

  const flashError = (msg) => {
    setMoveError(msg);
    setTimeout(() => setMoveError(null), 1700);
  };

  const handleDragStart = (source) => {
    if (isDone) return;
    if (typeof source === "number" && working[source] !== current) {
      flashError("That's not your piece!"); return;
    }
    setDragSrc(source);
  };

  const handleDrop = useCallback((targetIdx) => {
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
      next[dragSrc]   = null;
      next[targetIdx] = piece;
    }
    setWorking(next);
    setTouchedCell(targetIdx);
    setHasMoved(true);
    setDragOver(null);
    setDragSrc(null);
  }, [working, current, dragSrc, isDone]);

  const handleClick = useCallback((idx) => {
    if (isDone || working[idx]) return;
    const next = [...working];
    next[idx] = current;
    setWorking(next);
    setTouchedCell(idx);
    setHasMoved(true);
  }, [working, current, isDone]);

  const confirmTurn = () => {
    if (!hasMoved) { flashError("Make a move first!"); return; }
    const result = checkWinner(working);
    const draw   = !result && working.every(Boolean);
    setCommitted([...working]);
    if (result) {
      setWinResult(result);
      setScores(s => ({ ...s, [result.winner]: s[result.winner] + 1 }));
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 1400);
    } else if (draw) {
      setIsDraw(true);
    } else {
      setCurrent(p => p === "X" ? "O" : "X");
      setHasMoved(false);
      setTouchedCell(null);
    }
  };

  const undoMove = () => {
    setWorking([...committed]);
    setHasMoved(false);
    setTouchedCell(null);
  };

  const reset = () => {
    const e = Array(9).fill(null);
    setCommitted(e); setWorking(e);
    setCurrent("X"); setWinResult(null); setIsDraw(false);
    setHasMoved(false); setTouchedCell(null);
    setDragOver(null); setDragSrc(null); setMoveError(null);
  };
  const resetAll = () => { reset(); setScores({ X: 0, O: 0 }); };

  const display = isDone ? committed : working;

  return (
    // h-screen + overflow-hidden = nothing ever scrolls or overflows
    <div className="h-screen w-full bg-gray-950 flex flex-col overflow-hidden relative">

      {/* dot grid background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage:"linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)", backgroundSize:"40px 40px" }} />

      {celebrate && <Confetti />}

      {/* ── TOP BAR ───────────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 text-white/40 text-xs font-semibold tracking-widest uppercase hover:bg-white/5 hover:border-white/25 hover:text-white/70 transition-all duration-200"
        >
          ← Back
        </button>

        {/* Title centred */}
        <h1 className="absolute left-1/2 -translate-x-1/2 text-lg sm:text-2xl font-black tracking-[0.18em] uppercase bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent whitespace-nowrap">
          Tic Tac Drop
        </h1>

        {/* Scores top-right */}
        <div className="flex gap-2">
          {["X","O"].map(p => {
            const cfg    = P[p];
            const active = current === p && !isDone;
            return (
              <div key={p} className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-bold tracking-wider transition-all duration-300 ${active ? cfg.activeBadge + " shadow-md " + cfg.glow : cfg.badge}`}>
                {cfg.emoji} {p} <span className="font-black ml-0.5">{scores[p]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* thin gradient divider */}
      <div className="shrink-0 h-px mx-4 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20" />

      {/* ── MAIN CONTENT — flex-1 fills all remaining height ─────── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-evenly px-4 py-3 min-h-0">

        {/* Status row */}
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          {!isDone && (
            <>
              <div className={`px-4 py-1.5 rounded-full border text-xs font-bold tracking-widest transition-all duration-300 ${player.activeBadge} shadow-md ${player.glow}`}>
                {player.emoji} {player.label}'s Turn
              </div>
              <div className={`px-3 py-0.5 rounded-full border text-[10px] font-semibold tracking-widest transition-all duration-300 ${hasMoved ? player.pill : "bg-white/5 border-white/10 text-gray-600"}`}>
                {hasMoved ? "✦ READY TO CONFIRM" : "○ WAITING FOR MOVE"}
              </div>
            </>
          )}
          {winResult && (
            <div className={`px-5 py-1.5 rounded-full border-2 text-sm font-black tracking-widest animate-pulse ${P[winResult.winner].activeBadge} shadow-lg ${P[winResult.winner].glow}`}>
              🏆 {P[winResult.winner].label} Wins!
            </div>
          )}
          {isDraw && (
            <div className="px-5 py-1.5 rounded-full border border-white/20 bg-white/5 text-white/70 text-sm font-bold tracking-widest">
              🤝 It's a Draw!
            </div>
          )}
        </div>

        {/* Board — grows to fill space, stays square via aspect-square on cells */}
        <div className="shrink-0 grid grid-cols-3 gap-2 p-3 bg-white/[0.02] border border-white/[0.06] rounded-3xl shadow-2xl w-full max-w-xs sm:max-w-sm">
          {display.map((cell, i) => {
            const isWin     = winResult?.line.includes(i);
            const isMyPiece = cell === current && !isDone;
            const isDragSrc = dragSrc === i;
            const isHovered = dragOver === i;
            const cfg       = cell ? P[cell] : null;
            const isEnemy   = !!(cell && cell !== current);
            const isPending = i === touchedCell && hasMoved && !isDone;

            // aspect-square makes each cell a perfect square no matter the container width
            let cls = "aspect-square rounded-xl flex items-center justify-center text-3xl sm:text-4xl transition-all duration-150 border select-none ";

            if (isWin)                      cls += `${cfg.winCell} border-2 shadow-lg animate-pulse `;
            else if (isPending)             cls += `${player.pendingCell} `;
            else if (isHovered && !isEnemy) cls += `${player.cell} scale-105 `;
            else if (cell)                  cls += `${cfg.cell} `;
            else                            cls += "bg-white/[0.03] border-white/[0.07] ";

            if (isMyPiece && !isDone)       cls += "cursor-grab active:cursor-grabbing hover:scale-105 ";
            else if (!cell && !isDone)      cls += "cursor-pointer hover:scale-105 hover:bg-white/[0.06] ";
            else                            cls += "cursor-default ";

            if (isDragSrc)                  cls += "opacity-30 ";

            return (
              <div key={i} draggable={isMyPiece} className={cls}
                onClick={() => handleClick(i)}
                onDragStart={() => handleDragStart(i)}
                onDragOver={e => { e.preventDefault(); setDragOver(i); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={e => { e.preventDefault(); handleDrop(i); }}
                onDragEnd={() => { setDragOver(null); setDragSrc(null); }}
              >
                {cell && <span className="pointer-events-none leading-none">{cfg.emoji}</span>}
              </div>
            );
          })}
        </div>

        {/* Token trays — only during active play */}
        {!isDone && (
          <div className="flex gap-8 items-center justify-center shrink-0">
            {["X","O"].map(p => {
              const cfg      = P[p];
              const isActive = current === p;
              const count    = working.filter(v => v === p).length;
              return (
                <div key={p} className={`flex flex-col items-center gap-1 transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-20"}`}>
                  <div
                    draggable={isActive}
                    onDragStart={e => { if (!isActive) { e.preventDefault(); return; } handleDragStart("tray"); }}
                    onDragEnd={() => { setDragOver(null); setDragSrc(null); }}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-2xl border-2 transition-all duration-150 ${cfg.tray} ${isActive ? "cursor-grab active:cursor-grabbing hover:scale-110 hover:-translate-y-1 shadow-md " + cfg.glow : "cursor-not-allowed"}`}
                  >
                    {cfg.emoji}
                  </div>
                  <span className={`text-[9px] tracking-[0.2em] font-semibold uppercase ${p === "X" ? "text-pink-500/60" : "text-cyan-500/60"}`}>
                    {p === "X" ? "P1" : "P2"}
                  </span>
                  {count > 0 && isActive && (
                    <span className={`text-[9px] ${p === "X" ? "text-pink-500/40" : "text-cyan-500/40"}`}>{count} placed</span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Confirm + Undo */}
        {!isDone && (
          <div className="flex flex-col items-center gap-2 w-full shrink-0">
            <button
              disabled={!hasMoved}
              onClick={confirmTurn}
              className={`w-full max-w-xs py-2.5 px-6 rounded-full text-xs font-black tracking-[0.18em] uppercase transition-all duration-200
                ${hasMoved
                  ? `${player.confirm} shadow-lg hover:scale-[1.03] active:scale-[0.97]`
                  : "bg-white/5 text-white/20 cursor-not-allowed border border-white/10"
                }`}
            >
              {hasMoved ? "✔ Lock It In — End Turn" : "Place or move a piece first"}
            </button>
            <button
              disabled={!hasMoved}
              onClick={undoMove}
              className="px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-[0.15em] uppercase border border-white/10 text-white/40 transition-all duration-200 hover:enabled:bg-white/5 hover:enabled:border-white/25 hover:enabled:text-white/70 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              ↩ Undo This Turn
            </button>
          </div>
        )}

        {/* Rematch / Reset All */}
        <div className="flex gap-2 shrink-0">
          <button onClick={reset}
            className="px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-widest uppercase border border-white/10 text-white/50 hover:bg-white/5 hover:border-white/25 hover:text-white/80 transition-all duration-200">
            ↺ Rematch
          </button>
          <button onClick={resetAll}
            className="px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-widest uppercase border border-red-500/20 text-red-400/50 hover:bg-red-500/5 hover:border-red-500/40 hover:text-red-400/80 transition-all duration-200">
            ✕ Reset All
          </button>
        </div>

      </div>{/* end flex-1 */}

      {/* Error toast */}
      {moveError && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-500/15 border border-red-500/50 text-red-400 px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase pointer-events-none z-50 animate-bounce whitespace-nowrap">
          {moveError}
        </div>
      )}
    </div>
  );
}

function Confetti() {
  const colors = ["bg-pink-400","bg-cyan-400","bg-yellow-400","bg-purple-400","bg-orange-400","bg-green-400"];
  const shapes = ["rounded-full","rounded-sm"];
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i, left: `${5 + Math.random() * 90}%`, delay: `${Math.random() * 0.6}s`,
    color: colors[i % colors.length], shape: shapes[i % shapes.length],
    size: Math.random() > 0.5 ? "w-2 h-2" : "w-3 h-3",
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(p => (
        <div key={p.id} className={`absolute ${p.size} ${p.color} ${p.shape}`}
          style={{ left: p.left, top: "15%", animation: `confettiFall 1.2s ease-out ${p.delay} forwards` }} />
      ))}
      <style>{`@keyframes confettiFall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(400px) rotate(720deg);opacity:0}}`}</style>
    </div>
  );
}
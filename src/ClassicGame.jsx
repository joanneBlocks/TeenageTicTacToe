import { useState } from "react";

// ── Theme definitions ────────────────────────────────────────────────────────
const THEMES = {
  dark: {
    id: "dark",
    label: "Dark",
    bg: "bg-black",
    pageBg: "#000000",
    gridLine: "white",
    text: "text-white",
    textMuted: "text-white/25",
    textFaint: "text-white/20",
    title: "text-white",
    divider: "bg-white/10",
    // active player badge: filled
    badgeActive: "bg-white text-black border-white",
    badgeInactive: "bg-transparent border-white/20 text-white/35",
    // status banner
    statusBorder: "border-white/30",
    statusBg: "bg-white/5",
    statusText: "text-white",
    statusDraw: "text-white/50",
    winBanner: "bg-white text-black",
    drawBanner: "border-white/30 text-white/50",
    // board container
    boardBg: "bg-white/[0.03]",
    boardBorder: "border-white/10",
    // cells
    cellEmpty: "bg-white/5 border-white/15 text-transparent hover:bg-white/10 hover:border-white/40 hover:scale-105",
    cellFilled: "bg-white/10 border-white/50 text-white hover:bg-white/20 hover:border-white",
    cellWin: "bg-white text-black border-white scale-105",
    // buttons
    btn: "border-white/20 text-white/50 hover:bg-white/5 hover:border-white/40 hover:text-white/80",
    // history
    historyActive: "bg-white text-black border-white",
    historyInactive: "bg-white/[0.03] border-white/[0.08] text-white/30 hover:bg-white/[0.07] hover:text-white/60 hover:border-white/20",
    historyLabel: "text-white/20",
  },
  light: {
    id: "light",
    label: "Light",
    bg: "bg-white",
    pageBg: "#ffffff",
    gridLine: "black",
    text: "text-black",
    textMuted: "text-black/25",
    textFaint: "text-black/20",
    title: "text-black",
    divider: "bg-black/10",
    badgeActive: "bg-black text-white border-black",
    badgeInactive: "bg-transparent border-black/20 text-black/35",
    statusBorder: "border-black/30",
    statusBg: "bg-black/5",
    statusText: "text-black",
    statusDraw: "text-black/50",
    winBanner: "bg-black text-white",
    drawBanner: "border-black/30 text-black/50",
    boardBg: "bg-black/[0.03]",
    boardBorder: "border-black/10",
    cellEmpty: "bg-black/5 border-black/15 text-transparent hover:bg-black/10 hover:border-black/40 hover:scale-105",
    cellFilled: "bg-black/10 border-black/50 text-black hover:bg-black/20 hover:border-black",
    cellWin: "bg-black text-white border-black scale-105",
    btn: "border-black/20 text-black/50 hover:bg-black/5 hover:border-black/40 hover:text-black/80",
    historyActive: "bg-black text-white border-black",
    historyInactive: "bg-black/[0.03] border-black/[0.08] text-black/30 hover:bg-black/[0.07] hover:text-black/60 hover:border-black/20",
    historyLabel: "text-black/20",
  },
};

// ── Theme Picker ─────────────────────────────────────────────────────────────
function ThemePicker({ onPick }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">

        <div className="text-center">
          <h2 className="text-2xl font-black tracking-[0.15em] uppercase text-gray-900">
            Choose Your Theme
          </h2>
          <p className="text-xs tracking-[0.25em] text-gray-400 mt-1 uppercase">
            Pick a look for the classic board
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          {Object.values(THEMES).map(t => {
            const isDark = t.id === "dark";
            const isHov  = hovered === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onPick(t.id)}
                onMouseEnter={() => setHovered(t.id)}
                onMouseLeave={() => setHovered(null)}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer"
                style={{
                  background: isDark ? "#000" : "#fff",
                  borderColor: isHov
                    ? (isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)")
                    : (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"),
                  transform: isHov ? "scale(1.04)" : "scale(1)",
                  boxShadow: isHov ? "0 8px 24px rgba(0,0,0,0.18)" : "none",
                }}
              >
                {/* Mini board preview */}
                <div
                  className="grid grid-cols-3 rounded-xl overflow-hidden w-full"
                  style={{ gap:"2px", background: isDark ? "#333" : "#ccc", padding:"2px" }}
                >
                  {["X","","O","","X","","O","","X"].map((v, i) => (
                    <div key={i}
                      className="aspect-square flex items-center justify-center text-sm font-black"
                      style={{
                        background: isDark ? "#000" : "#fff",
                        color: isDark ? "#fff" : "#000",
                        borderRadius:"6px",
                      }}
                    >
                      {v}
                    </div>
                  ))}
                </div>

                {/* Label */}
                <div className="text-center">
                  <div className="font-black text-sm tracking-wider uppercase"
                    style={{ color: isDark ? "#fff" : "#000" }}>
                    {t.label}
                  </div>
                  <div className="text-[10px] tracking-wider mt-0.5"
                    style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>
                    {isDark ? "Black bg · White text" : "White bg · Black text"}
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

// ── Square ───────────────────────────────────────────────────────────────────
function Square({ value, onSquareClick, isWin, theme: t }) {
  let cls = "aspect-square rounded-2xl flex items-center justify-center text-4xl sm:text-5xl font-black border-2 transition-all duration-150 select-none cursor-pointer ";

  if (isWin)        cls += t.cellWin;
  else if (value)   cls += t.cellFilled;
  else              cls += t.cellEmpty;

  return <button className={cls} onClick={onSquareClick}>{value}</button>;
}

// ── Board ────────────────────────────────────────────────────────────────────
function Board({ xIsNext, squares, onPlay, theme: t }) {
  const result  = calculateWinner(squares);
  const winLine = result?.line ?? [];
  const isDraw  = !result && squares.every(Boolean);

  function handleClick(i) {
    if (result || squares[i]) return;
    const next = squares.slice();
    next[i] = xIsNext ? "X" : "O";
    onPlay(next);
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Status */}
      <div className="h-9 flex items-center">
        {result ? (
          <div className={`px-5 py-1.5 rounded-full text-xs font-black tracking-widest uppercase animate-pulse ${t.winBanner}`}>
            ✓ {result.winner} Wins!
          </div>
        ) : isDraw ? (
          <div className={`px-5 py-1.5 rounded-full border text-xs font-bold tracking-widest uppercase ${t.drawBanner}`}>
            Draw
          </div>
        ) : (
          <div className={`px-5 py-1.5 rounded-full border text-xs font-bold tracking-widest uppercase ${t.statusBorder} ${t.statusBg} ${t.statusText}`}>
            {xIsNext ? "X" : "O"} — Your Turn
          </div>
        )}
      </div>

      {/* Grid */}
      <div className={`grid grid-cols-3 gap-2.5 p-3 rounded-3xl shadow-lg border w-full max-w-xs sm:max-w-sm ${t.boardBg} ${t.boardBorder}`}>
        {squares.map((val, i) => (
          <Square
            key={i}
            value={val}
            isWin={winLine.includes(i)}
            onSquareClick={() => handleClick(i)}
            theme={t}
          />
        ))}
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];
  for (const [a,b,c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return { winner: squares[a], line: [a,b,c] };
  }
  return null;
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function ClassicGame({ onBack }) {
  const [themeId,     setThemeId]     = useState(null);
  const [history,     setHistory]     = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const xIsNext        = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // Show picker until theme is chosen
  if (!themeId) return <ThemePicker onPick={id => setThemeId(id)} />;

  const t = THEMES[themeId];

  function handlePlay(nextSquares) {
    const next = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(next);
    setCurrentMove(next.length - 1);
  }

  function jumpTo(move) { setCurrentMove(move); }

  function restart() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const btnCls = `border rounded-full px-5 py-1.5 text-xs font-semibold tracking-widest uppercase transition-all duration-200 ${t.btn}`;

  return (
    <div className={`h-screen w-full flex flex-col overflow-hidden relative ${t.bg}`}>



      {/* TOP BAR */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
        <div className="flex gap-2">
          <button onClick={onBack} className={btnCls}>← Back</button>
          <button
            onClick={() => { restart(); setThemeId(null); }}
            className={btnCls}
          >
            ◑ Theme
          </button>
        </div>

        <h1 className={`absolute left-1/2 -translate-x-1/2 text-lg sm:text-2xl font-black tracking-[0.15em] uppercase whitespace-nowrap ${t.title}`}>
          Tic Tac Toe
        </h1>

        {/* Active player badges */}
        <div className="flex gap-2">
          {["X","O"].map(p => {
            const active = (p === "X") === xIsNext;
            return (
              <div key={p} className={`px-3 py-1 rounded-full border text-xs font-bold tracking-wider transition-all duration-300 ${active ? t.badgeActive : t.badgeInactive}`}>
                {p}
              </div>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className={`shrink-0 h-px mx-4 ${t.divider}`} />

      {/* MAIN */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-evenly px-4 py-3 min-h-0">

        <p className={`text-[10px] tracking-[0.3em] uppercase shrink-0 ${t.textMuted}`}>
          Classic Mode · {t.label} Theme
        </p>

        <div className="shrink-0 w-full flex justify-center">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} theme={t} />
        </div>

        <div className="flex gap-2 shrink-0">
          <button onClick={restart} className={btnCls}>↺ New Game</button>
        </div>

        {/* Move history */}
        {history.length > 1 && (
          <div className="w-full max-w-xs shrink-0">
            <p className={`text-center text-[10px] tracking-widest uppercase mb-2 ${t.historyLabel}`}>
              Move History
            </p>
            <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
              {history.map((_, move) => (
                <button
                  key={move}
                  onClick={() => jumpTo(move)}
                  className={`w-full px-4 py-1.5 rounded-xl text-xs font-semibold tracking-wider transition-all duration-150 border ${move === currentMove ? t.historyActive : t.historyInactive}`}
                >
                  {move === 0 ? "⏮ Game Start" : `Move #${move}`}
                  {move === currentMove && " ← now"}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
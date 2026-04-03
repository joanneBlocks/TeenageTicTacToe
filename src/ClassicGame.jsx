import { useState } from "react";

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

function Square({ value, onSquareClick, isWin }) {
  let style = "aspect-square rounded-2xl flex items-center justify-center text-4xl sm:text-5xl font-black border-2 transition-all duration-150 select-none cursor-pointer ";

  if (isWin) {
    style += "bg-white text-black border-white scale-105";
  } else if (value === "X") {
    style += "bg-white/10 border-white/50 text-white hover:bg-white/20 hover:border-white";
  } else if (value === "O") {
    style += "bg-white/10 border-white/50 text-white hover:bg-white/20 hover:border-white";
  } else {
    style += "bg-white/5 border-white/15 text-transparent hover:bg-white/10 hover:border-white/40 hover:scale-105";
  }

  return (
    <button className={style} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
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

      {/* Status banner */}
      <div className="h-9 flex items-center">
        {result ? (
          <div className="px-5 py-1.5 rounded-full bg-white text-black text-xs font-black tracking-widest uppercase animate-pulse">
            ✓ {result.winner} Wins!
          </div>
        ) : isDraw ? (
          <div className="px-5 py-1.5 rounded-full border border-white/30 text-white/50 text-xs font-bold tracking-widest uppercase">
            Draw
          </div>
        ) : (
          <div className="px-5 py-1.5 rounded-full border border-white/30 bg-white/5 text-white text-xs font-bold tracking-widest uppercase">
            {xIsNext ? "X" : "O"} — Your Turn
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2.5 p-3 bg-white/[0.03] border border-white/10 rounded-3xl shadow-2xl w-full max-w-xs sm:max-w-sm">
        {squares.map((val, i) => (
          <Square
            key={i}
            value={val}
            isWin={winLine.includes(i)}
            onSquareClick={() => handleClick(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default function ClassicGame({ onBack }) {
  const [history,     setHistory]     = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const xIsNext        = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) { setCurrentMove(move); }

  function restart() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const btnBase = "border border-white/20 text-white/50 rounded-full px-5 py-1.5 text-xs font-semibold tracking-widest uppercase transition-all duration-200 hover:bg-white/5 hover:border-white/40 hover:text-white/80";

  return (
    <div className="h-screen w-full bg-black flex flex-col overflow-hidden relative">

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage:"linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)", backgroundSize:"40px 40px" }} />

      {/* TOP BAR */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
        <button onClick={onBack} className={btnBase}>← Back</button>

        <h1 className="absolute left-1/2 -translate-x-1/2 text-lg sm:text-2xl font-black tracking-[0.15em] uppercase text-white whitespace-nowrap">
          Tic Tac Toe
        </h1>

        {/* Player labels */}
        <div className="flex gap-2">
          {["X","O"].map(p => {
            const active = (p === "X") === xIsNext;
            return (
              <div key={p} className={`px-3 py-1 rounded-full border text-xs font-bold tracking-wider transition-all duration-300
                ${active
                  ? "bg-white text-black border-white"
                  : "bg-transparent border-white/20 text-white/35"
                }`}>
                {p}
              </div>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="shrink-0 h-px mx-4 bg-white/10" />

      {/* MAIN */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-evenly px-4 py-3 min-h-0">

        {/* Title + subtitle */}
        <div className="text-center shrink-0">
          <p className="text-[10px] tracking-[0.3em] text-white/25 uppercase">Classic Mode</p>
        </div>

        {/* Board */}
        <div className="shrink-0 w-full flex justify-center">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 shrink-0">
          <button onClick={restart} className={btnBase}>↺ New Game</button>
        </div>

        {/* Move history */}
        {history.length > 1 && (
          <div className="w-full max-w-xs shrink-0">
            <p className="text-center text-[10px] text-white/20 tracking-widest uppercase mb-2">Move History</p>
            <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
              {history.map((_, move) => (
                <button
                  key={move}
                  onClick={() => jumpTo(move)}
                  className={`w-full px-4 py-1.5 rounded-xl text-xs font-semibold tracking-wider transition-all duration-150 border
                    ${move === currentMove
                      ? "bg-white text-black border-white"
                      : "bg-white/[0.03] border-white/[0.08] text-white/30 hover:bg-white/[0.07] hover:text-white/60 hover:border-white/20"
                    }`}
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
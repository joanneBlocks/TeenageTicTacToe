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

function Square({ value, onSquareClick, isWin, isLatest }) {
  const base = "w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl font-black border transition-all duration-150 select-none cursor-pointer ";

  let style = "";
  if (isWin) {
    style = value === "X"
      ? "bg-amber-400/20 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/30 scale-105 animate-pulse"
      : "bg-amber-400/20 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/30 scale-105 animate-pulse";
  } else if (value === "X") {
    style = "bg-sky-500/10 border-sky-500/40 text-sky-300 hover:border-sky-400/60 hover:bg-sky-500/15";
  } else if (value === "O") {
    style = "bg-rose-500/10 border-rose-500/40 text-rose-300 hover:border-rose-400/60 hover:bg-rose-500/15";
  } else {
    style = "bg-white/[0.03] border-white/[0.08] text-transparent hover:bg-white/[0.07] hover:border-white/20 hover:scale-105";
  }

  return (
    <button className={base + style} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const result = calculateWinner(squares);
  const winLine = result?.line ?? [];
  const isDraw  = !result && squares.every(Boolean);

  function handleClick(i) {
    if (result || squares[i]) return;
    const next = squares.slice();
    next[i] = xIsNext ? "X" : "O";
    onPlay(next);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Status */}
      <div className="h-10 flex items-center">
        {result ? (
          <div className="px-5 py-2 rounded-full bg-amber-400/15 border border-amber-400/50 text-amber-300 text-sm font-bold tracking-widest uppercase animate-pulse">
            🏆 Winner: {result.winner}
          </div>
        ) : isDraw ? (
          <div className="px-5 py-2 rounded-full bg-white/5 border border-white/20 text-white/60 text-sm font-bold tracking-widest uppercase">
            🤝 It's a Draw!
          </div>
        ) : (
          <div className={`px-5 py-2 rounded-full border text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
            xIsNext
              ? "bg-sky-500/15 border-sky-500/40 text-sky-300"
              : "bg-rose-500/15 border-rose-500/40 text-rose-300"
          }`}>
            {xIsNext ? "✦ X's Turn" : "✦ O's Turn"}
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-3xl shadow-2xl">
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

  const xIsNext       = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  function restart() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  return (
    <div className="min-h-screen w-full bg-gray-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* grid bg */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage:"linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)", backgroundSize:"40px 40px" }} />

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-5 left-5 z-20 flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-white/40 text-xs font-semibold tracking-widest uppercase hover:bg-white/5 hover:border-white/25 hover:text-white/70 transition-all duration-200"
      >
        ← Back
      </button>

      <div className="relative z-10 w-full max-w-xl flex flex-col items-center gap-6">

        {/* Title */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Classic <span className="text-amber-400">Tic Tac Toe</span>
          </h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-sky-500 to-rose-500 rounded-full mx-auto mt-2" />
        </div>

        {/* Score pills */}
        <div className="flex gap-3">
          <div className="px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold tracking-widest uppercase">
            X — Player 1
          </div>
          <div className="px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold tracking-widest uppercase">
            O — Player 2
          </div>
        </div>

        {/* Board */}
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />

        {/* Restart */}
        <button
          onClick={restart}
          className="px-6 py-2.5 rounded-full border border-white/10 text-white/50 text-xs font-semibold tracking-widest uppercase hover:bg-white/5 hover:border-white/25 hover:text-white/80 transition-all duration-200"
        >
          ↺ New Game
        </button>

        {/* Move history */}
        {history.length > 1 && (
          <div className="w-full max-w-xs">
            <p className="text-center text-xs text-gray-600 tracking-widest uppercase mb-3">Move History</p>
            <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
              {history.map((_, move) => (
                <button
                  key={move}
                  onClick={() => jumpTo(move)}
                  className={`w-full px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all duration-150 border
                    ${move === currentMove
                      ? "bg-amber-400/15 border-amber-400/40 text-amber-300"
                      : "bg-white/[0.03] border-white/[0.07] text-gray-500 hover:bg-white/[0.07] hover:text-gray-300 hover:border-white/15"
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
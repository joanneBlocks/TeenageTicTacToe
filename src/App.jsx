import { useState } from "react";
import ClassicGame from "./ClassicGame";
import TicTacToe from "./TicTacToe";

export default function App() {
  const [mode, setMode] = useState(null); // null | "classic" | "teen"

  if (mode === "classic") return <ClassicGame onBack={() => setMode(null)} />;
  if (mode === "teen")    return <TicTacToe   onBack={() => setMode(null)} />;

  // ── Landing / mode selector ──────────────────────────────────────────────
  return (
    <div className="min-h-screen w-full bg-gray-950 flex flex-col items-center justify-center p-6 overflow-hidden">

      <div className="flex flex-col items-center gap-10 w-full max-w-xl">

        {/* Title */}
        <div className="text-center space-y-3">
          <img
            src="/TeenageTicTacToe/public/tlogowhite2.png"
            alt="Logo"
            className="h-28 sm:h-32 mx-auto object-contain"
          />
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white">
            Tic Tac <span className="bg-linear-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Toe</span>
          </h1>
          <p className="text-gray-500 text-sm tracking-widest uppercase">Choose your game</p>
          <div className="w-20 h-px bg-linear-to-r from-pink-500 to-cyan-500 mx-auto" />
        </div>

        {/* Mode cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">

          {/* Classic */}
          <button
            onClick={() => setMode("classic")}
            className="group flex flex-col items-center gap-5 p-8 rounded-3xl bg-white/3 border border-white/10 hover:border-amber-400/50 hover:bg-amber-400/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/10 text-left"
          >
            <div className="text-6xl">♟️</div>
            <div>
              <div className="text-white font-black text-xl tracking-tight mb-1.5">Classic</div>
              <div className="text-gray-500 text-sm leading-relaxed">
                The original game. Click to place your X or O, with full move history so you can travel back in time.
              </div>
            </div>
            <div className="w-full mt-auto pt-3 border-t border-white/5">
              <span className="text-amber-400/70 text-xs font-semibold tracking-widest uppercase group-hover:text-amber-400 transition-colors">
                Play Classic →
              </span>
            </div>
          </button>

          {/* Teen */}
          <button
            onClick={() => setMode("teen")}
            className="group flex flex-col items-center gap-5 p-8 rounded-3xl bg-white/3 border border-white/10 hover:border-pink-400/50 hover:bg-pink-400/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-pink-500/10 text-left"
          >
            <div className="text-6xl">⚡</div>
            <div>
              <div className="text-white font-black text-xl tracking-tight mb-1.5">Tic Tac Drop</div>
              <div className="text-gray-500 text-sm leading-relaxed">
                Drag, drop, and reposition your pieces freely — then lock in your turn when you're sure.
              </div>
            </div>
            <div className="w-full mt-auto pt-3 border-t border-white/5">
              <span className="text-pink-400/70 text-xs font-semibold tracking-widest uppercase group-hover:text-pink-400 transition-colors">
                Play Tic Tac Drop →
              </span>
            </div>
          </button>

        </div>

        <p className="text-gray-700 text-xs tracking-wider">Tap a card to start playing</p>

        {/* Copyright */}
        <p className="text-gray-700 text-[10px] tracking-wider text-center">
          © 2026 Joanne Costo. All Rights Reserved.
        </p>

      </div>
    </div>
  );
}
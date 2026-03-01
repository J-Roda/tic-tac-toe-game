import { cn } from "@/lib/utils";

function StatBox({ label, value, color }) {
  const colors = {
    pink: "border-neon-pink/40 shadow-[0_0_10px_#ff006e20]",
    cyan: "border-neon-cyan/40 shadow-[0_0_10px_#00f5ff20]",
    yellow: "border-neon-yellow/40 shadow-[0_0_10px_#ffbe0b20]",
  };
  const textColors = {
    pink: "neon-text-pink",
    cyan: "neon-text-cyan",
    yellow: "neon-text-yellow",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 px-4 py-3 border bg-void-800/80",
        "flex-1 min-w-0",
        colors[color],
      )}
    >
      <span
        className={cn(
          "font-display font-black text-2xl sm:text-3xl tabular-nums",
          textColors[color],
        )}
      >
        {value}
      </span>
      <span className="text-[10px] font-display tracking-widest text-white/80 uppercase truncate w-full text-center">
        {label}
      </span>
    </div>
  );
}

export function Scoreboard({ player1, player2, stats, roundCount }) {
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/50" />
        <span className="text-[10px] font-display tracking-[0.4em] text-white/70 uppercase">
          Session Stats
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/50" />
      </div>

      <div className="flex gap-2">
        <StatBox label={`${player1} (✕)`} value={stats.player1Wins} color="pink" />
        <StatBox label="Draws" value={stats.draws} color="yellow" />
        <StatBox label={`${player2} (○)`} value={stats.player2Wins} color="cyan" />
      </div>

      <div className="flex justify-between items-center pt-1 px-1">
        <span className="text-[10px] font-body text-white/60 tracking-widest">ROUNDS PLAYED</span>
        <span className="text-[10px] font-display neon-text-green">{roundCount}</span>
      </div>
    </div>
  );
}

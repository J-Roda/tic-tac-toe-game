import { cn } from "@/lib/utils";
import { Button } from "./Button";

export function AbandonPrompt({ player1, player2, stats, roundCount, onResume, onAbandon }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-void-900/90 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative border border-neon-yellow/40 bg-void-800 p-6 max-w-sm w-full animate-slide-up shadow-neon-yellow">
        {/* Corner accents */}
        <span className="absolute top-2 left-2 w-3 h-3 border-t border-l border-neon-yellow/60" />
        <span className="absolute top-2 right-2 w-3 h-3 border-t border-r border-neon-yellow/60" />
        <span className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-neon-yellow/60" />
        <span className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-neon-yellow/60" />

        {/* Header */}
        <div className="text-center mb-5">
          <div className="font-display font-black text-lg neon-text-yellow tracking-wider mb-1">
            ⚠ SESSION DETECTED
          </div>
          <div className="text-[10px] font-body text-white/80 tracking-widest">
            AN UNFINISHED SESSION WAS FOUND
          </div>
        </div>

        {/* Session info */}
        <div className="border border-white/50 bg-void-900/60 px-4 py-3 mb-5 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-display tracking-widest text-white/70 uppercase">
              Players
            </span>
            <span className="text-xs font-display">
              <span className="neon-text-pink">{player1}</span>
              <span className="text-white/70 mx-1">vs</span>
              <span className="neon-text-cyan">{player2}</span>
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-display tracking-widest text-white/70 uppercase">
              Score
            </span>
            <div className="flex items-center gap-2 text-[10px] font-display">
              <span className="neon-text-pink">{stats?.player1Wins ?? 0}W</span>
              <span className="neon-text-yellow">{stats?.draws ?? 0}D</span>
              <span className="neon-text-cyan">{stats?.player2Wins ?? 0}W</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-display tracking-widest text-white/70 uppercase">
              Rounds
            </span>
            <span className="text-xs font-display text-white/60">{roundCount}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="ghost" size="sm" className="flex-1" onClick={onAbandon}>
            [ ABANDON ]
          </Button>
          <Button variant="green" size="sm" className="flex-1" onClick={onResume}>
            [ RESUME ]
          </Button>
        </div>
      </div>
    </div>
  );
}

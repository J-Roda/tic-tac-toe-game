import { BoardCell } from "./BoardCell";
import { cn } from "@/lib/utils";

export function GameBoard({ board, onCellClick, winCombo, disabled }) {
  return (
    <div className="relative">
      {/* Outer glow frame */}
      <div
        className={cn(
          "absolute -inset-3 rounded-sm opacity-30 transition-opacity duration-500",
          winCombo.length > 0 ? "opacity-80" : "opacity-20",
          "bg-gradient-to-br from-neon-pink/10 via-transparent to-neon-cyan/10",
          "blur-xl pointer-events-none",
        )}
      />

      <div
        className={cn(
          "relative grid grid-cols-3 gap-2 p-2 animate-grid-fade",
          "bg-void-800/50 border border-white",
        )}
      >
        {/* Grid dividers */}
        <div className="absolute left-1/3 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <div className="absolute left-2/3 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <div className="absolute top-1/3 left-2 right-2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute top-2/3 left-2 right-2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {board.map((cell, i) => (
          <BoardCell
            key={i}
            value={cell}
            onClick={() => onCellClick(i)}
            isWinCell={winCombo.includes(i)}
            isDisabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

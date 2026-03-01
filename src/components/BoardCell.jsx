import { cn } from "@/lib/utils";

export function BoardCell({ value, onClick, isWinCell, isDisabled }) {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled || !!value}
      className={cn(
        "relative aspect-square flex items-center justify-center",
        "bg-void-800 border transition-all duration-200 cursor-pointer",
        "disabled:cursor-not-allowed group overflow-hidden",
        // base state
        !value &&
          !isDisabled &&
          "border-white hover:border-neon-cyan/60 hover:shadow-cell-hover hover:bg-void-700",
        !value && isDisabled && "border-white opacity-50",
        // X state
        value === "X" && !isWinCell && "border-neon-pink/50 shadow-cell-x",
        // O state
        value === "O" && !isWinCell && "border-neon-cyan/50 shadow-cell-o",
        // win state
        isWinCell &&
          value === "X" &&
          "border-neon-pink shadow-[0_0_30px_#ff006e,inset_0_0_30px_#ff006e20] win-cell",
        isWinCell &&
          value === "O" &&
          "border-neon-cyan shadow-[0_0_30px_#00f5ff,inset_0_0_30px_#00f5ff20] win-cell",
      )}
    >
      {/* Hover hint */}
      {!value && !isDisabled && (
        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-20 transition-opacity text-4xl font-display text-neon-cyan select-none">
          +
        </span>
      )}

      {/* Corner accents */}
      <span className="absolute top-1 left-1 w-2 h-2 border-t border-l border-white" />
      <span className="absolute top-1 right-1 w-2 h-2 border-t border-r border-white" />
      <span className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-white" />
      <span className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-white" />

      {value && (
        <span
          className={cn(
            "font-display font-black select-none animate-pop-in leading-none",
            "text-4xl sm:text-5xl md:text-6xl",
            value === "X" ? "neon-text-pink" : "neon-text-cyan",
            isWinCell && "scale-110",
          )}
        >
          {value === "X" ? "✕" : "○"}
        </span>
      )}
    </button>
  );
}

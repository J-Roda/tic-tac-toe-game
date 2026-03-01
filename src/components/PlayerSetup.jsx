import { useState } from "react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

export function PlayerSetup({ onStart, isLoading }) {
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (p1.trim() && p2.trim()) {
      onStart(p1.trim(), p2.trim());
    }
  };

  return (
    <div className="animate-slide-up flex flex-col items-center gap-8 w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-4xl neon-text-pink font-display font-black">✕</span>
          <span className="text-white/550 font-display text-2xl">VS</span>
          <span className="text-4xl neon-text-cyan font-display font-black">○</span>
        </div>
        <h2 className="font-display text-white/60 text-sm tracking-[0.3em] uppercase">
          Enter Player Names
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {/* Player 1 */}
        <div className="relative group">
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-neon-pink rounded-full shadow-neon-pink opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <label className="block text-xs font-display tracking-widest neon-text-pink mb-2 uppercase">
            Player 1 — ✕
          </label>
          <input
            value={p1}
            onChange={(e) => setP1(e.target.value)}
            placeholder="Enter callsign..."
            maxLength={16}
            autoFocus
            className={cn(
              "w-full bg-void-800 border border-neon-pink/70 text-white",
              "px-4 py-3 font-body text-sm tracking-wider",
              "focus:outline-none focus:border-neon-pink focus:shadow-neon-pink",
              "placeholder:text-white/60 transition-all duration-200",
            )}
          />
        </div>

        {/* Player 2 */}
        <div className="relative group">
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-neon-cyan rounded-full shadow-neon-cyan opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <label className="block text-xs font-display tracking-widest neon-text-cyan mb-2 uppercase">
            Player 2 — ○
          </label>
          <input
            value={p2}
            onChange={(e) => setP2(e.target.value)}
            placeholder="Enter callsign..."
            maxLength={16}
            className={cn(
              "w-full bg-void-800 border border-neon-cyan/70 text-white",
              "px-4 py-3 font-body text-sm tracking-wider",
              "focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan",
              "placeholder:text-white/60 transition-all duration-200",
            )}
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="green"
            size="lg"
            className="w-full"
            disabled={!p1.trim() || !p2.trim() || isLoading}
          >
            {isLoading ? "[ INITIALIZING... ]" : "[ START SESSION ]"}
          </Button>
        </div>
      </form>

      <div className="text-center">
        <p className="text-white/60 text-xs font-body tracking-widest">
          SESSION DATA WILL BE STORED TO DATABASE
        </p>
      </div>
    </div>
  );
}

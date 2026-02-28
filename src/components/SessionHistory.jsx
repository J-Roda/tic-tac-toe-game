import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

function SessionRow({ session, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  // Guard — bail out if session shape is unexpected
  if (!session || typeof session !== "object") return null;

  const {
    player1 = "Player 1",
    player2 = "Player 2",
    stats = { player1Wins: 0, player2Wins: 0, draws: 0 },
    rounds = [],
    isActive = false,
    createdAt,
    _id,
  } = session;

  const safeStats = {
    player1Wins: stats?.player1Wins ?? 0,
    player2Wins: stats?.player2Wins ?? 0,
    draws: stats?.draws ?? 0,
  };

  const total = safeStats.player1Wins + safeStats.player2Wins + safeStats.draws;

  const topPlayer =
    safeStats.player1Wins > safeStats.player2Wins
      ? player1
      : safeStats.player2Wins > safeStats.player1Wins
        ? player2
        : null;

  const safeRounds = Array.isArray(rounds) ? rounds : [];

  return (
    <div
      className={cn(
        "border bg-void-800/60 transition-all duration-200",
        isActive ? "border-neon-green/30" : "border-white/5",
      )}
    >
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-void-700/50 transition-colors"
        onClick={() => setExpanded((e) => !e)}
      >
        {/* Status dot */}
        <div
          className={cn(
            "w-2 h-2 rounded-full flex-shrink-0",
            isActive ? "bg-neon-green shadow-neon-green animate-pulse" : "bg-white/20",
          )}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-display text-sm text-white/90 truncate">
              <span className="neon-text-pink">{player1}</span>
              <span className="text-white/30 mx-1">vs</span>
              <span className="neon-text-cyan">{player2}</span>
            </span>
            {!isActive && topPlayer && (
              <span className="text-[10px] font-display neon-text-yellow tracking-wider flex-shrink-0">
                ★ {topPlayer}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[10px] font-body text-white/30 tracking-wider">
              {createdAt ? new Date(createdAt).toLocaleDateString() : "—"}
            </span>
            <span className="text-[10px] font-body neon-text-pink">{safeStats.player1Wins}W</span>
            <span className="text-[10px] font-body neon-text-yellow">{safeStats.draws}D</span>
            <span className="text-[10px] font-body neon-text-cyan">{safeStats.player2Wins}W</span>
            <span className="text-[10px] font-body text-white/30">{total} rounds</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {expanded ? (
            <ChevronUp size={14} className="text-white/30" />
          ) : (
            <ChevronDown size={14} className="text-white/30" />
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (_id) onDelete(_id);
            }}
            className="p-1.5 text-white/20 hover:text-neon-pink hover:bg-neon-pink/10 transition-all rounded"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-white/5 px-4 py-3">
          {safeRounds.length > 0 ? (
            <>
              <div className="text-[10px] font-display tracking-widest text-white/30 uppercase mb-2">
                Round History
              </div>
              <div className="flex flex-wrap gap-2">
                {safeRounds.map((r, i) => (
                  <div
                    key={r?._id ?? i}
                    className={cn(
                      "px-2 py-1 text-[10px] font-display tracking-wider border",
                      r?.winner === player1
                        ? "border-neon-pink/40 neon-text-pink"
                        : r?.winner === player2
                          ? "border-neon-cyan/40 neon-text-cyan"
                          : "border-neon-yellow/40 neon-text-yellow",
                    )}
                  >
                    R{i + 1}: {r?.winner === "draw" ? "DRAW" : (r?.winner ?? "?")}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-[10px] font-body text-white/20 tracking-wider">
              No rounds played yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function SessionHistory() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["sessions"],
    queryFn: sessionApi.getAllSessions,
    refetchInterval: 15_000, // poll every 15s — balances freshness vs rate limit,
    // Never let undefined/null reach the component
    select: (result) => (Array.isArray(result) ? result : []),
  });

  // Guarantee sessions is always a safe array regardless of query state
  const sessions = Array.isArray(data) ? data : [];

  const deleteMutation = useMutation({
    mutationFn: sessionApi.deleteSession,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sessions"] }),
  });

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
        <span className="text-[10px] font-display tracking-[0.4em] text-white/30 uppercase">
          Session Archive
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="font-display text-xs tracking-widest neon-text-cyan animate-pulse">
            [ LOADING RECORDS... ]
          </div>
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <div className="text-center py-4 border border-neon-pink/20 bg-neon-pink/5">
          <div className="font-display text-xs tracking-widest text-neon-pink/60">
            FAILED TO LOAD SESSIONS
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && sessions.length === 0 && (
        <div className="text-center py-8 border border-white/5 bg-void-800/30">
          <div className="font-body text-xs text-white/20 tracking-widest">
            NO SESSIONS ON RECORD
          </div>
          <div className="font-body text-[10px] text-white/10 tracking-widest mt-1">
            START A GAME TO SEE IT HERE
          </div>
        </div>
      )}

      {/* Session list */}
      {sessions.length > 0 && (
        <>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {sessions.map((session) =>
              session?._id ? (
                <SessionRow
                  key={session._id}
                  session={session}
                  onDelete={(id) => deleteMutation.mutate(id)}
                />
              ) : null,
            )}
          </div>
          <div className="mt-3 text-right">
            <span className="text-[10px] font-body text-white/20 tracking-widest">
              {sessions.length} SESSION{sessions.length !== 1 ? "S" : ""} TOTAL
            </span>
          </div>
        </>
      )}
    </div>
  );
}

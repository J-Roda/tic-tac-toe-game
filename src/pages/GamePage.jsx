import { useState, useCallback, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionApi } from "@/lib/api";
import { useGameLogic } from "@/hooks/useGameLogic";
import {
  useUnloadGuard,
  saveSessionToStorage,
  loadSessionFromStorage,
  clearSessionFromStorage,
} from "@/hooks/useSessionPersistence";
import { PlayerSetup } from "@/components/PlayerSetup";
import { GameBoard } from "@/components/GameBoard";
import { TurnIndicator } from "@/components/TurnIndicator";
import { Scoreboard } from "@/components/Scoreboard";
import { SessionHistory } from "@/components/SessionHistory";
import { AbandonPrompt } from "@/components/AbandonPrompt";
import { Button } from "@/components/Button";
import { DbStatusIndicator } from "@/components/DbStatusIndicator";
import { cn } from "@/lib/utils";

export function GamePage() {
  const queryClient = useQueryClient();
  const [session, setSession] = useState(null);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [localStats, setLocalStats] = useState({ player1Wins: 0, player2Wins: 0, draws: 0 });
  const [roundCount, setRoundCount] = useState(0);
  const [abandonPrompt, setAbandonPrompt] = useState(null); // stored session data to prompt with

  // ── On mount — check for an unfinished session from a previous page load ────
  useEffect(() => {
    const stored = loadSessionFromStorage();
    if (stored) setAbandonPrompt(stored);
  }, []);

  // ── End session on page unload (refresh / close tab) ─────────────────────
  useUnloadGuard(session?._id ?? null);

  // ── Persist session state to localStorage on every change ────────────────
  useEffect(() => {
    if (session) {
      saveSessionToStorage(session, player1, player2, localStats, roundCount);
    } else {
      clearSessionFromStorage();
    }
  }, [session, player1, player2, localStats, roundCount]);

  // ── Mutations ─────────────────────────────────────────────────────────────
  const createSessionMutation = useMutation({
    mutationFn: sessionApi.createSession,
    onSuccess: (data) => {
      setSession(data);
      setLocalStats(data.stats);
      setRoundCount(0);
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  const roundMutation = useMutation({
    mutationFn: sessionApi.createRound,
    onSuccess: (data) => {
      setLocalStats(data.stats);
      setRoundCount(data.rounds.length);
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  const endSessionMutation = useMutation({
    mutationFn: sessionApi.endSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  const reactivateSessionMutation = useMutation({
    mutationFn: sessionApi.reactivateSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  // ── Abandon prompt handlers ───────────────────────────────────────────────
  const handleResume = async () => {
    if (!abandonPrompt) return;
    // Reactivate in DB — beforeunload may have stopped it on the previous page load
    await reactivateSessionMutation.mutateAsync(abandonPrompt.session._id);
    setSession(abandonPrompt.session);
    setPlayer1(abandonPrompt.player1);
    setPlayer2(abandonPrompt.player2);
    setLocalStats(abandonPrompt.stats ?? { player1Wins: 0, player2Wins: 0, draws: 0 });
    setRoundCount(abandonPrompt.roundCount ?? 0);
    setAbandonPrompt(null);
  };

  const handleAbandon = async () => {
    if (abandonPrompt?.session?._id) {
      // Fire-and-forget — end the stale session in the DB
      endSessionMutation.mutate(abandonPrompt.session._id);
    }
    clearSessionFromStorage();
    setAbandonPrompt(null);
  };

  // ── Game logic ────────────────────────────────────────────────────────────
  const handleRoundEnd = useCallback(
    async (winnerName) => {
      if (!session) return;
      await roundMutation.mutateAsync({ id: session._id, winner: winnerName });
    },
    [session, roundMutation],
  );

  const { board, currentTurn, currentPlayerName, result, handleCellClick, resetBoard } =
    useGameLogic({
      session,
      player1,
      player2,
      onRoundEnd: handleRoundEnd,
    });

  const handleStart = async (p1, p2) => {
    setPlayer1(p1);
    setPlayer2(p2);
    await createSessionMutation.mutateAsync({ player1: p1, player2: p2 });
  };

  const handleNextRound = () => resetBoard();

  const handleEndSession = async () => {
    if (session) await endSessionMutation.mutateAsync(session._id);
    clearSessionFromStorage();
    setSession(null);
    setPlayer1("");
    setPlayer2("");
    setLocalStats({ player1Wins: 0, player2Wins: 0, draws: 0 });
    setRoundCount(0);
    resetBoard();
  };

  const winCombo = result?.combo || [];
  const isBoardDisabled = !!result || !session;

  return (
    <div className="min-h-screen grid-bg relative">
      {/* Scan line effect */}
      <div className="scanline-overlay" />
      <div className="crt-vignette" />

      {/* Animated scan beam */}
      <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent animate-scan pointer-events-none z-50" />

      {/* Abandon / resume prompt */}
      {abandonPrompt && (
        <AbandonPrompt
          player1={abandonPrompt.player1}
          player2={abandonPrompt.player2}
          stats={abandonPrompt.stats}
          roundCount={abandonPrompt.roundCount}
          onResume={handleResume}
          onAbandon={handleAbandon}
        />
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-block relative">
            <h1
              className="glitch-title font-display font-black text-5xl sm:text-6xl md:text-7xl tracking-tight text-white animate-flicker"
              data-text="X · O · ARENA"
            >
              X · O · ARENA
            </h1>
          </div>
          <div className="mt-2 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-neon-pink/60" />
            <span className="text-[10px] font-display tracking-[0.5em] text-white/70 uppercase">
              Tactical Combat Edition
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-neon-cyan/60" />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* LEFT — main game area */}
          <div className="space-y-5">
            {!session ? (
              <div className="border border-white/50 bg-void-800/40 p-8">
                <PlayerSetup onStart={handleStart} isLoading={createSessionMutation.isPending} />
                {createSessionMutation.isError && (
                  <div className="mt-4 text-center text-xs font-body text-neon-pink/70 tracking-widest border border-neon-pink/20 py-2">
                    CONNECTION ERROR — CHECK BACKEND
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 animate-slide-up">
                {/* Player tags */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 px-4 py-2 border border-neon-pink/70 bg-neon-pink/5 flex-1">
                    <span className="font-display font-black text-lg neon-text-pink">✕</span>
                    <span className="font-display text-sm text-white/80 truncate">{player1}</span>
                  </div>
                  <div className="font-display text-white/60 text-xs tracking-widest px-2">VS</div>
                  <div className="flex items-center gap-2 px-4 py-2 border border-neon-cyan/70 bg-neon-cyan/5 flex-1 flex-row-reverse">
                    <span className="font-display font-black text-lg neon-text-cyan">○</span>
                    <span className="font-display text-sm text-white/80 truncate">{player2}</span>
                  </div>
                </div>

                {/* Turn indicator */}
                <TurnIndicator
                  currentTurn={currentTurn}
                  currentPlayerName={currentPlayerName}
                  result={result}
                  player1={player1}
                  player2={player2}
                />

                {/* Board */}
                <div className="flex justify-center">
                  <div className="w-full max-w-sm">
                    <GameBoard
                      board={board}
                      onCellClick={handleCellClick}
                      winCombo={winCombo}
                      disabled={isBoardDisabled}
                    />
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  {result ? (
                    <Button
                      variant="green"
                      size="md"
                      className="flex-1"
                      onClick={handleNextRound}
                      disabled={roundMutation.isPending}
                    >
                      {roundMutation.isPending ? "[ SAVING... ]" : "[ NEXT ROUND ]"}
                    </Button>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <span className="text-xs font-body text-white/60 tracking-widest">
                        SESSION ID: {session._id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <Button
                    variant="pink"
                    size="md"
                    onClick={handleEndSession}
                    hidden={!result}
                    disabled={endSessionMutation.isPending}
                  >
                    {endSessionMutation.isPending ? "..." : "[ END ]"}
                  </Button>
                </div>

                {/* Scoreboard */}
                <Scoreboard
                  player1={player1}
                  player2={player2}
                  stats={localStats}
                  roundCount={roundCount}
                />
              </div>
            )}
          </div>

          {/* RIGHT — session history */}
          <div className="space-y-4">
            <div className="border border-white/55 bg-void-800/40 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-display tracking-widest text-white/70 uppercase">
                  System
                </span>
                <DbStatusIndicator />
              </div>
              <div className="mt-2 font-body text-[10px] text-white/60 tracking-widest space-y-0.5">
                <div>BACKEND: {import.meta.env.VITE_API_URL ?? "localhost:5000"}</div>
                <div>DB: MONGODB</div>
                {session && <div className="neon-text-green">SESSION: ACTIVE</div>}
              </div>
            </div>

            <SessionHistory />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <div className="text-[10px] font-body text-white/555 tracking-[0.4em] uppercase">
            X · O · ARENA — TACTICAL EDITION — {new Date().getFullYear()}
          </div>
        </footer>
      </div>
    </div>
  );
}

import { useState, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sessionApi } from '@/lib/api'
import { useGameLogic } from '@/hooks/useGameLogic'
import { PlayerSetup } from '@/components/PlayerSetup'
import { GameBoard } from '@/components/GameBoard'
import { TurnIndicator } from '@/components/TurnIndicator'
import { Scoreboard } from '@/components/Scoreboard'
import { SessionHistory } from '@/components/SessionHistory'
import { Button } from '@/components/Button'
import { DbStatusIndicator } from '@/components/DbStatusIndicator'
import { cn } from '@/lib/utils'

export function GamePage() {
  const queryClient = useQueryClient()
  const [session, setSession] = useState(null)
  const [player1, setPlayer1] = useState('')
  const [player2, setPlayer2] = useState('')
  const [localStats, setLocalStats] = useState({ player1Wins: 0, player2Wins: 0, draws: 0 })
  const [roundCount, setRoundCount] = useState(0)

  // Mutations
  const createSessionMutation = useMutation({
    mutationFn: sessionApi.createSession,
    onSuccess: (data) => {
      setSession(data)
      setLocalStats(data.stats)
      setRoundCount(0)
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })

  const roundMutation = useMutation({
    mutationFn: sessionApi.createRound,
    onSuccess: (data) => {
      setLocalStats(data.stats)
      setRoundCount(data.rounds.length)
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })

  const endSessionMutation = useMutation({
    mutationFn: sessionApi.endSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })

  const handleRoundEnd = useCallback(async (winnerName) => {
    if (!session) return
    await roundMutation.mutateAsync({ id: session._id, winner: winnerName })
  }, [session, roundMutation])

  const { board, currentTurn, currentPlayerName, result, handleCellClick, resetBoard } = useGameLogic({
    session,
    player1,
    player2,
    onRoundEnd: handleRoundEnd,
  })

  const handleStart = async (p1, p2) => {
    setPlayer1(p1)
    setPlayer2(p2)
    await createSessionMutation.mutateAsync({ player1: p1, player2: p2 })
  }

  const handleNextRound = () => {
    resetBoard()
  }

  const handleEndSession = async () => {
    if (session) {
      await endSessionMutation.mutateAsync(session._id)
    }
    setSession(null)
    setPlayer1('')
    setPlayer2('')
    setLocalStats({ player1Wins: 0, player2Wins: 0, draws: 0 })
    setRoundCount(0)
    resetBoard()
  }

  const winCombo = result?.combo || []
  const isBoardDisabled = !!result || !session

  return (
    <div className="min-h-screen grid-bg relative">
      {/* Scan line effect */}
      <div className="scanline-overlay" />
      <div className="crt-vignette" />

      {/* Animated scan beam */}
      <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent animate-scan pointer-events-none z-50" />

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
            <span className="text-[10px] font-display tracking-[0.5em] text-white/30 uppercase">
              Tactical Combat Edition
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-neon-cyan/60" />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

          {/* LEFT — main game area */}
          <div className="space-y-5">

            {!session ? (
              /* Setup screen */
              <div className="border border-white/10 bg-void-800/40 p-8">
                <PlayerSetup
                  onStart={handleStart}
                  isLoading={createSessionMutation.isPending}
                />
                {createSessionMutation.isError && (
                  <div className="mt-4 text-center text-xs font-body text-neon-pink/70 tracking-widest border border-neon-pink/20 py-2">
                    CONNECTION ERROR — CHECK BACKEND
                  </div>
                )}
              </div>
            ) : (
              /* Active game */
              <div className="space-y-4 animate-slide-up">
                {/* Player tags */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 px-4 py-2 border border-neon-pink/30 bg-neon-pink/5 flex-1">
                    <span className="font-display font-black text-lg neon-text-pink">✕</span>
                    <span className="font-display text-sm text-white/80 truncate">{player1}</span>
                  </div>
                  <div className="font-display text-white/20 text-xs tracking-widest px-2">VS</div>
                  <div className="flex items-center gap-2 px-4 py-2 border border-neon-cyan/30 bg-neon-cyan/5 flex-1 flex-row-reverse">
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
                      {roundMutation.isPending ? '[ SAVING... ]' : '[ NEXT ROUND ]'}
                    </Button>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <span className="text-xs font-body text-white/20 tracking-widest">
                        SESSION ID: {session._id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <Button
                    variant="pink"
                    size="md"
                    onClick={handleEndSession}
                    disabled={endSessionMutation.isPending}
                  >
                    {endSessionMutation.isPending ? '...' : '[ END ]'}
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
            {/* System status */}
            <div className="border border-white/5 bg-void-800/40 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-display tracking-widest text-white/30 uppercase">System</span>
                <DbStatusIndicator />
              </div>
              <div className="mt-2 font-body text-[10px] text-white/20 tracking-widest space-y-0.5">
                <div>BACKEND: localhost:5000</div>
                <div>DB: MONGODB</div>
                {session && <div className="neon-text-green">SESSION: ACTIVE</div>}
              </div>
            </div>

            <SessionHistory />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <div className="text-[10px] font-body text-white/15 tracking-[0.4em] uppercase">
            X · O · ARENA — TACTICAL EDITION — {new Date().getFullYear()}
          </div>
        </footer>
      </div>
    </div>
  )
}

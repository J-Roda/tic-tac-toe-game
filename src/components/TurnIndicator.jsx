import { cn } from '@/lib/utils'

export function TurnIndicator({ currentTurn, currentPlayerName, result, player1, player2 }) {
  if (result) {
    const isDraw = result.winner === 'draw'
    const winnerName = result.winner === 'X' ? player1 : player2
    const isP1Win = result.winner === 'X'

    return (
      <div className="animate-slide-up text-center py-3 px-4 border bg-void-800/80 relative overflow-hidden">
        {!isDraw && (
          <div className={cn(
            'absolute inset-0 opacity-10',
            isP1Win ? 'bg-neon-pink' : 'bg-neon-cyan',
          )} />
        )}

        <div className="relative">
          <div className="text-xs font-display tracking-[0.4em] text-white/40 uppercase mb-1">
            {isDraw ? 'Round Over' : 'Victory'}
          </div>
          {isDraw ? (
            <div className="font-display font-black text-xl neon-text-yellow tracking-wider">
              ⚡ DRAW ⚡
            </div>
          ) : (
            <div className={cn(
              'font-display font-black text-xl tracking-wider',
              isP1Win ? 'neon-text-pink' : 'neon-text-cyan',
            )}>
              {winnerName} WINS
            </div>
          )}
        </div>
      </div>
    )
  }

  const isX = currentTurn === 'X'
  return (
    <div className={cn(
      'text-center py-3 px-4 border bg-void-800/80 transition-all duration-300',
      isX ? 'border-neon-pink/30' : 'border-neon-cyan/30',
    )}>
      <div className="text-xs font-display tracking-[0.4em] text-white/40 uppercase mb-1">
        Current Turn
      </div>
      <div className="flex items-center justify-center gap-2">
        <span className={cn(
          'font-display font-black text-lg',
          isX ? 'neon-text-pink' : 'neon-text-cyan',
        )}>
          {isX ? '✕' : '○'}
        </span>
        <span className={cn(
          'font-display font-semibold text-sm tracking-wider',
          isX ? 'text-neon-pink/80' : 'text-neon-cyan/80',
        )}>
          {currentPlayerName}
        </span>
        <span className={cn(
          'w-2 h-2 rounded-full animate-pulse',
          isX ? 'bg-neon-pink' : 'bg-neon-cyan',
        )} />
      </div>
    </div>
  )
}

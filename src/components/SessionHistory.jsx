import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { sessionApi } from '@/lib/api'
import { Button } from './Button'
import { cn } from '@/lib/utils'
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

function SessionRow({ session, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const { player1, player2, stats, rounds, isActive, createdAt, _id } = session
  const total = stats.player1Wins + stats.player2Wins + stats.draws

  const topPlayer = stats.player1Wins > stats.player2Wins
    ? player1
    : stats.player2Wins > stats.player1Wins
      ? player2
      : null

  return (
    <div className={cn(
      'border bg-void-800/60 transition-all duration-200',
      isActive ? 'border-neon-green/30' : 'border-white/5',
    )}>
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-void-700/50 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        {/* Status dot */}
        <div className={cn(
          'w-2 h-2 rounded-full flex-shrink-0',
          isActive ? 'bg-neon-green shadow-neon-green animate-pulse' : 'bg-white/20',
        )} />

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
              {new Date(createdAt).toLocaleDateString()}
            </span>
            <span className="text-[10px] font-body neon-text-pink">{stats.player1Wins}W</span>
            <span className="text-[10px] font-body neon-text-yellow">{stats.draws}D</span>
            <span className="text-[10px] font-body neon-text-cyan">{stats.player2Wins}W</span>
            <span className="text-[10px] font-body text-white/30">{total} rounds</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {expanded ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(_id) }}
            className="p-1.5 text-white/20 hover:text-neon-pink hover:bg-neon-pink/10 transition-all rounded"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {expanded && rounds.length > 0 && (
        <div className="border-t border-white/5 px-4 py-3">
          <div className="text-[10px] font-display tracking-widest text-white/30 uppercase mb-2">Round History</div>
          <div className="flex flex-wrap gap-2">
            {rounds.map((r, i) => (
              <div key={i} className={cn(
                'px-2 py-1 text-[10px] font-display tracking-wider border',
                r.winner === player1 ? 'border-neon-pink/40 neon-text-pink' :
                r.winner === player2 ? 'border-neon-cyan/40 neon-text-cyan' :
                'border-neon-yellow/40 neon-text-yellow',
              )}>
                R{i + 1}: {r.winner === 'draw' ? 'DRAW' : r.winner}
              </div>
            ))}
          </div>
        </div>
      )}
      {expanded && rounds.length === 0 && (
        <div className="border-t border-white/5 px-4 py-3">
          <div className="text-[10px] font-body text-white/20 tracking-wider">No rounds played yet</div>
        </div>
      )}
    </div>
  )
}

export function SessionHistory() {
  const queryClient = useQueryClient()
  const { data: sessions = [], isLoading, error } = useQuery({
    queryKey: ['sessions'],
    queryFn: sessionApi.getAllSessions,
    refetchInterval: 5000,
  })

  const deleteMutation = useMutation({
    mutationFn: sessionApi.deleteSession,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessions'] }),
  })

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
        <span className="text-[10px] font-display tracking-[0.4em] text-white/30 uppercase">
          Session Archive
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <div className="font-display text-xs tracking-widest neon-text-cyan animate-pulse">
            [ LOADING RECORDS... ]
          </div>
        </div>
      )}

      {error && (
        <div className="text-center py-4 border border-neon-pink/20 bg-neon-pink/5">
          <div className="font-display text-xs tracking-widest text-neon-pink/60">
            FAILED TO LOAD SESSIONS
          </div>
        </div>
      )}

      {!isLoading && sessions.length === 0 && (
        <div className="text-center py-8 border border-white/5 bg-void-800/30">
          <div className="font-body text-xs text-white/20 tracking-widest">
            NO SESSIONS ON RECORD
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {sessions.map(session => (
          <SessionRow
            key={session._id}
            session={session}
            onDelete={(id) => deleteMutation.mutate(id)}
          />
        ))}
      </div>

      {sessions.length > 0 && (
        <div className="mt-3 text-right">
          <span className="text-[10px] font-body text-white/20 tracking-widest">
            {sessions.length} SESSION{sessions.length !== 1 ? 'S' : ''} TOTAL
          </span>
        </div>
      )}
    </div>
  )
}

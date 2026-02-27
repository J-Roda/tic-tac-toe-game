import { useDbStatus } from '@/hooks/useDbStatus'
import { cn } from '@/lib/utils'

const config = {
  loading: {
    dot: 'bg-neon-yellow animate-pulse',
    text: 'neon-text-yellow',
    label: 'CONNECTING',
    shadow: 'shadow-neon-yellow',
  },
  online: {
    dot: 'bg-neon-green animate-pulse',
    text: 'neon-text-green',
    label: 'ONLINE',
    shadow: 'shadow-neon-green',
  },
  offline: {
    dot: 'bg-neon-pink animate-[ping_1s_ease-in-out_infinite]',
    text: 'neon-text-pink',
    label: 'OFFLINE',
    shadow: 'shadow-neon-pink',
  },
}

export function DbStatusIndicator() {
  const status = useDbStatus()
  const c = config[status]

  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        {/* ping ring for offline */}
        {status === 'offline' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-pink opacity-60" />
        )}
        <span className={cn('relative inline-flex rounded-full h-2 w-2', c.dot)} />
      </span>
      <span className={cn('text-[10px] font-body tracking-wider transition-colors duration-500', c.text)}>
        {c.label}
      </span>
    </div>
  )
}

import { useQuery } from '@tanstack/react-query'
import { healthApi } from '@/lib/api'

// 'loading' | 'online' | 'offline'
export function useDbStatus() {
  const { isLoading, isError, isSuccess } = useQuery({
    queryKey: ['db-health'],
    queryFn: healthApi.check,
    refetchInterval: 8000,       // re-ping every 8s
    retry: 1,                    // one retry before marking offline
    retryDelay: 1000,
  })

  if (isLoading) return 'loading'
  if (isError)   return 'offline'
  return 'online'
}

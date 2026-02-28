import { useQuery } from "@tanstack/react-query";
import { healthApi } from "@/lib/api";

// 'loading' | 'online' | 'offline'
export function useDbStatus() {
  const { isLoading, isError } = useQuery({
    queryKey: ["db-health"],
    queryFn: healthApi.check,
    refetchInterval: 30_000, // re-ping every 30s — no need to hammer health check
    retry: 1,
    retryDelay: 2000,
  });

  if (isLoading) return "loading";
  if (isError) return "offline";
  return "online";
}

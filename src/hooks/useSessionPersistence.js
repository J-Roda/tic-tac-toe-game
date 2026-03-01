import { useEffect, useRef } from 'react'
import { sessionApi } from '@/lib/api'

const STORAGE_KEY = 'xo_arena_session'

// ── Helpers ───────────────────────────────────────────────────────────────────

export function saveSessionToStorage(session, player1, player2, stats, roundCount) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      session,
      player1,
      player2,
      stats,
      roundCount,
    }))
  } catch (_) {}
}

export function loadSessionFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    // Validate shape before trusting it
    if (!parsed?.session?._id || !parsed?.player1 || !parsed?.player2) return null
    return parsed
  } catch (_) {
    return null
  }
}

export function clearSessionFromStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (_) {}
}

// ── Hook — fires endSession on page unload if a session is active ─────────────
export function useUnloadGuard(sessionId) {
  const sessionIdRef = useRef(sessionId)

  // Keep ref in sync without re-registering the event listener
  useEffect(() => {
    sessionIdRef.current = sessionId
  }, [sessionId])

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!sessionIdRef.current) return

      // Use sendBeacon so the request survives page unload
      // Falls back to a fire-and-forget fetch if sendBeacon is unavailable
      const url = `${import.meta.env.VITE_API_URL ?? ''}/api/session/${sessionIdRef.current}/stop`

      const sent = navigator.sendBeacon?.(url, new Blob(['{}'], { type: 'application/json' }))

      if (!sent) {
        // sendBeacon not available or failed — best-effort fetch (may not complete)
        fetch(url, { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: '{}' })
          .catch(() => {})
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, []) // register once — reads sessionId via ref
}

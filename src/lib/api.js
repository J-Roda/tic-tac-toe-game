import axios from 'axios'

// In dev: Vite proxy rewrites /api → localhost:5000 (no VITE_API_URL needed)
// In prod (Vercel): VITE_API_URL must be set to your deployed backend, e.g. https://your-api.railway.app
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/session`
  : '/api/session'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const healthApi = {
  // Pings the backend — resolves if reachable, throws if not
  check: async () => {
    const { data } = await api.get('/')
    return data
  },
}

export const sessionApi = {
  // POST /create — { player1, player2 }
  createSession: async ({ player1, player2 }) => {
    const { data } = await api.post('/create', { player1, player2 })
    return data
  },

  // GET /all — returns all sessions (unwraps paginated { sessions, pagination } shape)
  getAllSessions: async () => {
    const { data } = await api.get('/all')
    // Backend returns { sessions: [], pagination: {} } — extract the array safely
    if (Array.isArray(data)) return data
    if (Array.isArray(data?.sessions)) return data.sessions
    return []
  },

  // POST /:id/round — { winner }
  createRound: async ({ id, winner }) => {
    const { data } = await api.post(`/${id}/round`, { winner })
    return data
  },

  // POST /:id/stop — end session
  endSession: async (id) => {
    const { data } = await api.post(`/${id}/stop`)
    return data
  },

  // POST /:id/reactivate — called when user resumes after page refresh
  reactivateSession: async (id) => {
    const { data } = await api.post(`/${id}/reactivate`)
    return data
  },

  // DELETE /:id
  deleteSession: async (id) => {
    const { data } = await api.delete(`/${id}`)
    return data
  },
}

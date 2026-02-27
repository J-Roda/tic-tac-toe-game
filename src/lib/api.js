import axios from 'axios'

const api = axios.create({
  baseURL: '/api/session',
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

  // GET /all — returns all sessions
  getAllSessions: async () => {
    const { data } = await api.get('/all')
    return data
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

  // DELETE /:id
  deleteSession: async (id) => {
    const { data } = await api.delete(`/${id}`)
    return data
  },
}

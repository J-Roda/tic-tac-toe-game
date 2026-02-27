import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GamePage } from './pages/GamePage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 2000,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GamePage />
    </QueryClientProvider>
  )
}

export default App

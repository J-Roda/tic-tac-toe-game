import { useState, useCallback } from 'react'

export const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],             // diags
]

export function checkWinner(squares) {
  for (const [a, b, c] of WINNING_COMBOS) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], combo: [a, b, c] }
    }
  }
  if (squares.every(Boolean)) return { winner: 'draw', combo: [] }
  return null
}

export function useGameLogic({ session, player1, player2, onRoundEnd }) {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [currentTurn, setCurrentTurn] = useState('X') // X = player1, O = player2
  const [result, setResult] = useState(null) // { winner, combo }
  const [isProcessing, setIsProcessing] = useState(false)

  const currentPlayerName = currentTurn === 'X' ? player1 : player2

  const handleCellClick = useCallback(async (index) => {
    if (!session || board[index] || result || isProcessing) return

    const newBoard = [...board]
    newBoard[index] = currentTurn
    setBoard(newBoard)

    const outcome = checkWinner(newBoard)
    if (outcome) {
      setResult(outcome)
      setIsProcessing(true)
      const winnerName = outcome.winner === 'X' ? player1 : outcome.winner === 'O' ? player2 : 'draw'
      await onRoundEnd(winnerName)
      setIsProcessing(false)
    } else {
      setCurrentTurn(t => t === 'X' ? 'O' : 'X')
    }
  }, [board, currentTurn, result, isProcessing, session, player1, player2, onRoundEnd])

  const resetBoard = useCallback(() => {
    setBoard(Array(9).fill(null))
    setCurrentTurn('X')
    setResult(null)
    setIsProcessing(false)
  }, [])

  return {
    board,
    currentTurn,
    currentPlayerName,
    result,
    isProcessing,
    handleCellClick,
    resetBoard,
  }
}

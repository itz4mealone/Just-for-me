import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

type Player = 'X' | 'O';
type Board = (Player | null)[];

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

export default function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);

  const checkWinner = (squares: Board): Player | 'Draw' | null => {
    for (const [a, b, c] of WINNING_COMBINATIONS) {
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a] as Player;
      }
    }
    
    if (squares.every(square => square !== null)) {
      return 'Draw';
    }
    
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  const renderSquare = (index: number) => {
    const isWinningSquare = winner && winner !== 'Draw' &&
      WINNING_COMBINATIONS.some(combo =>
        combo.includes(index) &&
        combo.every(i => board[i] === winner)
      );

    return (
      <button
        className={`w-24 h-24 border-2 border-gray-200 text-4xl font-bold
          ${!board[index] && !winner ? 'hover:bg-gray-100' : ''}
          ${isWinningSquare ? 'bg-green-100' : 'bg-white'}
          transition-colors`}
        onClick={() => handleClick(index)}
      >
        <span className={board[index] === 'X' ? 'text-rose-500' : 'text-blue-500'}>
          {board[index]}
        </span>
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex items-center justify-between w-full max-w-[400px]">
        <div className="text-xl font-semibold">
          {winner
            ? winner === 'Draw'
              ? "It's a Draw!"
              : `Winner: ${winner}`
            : `Current Player: ${currentPlayer}`}
        </div>
        <button
          onClick={resetGame}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <RotateCcw className="h-6 w-6" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {Array(9).fill(null).map((_, index) => (
          <div key={index}>
            {renderSquare(index)}
          </div>
        ))}
      </div>

      {winner && (
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
        >
          Play Again
        </button>
      )}
    </div>
  );
}
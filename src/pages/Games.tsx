import React, { useState } from 'react';
import { TowerControl as GameController, X, RotateCcw } from 'lucide-react';
import SnakeGame from '../components/games/SnakeGame';
import MemoryGame from '../components/games/MemoryGame';
import TicTacToe from '../components/games/TicTacToe';

const games = [
  {
    id: 'snake',
    name: 'Snake',
    description: 'Classic snake game. Eat the food, grow longer, but don\'t hit the walls or yourself!',
    component: SnakeGame,
  },
  {
    id: 'memory',
    name: 'Memory Cards',
    description: 'Test your memory by matching pairs of cards. Find all matches to win!',
    component: MemoryGame,
  },
  {
    id: 'tictactoe',
    name: 'Tic Tac Toe',
    description: 'Classic game of X\'s and O\'s. Play against each other!',
    component: TicTacToe,
  },
];

export default function Games() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  
  const GameComponent = selectedGame 
    ? games.find(game => game.id === selectedGame)?.component 
    : null;

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-playfair text-gray-800">Our Games</h1>
          {selectedGame && (
            <button
              onClick={() => setSelectedGame(null)}
              className="flex items-center space-x-2 px-4 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
            >
              <X className="h-5 w-5" />
              <span>Close Game</span>
            </button>
          )}
        </div>

        {selectedGame ? (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            {GameComponent && <GameComponent />}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {games.map((game, index) => (
              <div
                key={game.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
                onClick={() => setSelectedGame(game.id)}
              >
                <GameController className="h-12 w-12 text-rose-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">{game.name}</h2>
                <p className="text-gray-600">{game.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
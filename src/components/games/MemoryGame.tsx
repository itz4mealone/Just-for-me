import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

const CARD_PAIRS = [
  '❤️', '🌹', '🎵', '🌟', '🎨', '🎭', '🎪', '🎡'
].flatMap(emoji => [emoji, emoji]);

interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);

  const initializeGame = () => {
    const shuffledCards = [...CARD_PAIRS]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setIsGameComplete(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstId, secondId] = flippedCards;
      const firstCard = cards[firstId];
      const secondCard = cards[secondId];

      if (firstCard.value === secondCard.value) {
        setCards(prevCards =>
          prevCards.map(card =>
            card.id === firstId || card.id === secondId
              ? { ...card, isMatched: true }
              : card
          )
        );
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
      setMoves(prev => prev + 1);
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (cards.every(card => card.isMatched)) {
      setIsGameComplete(true);
    }
  }, [cards]);

  const handleCardClick = (id: number) => {
    if (
      flippedCards.length === 2 ||
      cards[id].isFlipped ||
      cards[id].isMatched
    ) {
      return;
    }

    setCards(prevCards =>
      prevCards.map(card =>
        card.id === id ? { ...card, isFlipped: true } : card
      )
    );
    setFlippedCards(prev => [...prev, id]);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex items-center justify-between w-full max-w-[400px]">
        <div className="text-xl font-semibold">Moves: {moves}</div>
        <button
          onClick={initializeGame}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <RotateCcw className="h-6 w-6" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 max-w-[400px]">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`w-20 h-20 rounded-lg flex items-center justify-center text-3xl
              ${card.isFlipped || card.isMatched
                ? 'bg-white'
                : 'bg-rose-500'} 
              transition-all duration-300 transform
              ${card.isFlipped ? 'rotate-y-180' : ''}
              hover:scale-105`}
            disabled={card.isMatched}
          >
            {(card.isFlipped || card.isMatched) && card.value}
          </button>
        ))}
      </div>

      {isGameComplete && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Congratulations! 🎉
          </h2>
          <p className="text-gray-600 mb-4">
            You completed the game in {moves} moves!
          </p>
          <button
            onClick={initializeGame}
            className="px-4 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
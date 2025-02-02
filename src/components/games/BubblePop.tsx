import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Play, Pause } from 'lucide-react';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
}

const COLORS = ['rose', 'pink', 'red', 'purple'];
const GAME_DURATION = 30; // seconds

export default function BubblePop() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<number>();
  const timerRef = useRef<number>();

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setBubbles([]);
    setIsPlaying(true);
  };

  const createBubble = () => {
    if (!gameAreaRef.current) return;
    
    const { width } = gameAreaRef.current.getBoundingClientRect();
    const size = Math.random() * 30 + 20;
    const newBubble: Bubble = {
      id: Date.now(),
      x: Math.random() * (width - size),
      y: 400, // Start from bottom
      size,
      speed: Math.random() * 2 + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
    setBubbles(prev => [...prev, newBubble]);
  };

  const updateBubbles = () => {
    setBubbles(prev =>
      prev
        .map(bubble => ({
          ...bubble,
          y: bubble.y - bubble.speed,
        }))
        .filter(bubble => bubble.y + bubble.size > 0)
    );
  };

  const popBubble = (id: number) => {
    setBubbles(prev => prev.filter(bubble => bubble.id !== id));
    setScore(prev => prev + 1);
  };

  useEffect(() => {
    if (isPlaying) {
      gameLoopRef.current = window.setInterval(() => {
        if (Math.random() < 0.1) createBubble();
        updateBubbles();
      }, 50);

      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            setHighScore(current => Math.max(current, score));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center justify-between w-full max-w-[400px]">
        <div className="space-x-4">
          <span className="text-xl font-semibold">Score: {score}</span>
          <span className="text-xl font-semibold">Time: {timeLeft}s</span>
        </div>
        <div className="space-x-2">
          <button
            onClick={() => setIsPlaying(prev => !prev)}
            className="p-2 rounded-full hover:bg-gray-100"
            disabled={timeLeft === 0}
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </button>
          <button
            onClick={startGame}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <RotateCcw className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div
        ref={gameAreaRef}
        className="relative bg-gray-100 rounded-lg w-full max-w-[400px] h-[400px] overflow-hidden"
      >
        {bubbles.map(bubble => (
          <button
            key={bubble.id}
            onClick={() => popBubble(bubble.id)}
            className={`absolute rounded-full bg-${bubble.color}-500 hover:bg-${bubble.color}-600 
              transition-transform hover:scale-110 cursor-pointer`}
            style={{
              left: bubble.x,
              top: bubble.y,
              width: bubble.size,
              height: bubble.size,
            }}
          />
        ))}

        {!isPlaying && timeLeft === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
              <p className="mb-2">Final Score: {score}</p>
              <p className="mb-4">High Score: {highScore}</p>
              <button
                onClick={startGame}
                className="px-4 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
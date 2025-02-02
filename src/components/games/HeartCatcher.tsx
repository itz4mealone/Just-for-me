import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Play, Pause, Heart } from 'lucide-react';

interface FallingHeart {
  id: number;
  x: number;
  y: number;
  speed: number;
  points: number;
}

const GAME_WIDTH = 400;
const GAME_HEIGHT = 400;
const PLAYER_WIDTH = 60;
const PLAYER_HEIGHT = 40;

export default function HeartCatcher() {
  const [playerX, setPlayerX] = useState(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
  const [hearts, setHearts] = useState<FallingHeart[]>([]);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const gameLoopRef = useRef<number>();
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setHearts([]);
    setIsPlaying(true);
  };

  const createHeart = () => {
    const newHeart: FallingHeart = {
      id: Date.now(),
      x: Math.random() * (GAME_WIDTH - 30),
      y: -30,
      speed: Math.random() * 2 + 2,
      points: Math.random() < 0.2 ? 5 : 1,
    };
    setHearts(prev => [...prev, newHeart]);
  };

  const updateGame = () => {
    setHearts(prev => {
      const updated = prev.map(heart => ({
        ...heart,
        y: heart.y + heart.speed,
      }));

      // Check collisions
      updated.forEach(heart => {
        if (
          heart.y + 30 >= GAME_HEIGHT - PLAYER_HEIGHT &&
          heart.x + 30 >= playerX &&
          heart.x <= playerX + PLAYER_WIDTH
        ) {
          setScore(prev => prev + heart.points);
          updated.splice(updated.indexOf(heart), 1);
        } else if (heart.y > GAME_HEIGHT) {
          setLives(prev => prev - 1);
          updated.splice(updated.indexOf(heart), 1);
        }
      });

      return updated;
    });
  };

  useEffect(() => {
    if (lives <= 0) {
      setIsPlaying(false);
      setHighScore(current => Math.max(current, score));
    }
  }, [lives, score]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!gameAreaRef.current) return;
      
      const rect = gameAreaRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setPlayerX(Math.max(0, Math.min(x - PLAYER_WIDTH / 2, GAME_WIDTH - PLAYER_WIDTH)));
    };

    if (isPlaying) {
      gameLoopRef.current = window.setInterval(() => {
        if (Math.random() < 0.05) createHeart();
        updateGame();
      }, 20);

      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isPlaying]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center justify-between w-full max-w-[400px]">
        <div className="space-x-4">
          <span className="text-xl font-semibold">Score: {score}</span>
          <span className="text-xl font-semibold">Lives: {'❤️'.repeat(lives)}</span>
        </div>
        <div className="space-x-2">
          <button
            onClick={() => setIsPlaying(prev => !prev)}
            className="p-2 rounded-full hover:bg-gray-100"
            disabled={lives <= 0}
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
        className="relative bg-gray-100 rounded-lg overflow-hidden"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {/* Player */}
        <div
          className="absolute bottom-0 transition-all duration-75"
          style={{
            left: playerX,
            width: PLAYER_WIDTH,
            height: PLAYER_HEIGHT,
          }}
        >
          <div className="w-full h-full flex items-center justify-center bg-rose-500 rounded-t-lg">
            <Heart className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Falling Hearts */}
        {hearts.map(heart => (
          <div
            key={heart.id}
            className={`absolute ${heart.points === 5 ? 'text-rose-500' : 'text-pink-400'}`}
            style={{
              left: heart.x,
              top: heart.y,
              transform: 'scale(1.5)',
            }}
          >
            ❤️
          </div>
        ))}

        {/* Game Over Screen */}
        {!isPlaying && lives <= 0 && (
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

      <p className="text-gray-600 text-center">
        Move the mouse to catch falling hearts!<br />
        Pink hearts = 1 point, Red hearts = 5 points
      </p>
    </div>
  );
}
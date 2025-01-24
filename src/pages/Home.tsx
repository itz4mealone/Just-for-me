import React, { useEffect, useState } from 'react';
import { Heart, Calendar, Clock } from 'lucide-react';

export default function Home() {
  const [daysInLove, setDaysInLove] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const startDate = new Date('2024-01-01'); // Update this to your actual start date
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysInLove(diffDays);

    const createHeart = () => {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.innerHTML = '❤️';
      heart.style.left = Math.random() * 100 + 'vw';
      heart.style.animationDuration = Math.random() * 3 + 2 + 's';
      document.getElementById('hearts-container')?.appendChild(heart);
      setTimeout(() => heart.remove(), 5000);
    };

    const heartInterval = setInterval(createHeart, 2000);
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      clearInterval(heartInterval);
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50 backdrop-blur-[2px]" />
      </div>
      
      <div id="hearts-container" className="absolute inset-0 pointer-events-none" />

      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-8 max-w-3xl mx-auto bg-black/30 p-12 rounded-xl backdrop-blur-sm">
          <div className="flex justify-center items-center space-x-4 text-white opacity-0 animate-fade-in">
            <Calendar className="h-6 w-6" />
            <span className="text-xl">{daysInLove} Days of Love</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-playfair text-white mb-6 opacity-0 animate-fade-in">
            To someone who makes my world brighter every day
          </h1>

          <div className="flex justify-center items-center space-x-4 text-white opacity-0 animate-fade-in animation-delay-500">
            <Clock className="h-6 w-6" />
            <span className="text-xl">
              {currentTime.toLocaleTimeString()}
            </span>
          </div>

          <p className="text-xl md:text-2xl text-white font-light opacity-0 animate-fade-in animation-delay-500">
            Every moment with you is a treasure, every memory a gift
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              'Every smile we share',
              'Every dream we build',
              'Every moment together'
            ].map((text, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-lg opacity-0 animate-fade-in"
                style={{ animationDelay: `${(index + 3) * 200}ms` }}
              >
                <Heart className="h-8 w-8 text-rose-500 mx-auto mb-4" />
                <p className="text-white">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
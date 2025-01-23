import React, { useEffect, useRef } from 'react';

export default function Message() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
    }
  }, []);

  return (
    <div className="min-h-screen py-16 px-4 bg-[url('https://images.unsplash.com/photo-1524172799204-f4048534a82b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center">
      <audio
        ref={audioRef}
        src="https://cdn.pixabay.com/download/audio/2022/02/22/audio_d1718ab41b.mp3?filename=soft-piano-background-9779.mp3"
        loop
        autoPlay
      />
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm p-8 md:p-12 rounded-lg shadow-lg transform rotate-1">
          <h1 className="text-4xl font-playfair text-gray-800 text-center mb-8">My Dearest</h1>
          <div className="space-y-6 text-gray-700 font-handwriting text-lg leading-relaxed">
            <p>
              Every day with you feels like a beautiful dream come true. Your smile lights up my world,
              and your love makes everything better.
            </p>
            <p>
              Thank you for being the most amazing person in my life. For all the little moments,
              the shared laughter, and the dreams we're building together.
            </p>
            <p>
              You make my heart skip a beat, today and always.
            </p>
            <p className="text-right">
              Forever yours,<br />
              Me
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
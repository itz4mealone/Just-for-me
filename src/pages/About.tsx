import React, { useState } from 'react';
import { Calendar, Heart } from 'lucide-react';

const milestones = [
  {
    date: 'First Meeting - January 1st, 2024',
    description: 'When our eyes first met...',
    poem: `It started with words after midnight's glow,
A chance, a moment, I didn't yet know.
We waited for sunshine, the day's gentle hue,
And somehow my heart found its path to you.

I never planned to love, yet here I stand,
Perhaps it was written by God's own hand.
From that first dawn, a truth I now see—
I'll love you forever, as meant to be.`,
  },
  {
    date: 'Most Memorable Meetup',
    description: 'A magical evening that changed everything...',
    poem: `Beneath October's moonlit skies,
I saw pure joy light up your eyes.
A journal gifted for your dreams to flow,
To hold your thoughts, to let them grow.

I spent a little, but gained so much,
Your happiness, your gentle touch.
And in that moment, a kiss we shared,
A silent promise of how much I cared.`,
  },
];

export default function About() {
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null);

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-16">
        <section className="text-center">
          <h1 className="text-4xl font-playfair text-gray-800 mb-6">Our Journey</h1>
          <p className="text-xl text-gray-600">
            "Great things are done by a series of small things brought together"
          </p>
        </section>

        <section className="space-y-12">
          <h2 className="text-3xl font-playfair text-gray-800 text-center">Our Story Timeline</h2>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="space-y-4">
                <div
                  className="flex items-center space-x-4 opacity-0 animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${index * 200}ms` }}
                  onClick={() => setSelectedMilestone(selectedMilestone === index ? null : index)}
                >
                  <Calendar className="h-8 w-8 text-rose-500 flex-shrink-0" />
                  <div className="bg-white p-6 rounded-lg shadow-md flex-grow">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{milestone.date}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
                
                {selectedMilestone === index && (
                  <div className="bg-rose-50 p-8 rounded-lg shadow-inner mx-12 opacity-0 animate-fade-in">
                    <pre className="font-handwriting text-lg whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {milestone.poem}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="text-center space-y-6">
          <h2 className="text-3xl font-playfair text-gray-800">Things We Love</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Adventures Together', 'Quiet Moments', 'Shared Dreams'].map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <Heart className="h-8 w-8 text-rose-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800">{item}</h3>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
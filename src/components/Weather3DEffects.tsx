import React from 'react';

// Simple weather effects UI
export default function Weather3DEffects({ condition }: { condition: string }) {
  let icon = '☀️';
  if (condition === 'cloudy') icon = '☁️';
  if (condition === 'rainy') icon = '🌧️';
  return (
    <div className="flex items-center gap-2 my-2 text-2xl">
      <span>{icon}</span>
      <span className="font-semibold">{condition.charAt(0).toUpperCase() + condition.slice(1)}</span>
    </div>
  );
}

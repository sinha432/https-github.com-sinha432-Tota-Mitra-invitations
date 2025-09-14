import React from 'react';

// Simple skill badges UI
export default function SkillBadges3D({ skills }: { skills: string[] }) {
  return (
    <div className="flex gap-2 flex-wrap my-2">
      {skills.map(skill => (
        <span key={skill} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">{skill}</span>
      ))}
    </div>
  );
}

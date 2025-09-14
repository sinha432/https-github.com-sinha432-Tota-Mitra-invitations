import React from 'react';

// Simple attendance board UI
export default function AttendanceBoard3D({ workers }: { workers: Array<{ name: string, id: string, present: boolean }> }) {
  return (
    <div className="my-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {workers.map(w => (
          <div key={w.id} className={`p-3 rounded-lg border flex flex-col items-center ${w.present ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'}`}>
            <span className="font-semibold">{w.name}</span>
            <span className={`mt-1 text-xs ${w.present ? 'text-green-700' : 'text-red-700'}`}>{w.present ? 'Present' : 'Absent'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

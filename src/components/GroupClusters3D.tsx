import React from 'react';

// Simple group cluster list UI
export default function GroupClusters3D({ groups }: { groups: Array<{ group: string, workers: Array<{ name: string, id: string }> }> }) {
  return (
    <div className="my-6">
      {groups.map(g => (
        <div key={g.group} className="mb-4 p-4 border rounded-lg bg-gray-50">
          <div className="font-bold text-lg text-teal-700 mb-2">{g.group}</div>
          <div className="flex gap-2 flex-wrap">
            {g.workers.map(w => (
              <span key={w.id} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{w.name}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

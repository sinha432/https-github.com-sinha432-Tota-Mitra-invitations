import React from 'react';

// Simple task timeline UI
export default function TaskTimeline3D({ tasks }: { tasks: Array<{ title: string, status: string }> }) {
  return (
    <div className="my-6">
      <div className="flex gap-4 flex-wrap">
        {tasks.map((task, i) => (
          <div key={i} className={`px-4 py-2 rounded-lg border shadow-sm ${task.status === 'completed' ? 'bg-green-100 border-green-400' : task.status === 'pending' ? 'bg-yellow-100 border-yellow-400' : 'bg-blue-100 border-blue-400'}`}>
            <div className="font-semibold">{task.title}</div>
            <div className="text-xs mt-1">{task.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

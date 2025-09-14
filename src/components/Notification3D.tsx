import React, { useEffect } from 'react';

// Simple notification UI
export default function Notification3D({ message, color = '#00e6d3', duration = 2000, onClose }: { message: string, color?: string, duration?: number, onClose?: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  return (
    <div className="fixed top-10 right-10 z-50 px-4 py-2 rounded shadow-lg" style={{ background: color, color: '#222', minWidth: 120 }}>
      {message}
    </div>
  );
}

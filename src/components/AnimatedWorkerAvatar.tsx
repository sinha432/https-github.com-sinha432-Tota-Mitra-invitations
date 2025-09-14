import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Simple avatar UI
export default function AnimatedWorkerAvatar({ name, color, profilePic }: { name: string, color?: string, profilePic?: string }) {
  return (
    <Avatar className="h-20 w-20">
      <AvatarImage src={profilePic} alt={name} />
      <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
    </Avatar>
  );
}

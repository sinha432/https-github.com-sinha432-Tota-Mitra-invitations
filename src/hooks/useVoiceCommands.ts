import { useState, useEffect, useCallback } from 'react';

// Type declaration for SpeechRecognition (Web Speech API)
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
import { mockWorkers, mockTasks } from '@/data/mockData';
import { toast } from 'sonner';

interface VoiceCommandResult {
  action: string;
  data?: any;
  message: string;
}

export const useVoiceCommands = (language: 'en' | 'kn' = 'en') => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = language === 'kn' ? 'kn-IN' : 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
        toast.info('Listening for voice commands...');
      };

      recognitionInstance.onresult = (event) => {
        // Handle final results
        if (event.results[0].isFinal) {
          const result = event.results[0][0].transcript.toLowerCase();
          setTranscript(result);
          processVoiceCommand(result);
        } else {
          // Interim results for better UX (optional preview)
          const interim = event.results[0][0].transcript;
          setTranscript(interim);
        }
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast.error('Voice recognition failed. Please try again.');
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const processVoiceCommand = useCallback((command: string): VoiceCommandResult | null => {
    console.log('Processing voice command:', command);

    if (language === 'kn') {
      // Basic warning for limited Kannada support
      return {
        action: 'language_warning',
        message: 'Kannada voice recognition is limited. Please use English commands for best results, or type your query.'
      };
    }

    // Enhanced worker queries with more variations
    if ((command.includes('show') && command.includes('workers')) || command.includes('list workers') || command.includes('show me workers') || command.includes('who are the workers')) {
      if (command.includes('group')) {
        const groupMatch = command.match(/group\s+(\w+)/i);
        if (groupMatch) {
          const group = groupMatch[1];
          const workersInGroup = mockWorkers.filter(w => w.group.toLowerCase().includes(group.toLowerCase()));
          return {
            action: 'list_workers',
            data: workersInGroup,
            message: `Found ${workersInGroup.length} workers in group ${group}`
          };
        }
      } else if (command.includes('available') || command.includes('free') || command.includes('ready')) {
        const availableWorkers = mockWorkers.filter(w => w.availability);
        return {
          action: 'list_workers',
          data: availableWorkers,
          message: `Found ${availableWorkers.length} available workers`
        };
      } else if (command.includes('rating above') || command.includes('rating over') || command.includes('high rating')) {
        const ratingMatch = command.match(/rating\s+(?:above|over)\s+(\d+)/i);
        if (ratingMatch) {
          const rating = parseFloat(ratingMatch[1]);
          const highRatedWorkers = mockWorkers.filter(w => w.rating >= rating);
          return {
            action: 'list_workers',
            data: highRatedWorkers,
            message: `Found ${highRatedWorkers.length} workers with rating ${rating} or above`
          };
        }
      }
      // Default: show all workers
      return {
        action: 'list_workers',
        data: mockWorkers,
        message: `Found ${mockWorkers.length} total workers`
      };
    }

    // Enhanced task queries with more variations
    if ((command.includes('show') && command.includes('tasks')) || command.includes('list tasks') || command.includes('what tasks') || command.includes('my tasks')) {
      if (command.includes('pending') || command.includes('incomplete')) {
        const pendingTasks = mockTasks.filter(t => t.status === 'pending');
        return {
          action: 'list_tasks',
          data: pendingTasks,
          message: `Found ${pendingTasks.length} pending tasks`
        };
      } else if (command.includes('completed') || command.includes('done') || command.includes('finished')) {
        const completedTasks = mockTasks.filter(t => t.status === 'completed');
        return {
          action: 'list_tasks',
          data: completedTasks,
          message: `Found ${completedTasks.length} completed tasks`
        };
      } else if (command.includes('today') || command.includes('tomorrow') || command.includes('schedule')) {
        const targetDate = command.includes('tomorrow')
          ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];
        const tasksForDate = mockTasks.filter(t => t.date === targetDate);
        return {
          action: 'list_tasks',
          data: tasksForDate,
          message: `Found ${tasksForDate.length} tasks for ${command.includes('tomorrow') ? 'tomorrow' : 'today'}`
        };
      }
      // Default: show all tasks
      return {
        action: 'list_tasks',
        data: mockTasks,
        message: `Found ${mockTasks.length} total tasks`
      };
    }

    // Task manipulation
    if (command.includes('mark task') && command.includes('completed')) {
      const taskIdMatch = command.match(/task\s+(\d+)/i) || command.match(/task\s+id\s+(\d+)/i);
      if (taskIdMatch) {
        const taskId = taskIdMatch[1];
        const task = mockTasks.find(t => t.id === taskId);
        if (task) {
          // In real app, this would update the database
          return {
            action: 'update_task',
            data: { id: taskId, status: 'completed' },
            message: `Marked task "${task.title}" as completed`
          };
        }
      }
    }

    // Contact information
    if (command.includes('contact') || command.includes('phone') || command.includes('call')) {
      const nameMatch = command.match(/(?:contact|phone|call)\s+(.+)/i);
      if (nameMatch) {
        const name = nameMatch[1].trim();
        const worker = mockWorkers.find(w => w.name.toLowerCase().includes(name.toLowerCase()));
        if (worker) {
          return {
            action: 'contact_worker',
            data: worker,
            message: `Contacting ${worker.name}: ${worker.contact.phone}`
          };
        }
      }
    }

    // Bulk operations
    if (command.includes('mark all') && command.includes('completed')) {
      if (command.includes('morning')) {
        // Mark all morning tasks as completed
        return {
          action: 'bulk_update',
          data: { type: 'morning_tasks', status: 'completed' },
          message: 'Marked all morning tasks as completed'
        };
      }
    }

    // Profile updates
    if (command.includes('update') && command.includes('profile')) {
      if (command.includes('location')) {
        const locationMatch = command.match(/location\s+to\s+(.+)/i);
        if (locationMatch) {
          const newLocation = locationMatch[1].trim();
          return {
            action: 'update_profile',
            data: { field: 'location', value: newLocation },
            message: `Updated location to ${newLocation}`
          };
        }
      }
    }

    // Enhanced attendance with more variations
    if (command.includes('mark attendance') || command.includes('i am present') || command.includes('check in') || command.includes('attendance present') || command.includes('im here')) {
      return {
        action: 'mark_attendance',
        data: { status: 'present' },
        message: 'Attendance marked as present'
      };
    }

    if (command.includes('check out') || command.includes('mark absent') || command.includes('i am absent') || command.includes('im leaving') || command.includes('attendance absent')) {
      return {
        action: 'mark_attendance',
        data: { status: 'absent' },
        message: 'Attendance marked as absent'
      };
    }

    // Worker-specific task requests
    if (command.includes('request new task') || command.includes('assign me task') || command.includes('give me task') || command.includes('new task for me')) {
      const typeMatch = command.match(/(?:task|for)\s+(.*)/i);
      const taskType = typeMatch ? typeMatch[1].trim() : 'general';
      return {
        action: 'request_task',
        data: { type: taskType },
        message: `Requesting new ${taskType} task. Opening task request modal.`
      };
    }

    // Help
    if (command.includes('help') || command.includes('commands')) {
      return {
        action: 'help',
        message: 'Available commands: show workers, list tasks, mark attendance, contact worker, update profile'
      };
    }

    // No match found
    return {
      action: 'unknown',
      message: `I didn't understand: "${command}". Try saying "help" for available commands.`
    };
  }, []);

  const startListening = useCallback(async () => {
    if (recognition && !isListening) {
      try {
        // Check microphone permission
        await navigator.mediaDevices.getUserMedia({ audio: true });
        recognition.start();
      } catch (err) {
        console.error('Microphone permission denied:', err);
        toast.error('Microphone access denied. Please enable in browser settings and try again.');
        setIsListening(false);
      }
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
    }
  }, [recognition, isListening]);

  const executeCommand = useCallback((command: string) => {
    const result = processVoiceCommand(command);
    if (result) {
      toast.success(result.message);
      return result;
    }
    return null;
  }, [processVoiceCommand]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    executeCommand,
    processVoiceCommand
  };
};

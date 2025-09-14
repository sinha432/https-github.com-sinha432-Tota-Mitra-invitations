import ThreeDOrb from './ThreeDOrb';
import React, { useState } from 'react';
import { FaMicrophone, FaPaperPlane } from 'react-icons/fa';
import '../AIAssistant.css';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface AIAssistantProps {
  appData?: any;
  onSend?: (msg: string) => void;
  theme?: string;
}

export default function AIAssistant({ appData, onSend, theme }: AIAssistantProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai', text: string }>>([]);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Voice recognition integration
  const handleMicClick = () => {
    if (!browserSupportsSpeechRecognition) {
      alert('Browser does not support speech recognition.');
      return;
    }
    if (!listening) {
      SpeechRecognition.startListening({ continuous: false, language: 'en-IN' });
    } else {
      SpeechRecognition.stopListening();
      setInput(transcript);
      resetTranscript();
    }
  };

  // Real-time query processing
  const processQuery = (query: string) => {
    if (!appData) return "Sorry, I couldn't access app data.";
    // Available workers
    if (/available workers|available now|who is available/i.test(query)) {
      const available = appData.workers?.filter((w: any) => w.availability);
      return `There are ${available.length} workers available now.`;
    }
    // Coconut harvesting in Group 4
    if (/coconut harvesting.*group 4/i.test(query)) {
      const assigned = appData.tasks?.filter((t: any) => t.type === 'Coconut Harvesting' && t.group === 'Group 4')?.flatMap((t: any) => t.assignedWorkers) || [];
      return assigned.length > 0
        ? `Assigned to coconut harvesting in Group 4: ${assigned.join(', ')}`
        : 'No workers assigned to coconut harvesting in Group 4.';
    }
    // Weather forecast for location
    if (/weather.*(forecast|today|now).*([a-zA-Z]+)/i.test(query)) {
      const match = query.match(/weather.*(?:for|in|at)?\s*([a-zA-Z]+)/i);
      const location = match ? match[1] : null;
      if (location && appData.weather) {
        return `Weather in ${location}: ${appData.weather.condition}, ${appData.weather.temperature}°C, Humidity ${appData.weather.humidity}%.`;
      }
      return appData.weather ? `Current weather: ${appData.weather.condition}, ${appData.weather.temperature}°C.` : 'Weather data not available.';
    }
    // Today's schedule
    if (/today.*schedule|show.*schedule/i.test(query)) {
      const today = new Date().toISOString().slice(0, 10);
      const todayTasks = appData.tasks?.filter((t: any) => t.date.startsWith(today));
      if (todayTasks && todayTasks.length > 0) {
        return `Today's schedule: ` + todayTasks.map((t: any) => `${t.title} (${t.type}) at ${t.location}`).join(', ');
      }
      return 'No tasks scheduled for today.';
    }
    // Pending tasks for group
    if (/pending tasks.*group (\d+)/i.test(query)) {
      const match = query.match(/group (\d+)/i);
      const group = match ? `Group ${match[1]}` : null;
      const pending = appData.tasks?.filter((t: any) => t.status === 'pending' && t.group === group);
      if (pending && pending.length > 0) {
        return `Pending tasks for ${group}: ` + pending.map((t: any) => t.title).join(', ');
      }
      return `No pending tasks for ${group}.`;
    }
    // Send notification
    if (/send.*notification/i.test(query)) {
      return 'Notification sent to all workers.';
    }
    // Give feedback for worker
    if (/give feedback.*([a-zA-Z]+)/i.test(query)) {
      const match = query.match(/give feedback.*([a-zA-Z]+)/i);
      const worker = match ? match[1] : null;
      if (worker) {
        return `Feedback form opened for ${worker}.`;
      }
      return 'Specify a worker name to give feedback.';
    }
    // Attendance status
    if (/attendance|who is present|who is absent/i.test(query)) {
      if (appData.attendance) {
        const present = Object.values(appData.attendance).filter((a: any) => a.status === 'present');
        const absent = Object.values(appData.attendance).filter((a: any) => a.status === 'absent');
        return `Present: ${present.map((a: any) => a.name).join(', ') || 'None'}; Absent: ${absent.map((a: any) => a.name).join(', ') || 'None'}`;
      }
      return 'Attendance data not available.';
    }
    // Worker profile
    if (/profile.*([a-zA-Z]+)/i.test(query)) {
      const match = query.match(/profile.*([a-zA-Z]+)/i);
      const name = match ? match[1].toLowerCase() : null;
      const worker = appData.workers?.find((w: any) => w.name.toLowerCase().includes(name));
      if (worker) {
        return `Profile for ${worker.name}: Age ${worker.age}, Group ${worker.group}, Skills: ${worker.skills.join(', ')}, Location: ${worker.location}, Rating: ${worker.rating}`;
      }
      return 'Worker not found.';
    }
    // Contact info
    if (/contact.*([a-zA-Z]+)/i.test(query)) {
      const match = query.match(/contact.*([a-zA-Z]+)/i);
      const name = match ? match[1].toLowerCase() : null;
      const worker = appData.workers?.find((w: any) => w.name.toLowerCase().includes(name));
      if (worker) {
        return `Contact for ${worker.name}: Phone ${worker.contact.phone}, Email ${worker.contact.email}`;
      }
      return 'Worker not found.';
    }
    // Skills
    if (/skills.*([a-zA-Z]+)/i.test(query)) {
      const match = query.match(/skills.*([a-zA-Z]+)/i);
      const name = match ? match[1].toLowerCase() : null;
      const worker = appData.workers?.find((w: any) => w.name.toLowerCase().includes(name));
      if (worker) {
        return `${worker.name}'s skills: ${worker.skills.join(', ')}`;
      }
      return 'Worker not found.';
    }
    // Feedback for worker
    if (/feedback.*([a-zA-Z]+)/i.test(query)) {
      const match = query.match(/feedback.*([a-zA-Z]+)/i);
      const name = match ? match[1].toLowerCase() : null;
      const feedbacks = appData.feedback?.filter((f: any) => f.workerName.toLowerCase().includes(name));
      if (feedbacks && feedbacks.length > 0) {
        return `Feedback for ${name}: ` + feedbacks.map((f: any) => `Rating ${f.rating}, "${f.comment}"`).join(' | ');
      }
      return 'No feedback found for this worker.';
    }
    // Switch language
    if (/switch.*kannada/i.test(query)) {
      return 'Language switched to Kannada.';
    }
    // General fallback
    return "Sorry, I couldn't find that information. Try asking about workers, tasks, weather, schedule, feedback, notifications, attendance, profile, contact, or skills.";
  };

  const handleSend = async () => {
    const messageToSend = input.trim() || transcript.trim();
    if (!messageToSend) return;
    setMessages([...messages, { sender: 'user', text: messageToSend }]);
    setInput('');
    resetTranscript();
    if (onSend) onSend(messageToSend);
    setTimeout(() => {
      const aiResponse = processQuery(messageToSend);
      setMessages(msgs => [...msgs, { sender: 'ai', text: aiResponse }]);
    }, 1200);
  };

  // Alexa-style floating orb and popover
  const [open, setOpen] = useState(false);
  // Use theme prop from parent, fallback to light if not provided
  const currentTheme = theme || 'light';
  return (
    <>
      {/* 3D Animated orb button */}
      <ThreeDOrb onClick={() => setOpen(o => !o)} />
      {/* Chat popover */}
      {open && (
        <div className={`ai-popover ai-popover-'${theme}'`}>
          <div className="ai-popover-header">
            <span className="ai-popover-title">TotaMitra Assistant</span>
            <button className="ai-popover-close" onClick={() => setOpen(false)}>&times;</button>
          </div>
          {/* Help/Suggestions Section */}
          <div className="ai-popover-help">
            <strong>Try asking:</strong>
            <ul className="ai-popover-help-list">
              <li>How many workers are available now?</li>
              <li>Who is assigned coconut harvesting in Group 4?</li>
              <li>What is the weather forecast for Sullia?</li>
              <li>Show me today’s schedule.</li>
              <li>Any pending tasks for Group 2?</li>
              <li>Send a notification to all workers.</li>
              <li>Give feedback for Ramesh Shenoy.</li>
              <li>Switch to Kannada.</li>
            </ul>
          </div>
          <div className="ai-popover-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={
                  'ai-popover-message ' +
                  (msg.sender === 'user' ? 'ai-popover-message-user' : 'ai-popover-message-ai')
                }
              >
                <span className={msg.sender === 'user' ? 'ai-popover-bubble-user' : 'ai-popover-bubble-ai'}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <div className="ai-popover-input-row">
            <button
              onClick={handleMicClick}
              className={listening ? 'ai-popover-mic-btn listening' : 'ai-popover-mic-btn'}
              title={listening ? 'Stop voice input' : 'Start voice input'}
            >
              <FaMicrophone />
            </button>
            <input
              value={input || transcript}
              onChange={e => setInput(e.target.value)}
              placeholder={listening ? 'Listening...' : 'Type a message'}
              className="ai-popover-input"
              disabled={listening}
            />
            <button
              onClick={handleSend}
              className="ai-popover-send-btn"
              title="Send message"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

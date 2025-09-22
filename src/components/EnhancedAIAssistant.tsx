import ThreeDOrb from './ThreeDOrb';
import React, { useState, useEffect, useRef } from 'react';
import { FaMicrophone, FaPaperPlane, FaRobot, FaKeyboard, FaTimes } from 'react-icons/fa';
import '../AIAssistant.css';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface AIAssistantProps {
  appData?: any;
  onSend?: (msg: string) => void;
  theme?: string;
}

export default function AIAssistant({ appData, onSend, theme }: AIAssistantProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai', text: string, timestamp?: Date }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [lastQueryContext, setLastQueryContext] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai', text: string, timestamp: Date }>>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enhanced voice recognition integration
  const handleMicClick = () => {
    if (!browserSupportsSpeechRecognition) {
      setMessages([...messages, {
        sender: 'ai',
        text: '❌ Voice recognition is not supported in this browser. Please type your message instead.',
        timestamp: new Date()
      }]);
      return;
    }

    if (!listening) {
      try {
        SpeechRecognition.startListening({
          continuous: false,
          language: 'en-IN',
          interimResults: false
        });
      } catch (error) {
        console.error('Speech recognition error:', error);
        setMessages([...messages, {
          sender: 'ai',
          text: '❌ Voice recognition failed to start. Please check your microphone permissions and try again.',
          timestamp: new Date()
        }]);
      }
    } else {
      try {
        SpeechRecognition.stopListening();
        if (transcript.trim()) {
          setInput(transcript);
        }
        resetTranscript();
      } catch (error) {
        console.error('Speech recognition stop error:', error);
        setInput(transcript || '');
        resetTranscript();
      }
    }
  };

  // Enhanced keyboard support
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Clear chat history
  const clearChat = () => {
    setMessages([]);
    setChatHistory([]);
    setLastQueryContext(null);
  };

  // Enhanced error handling for voice recognition
  useEffect(() => {
    if (transcript && listening) {
      // Real-time feedback for voice input
      setInput(transcript);
    }
  }, [transcript, listening]);

  // Add speech recognition event listeners
  useEffect(() => {
    const handleSpeechError = (event: any) => {
      console.error('Speech recognition error:', event.error);
      let errorMessage = '❌ Voice recognition error occurred.';

      switch (event.error) {
        case 'not-allowed':
          errorMessage = '❌ Microphone access denied. Please allow microphone permissions and try again.';
          break;
        case 'no-speech':
          errorMessage = '❌ No speech detected. Please speak clearly and try again.';
          break;
        case 'network':
          errorMessage = '❌ Network error occurred. Please check your connection and try again.';
          break;
        case 'service-not-allowed':
          errorMessage = '❌ Speech recognition service not allowed. Please check your browser settings.';
          break;
        default:
          errorMessage = `❌ Voice recognition failed: ${event.error}. Please try typing your message instead.`;
      }

      setMessages(prev => [...prev, {
        sender: 'ai',
        text: errorMessage,
        timestamp: new Date()
      }]);

      // Reset listening state on error
      if (listening) {
        SpeechRecognition.stopListening();
        resetTranscript();
      }
    };

    const handleSpeechEnd = () => {
      if (listening && transcript.trim()) {
        setInput(transcript);
      }
      resetTranscript();
    };

    // Add event listeners if supported
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.onerror = handleSpeechError;
      SpeechRecognition.onend = handleSpeechEnd;
    }

    return () => {
      // Cleanup
      if (browserSupportsSpeechRecognition) {
        SpeechRecognition.onerror = null;
        SpeechRecognition.onend = null;
      }
    };
  }, [browserSupportsSpeechRecognition, listening, transcript]);

  // Enhanced query processing with fuzzy matching and context awareness
  const processQuery = (query: string) => {
    const lowerQuery = query.toLowerCase().trim();
    if (!appData) return "❌ Sorry, I couldn't access app data. Please try refreshing the page.";

    // Context-aware responses based on previous queries
    if (lastQueryContext) {
      if (lowerQuery.includes('more') || lowerQuery.includes('details') || lowerQuery.includes('elaborate')) {
        return getDetailedResponse(lastQueryContext, query);
      }
    }

    // Enhanced pattern matching with multiple variations
    const patterns = {
      // Worker availability queries
      availability: [
        /available workers|workers available|who is available|available now|free workers/i,
        /show.*available|list.*available|current.*availability/i,
        /workers.*ready|ready.*workers|workers.*free/i
      ],
      // Group-specific queries
      groupTasks: [
        /tasks.*group (\d+)|group (\d+).*tasks|what.*group (\d+)/i,
        /group (\d+).*doing|group (\d+).*working|group (\d+).*assigned/i,
        /show.*group (\d+)|list.*group (\d+)/i
      ],
      // Skill-based queries
      skillSearch: [
        /workers.*skill|skilled.*workers|workers.*can|who.*can/i,
        /expertise|specialist|experienced/i,
        /workers.*harvest|workers.*spray|workers.*cultivat/i
      ],
      // Location-based queries
      location: [
        /workers.*location|location.*workers|where.*workers/i,
        /workers.*from|from.*workers|workers.*in/i,
        /workers.*puttur|workers.*belthangady|workers.*mangalore|workers.*bantwal|workers.*sullia/i
      ],
      // Task status queries
      taskStatus: [
        /pending.*tasks|tasks.*pending|incomplete.*tasks/i,
        /completed.*tasks|finished.*tasks|done.*tasks/i,
        /upcoming.*tasks|future.*tasks|scheduled.*tasks/i
      ],
      // Performance and ratings
      performance: [
        /best.*workers|top.*workers|highest.*rated|top.*performers/i,
        /worker.*rating|rating.*workers|performance.*workers/i,
        /reliable.*workers|dependable.*workers/i
      ],
      // Administrative commands
      admin: [
        /clear.*chat|reset.*chat|clear.*conversation/i,
        /help|what.*can.*do|how.*use|commands/i,
        /settings|preferences|options/i,
        /switch.*language|change.*language|kannada|hindi|english/i
      ]
    };

    // Check for matches with confidence scoring
    let bestMatch = { category: '', confidence: 0, response: '' };

    // Worker availability
    for (const pattern of patterns.availability) {
      if (pattern.test(lowerQuery)) {
        const available = appData.workers?.filter((w: any) => w.availability) || [];
        const response = `✅ **Available Workers (${available.length})**\n` +
          available.slice(0, 5).map((w: any) => `• ${w.name} (${w.group}) - ${w.skills.slice(0, 2).join(', ')}`).join('\n') +
          (available.length > 5 ? `\n... and ${available.length - 5} more` : '');
        bestMatch = { category: 'availability', confidence: 0.9, response };
        break;
      }
    }

    // Group-specific tasks
    if (!bestMatch.response) {
      const groupMatch = lowerQuery.match(/group (\d+)/i);
      if (groupMatch) {
        const groupNum = groupMatch[1];
        const groupName = `Group ${groupNum}`;
        const groupWorkers = appData.workers?.filter((w: any) => w.group === groupName) || [];
        const groupTasks = appData.tasks?.filter((t: any) => t.assignedWorkers?.some((wid: string) =>
          groupWorkers.some((w: any) => w.id === wid)
        )) || [];

        const response = `📊 **${groupName} Overview**\n` +
          `👥 Workers: ${groupWorkers.length} (${groupWorkers.filter((w: any) => w.availability).length} available)\n` +
          `📋 Active Tasks: ${groupTasks.length}\n` +
          `⭐ Top Skills: ${[...new Set(groupWorkers.flatMap((w: any) => w.skills))].slice(0, 3).join(', ')}`;
        bestMatch = { category: 'group', confidence: 0.9, response };
      }
    }

    // Skill-based search
    if (!bestMatch.response) {
      const skillKeywords = ['harvest', 'spray', 'cultivat', 'labor', 'support', 'medicine'];
      const foundSkill = skillKeywords.find(skill => lowerQuery.includes(skill));
      if (foundSkill) {
        const skilledWorkers = appData.workers?.filter((w: any) =>
          w.skills.some((s: string) => s.toLowerCase().includes(foundSkill))
        ) || [];
        const response = `🔧 **Workers with ${foundSkill}ing skills (${skilledWorkers.length})**\n` +
          skilledWorkers.slice(0, 4).map((w: any) => `• ${w.name} (${w.group}) - Rating: ${w.rating}/5`).join('\n') +
          (skilledWorkers.length > 4 ? `\n... and ${skilledWorkers.length - 4} more` : '');
        bestMatch = { category: 'skill', confidence: 0.8, response };
      }
    }

    // Location-based queries
    if (!bestMatch.response) {
      const locations = ['puttur', 'belthangady', 'mangalore', 'bantwal', 'sullia'];
      const foundLocation = locations.find(loc => lowerQuery.includes(loc));
      if (foundLocation) {
        const locationWorkers = appData.workers?.filter((w: any) =>
          w.location.toLowerCase().includes(foundLocation)
        ) || [];
        const response = `📍 **Workers in ${foundLocation.charAt(0).toUpperCase() + foundLocation.slice(1)} (${locationWorkers.length})**\n` +
          locationWorkers.slice(0, 4).map((w: any) => `• ${w.name} (${w.group}) - ${w.availability ? 'Available' : 'Busy'}`).join('\n') +
          (locationWorkers.length > 4 ? `\n... and ${locationWorkers.length - 4} more` : '');
        bestMatch = { category: 'location', confidence: 0.8, response };
      }
    }

    // Task status queries
    if (!bestMatch.response) {
      if (patterns.taskStatus.some(pattern => pattern.test(lowerQuery))) {
        const pendingTasks = appData.tasks?.filter((t: any) => t.status === 'pending') || [];
        const completedTasks = appData.tasks?.filter((t: any) => t.status === 'completed') || [];

        const response = `📋 **Task Status Overview**\n` +
          `⏳ Pending: ${pendingTasks.length}\n` +
          `✅ Completed: ${completedTasks.length}\n` +
          `📅 Today's Tasks: ${appData.tasks?.filter((t: any) => t.date === new Date().toISOString().split('T')[0]).length || 0}`;
        bestMatch = { category: 'tasks', confidence: 0.8, response };
      }
    }

    // Performance queries
    if (!bestMatch.response) {
      if (patterns.performance.some(pattern => pattern.test(lowerQuery))) {
        const topWorkers = appData.workers?.sort((a: any, b: any) => b.rating - a.rating).slice(0, 5) || [];
        const response = `🏆 **Top Performers**\n` +
          topWorkers.map((w: any, i: number) => `${i + 1}. ${w.name} (${w.group}) - ${w.rating}/5 ⭐`).join('\n');
        bestMatch = { category: 'performance', confidence: 0.8, response };
      }
    }

    // Administrative commands
    if (!bestMatch.response) {
      if (patterns.admin.some(pattern => pattern.test(lowerQuery))) {
        if (/clear|reset/i.test(lowerQuery)) {
          setTimeout(() => clearChat(), 100);
          return "🗑️ Chat history cleared!";
        }
        if (/help|what.*can|how.*use/i.test(lowerQuery)) {
          return getHelpResponse();
        }
        if (/language|kannada|hindi/i.test(lowerQuery)) {
          return "🌐 Language settings updated! (Feature coming soon)";
        }
        if (/settings|preferences/i.test(lowerQuery)) {
          return "⚙️ Settings panel would open here. (Feature coming soon)";
        }
      }
    }

    // Enhanced fallback with suggestions
    if (!bestMatch.response) {
      const suggestions = [
        "Try: 'Show available workers'",
        "Try: 'What tasks are pending?'",
        "Try: 'Who are the top performers?'",
        "Try: 'Workers in Puttur'",
        "Try: 'Help' for more options"
      ];
      return `🤔 I didn't understand: "${query}"\n\n💡 ${suggestions[Math.floor(Math.random() * suggestions.length)]}`;
    }

    // Set context for follow-up queries
    setLastQueryContext(bestMatch.category);
    return bestMatch.response;
  };

  // Get detailed response for follow-up queries
  const getDetailedResponse = (context: string, originalQuery: string) => {
    switch (context) {
      case 'availability':
        const available = appData.workers?.filter((w: any) => w.availability) || [];
        return `📞 **Contact Details for Available Workers**\n` +
          available.map((w: any) => `• ${w.name}: ${w.contact.phone}`).join('\n');
      case 'group':
        const groupMatch = originalQuery.match(/group (\d+)/i);
        if (groupMatch) {
          const groupNum = groupMatch[1];
          const groupWorkers = appData.workers?.filter((w: any) => w.group === `Group ${groupNum}`) || [];
          return `👥 **All ${groupNum} Workers**\n` +
            groupWorkers.map((w: any) => `• ${w.name} - ${w.availability ? '✅ Available' : '❌ Busy'}`).join('\n');
        }
        break;
      default:
        return "🔍 Please ask for more specific details about what you'd like to know.";
    }
    return "🔍 Please ask for more specific details about what you'd like to know.";
  };

  // Enhanced help response
  const getHelpResponse = () => {
    return `🤖 **TotaMitra Assistant Help**

**👥 Worker Queries:**
• "Show available workers" - List workers ready for tasks
• "Workers in Puttur" - Find workers by location
• "Top performers" - Best rated workers
• "Workers with harvesting skills" - Skill-based search

**📋 Task Management:**
• "What tasks are pending?" - Pending tasks overview
• "Today's schedule" - Tasks for today
• "Tasks for Group 2" - Group-specific tasks

**📞 Contact & Info:**
• "Contact Ramesh Shenoy" - Get worker contact details
• "Profile of Harish Rao" - Worker profile information
• "Skills of Meena Acharya" - Worker skills

**⚙️ Commands:**
• "Clear chat" - Reset conversation
• "Help" - Show this help menu

**🎤 Voice Commands:**
• Click microphone and speak naturally
• Press Enter or click send to submit text

💬 **Tips:** Ask follow-up questions like "more details" or "show contacts" for additional information!`;
  };

  const handleSend = async () => {
    const messageToSend = input.trim() || transcript.trim();
    if (!messageToSend) return;

    // Add user message with timestamp
    const userMessage = { sender: 'user' as const, text: messageToSend, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setChatHistory(prev => [...prev, userMessage]);

    // Clear input and transcript
    setInput('');
    resetTranscript();

    // Call parent onSend if provided
    if (onSend) onSend(messageToSend);

    // Show typing indicator
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse = processQuery(messageToSend);
      const aiMessage = { sender: 'ai' as const, text: aiResponse, timestamp: new Date() };
      setMessages(prev => [...prev, aiMessage]);
      setChatHistory(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 800); // Random delay between 800-1600ms for natural feel
  };

  // Alexa-style floating orb and popover
  const [open, setOpen] = useState(false);
  // Use theme prop from parent, fallback to light if not provided
  const currentTheme = theme || 'light';

  // Voice recognition timeout
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (listening) {
      timeoutId = setTimeout(() => {
        if (listening) {
          SpeechRecognition.stopListening();
          resetTranscript();
          setMessages(prev => [...prev, {
            sender: 'ai',
            text: '⏱️ Voice input timed out. Please try again or type your message.',
            timestamp: new Date()
          }]);
        }
      }, 10000); // 10 second timeout
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [listening]);
  return (
    <>
      {/* 3D Animated orb button */}
      <ThreeDOrb onClick={() => setOpen(o => !o)} />
      {/* Chat popover */}
      {open && (
        <div className={`ai-popover ai-popover-${theme}`}>
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
          {/* Typing indicator */}
          {isTyping && (
            <div className="ai-popover-typing">
              <div className="ai-popover-typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="ai-popover-typing-text">AI is thinking...</span>
            </div>
          )}

          <div className="ai-popover-input-row">
            <button
              onClick={handleMicClick}
              className={listening ? 'ai-popover-mic-btn listening' : 'ai-popover-mic-btn'}
              title={listening ? 'Stop voice input (click or wait for timeout)' : 'Start voice input'}
              disabled={!browserSupportsSpeechRecognition}
            >
              <FaMicrophone />
              {listening && <span className="ai-mic-indicator">🎤</span>}
            </button>
            <input
              ref={inputRef}
              value={input || transcript}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={listening ? '🎤 Listening...' : '💬 Type a message or press Enter to send...'}
              className="ai-popover-input"
              disabled={listening}
            />
            <button
              onClick={handleSend}
              className="ai-popover-send-btn"
              title="Send message (Enter)"
              disabled={!input.trim() && !transcript.trim()}
            >
              <FaPaperPlane />
            </button>
          </div>

          {/* Quick action buttons */}
          <div className="ai-popover-quick-actions">
            <button
              onClick={() => setInput('Show available workers')}
              className="ai-quick-action-btn"
              title="Available workers"
            >
              👥 Available
            </button>
            <button
              onClick={() => setInput('What tasks are pending?')}
              className="ai-quick-action-btn"
              title="Pending tasks"
            >
              📋 Tasks
            </button>
            <button
              onClick={() => setInput('Top performers')}
              className="ai-quick-action-btn"
              title="Top performers"
            >
              🏆 Best
            </button>
            <button
              onClick={clearChat}
              className="ai-quick-action-btn"
              title="Clear chat"
            >
              🗑️ Clear
            </button>
          </div>
        </div>
      )}
    </>
  );
}

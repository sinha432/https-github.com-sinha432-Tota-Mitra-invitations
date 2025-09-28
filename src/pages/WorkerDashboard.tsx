import React, { useState, useEffect, useRef } from 'react'

// Extend Window type for sharedFeedback and liveAttendance
declare global {
  interface Window {
    sharedFeedback: Feedback[];
    liveAttendance: Record<string, unknown>;
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Calendar,
  MapPin,
  Clock,
  Star,
  Phone,
  Mail,
  User,
  Briefcase,
  CheckCircle,
  AlertCircle,
  LogOut,
  Languages,
  Sun,
  CloudRain,
  Thermometer,
  MessageSquare,
  Send,
  Plus,
  Mic
} from 'lucide-react'
import { useAuth } from '@/App'
import FeedbackForm from '@/components/FeedbackForm'
import WeatherWidget from '@/components/WeatherWidget'
import ThreeDIcon from '../components/ThreeDIcon';
import '../components/WorkerProfile3D.css';
import { toast } from 'sonner'
import Notification3D from '../components/Notification3D';

const baseURL = 'http://localhost:8000/api'

type Task = {
  id: string;
  title: string;
  type: string;
  date: string;
  workersNeeded: number;
  assignedWorkers: string[];
  status: string;
  location: string;
  duration: string;
  description: string;
  createdBy: string;
  createdAt: string;
}

type Feedback = {
  id: string;
  taskId: string;
  workerId: string;
  workerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const WorkerDashboard = () => {
  // Live attendance state
  const [attendance, setAttendance] = useState<'present' | 'absent' | null>(null);
  const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);
  // Voice and Farmer Mode state
  const [farmerMode, setFarmerMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Import AI Assistant
  // Theme toggle
  const [theme, setTheme] = useState(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };
  const AIAssistant = React.lazy(() => import('../components/EnhancedAIAssistant'));

  const { user, logout, language, setLanguage } = useAuth()

  // API states
  const [workers, setWorkers] = useState<any[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const token = localStorage.getItem('token') || ''

  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showRequestTask, setShowRequestTask] = useState(false)
  const [showTaskDetails, setShowTaskDetails] = useState(false)
  const [selectedTaskDetails, setSelectedTaskDetails] = useState<Task | null>(null)
  const [notification, setNotification] = useState<{ message: string, color?: string } | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    type: '',
    date: '',
    location: '',
    duration: '',
    description: ''
  })
  const [isListeningForTask, setIsListeningForTask] = useState(false)
  const [selectedWorkerId, setSelectedWorkerId] = useState('1')
  const [animateProfile, setAnimateProfile] = useState(false)
  const [activeTab, setActiveTab] = useState<'tasks' | 'profile'>('tasks')
  const taskTypes = [
    'Arecanut Harvesting',
    'Coconut Harvesting',
    'Banana Cultivation Assistance',
    'Arecanut Medicine Spray',
    'Pepper Vine Support Work',
    'General Farm Labor'
  ]

  const currentWorker = workers.find(w => w.id === selectedWorkerId) || workers[0]
  const upcomingTasks = tasks.filter(task => task.assignedWorkers.includes(currentWorker?.id || '') && (task.status === 'approved' || task.status === 'pending'))
  const completedTasksCount = tasks.filter(task => task.assignedWorkers.includes(currentWorker?.id || '') && task.status === 'completed').length

  // Fetch data from API
  const fetchData = async () => {
    try {
      const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      console.log('GET /api/workers', { method: 'GET', path: '/api/workers' })
      const workersRes = await fetch(`${baseURL}/workers`, { headers })
      console.log('GET /api/tasks', { method: 'GET', path: '/api/tasks' })
      const tasksRes = await fetch(`${baseURL}/tasks?workerId=${user.id}`, { headers })
      console.log('GET /api/feedback', { method: 'GET', path: '/api/feedback' })
      const feedbackRes = await fetch(`${baseURL}/feedback?workerId=${user.id}`, { headers })
      if (!workersRes.ok || !tasksRes.ok || !feedbackRes.ok) throw new Error('Failed to fetch data')
      const workersData = await workersRes.json()
      const tasksData = await tasksRes.json()
      const feedbackData = await feedbackRes.json()
      setWorkers(workersData)
      setTasks(tasksData)
      setFeedback(feedbackData)
      setSelectedWorkerId(user.id || workersData[0]?.id)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAttendance = async (status: 'present' | 'absent') => {
    console.log('POST /api/attendance', { method: 'POST', path: '/api/attendance' })
    try {
      const res = await fetch(`${baseURL}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ workerId: currentWorker?.id, status })
      })
      if (!res.ok) throw new Error('Failed to submit attendance')
      setAttendance(status);
      setAttendanceSubmitted(true);
      toast.success(status === 'present' ? (language === 'en' ? 'Attendance marked: Present' : 'ಹಾಜರಿದ್ದೇನೆ ಎಂದು ಗುರುತಿಸಲಾಗಿದೆ') : (language === 'en' ? 'Attendance marked: Absent' : 'ಗೈರಾಗಿದ್ದೇನೆ ಎಂದು ಗುರುತಿಸಲಾಗಿದೆ'));
    } catch (err) {
      toast.error('Failed to submit attendance')
    }
  };

  // Function to speak text with Alexa-like natural voice
  const speak = (text: string) => {
    if (synthRef.current && voiceEnabled && !synthRef.current.speaking) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'kn' ? 'kn-IN' : 'en-US';
      utterance.rate = 0.85; // Slower, more deliberate like Alexa
      utterance.pitch = 1.1; // Slightly higher pitch for friendly tone
      utterance.volume = 1.0; // Full volume
      // Try to select a more natural voice if available
      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(voice =>
        (language === 'kn' && voice.lang.includes('kn')) ||
        (language === 'en' && voice.lang.includes('en') && (voice.name.includes('Google') || voice.name.includes('Microsoft')))
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      synthRef.current.speak(utterance);
    }
  };

  const handleRequestTask = async () => {
    if (!newTask.title || !newTask.type || !newTask.date || !newTask.location) {
      toast.error(language === 'en' ? 'Please fill all required fields' : 'ದಯವಿಟ್ಟು ಅಗತ್ಯವಿರುವ ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ')
      return
    }
    const allowedTypes = [
      'Arecanut Harvesting',
      'Coconut Harvesting',
      'Pepper Vine Support Work',
      'Banana Cultivation Assistance',
      'Arecanut Medicine Spray',
      'General Farm Labor'
    ] as const
    const typeValue = allowedTypes.includes(newTask.type as typeof allowedTypes[number])
      ? (newTask.type as typeof allowedTypes[number])
      : 'General Farm Labor'
    console.log('POST /api/tasks', { method: 'POST', path: '/api/tasks' })
    try {
      const taskData = {
        title: newTask.title,
        type: typeValue,
        date: newTask.date,
        workersNeeded: 1,
        assignedWorkers: [currentWorker?.id],
        status: 'pending',
        location: newTask.location,
        duration: newTask.duration,
        description: newTask.description,
        createdBy: currentWorker?.name,
        createdAt: new Date().toISOString()
      }
      const res = await fetch(`${baseURL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(taskData)
      })
      if (!res.ok) throw new Error('Failed to request task')
      const newTaskData = await res.json()
      setTasks([...tasks, newTaskData])
      setNotification({ message: language === 'en' ? 'Task request submitted!' : 'ಕಾರ್ಯ ವಿನಂತಿಯನ್ನು ಸಲ್ಲಿಸಲಾಗಿದೆ!', color: '#00e6d3' });
      setTimeout(() => setNotification(null), 2000);
      toast.success(language === 'en' ? 'Task request submitted!' : 'ಕಾರ್ಯ ವಿನಂತಿಯನ್ನು ಸಲ್ಲಿಸಲಾಗಿದೆ!')
      setShowRequestTask(false)
      setNewTask({
        title: '',
        type: '',
        date: '',
        location: '',
        duration: '',
        description: ''
      })
    } catch (err) {
      toast.error('Failed to request task')
    }
  }

  const handleFeedbackSubmit = async (feedbackData: { rating: number; comment: string }) => {
    console.log('POST /api/feedback', { method: 'POST', path: '/api/feedback' })
    try {
      const feedbackPayload = {
        taskId: selectedTask?.id || '',
        workerId: currentWorker?.id || '',
        workerName: currentWorker?.name || '',
        rating: feedbackData.rating,
        comment: feedbackData.comment,
        createdAt: new Date().toISOString()
      }
      const res = await fetch(`${baseURL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(feedbackPayload)
      })
      if (!res.ok) throw new Error('Failed to submit feedback')
      const savedFeedback = await res.json()
      setFeedback([...feedback, savedFeedback])
      setShowFeedbackForm(false)
      setSelectedTask(null)
      toast.success(t.feedbackSubmitted)
    } catch (err) {
      toast.error('Failed to submit feedback')
    }
  }

  const handleTabChange = (value: 'tasks' | 'profile') => {
    setActiveTab(value);
    if (farmerMode) {
      const speakText = value === 'tasks' 
        ? (language === 'en' ? 'Switched to tasks section. View your assigned tasks and mark attendance.' : 'ಕಾರ್ಯಗಳ ವಿಭಾಗಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ. ನಿಮ್ಮ ನಿಯೋಜಿತ ಕಾರ್ಯಗಳನ್ನು ವೀಕ್ಷಿಸಿ ಮತ್ತು ಹಾಜರಿ ಗುರುತಿಸಿ.')
        : (language === 'en' ? 'Switched to profile section. View your personal information and skills.' : 'ಪ್ರೊಫೈಲ್ ವಿಭಾಗಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ. ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ ಮತ್ತು ಕೌಶಲ್ಯಗಳನ್ನು ವೀಕ್ಷಿಸಿ.');
      speak(speakText);
    }
  };

  const switchWorkerByName = (name: string) => {
    const worker = workers.find(w => w.name.toLowerCase().includes(name.toLowerCase()));
    if (worker) {
      setSelectedWorkerId(worker.id);
      setAnimateProfile(true);
      setTimeout(() => setAnimateProfile(false), 800);
      toast.success(language === 'en' ? `Switched to ${worker.name}'s profile.` : `${worker.name}ರ ಪ್ರೊಫೈಲ್‌ಗೆ ಬದಲಾಯಿಸಲಾಗಿದೆ.`);
      speak(language === 'en' ? `Switched to ${worker.name}. Profile updated.` : `${worker.name}ಗೆ ಬದಲಾಯಿಸಲಾಗಿದೆ. ಪ್ರೊಫೈಲ್ ನವೀಕರಿಸಲಾಗಿದೆ.`);
    } else {
      toast.warning(language === 'en' ? 'Worker not found. Please try again.' : 'ಕೆಲಸಗಾರ ಹುಡುಕಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.');
      speak(language === 'en' ? 'Worker not found. Please say the name again.' : 'ಕೆಲಸಗಾರ ಹುಡುಕಲಿಲ್ಲ. ಹೆಸರನ್ನು ಮತ್ತೆ ಹೇಳಿ.');
    }
  };

  const viewTaskDetails = (taskTitle: string) => {
    const task = tasks.find(t => t.title.toLowerCase().includes(taskTitle.toLowerCase()));
    if (task) {
      setSelectedTaskDetails(task);
      setShowTaskDetails(true);
      speak(language === 'en' ? `Opening details for ${task.title}. Date: ${task.date}, Location: ${task.location}.` : `${task.title}ರ ವಿವರಗಳನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ. ದಿನಾಂಕ: ${task.date}, ಸ್ಥಳ: ${task.location}.`);
    } else {
      speak(language === 'en' ? 'Task not found. Please select from your list.' : 'ಕಾರ್ಯ ಹುಡುಕಲಿಲ್ಲ. ನಿಮ್ಮ ಪಟ್ಟಿಯಿಂದ ಆಯ್ಕೆಮಾಡಿ.');
    }
  };

  // Function to process voice commands with natural language support
  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase().trim();
    let handled = false;

    // Tab navigation
    if (!handled && (lowerCommand.includes('tasks') || lowerCommand.includes('my tasks') || lowerCommand.includes('go to tasks') || lowerCommand.includes('open tasks') || lowerCommand.includes('ಕಾರ್ಯಗಳು') || lowerCommand.includes('ನನ್ನ ಕಾರ್ಯಗಳು'))) {
      handleTabChange('tasks');
      handled = true;
    } else if (!handled && (lowerCommand.includes('profile') || lowerCommand.includes('my profile') || lowerCommand.includes('go to profile') || lowerCommand.includes('open profile') || lowerCommand.includes('ಪ್ರೊಫೈಲ್') || lowerCommand.includes('ನನ್ನ ಪ್ರೊಫೈಲ್'))) {
      handleTabChange('profile');
      handled = true;
    }

    // Profile switch
    if (!handled && (lowerCommand.includes('switch worker') || lowerCommand.includes('change worker') || lowerCommand.includes('select worker') || lowerCommand.includes('ಬದಲಾಯಿಸಿ ಕೆಲಸಗಾರ'))) {
      const nameMatch = lowerCommand.match(/switch to (\w+)|change to (\w+)|select (\w+)/i) || lowerCommand.match(/(\w+)\s*(?:ಗೆ|to)/);
      const name = nameMatch ? (nameMatch[1] || nameMatch[2] || nameMatch[3] || '') : '';
      if (name) {
        switchWorkerByName(name);
      } else {
        speak(language === 'en' ? 'Please say the worker name, like "switch to John".' : 'ಕೆಲಸಗಾರರ ಹೆಸರನ್ನು ಹೇಳಿ, ಉದಾ. "ಜಾನ್‌ಗೆ ಬದಲಾಯಿಸಿ".');
      }
      handled = true;
    }

    // Logout
    if (!handled && (lowerCommand.includes('logout') || lowerCommand.includes('log out') || lowerCommand.includes('sign out') || lowerCommand.includes('ಲಾಗ್ ಔಟ್') || lowerCommand.includes('ಸೈನ್ ಔಟ್'))) {
      logout();
      speak(language === 'en' ? 'Logging out. Goodbye!' : 'ಲಾಗ್ ಔಟ್ ಆಗುತ್ತಿದ್ದೇನೆ. ವಿದಾಯ!');
      handled = true;
    }

    // Farmer mode toggle
    if (!handled && (lowerCommand.includes('farmer mode') || lowerCommand.includes('simple mode') || lowerCommand.includes('enable farmer') || lowerCommand.includes('ಕೃಷಿ ಮೋಡ್') || lowerCommand.includes('ಸರಳ ಮೋಡ್'))) {
      setFarmerMode(!farmerMode);
      const mode = !farmerMode ? 'farmer' : 'normal';
      speak(language === 'en' ? `Switched to ${mode} mode.` : `${mode} ಮೋಡ್‌ಗೆ ಬದಲಾಯಿಸಲಾಗಿದೆ.`);
      handled = true;
    }

    // Language switch
    if (!handled && (lowerCommand.includes('english') || lowerCommand.includes('kannada') || lowerCommand.includes('switch language') || lowerCommand.includes('ಇಂಗ್ಲಿಷ್') || lowerCommand.includes('ಕನ್ನಡ'))) {
      const newLang = language === 'en' ? 'kn' : 'en';
      setLanguage(newLang);
      speak(newLang === 'en' ? 'Switched to English.' : 'ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ.');
      handled = true;
    }

    // View task details
    if (!handled && (lowerCommand.includes('view details') || lowerCommand.includes('task details') || lowerCommand.includes('show details') || lowerCommand.includes('ವಿವರಗಳು') || lowerCommand.includes('ಕಾರ್ಯ ವಿವರ'))) {
      const titleMatch = lowerCommand.match(/details for (\w+)|(\w+) details/i);
      const title = titleMatch ? (titleMatch[1] || titleMatch[2] || '') : '';
      if (title) {
        viewTaskDetails(title);
      } else {
        speak(language === 'en' ? 'Please say the task title, like "view details for harvesting".' : 'ಕಾರ್ಯದ ಶೀರ್ಷಿಕೆ ಹೇಳಿ, ಉದಾ. "ಕೊಯ್ಯುವಿಕೆ ವಿವರಗಳು ವೀಕ್ಷಿಸಿ".');
      }
      handled = true;
    }

    // Theme toggle with natural phrases
    if (lowerCommand.includes('dark mode') || lowerCommand.includes('light mode') || lowerCommand.includes('turn on dark') || lowerCommand.includes('turn off dark') || lowerCommand.includes('ಡಾರ್ಕ್ ಮೋಡ್') || lowerCommand.includes('ಲೈಟ್ ಮೋಡ್')) {
      toggleTheme();
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      speak(language === 'en' ? `Switched to ${newTheme} mode. Enjoy the view!` : `${newTheme} ಮೋಡ್‌ಗೆ ಬದಲಾಯಿಸಲಾಗಿದೆ. ವೀಕ್ಷಣೆಯನ್ನು ಆನಂದಿಸಿ!`);
      handled = true;
    }

    // Attendance with more natural phrases
    if (!handled && (lowerCommand.includes('present') || lowerCommand.includes('here') || lowerCommand.includes('i am present') || lowerCommand.includes('i\'m here') || lowerCommand.includes('mark present') || lowerCommand.includes('ಹಾಜರಿದ್ದೇನೆ') || lowerCommand.includes('ನಾನು ಇಲ್ಲಿದ್ದೇನೆ') || lowerCommand.includes('ಹಾಜರ್ ಮಾಡಿ'))) {
      handleAttendance('present');
      speak(language === 'en' ? 'Great! Your attendance has been marked as present. Have a productive day!' : 'ಚೆನ್ನಾಗಿ! ನಿಮ್ಮ ಹಾಜರನ್ನು ಹಾಜರಿದ್ದೇನೆ ಎಂದು ಗುರುತಿಸಲಾಗಿದೆ. ಉತ್ಪಾದಕ ದಿನವನ್ನು ಹೊಂದಿ!');
      handled = true;
    } else if (!handled && (lowerCommand.includes('absent') || lowerCommand.includes('not here') || lowerCommand.includes('i am absent') || lowerCommand.includes('i\'m not here') || lowerCommand.includes('mark absent') || lowerCommand.includes('ಗೈರಾಗಿದ್ದೇನೆ') || lowerCommand.includes('ನಾನು ಇಲ್ಲಿಲ್ಲ') || lowerCommand.includes('ಗೈರು ಮಾಡಿ'))) {
      handleAttendance('absent');
      speak(language === 'en' ? 'Attendance marked as absent. Feel free to update later if needed.' : 'ಹಾಜರನ್ನು ಗೈರಾಗಿದ್ದೇನೆ ಎಂದು ಗುರುತಿಸಲಾಗಿದೆ. ಅಗತ್ಯವಿದ್ದರೆ ನಂತರ ನವೀಕರಿಸಿ.');
      handled = true;
    }

    // Task request with natural phrases
    if (!handled && (lowerCommand.includes('task') || lowerCommand.includes('new task') || lowerCommand.includes('request task') || lowerCommand.includes('i need a task') || lowerCommand.includes('assign task') || lowerCommand.includes('ಕಾರ್ಯ') || lowerCommand.includes('ಹೊಸ ಕಾರ್ಯ') || lowerCommand.includes('ಕಾರ್ಯ ವಿನಂತಿ') || lowerCommand.includes('ಕಾರ್ಯ ನಿಯೋಜಿಸಿ'))) {
      setShowRequestTask(true);
      speak(language === 'en' ? "Sure, let's create a new task request. First, tell me the task title and type. For example, 'Coconut harvesting tomorrow at the farm'." : 'ಖಂಡಿತ, ಹೊಸ ಕಾರ್ಯ ವಿನಂತಿ ರಚಿಸೋಣ. ಮೊದಲು ಕಾರ್ಯದ ಶೀರ್ಷಿಕೆ ಮತ್ತು ಪ್ರಕಾರ ಹೇಳಿ. ಉದಾಹರಣೆಗೆ, "ನಾಳೆ ಜಮೀನಿನಲ್ಲಿ ತೆಂಗಿನ ಕೊಯ್ಯುವಿಕೆ".');
      handled = true;
    }

    // Submit task with natural phrases
    if (!handled && showRequestTask && (lowerCommand.includes('submit') || lowerCommand.includes('send') || lowerCommand.includes('done') || lowerCommand.includes('confirm') || lowerCommand.includes('ಸಲ್ಲಿಸಿ') || lowerCommand.includes('ಕಳುಹಿಸಿ') || lowerCommand.includes('ಒಪ್ಪುಕೊಳ್ಳಿ'))) {
      handleRequestTask();
      speak(language === 'en' ? "Task request submitted successfully! You'll hear back soon. What else can I help with?" : 'ಕಾರ್ಯ ವಿನಂತಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ! ಶೀಘ್ರದಲ್ಲೇ ಪ್ರತಿಕ್ರಿಯೆ ಬರುತ್ತದೆ. ಇನ್ನೇನಾದರೂ ಸಹಾಯ ಮಾಡಲಿ?');
      handled = true;
    }

    // Feedback with natural phrases
    if (!handled && (lowerCommand.includes('feedback') || lowerCommand.includes('review') || lowerCommand.includes('rate') || lowerCommand.includes('give feedback') || lowerCommand.includes('ಪ್ರತಿಕ್ರಿಯೆ') || lowerCommand.includes('ಮೌಲ್ಯಮಾಪನ') || lowerCommand.includes('ರೇಟ್ ಮಾಡಿ'))) {
      if (selectedTask) {
        setShowFeedbackForm(true);
        speak(language === 'en' ? `Opening feedback for "${selectedTask.title}". Please rate from 1 to 5 and share your thoughts.` : `"${selectedTask.title}" ಕ್ಕೆ ಪ್ರತಿಕ್ರಿಯೆ ತೆರೆಯುತ್ತಿದೆ. 1 ರಿಂದ 5 ರವರೆಗೆ ಮೌಲ್ಯಮಾಪನ ಮಾಡಿ ಮತ್ತು ನಿಮ್ಮ ಆಲೋಚನೆಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ.`);
      } else {
        speak(language === 'en' ? 'Please select a task first, then say "feedback" to provide your review.' : 'ಮೊದಲು ಒಂದು ಕಾರ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ, ನಂತರ "ಪ್ರತಿಕ್ರಿಯೆ" ಎಂದು ಹೇಳಿ ನಿಮ್ಮ ಮೌಲ್ಯಮಾಪನ ನೀಡಿ.');
      }
      handled = true;
    }

    // Submit feedback via voice
    if (!handled && (lowerCommand.includes('submit feedback') || lowerCommand.includes('send feedback') || lowerCommand.includes('ಪ್ರತಿಕ್ರಿಯೆ ಸಲ್ಲಿಸಿ'))) {
      if (selectedTask) {
        const ratingMatch = lowerCommand.match(/(\d)/);
        const rating = ratingMatch ? parseInt(ratingMatch[1]) : 5;
        const comment = lowerCommand.replace(/submit feedback \d/, '').trim() || 'Good job!';
        handleFeedbackSubmit({ rating, comment });
        speak(language === 'en' ? `Feedback submitted: ${rating} stars, "${comment}".` : `ಪ್ರತಿಕ್ರಿಯೆ ಸಲ್ಲಿಸಲಾಗಿದೆ: ${rating} ನಕ್ಷತ್ರಗಳು, "${comment}".`);
      } else {
        speak(language === 'en' ? 'Please select a task first.' : 'ಮೊದಲು ಒಂದು ಕಾರ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ.');
      }
      handled = true;
    }

    // Change role
    if (!handled && (lowerCommand.includes('change role') || lowerCommand.includes('switch role') || lowerCommand.includes('ಪಾತ್ರ ಬದಲಾಯಿಸಿ'))) {
      const roleMatch = lowerCommand.match(/(supervisor|employer|worker)/i);
      if (roleMatch) {
        const newRole = roleMatch[1].toLowerCase() as 'supervisor' | 'employer' | 'worker';
        const savedUser = localStorage.getItem('totamitra_user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          user.role = newRole;
          localStorage.setItem('totamitra_user', JSON.stringify(user));
          speak(language === 'en' ? `Switching to ${newRole} role. Reloading...` : `${newRole} ಪಾತ್ರಕ್ಕೆ ಬದಲಾಯಿಸುತ್ತಿದೆ. ಮರುಲೋಡ್ ಆಗುತ್ತಿದೆ...`);
          setTimeout(() => window.location.reload(), 1000);
        }
      } else {
        speak(language === 'en' ? 'Please specify supervisor, employer, or worker.' : 'ಸೂಪರ್ವೈಸರ್, ಎಂಪ್ಲಾಯರ್ ಅಥವಾ ವರ್ಕರ್ ಎಂದು ನಿರ್ದಿಷ್ಟಪಡಿಸಿ.');
      }
      handled = true;
    }

    // View personal information
    if (!handled && (lowerCommand.includes('personal info') || lowerCommand.includes('my profile') || lowerCommand.includes('tell me about myself') || lowerCommand.includes('ನನ್ನ ಮಾಹಿತಿ') || lowerCommand.includes('ನನ್ನ ಪ್ರೊಫೈಲ್'))) {
      setActiveTab('profile');
      const info = `${currentWorker?.name}, age ${currentWorker?.age}, ${currentWorker?.gender}, group ${currentWorker?.group}, location ${currentWorker?.location}, rating ${currentWorker?.rating}, skills: ${currentWorker?.skills?.join(', ')}.`;
      speak(language === 'en' ? `Switching to profile. ${info}` : `ಪ್ರೊಫೈಲ್‌ಗೆ ಬದಲಾಯಿಸುತ್ತಿದೆ. ${info}`);
      handled = true;
    }

    // Weather with more phrases
    if (!handled && (lowerCommand.includes('weather') || lowerCommand.includes('forecast') || lowerCommand.includes('today weather') || lowerCommand.includes('weather details') || lowerCommand.includes('tell me weather') || lowerCommand.includes('what\'s the weather') || lowerCommand.includes('rain check') || lowerCommand.includes('ಹವಾಮಾನ') || lowerCommand.includes('ಇಂದಿನ ಹವಾಮಾನ') || lowerCommand.includes('ಹವಾಮಾನ ವಿವರಗಳು') || lowerCommand.includes('ಹವಾಮಾನ ಹೇಳಿ'))) {
      // Mock detailed weather data (integrate with WeatherWidget in real app)
      const weatherDetails = {
        condition: 'Sunny',
        temp: 28,
        humidity: 60,
        wind: '5 km/h',
        uv: 'High'
      };
      speak(language === 'en' ? `Today's weather is ${weatherDetails.condition} with a temperature of ${weatherDetails.temp} degrees Celsius. Humidity is ${weatherDetails.humidity}%, wind at ${weatherDetails.wind}, and UV index is ${weatherDetails.uv}. Perfect for outdoor work!` : `ಇಂದಿನ ಹವಾಮಾನ ${weatherDetails.condition} ಆಗಿದ್ದು, ತಾಪಮಾನ ${weatherDetails.temp} ಡಿಗ್ರಿ ಸೆಲ್ಸಿಯಸ್. ಆರ್ದ್ರತೆ ${weatherDetails.humidity}%, ಗಾಳಿ ${weatherDetails.wind}, ಮತ್ತು UV ಸೂಚ್ಯಂಕ ${weatherDetails.uv}. ಹೊರಗಿನ ಕೆಲಸಕ್ಕೆ ಸೂಕ್ತ!`);
      // Trigger weather widget update if needed
      handled = true;
    }

    // AI Assistant commands
    if (!handled && (lowerCommand.includes('assistant') || lowerCommand.includes('totamitra') || lowerCommand.includes('ai') || lowerCommand.includes('open assistant') || lowerCommand.includes('help me') || lowerCommand.includes('ಸಹಾಯಕ') || lowerCommand.includes('ಟೋಟಮಿತ್ರ ಸಹಾಯಕ') || lowerCommand.includes('ಸಹಾಯ'))) {
      // Since AIAssistant is always rendered, focus or highlight it (simulate by speaking and toasting)
      toast.info(language === 'en' ? 'Totamitra Assistant is ready! You can chat with it on the side.' : 'ಟೋಟಮಿತ್ರ ಸಹಾಯಕ ಸಿದ್ಧ! ಪಕ್ಕದಲ್ಲಿ ಅದರೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಬಹುದು.');
      speak(language === 'en' ? "Opening Totamitra Assistant. Ask it anything about your dashboard or tasks!" : 'ಟೋಟಮಿತ್ರ ಸಹಾಯಕವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ. ನಿಮ್ಮ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಅಥವಾ ಕಾರ್ಯಗಳ ಬಗ್ಗೆ ಏನು ಕೇಳಬಹುದು!');
      // In real app, could trigger a ref to focus the assistant component
      handled = true;
    }

    // Help or unknown command with expanded guidance
    if (!handled) {
      speak(language === 'en' ? `I didn't catch that. Try saying "go to tasks", "switch to profile", "mark present", "request new task", "view details for harvesting", "switch language", "enable farmer mode", "logout", or "weather". What would you like to do?` : `ಅದನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲಿಲ್ಲ. "ಕಾರ್ಯಗಳು ಹೋಗಿ", "ಪ್ರೊಫೈಲ್ ಬದಲಾಯಿಸಿ", "ಹಾಜರ್ ಮಾಡಿ", "ಹೊಸ ಕಾರ್ಯ ವಿನಂತಿಸಿ", "ಕೊಯ್ಯುವಿಕೆ ವಿವರಗಳು ವೀಕ್ಷಿಸಿ", "ಭಾಷೆ ಬದಲಾಯಿಸಿ", "ಕೃಷಿ ಮೋಡ್ ಆನ್ ಮಾಡಿ", "ಲಾಗ್ ಔಟ್", ಅಥವಾ "ಹವಾಮಾನ" ಎಂದು ಹೇಳಿ ಪ್ರಯತ್ನಿಸಿ. ನೀವು ಏನು ಮಾಡಲು ಬಯಸುತ್ತೀರಿ?`);
    }
  };



  // Function to start listening
  const startListening = () => {
    if (recognitionRef.current && voiceEnabled && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    } else if (!voiceEnabled) {
      toast.error(language === 'en' ? 'Voice recognition not supported in this browser' : 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ');
    } else {
      toast.info(language === 'en' ? 'Listening already in progress' : 'ಶ್ರವಣ ನಡೆಯುತ್ತಿದೆ');
    }
  };

  // Function to start listening for task request
  const startListeningForTask = () => {
    if (recognitionRef.current && voiceEnabled && !isListeningForTask) {
      setIsListeningForTask(true);
      recognitionRef.current.start();
    } else if (!voiceEnabled) {
      toast.error(language === 'en' ? 'Voice recognition not supported' : 'ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ');
    } else {
      toast.info(language === 'en' ? 'Listening for task details' : 'ಕಾರ್ಯ ವಿವರಗಳಿಗಾಗಿ ಶ್ರವಣಿಸುತ್ತಿದೆ');
    }
  };

  // Function to parse task voice input with improved natural language
  const parseTaskVoiceInput = (input: string) => {
    const lowerInput = input.toLowerCase().trim();
    let parsedTask = { ...newTask };

    // Enhanced keyword matching for task type with natural phrases
    if (lowerInput.includes('coconut') || lowerInput.includes('ತೆಂಗು') || lowerInput.includes('coconut harvesting')) {
      parsedTask.type = 'Coconut Harvesting';
    } else if (lowerInput.includes('areca') || lowerInput.includes('arecanut') || lowerInput.includes('ಅಡಿಕೆ') || lowerInput.includes('betel nut')) {
      parsedTask.type = 'Arecanut Harvesting';
    } else if (lowerInput.includes('banana') || lowerInput.includes('ಬಾಳೆ') || lowerInput.includes('banana cultivation')) {
      parsedTask.type = 'Banana Cultivation Assistance';
    } else if (lowerInput.includes('spray') || lowerInput.includes('medicine') || lowerInput.includes('ಸ್ಪ್ರೇ') || lowerInput.includes('arecanut spray')) {
      parsedTask.type = 'Arecanut Medicine Spray';
    } else if (lowerInput.includes('pepper') || lowerInput.includes('vine') || lowerInput.includes('support')) {
      parsedTask.type = 'Pepper Vine Support Work';
    } else {
      parsedTask.type = 'General Farm Labor';
    }

    // Extract title from descriptive phrases (first meaningful words)
    const words = lowerInput.replace(/^(i want|please|can you|ನಾನು ಬಯಸು|ದಯವಿಟ್ಟು)/, '').split(' ');
    parsedTask.title = words.slice(0, 4).join(' ').replace(/\.$/, '') || 'New Task Request';

    // Enhanced date extraction
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); const tomorrowStr = tomorrow.toISOString().split('T')[0];
    if (lowerInput.includes('tomorrow') || lowerInput.includes('ನಾಳೆ') || lowerInput.includes('next day')) {
      parsedTask.date = tomorrowStr;
    } else if (lowerInput.includes('today') || lowerInput.includes('ಇಂದು') || lowerInput.includes('now')) {
      parsedTask.date = today;
    } else if (lowerInput.match(/\d{1,2}\/\d{1,2}/)) { // Simple date pattern like "10/15"
      const dateMatch = lowerInput.match(/(\d{1,2})[\/-](\d{1,2})/);
      if (dateMatch) {
        const month = parseInt(dateMatch[1]) - 1;
        const day = parseInt(dateMatch[2]);
        const dateObj = new Date(new Date().getFullYear(), month, day);
        parsedTask.date = dateObj.toISOString().split('T')[0];
      }
    } else {
      parsedTask.date = tomorrowStr; // Default to tomorrow
    }

    // Enhanced location extraction
    if (lowerInput.includes('farm') || lowerInput.includes('field') || lowerInput.includes('plantation') || lowerInput.includes('ಜಮೀನು') || lowerInput.includes('ಕ್ಷೇತ್ರ')) {
      parsedTask.location = lowerInput.includes('main farm') ? 'Main Farm' : 'Farm';
    } else if (lowerInput.includes('home') || lowerInput.includes('house')) {
      parsedTask.location = 'Home Location';
    } else {
      // Extract location words
      const locationWords = lowerInput.match(/(farm|field|plantation|orchard|ಜಮೀನು|ಕ್ಷೇತ್ರ|ಮನೆ)/);
      parsedTask.location = locationWords ? locationWords[0].charAt(0).toUpperCase() + locationWords[0].slice(1) : 'Farm';
    }

    // Enhanced duration extraction
    const hourMatch = lowerInput.match(/(\d+)\s*(hours?|hrs?|ಗಂಟೆಗಳ?|ಗಂಟೆ)/i);
    if (hourMatch) {
      parsedTask.duration = `${hourMatch[1]} ${parseInt(hourMatch[1]) > 1 ? 'hours' : 'hour'}`;
    } else if (lowerInput.includes('half day')) {
      parsedTask.duration = '4 hours';
    } else if (lowerInput.includes('full day')) {
      parsedTask.duration = '8 hours';
    } else {
      parsedTask.duration = '4 hours'; // Default
    }

    // Extract description (remaining text)
    const descStart = lowerInput.indexOf('because') > -1 ? lowerInput.indexOf('because') : lowerInput.length;
    const originalDescStart = input.toLowerCase().indexOf('because') > -1 ? input.toLowerCase().indexOf('because') : input.length;
    parsedTask.description = input.substring(originalDescStart).trim() || '';

    setNewTask(parsedTask);
    speak(language === 'en' ? `I've filled in the details: ${parsedTask.title} for ${parsedTask.date} at ${parsedTask.location}. Review and say "submit" when ready.` : `ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿದ್ದೇನೆ: ${parsedTask.title} ${parsedTask.date} ನ ${parsedTask.location} ರಲ್ಲಿ. ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಸಿದ್ಧವಾದಾಗ "ಸಲ್ಲಿಸಿ" ಎಂದು ಹೇಳಿ.`);
  };

  const translations = {
    en: {
      dashboard: 'Worker Dashboard',
      welcome: 'Welcome back',
      myTasks: 'My Tasks',
      profile: 'My Profile',
      weather: 'Today\'s Weather',
      upcomingTasks: 'Upcoming Tasks',
      completedTasks: 'Completed Tasks',
      totalTasks: 'Total Tasks',
      taskHistory: 'Task History',
      personalInfo: 'Personal Information',
      contactInfo: 'Contact Information',
      skills: 'Skills',
      workHistory: 'Work History',
      name: 'Name',
      age: 'Age',
      gender: 'Gender',
      group: 'Group',
      location: 'Location',
      phone: 'Phone',
      email: 'Email',
      rating: 'Rating',
      languages: 'Languages',
      availability: 'Availability Status',
      available: 'Available',
      unavailable: 'Unavailable',
      taskDate: 'Task Date',
      duration: 'Duration',
      status: 'Status',
      pending: 'Pending',
      approved: 'Approved',
      completed: 'Completed',
      cancelled: 'Cancelled',
      viewDetails: 'View Details',
      noTasks: 'No tasks assigned yet',
      temperature: 'Temperature',
      humidity: 'Humidity',
      condition: 'Weather',
      submitFeedback: 'Submit Feedback',
      provideFeedback: 'Provide Feedback',
      feedbackSubmitted: 'Feedback submitted successfully!',
      taskTitle: 'Task Title'
    },
    kn: {
      dashboard: 'ಕೆಲಸಗಾರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      welcome: 'ಮರಳಿ ಸ್ವಾಗತ',
      myTasks: 'ನನ್ನ ಕಾರ್ಯಗಳು',
      profile: 'ನನ್ನ ಪ್ರೊಫೈಲ್',
      weather: 'ಇಂದಿನ ಹವಾಮಾನ',
      upcomingTasks: 'ಮುಂಬರುವ ಕಾರ್ಯಗಳು',
      completedTasks: 'ಪೂರ್ಣಗೊಂಡ ಕಾರ್ಯಗಳು',
      totalTasks: 'ಒಟ್ಟು ಕಾರ್ಯಗಳು',
      taskHistory: 'ಕಾರ್ಯ ಇತಿಹಾಸ',
      personalInfo: 'ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ',
      contactInfo: 'ಸಂಪರ್ಕ ಮಾಹಿತಿ',
      skills: 'ಕೌಶಲ್ಯಗಳು',
      workHistory: 'ಕೆಲಸದ ಇತಿಹಾಸ',
      name: 'ಹೆಸರು',
      age: 'ವಯಸ್ಸು',
      gender: 'ಲಿಂಗ',
      group: 'ಗುಂಪು',
      location: 'ಸ್ಥಳ',
      phone: 'ಫೋನ್',
      email: 'ಇಮೇಲ್',
      rating: 'ರೇಟಿಂಗ್',
      languages: 'ಭಾಷೆಗಳು',
      availability: 'ಲಭ್ಯತೆಯ ಸ್ಥಿತಿ',
      available: 'ಲಭ್ಯವಿದೆ',
      unavailable: 'ಲಭ್ಯವಿಲ್ಲ',
      taskDate: 'ಕಾರ್ಯದ ದಿನಾಂಕ',
      duration: 'ಅವಧಿ',
      status: 'ಸ್ಥಿತಿ',
      pending: 'ಬಾಕಿ',
      approved: 'ಅನುಮೋದಿತ',
      completed: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
      cancelled: 'ರದ್ದುಮಾಡಲಾಗಿದೆ',
      viewDetails: 'ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
      noTasks: 'ಇನ್ನೂ ಯಾವುದೇ ಕಾರ್ಯಗಳನ್ನು ನಿಯೋಜಿಸಲಾಗಿಲ್ಲ',
      temperature: 'ತಾಪಮಾನ',
      humidity: 'ಆರ್ದ್ರತೆ',
      condition: 'ಹವಾಮಾನ',
      submitFeedback: 'ಪ್ರತಿಕ್ರಿಯೆ ಸಲ್ಲಿಸಿ',
      provideFeedback: 'ಪ್ರತಿಕ್ರಿಯೆ ನೀಡಿ',
      feedbackSubmitted: 'ಪ್ರತಿಕ್ರಿಯೆ ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ!',
      taskTitle: 'ಕಾರ್ಯದ ಶೀರ್ಷಿಕೆ'
    }
  }

  const t = translations[language]

  // Fetch data on mount
  useEffect(() => {
    fetchData()
  }, [])

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = language === 'kn' ? 'kn-IN' : 'en-US';
        recognitionRef.current.onresult = (event: any) => {
          const currentTranscript = event.results[0][0].transcript;
          setTranscript(currentTranscript);
          if (isListeningForTask) {
            parseTaskVoiceInput(currentTranscript);
            setIsListeningForTask(false);
          } else {
            processVoiceCommand(currentTranscript);
          }
        };
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          setIsListeningForTask(false);
          toast.error(language === 'en' ? 'Voice recognition failed' : 'ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ವಿಫಲವಾಗಿದೆ');
        };
        recognitionRef.current.onend = () => {
          setIsListening(false);
          setIsListeningForTask(false);
        };
      }
      synthRef.current = window.speechSynthesis;
      setVoiceEnabled(!!SpeechRecognition && !!synthRef.current);
    }
  }, [language]);

  // Auto-speak on farmer mode toggle or load
  useEffect(() => {
    if (farmerMode) {
      speak(language === 'en' ? `Welcome to farmer mode. Dashboard loaded. Say "tasks" or "profile" to navigate.` : `ಕೃಷಿ ಮೋಡ್ ಸ್ವಾಗತ. ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಲೋಡ್ ಆಗಿದೆ. ನ್ಯಾವಿಗೇಟ್ ಮಾಡಲು "ಕಾರ್ಯಗಳು" ಅಥವಾ "ಪ್ರೊಫೈಲ್" ಎಂದು ಹೇಳಿ.`);
    }
  }, [farmerMode, language]);



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500'
      case 'pending': return 'bg-yellow-500'
      case 'completed': return 'bg-blue-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <AlertCircle className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <AlertCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className={`min-h-screen bg-background ${farmerMode ? 'farmer-mode text-xl' : ''}`}>
      {notification && (
        <Notification3D message={notification.message} color={notification.color} duration={2000} onClose={() => setNotification(null)} />
      )}
      <div className="flex justify-end p-2">
        <Button variant="outline" size="sm" onClick={toggleTheme}>
          {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </Button>
      </div>
      {/* AI Assistant Floating UI */}
      <React.Suspense fallback={<div className="flex justify-center items-center h-32"><span>Loading assistant...</span></div>}>
        {typeof window !== 'undefined' && loading ? (
          <div>Loading data...</div>
        ) : (
          <AIAssistant appData={{ workers, tasks, feedback }} theme={theme} />
        )}
      </React.Suspense>
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={currentWorker.profilePic} alt={currentWorker.name} />
              <AvatarFallback>{currentWorker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-primary">{t.dashboard}</h1>
              <p className="text-sm text-muted-foreground">{t.welcome}, {currentWorker.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'kn' : 'en')}
            >
              <Languages className="h-4 w-4 mr-2" />
              {language === 'en' ? 'ಕನ್ನಡ' : 'English'}
            </Button>
            <Button variant="outline" size="sm" onClick={toggleTheme}>
              {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </Button>
            <Button
              variant={farmerMode ? "default" : "outline"}
              size="sm"
              onClick={() => setFarmerMode(!farmerMode)}
            >
              <User className="h-4 w-4 mr-2" />
              {farmerMode ? (language === 'en' ? 'Farmer Mode' : 'ಕೃಷಿ ಮೋಡ್') : (language === 'en' ? 'Farmer Mode' : 'ಕೃಷಿ ಮೋಡ್')}
            </Button>
            {voiceEnabled && (
              <Button
                variant={isListening ? "destructive" : "secondary"}
                size="sm"
                onClick={startListening}
                disabled={isListening}
              >
                <Mic className="h-4 w-4 mr-2" />
                {isListening ? (language === 'en' ? 'Listening...' : 'ಶ್ರವಣಿಸುತ್ತಿದೆ...') : (language === 'en' ? 'Voice' : 'ಧ್ವನಿ')}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Logout' : 'ಲಾಗ್ ಔಟ್'}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-screen">Loading dashboard data...</div>
        ) : error ? (
          <div className="flex justify-center items-center h-screen">Error loading data: {error}</div>
        ) : farmerMode ? (
          // Farmer Mode: Big Buttons
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-primary mb-2">
                {language === 'en' ? 'Welcome to Farmer Mode' : 'ಕೃಷಿ ಮೋಡ್ ಸ್ವಾಗತ'}
              </h2>
              <p className="text-lg text-muted-foreground">
                {language === 'en' ? 'Tap any button below to get started' : 'ಪ್ರಾರಂಭಿಸಲು ಕೆಳಗಿನ ಯಾವುದೇ ಬಟನ್ ಟ್ಯಾಪ್ ಮಾಡಿ'}
              </p>
            </div>

            {/* Big Buttons Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Attendance Button */}
              <Button
                className="h-32 flex flex-col items-center justify-center text-xl font-bold bg-green-500 hover:bg-green-600 text-white"
                onClick={() => {
                  if (!attendanceSubmitted) {
                    handleAttendance('present');
                    speak(language === 'en' ? 'Attendance marked as present. Great job!' : 'ಹಾಜರಿ ಹಾಜರಿದ್ದೇನೆ ಎಂದು ಗುರುತಿಸಲಾಗಿದೆ. ಚೆನ್ನಾಗಿ ಮಾಡಿದ್ದೀರಿ!');
                  } else {
                    speak(language === 'en' ? 'Attendance already marked for today.' : 'ಇಂದಿನ ಹಾಜರಿ ಈಗಾಗಲೇ ಗುರುತಿಸಲಾಗಿದೆ.');
                  }
                }}
              >
                <CheckCircle className="h-12 w-12 mb-2" />
                {language === 'en' ? 'Attendance' : 'ಹಾಜರಿ'}
              </Button>

              {/* Today's Task Button */}
              <Button
                className="h-32 flex flex-col items-center justify-center text-xl font-bold bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => {
                  const todayTasks = upcomingTasks.filter(task => task.date === new Date().toISOString().split('T')[0]);
                  if (todayTasks.length > 0) {
                    const task = todayTasks[0];
                    speak(language === 'en' ? `Today's task: ${task.title} at ${task.location}, ${task.duration}.` : `ಇಂದಿನ ಕಾರ್ಯ: ${task.title} ${task.location} ರಲ್ಲಿ, ${task.duration}.`);
                    setSelectedTaskDetails(task);
                    setShowTaskDetails(true);
                  } else {
                    speak(language === 'en' ? 'No tasks assigned for today.' : 'ಇಂದಿಗೆ ಯಾವುದೇ ಕಾರ್ಯಗಳನ್ನು ನಿಯೋಜಿಸಲಾಗಿಲ್ಲ.');
                  }
                }}
              >
                <Calendar className="h-12 w-12 mb-2" />
                {language === 'en' ? "Today's Task" : 'ಇಂದಿನ ಕಾರ್ಯ'}
              </Button>

              {/* Give Feedback Button */}
              <Button
                className="h-32 flex flex-col items-center justify-center text-xl font-bold bg-purple-500 hover:bg-purple-600 text-white"
                onClick={() => {
                  if (tasks.length > 0) {
                    const lastTask = tasks[tasks.length - 1];
                    setSelectedTask(lastTask);
                    setShowFeedbackForm(true);
                    speak(language === 'en' ? 'Opening voice feedback. Please record your feedback.' : 'ಧ್ವನಿ ಪ್ರತಿಕ್ರಿಯೆ ತೆರೆಯುತ್ತಿದೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ ರೆಕಾರ್ಡ್ ಮಾಡಿ.');
                  } else {
                    speak(language === 'en' ? 'No tasks available for feedback.' : 'ಪ್ರತಿಕ್ರಿಯೆಗೆ ಯಾವುದೇ ಕಾರ್ಯಗಳು ಲಭ್ಯವಿಲ್ಲ.');
                  }
                }}
              >
                <MessageSquare className="h-12 w-12 mb-2" />
                {language === 'en' ? 'Give Feedback' : 'ಪ್ರತಿಕ್ರಿಯೆ ನೀಡಿ'}
              </Button>

              {/* Notifications Button */}
              <Button
                className="h-32 flex flex-col items-center justify-center text-xl font-bold bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => {
                  const pendingTasks = upcomingTasks.length;
                  const completedToday = completedTasksCount;
                  speak(language === 'en' ?
                    `You have ${pendingTasks} pending tasks and completed ${completedToday} tasks today. Weather is sunny, perfect for work.` :
                    `ನಿಮ್ಮಲ್ಲಿ ${pendingTasks} ಬಾಕಿ ಕಾರ್ಯಗಳು ಮತ್ತು ಇಂದು ${completedToday} ಕಾರ್ಯಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ. ಹವಾಮಾನ ಸೂರ್ಯೋದಯವಾಗಿದೆ, ಕೆಲಸಕ್ಕೆ ಸೂಕ್ತ.`);
                  setNotification({
                    message: language === 'en' ? `${pendingTasks} pending tasks, ${completedToday} completed today` : `${pendingTasks} ಬಾಕಿ ಕಾರ್ಯಗಳು, ಇಂದು ${completedToday} ಪೂರ್ಣ`,
                    color: '#ff6b35'
                  });
                }}
              >
                <div className="relative">
                  <Sun className="h-12 w-12 mb-2" />
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {upcomingTasks.length}
                  </div>
                </div>
                {language === 'en' ? 'Notifications' : 'ಅಧಿಸೂಚನೆಗಳು'}
              </Button>

              {/* Ask Assistant Button */}
              <Button
                className="h-32 flex flex-col items-center justify-center text-xl font-bold bg-teal-500 hover:bg-teal-600 text-white"
                onClick={() => {
                  speak(language === 'en' ? 'Totamitra assistant is ready. You can ask me anything about your work or the dashboard.' : 'ಟೋಟಮಿತ್ರ ಸಹಾಯಕ ಸಿದ್ಧ. ನಿಮ್ಮ ಕೆಲಸ ಅಥವಾ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಬಹುದು.');
                  toast.info(language === 'en' ? 'Assistant activated! Ask me anything.' : 'ಸಹಾಯಕ ಸಕ್ರಿಯಗೊಂಡಿದೆ! ಏನಾದರೂ ಕೇಳಿ.');
                }}
              >
                <User className="h-12 w-12 mb-2" />
                {language === 'en' ? 'Ask Assistant' : 'ಸಹಾಯಕರನ್ನು ಕೇಳಿ'}
              </Button>
            </div>

            {/* Quick Stats in Farmer Mode */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-green-600">{completedTasksCount}</div>
                  <p className="text-sm text-muted-foreground">{language === 'en' ? 'Completed' : 'ಪೂರ್ಣಗೊಂಡ'}</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-blue-600">{upcomingTasks.length}</div>
                  <p className="text-sm text-muted-foreground">{language === 'en' ? 'Pending' : 'ಬಾಕಿ'}</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-yellow-600">{attendance === 'present' ? '✓' : attendance === 'absent' ? '✗' : '?'}</div>
                  <p className="text-sm text-muted-foreground">{language === 'en' ? 'Attendance' : 'ಹಾಜರಿ'}</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-purple-600">{currentWorker.rating}</div>
                  <p className="text-sm text-muted-foreground">{language === 'en' ? 'Rating' : 'ರೇಟಿಂಗ್'}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Normal Mode: Tabs
          <Tabs defaultValue="tasks" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tasks">
                <Briefcase className="h-5 w-5 mr-2" />
                {t.myTasks}
              </TabsTrigger>
              <TabsTrigger value="profile">
                <User className="h-5 w-5 mr-2" />
                {t.profile}
              </TabsTrigger>
            </TabsList>

          {/* My Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            {/* ...existing code... */}
            {/* Stats Cards, Attendance, and Request Task Button */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{language === 'en' ? 'Live Attendance' : 'ನೈಜ ಹಾಜರಿ'}</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  {attendanceSubmitted ? (
                    <div className="text-lg font-bold">
                      {attendance === 'present' ? (language === 'en' ? 'Present' : 'ಹಾಜರಿದ್ದೇನೆ') : (language === 'en' ? 'Absent' : 'ಗೈರಾಗಿದ್ದೇನೆ')}
                    </div>
                    ) : (
                    <div className="flex gap-2">
                      {farmerMode ? (
                        <Button onClick={startListening} className="flex-1" variant="default" disabled={isListening}>
                          <Mic className="h-5 w-5 mr-2" />
                          {isListening ? (language === 'en' ? 'Listening...' : 'ಶ್ರವಣಿಸುತ್ತಿದೆ...') : (language === 'en' ? 'Say "Present" or "Absent"' : '"ಹಾಜರಿದ್ದೇನೆ" ಅಥವಾ "ಗೈರಾಗಿದ್ದೇನೆ" ಎಂದು ಹೇಳಿ')}
                        </Button>
                      ) : (
                        <>
                          <Button onClick={() => handleAttendance('present')} className="flex-1" variant="default">
                            {language === 'en' ? 'Mark Present' : 'ಹಾಜರಿದ್ದೇನೆ ಎಂದು ಗುರುತಿಸಿ'}
                          </Button>
                          <Button onClick={() => handleAttendance('absent')} className="flex-1" variant="outline">
                            {language === 'en' ? 'Mark Absent' : 'ಗೈರಾಗಿದ್ದೇನೆ ಎಂದು ಗುರುತಿಸಿ'}
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t.upcomingTasks}</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{upcomingTasks.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t.completedTasks}</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{completedTasksCount}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t.totalTasks}</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tasks.length}</div>
                  <Button className="mt-4 w-full" onClick={() => setShowRequestTask(true)}>
                    {/* Removed 3D icon */}
                    {language === 'en' ? 'Request New Task' : 'ಹೊಸ ಕಾರ್ಯ ವಿನಂತಿಸಿ'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Request Task Modal */}
            {showRequestTask && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <Card className="w-full max-w-lg mx-auto">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{language === 'en' ? 'Request New Task' : 'ಹೊಸ ಕಾರ್ಯ ವಿನಂತಿಸಿ'}</CardTitle>
                        <CardDescription>
                          {language === 'en' ? 'Submit a request for a new task assignment' : 'ಹೊಸ ಕಾರ್ಯವನ್ನು ವಿನಂತಿಸಲು ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ'}
                        </CardDescription>
                      </div>
                      {voiceEnabled && (
                        <Button
                          variant={isListeningForTask ? "destructive" : "secondary"}
                          size="sm"
                          onClick={startListeningForTask}
                          disabled={isListeningForTask}
                        >
                          <Mic className="h-4 w-4 mr-2" />
                          {isListeningForTask ? (language === 'en' ? 'Listening...' : 'ಶ್ರವಣಿಸುತ್ತಿದೆ...') : (language === 'en' ? 'Voice Input' : 'ಧ್ವನಿ ಇನ್‌ಪುಟ್')}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="title" className="font-medium">{t.taskTitle}</label>
                      <input
                        id="title"
                        className="w-full border rounded px-2 py-1"
                        value={newTask.title}
                        onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder={language === 'en' ? 'Enter task title' : 'ಕಾರ್ಯದ ಶೀರ್ಷಿಕೆ ನಮೂದಿಸಿ'}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="type" className="font-medium">{language === 'en' ? 'Task Type' : 'ಕಾರ್ಯದ ಪ್ರಕಾರ'}</label>
                      <select
                        id="type"
                        className="w-full border rounded px-2 py-1"
                        value={newTask.type}
                        onChange={e => setNewTask({ ...newTask, type: e.target.value })}
                      >
                        <option value="">{language === 'en' ? 'Select task type' : 'ಕಾರ್ಯದ ಪ್ರಕಾರ ಆಯ್ಕೆಮಾಡಿ'}</option>
                        {taskTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="date" className="font-medium">{t.taskDate}</label>
                      <input
                        id="date"
                        type="date"
                        className="w-full border rounded px-2 py-1"
                        value={newTask.date}
                        onChange={e => setNewTask({ ...newTask, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="location" className="font-medium">{t.location}</label>
                      <input
                        id="location"
                        className="w-full border rounded px-2 py-1"
                        value={newTask.location}
                        onChange={e => setNewTask({ ...newTask, location: e.target.value })}
                        placeholder={language === 'en' ? 'Enter location' : 'ಸ್ಥಳ ನಮೂದಿಸಿ'}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="duration" className="font-medium">{language === 'en' ? 'Duration' : 'ಅವಧಿ'}</label>
                      <input
                        id="duration"
                        className="w-full border rounded px-2 py-1"
                        value={newTask.duration}
                        onChange={e => setNewTask({ ...newTask, duration: e.target.value })}
                        placeholder={language === 'en' ? 'e.g., 4 hours' : 'ಉದಾ., 4 ಗಂಟೆಗಳು'}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="description" className="font-medium">{language === 'en' ? 'Description' : 'ವಿವರಣೆ'}</label>
                      <textarea
                        id="description"
                        className="w-full border rounded px-2 py-1"
                        value={newTask.description}
                        onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                        placeholder={language === 'en' ? 'Enter task description' : 'ಕಾರ್ಯದ ವಿವರಣೆ ನಮೂದಿಸಿ'}
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleRequestTask} className="flex-1">
                        <Send className="h-4 w-4 mr-2" />
                        {language === 'en' ? 'Submit Request' : 'ವಿನಂತಿಯನ್ನು ಸಲ್ಲಿಸಿ'}
                      </Button>
                      <Button variant="outline" onClick={() => setShowRequestTask(false)}>
                        {language === 'en' ? 'Cancel' : 'ರದ್ದುಮಾಡಿ'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Weather Widget */}
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">Weather</span>
            </div>
            <WeatherWidget />

            {/* Tasks List */}
            <Card>
              <CardHeader>
                <CardTitle>{t.taskHistory}</CardTitle>
                <CardDescription>
                  {language === 'en'
                    ? 'All your assigned tasks and their current status'
                    : 'ನಿಮ್ಮ ಎಲ್ಲಾ ನಿಯೋಜಿತ ಕಾರ್ಯಗಳು ಮತ್ತು ಅವುಗಳ ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tasks.length > 0 ? (
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(task.status)}
                          <div>
                            <h3 className="font-semibold">{task.title}</h3>
                            <p className="text-sm text-muted-foreground">{task.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{task.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{task.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{task.duration}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={`${getStatusColor(task.status)} text-white mb-2`}>
                            {t[task.status as keyof typeof t] || task.status}
                          </Badge>
                          <br />
                          <div className="flex gap-2">
                            <Dialog open={showTaskDetails} onOpenChange={setShowTaskDetails}>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedTaskDetails(task);
                                    setShowTaskDetails(true);
                                  }}
                                >
                                  {t.viewDetails}
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>{t.taskTitle}: {selectedTaskDetails?.title}</DialogTitle>
                                  <DialogDescription>
                                    {selectedTaskDetails?.description}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-2 text-sm">
                                  <div><strong>Task Type:</strong> {selectedTaskDetails?.type}</div>
                                  <div><strong>{t.status}:</strong> {t[selectedTaskDetails?.status as keyof typeof t] || selectedTaskDetails?.status}</div>
                                  <div><strong>{t.taskDate}:</strong> {selectedTaskDetails?.date}</div>
                                  <div><strong>{t.location}:</strong> {selectedTaskDetails?.location}</div>
                                  <div><strong>{t.duration}:</strong> {selectedTaskDetails?.duration}</div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Dialog open={showFeedbackForm} onOpenChange={setShowFeedbackForm}>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  onClick={() => setSelectedTask(task)}
                                >
                                  <ThreeDIcon icon="feedback" />
                                  {t.submitFeedback}
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>{t.provideFeedback}</DialogTitle>
                                  <DialogDescription>
                                    {language === 'en'
                                      ? 'Share your experience about this task'
                                      : 'ಈ ಕಾರ್ಯದ ಬಗ್ಗೆ ನಿಮ್ಮ ಅನುಭವವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ'
                                    }
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedTask && (
                                  <FeedbackForm
                                    taskId={selectedTask.id}
                                    taskTitle={selectedTask.title}
                                    onSubmit={handleFeedbackSubmit}
                                  />
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">{t.noTasks}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            {/* Worker Selector with enhanced UI */}
            <div className="worker-profile-switch-ui">
              <div className="profile-switch-label">
                <User className="h-5 w-5 inline-block mr-2 align-middle" />
                {language === 'en' ? 'Switch Worker Profile' : 'ಕೆಲಸಗಾರರ ಪ್ರೊಫೈಲ್ ಬದಲಾಯಿಸಿ'}
              </div>
              <div style={{ width: '100%', maxWidth: 340 }}>
                <Select
                  value={selectedWorkerId}
                  onValueChange={value => {
                    setSelectedWorkerId(value);
                    setAnimateProfile(true);
                    setTimeout(() => setAnimateProfile(false), 800);
                  }}
                >
                  <SelectTrigger className="profile-switch-select">
                    <SelectValue placeholder={language === 'en' ? 'Select a worker' : 'ಕೆಲಸಗಾರರನ್ನು ಆಯ್ಕೆಮಾಡಿ'} />
                  </SelectTrigger>
                  <SelectContent>
                    {workers.map((worker) => (
                      <SelectItem key={worker.id} value={worker.id}>
                        {worker.name} - {worker.group} ({worker.location})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {language === 'en' ? 'Select a worker to view their profile and information' : 'ಕೆಲಸಗಾರರ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಮಾಹಿತಿಯನ್ನು ವೀಕ್ಷಿಸಲು ಆಯ್ಕೆಮಾಡಿ'}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {t.personalInfo}
                  </CardTitle>
                </CardHeader>
                <CardContent className={`space-y-4 ${animateProfile ? 'worker-profile-3d-animate' : ''}`}> 
                  <div className="flex items-center justify-center mb-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={currentWorker.profilePic} alt={currentWorker.name} />
                      <AvatarFallback>{currentWorker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{t.name}:</span>
                      <span className="font-medium">{currentWorker.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{t.age}:</span>
                      <span className="font-medium">{currentWorker.age}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{t.gender}:</span>
                      <span className="font-medium">{currentWorker.gender}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{t.group}:</span>
                      <Badge>{currentWorker.group}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{t.location}:</span>
                      <span className="font-medium">{currentWorker.location}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{t.rating}:</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{currentWorker.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{t.availability}:</span>
                      <div className="flex items-center gap-2">
                        <div className={`availability-dot ${currentWorker.availability ? 'available' : 'unavailable'}`} />
                        <span className={`font-medium ${currentWorker.availability ? 'text-green-600' : 'text-red-600'}`}>
                          {currentWorker.availability ? t.available : t.unavailable}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact & Skills */}
              <div className="space-y-6">
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      {t.contactInfo}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{currentWorker.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{currentWorker.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Languages className="h-4 w-4 text-muted-foreground" />
                      <div className="flex gap-2">
                        {currentWorker.languages.map((lang) => (
                          <Badge key={lang} variant="secondary">{lang}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      {t.skills}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 flex-wrap">
                      {currentWorker.skills.map(skill => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        )}
      </div>
    </div>
  )
}

export default WorkerDashboard

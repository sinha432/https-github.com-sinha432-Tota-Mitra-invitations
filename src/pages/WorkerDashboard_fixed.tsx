import React, { useState } from 'react'

// Extend Window type for sharedFeedback and liveAttendance
declare global {
  interface Window {
    sharedFeedback: Feedback[];
    liveAttendance: Record<string, unknown>;
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
  Plus
} from 'lucide-react'
import { useAuth } from '@/App'
import { mockWorkers, mockTasks, mockFeedback, Feedback } from '@/data/mockData'
import FeedbackForm from '@/components/FeedbackForm'
import WeatherWidget from '@/components/WeatherWidget'
import ThreeDIcon from '../components/ThreeDIcon';
import AttendanceBoard3D from '../components/AttendanceBoard3D';
import GroupClusters3D from '../components/GroupClusters3D';
import TaskTimeline3D from '../components/TaskTimeline3D';
import '../components/WorkerProfile3D.css';
import { toast } from 'sonner'
import Notification3D from '../components/Notification3D';

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

const WorkerDashboard = () => {
  // State for task details dialog
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState<Task | null>(null);
  // Live attendance state
  const [attendance, setAttendance] = useState<'present' | 'absent' | null>(null);
  const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);
  const handleAttendance = (status: 'present' | 'absent') => {
    setAttendance(status);
    setAttendanceSubmitted(true);
    // For demo, store in window for cross-dashboard access
    if (!window.liveAttendance) window.liveAttendance = {};
    window.liveAttendance[currentWorker.id] = {
      name: currentWorker.name,
      status,
      time: new Date().toISOString()
    };
    toast.success(status === 'present' ? (language === 'en' ? 'Attendance marked: Present' : 'ಹಾಜರಿದ್ದೇನೆ ಎಂದು ಗುರುತಿಸಲಾಗಿದೆ') : (language === 'en' ? 'Attendance marked: Absent' : 'ಗೈರಾಗಿದ್ದೇನೆ ಎಂದು ಗುರುತಿಸಲಾಗಿದೆ'));
  };
  // Import AI Assistant
  // Theme toggle
  const [theme, setTheme] = useState(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };
  const AIAssistant = React.lazy(() => import('../components/EnhancedAIAssistant'));
  console.log('👷 WorkerDashboard component rendering...')

  const { user, logout, language, setLanguage } = useAuth()
  // Use window.sharedFeedback for demo purposes (replace with context/store in real app)
  if (!window.sharedFeedback) window.sharedFeedback = [...mockFeedback]
  const [feedback, setFeedback] = useState(window.sharedFeedback)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showRequestTask, setShowRequestTask] = useState(false)
  const [notification, setNotification] = useState<{ message: string, color?: string } | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    type: '',
    date: '',
    location: '',
    duration: '',
    description: ''
  })
  const [selectedWorkerId, setSelectedWorkerId] = useState('1')
  const [animateProfile, setAnimateProfile] = useState(false)
  const taskTypes = [
    'Arecanut Harvesting',
    'Coconut Harvesting',
    'Banana Cultivation Assistance',
    'Arecanut Medicine Spray',
    'General Farm Labor'
  ]

  const handleRequestTask = () => {
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
    const taskData: Task = {
      id: (workerTasksState.length + 1).toString(),
      title: newTask.title,
      type: typeValue,
      date: newTask.date,
      workersNeeded: 1,
      assignedWorkers: [currentWorker.id],
      status: 'pending' as const,
      location: newTask.location,
      duration: newTask.duration,
      description: newTask.description,
      createdBy: currentWorker.name,
      createdAt: new Date().toISOString()
    }
    setWorkerTasksState([...workerTasksState, taskData])
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
  }

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

  // Mock data for current worker (in real app, this would come from API)
  const currentWorker = mockWorkers.find(w => w.id === selectedWorkerId) || mockWorkers[0]
  const workerTasks = mockTasks.filter(task => task.assignedWorkers.includes(currentWorker.id))
  const [workerTasksState, setWorkerTasksState] = useState<Task[]>(workerTasks)
  const upcomingTasks = workerTasksState.filter(task => task.status === 'approved' || task.status === 'pending')
  const completedTasksCount = workerTasksState.filter(task => task.status === 'completed').length

  const handleFeedbackSubmit = (feedbackData: { rating: number; comment: string }) => {
    console.log('📝 Worker submitting feedback:', feedbackData)
    const newFeedback: Feedback = {
      id: (window.sharedFeedback.length + 1).toString(),
      taskId: selectedTask.id,
      workerId: currentWorker.id,
      workerName: currentWorker.name,
      rating: feedbackData.rating,
      comment: feedbackData.comment,
      createdAt: new Date().toISOString()
    }
    window.sharedFeedback.push(newFeedback)
    setFeedback([...window.sharedFeedback])
    setShowFeedbackForm(false)
    setSelectedTask(null)
    toast.success(t.feedbackSubmitted)
  }

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
    <div className="min-h-screen bg-background">
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
        {typeof window !== 'undefined' && (
          <AIAssistant appData={{ workers: mockWorkers, tasks: mockTasks, feedback: mockFeedback }} theme={theme} />
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
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Logout' : 'ಲಾಗ್ ಔಟ್'}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tasks">{t.myTasks}</TabsTrigger>
            <TabsTrigger value="profile">{t.profile}</TabsTrigger>
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
                      <Button onClick={() => handleAttendance('present')} className="flex-1" variant="default">
                        {language === 'en' ? 'Mark Present' : 'ಹಾಜರಿದ್ದೇನೆ ಎಂದು ಗುರುತಿಸಿ'}
                      </Button>
                      <Button onClick={() => handleAttendance('absent')} className="flex-1" variant="outline">
                        {language === 'en' ? 'Mark Absent' : 'ಗೈರಾಗಿದ್ದೇನೆ ಎಂದು ಗುರುತಿಸಿ'}
                      </Button>
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
                  <div className="text-2xl font-bold">{workerTasksState.length}</div>
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
                    <CardTitle>{language === 'en' ? 'Request New Task' : 'ಹೊಸ ಕಾರ್ಯ ವಿನಂತಿಸಿ'}</CardTitle>
                    <CardDescription>
                      {language === 'en' ? 'Submit a request for a new task assignment' : 'ಹೊಸ ಕಾರ್ಯವನ್ನು ವಿನಂತಿಸಲು ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ'}
                    </CardDescription>
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
                {workerTasksState.length > 0 ? (
                  <div className="space-y-4">
                    {workerTasksState.map((task) => (
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
                    {mockWorkers.map((worker) => (
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
      </div>
    </div>
  )
}

export default WorkerDashboard

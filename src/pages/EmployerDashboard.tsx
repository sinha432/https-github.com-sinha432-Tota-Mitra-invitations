import React, { useState } from 'react'
// Extend Window type for liveAttendance
declare global {
  interface Window {
    liveAttendance: Record<string, unknown>;
    sharedFeedback: Feedback[];
  }
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Plus,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  LogOut,
  Languages,
  Search,
  Filter,
  MessageSquare
} from 'lucide-react'
import { useAuth } from '@/App'
import { mockWorkers, mockTasks, mockFeedback, Task, Feedback } from '@/data/mockData'
import FeedbackDisplay from '@/components/FeedbackDisplay'
import WeatherWidget from '@/components/WeatherWidget'
import ThreeDIcon from '../components/ThreeDIcon';
import { toast } from 'sonner'
import { format } from 'date-fns'

const EmployerDashboard = () => {
  // Import AI Assistant
  const AIAssistant = React.lazy(() => import('../components/EnhancedAIAssistant'));
  console.log('👔 EmployerDashboard component rendering...')
  
  const { user, logout, language, setLanguage, addEmployerFeedback } = useAuth()
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [tasks, setTasks] = useState(mockTasks)
  const [taskCreatedMessage, setTaskCreatedMessage] = useState('')

  // Employer feedback form state
  const [showEmployerFeedbackForm, setShowEmployerFeedbackForm] = useState(false)
  const [employerFeedbackForm, setEmployerFeedbackForm] = useState({
    subject: '',
    comment: '',
    category: '',
    priority: 'Medium'
  })

  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    type: '',
    date: '',
    workersNeeded: 1,
    location: '',
    duration: '',
    description: ''
  })

  // Theme toggle
  const [theme, setTheme] = useState(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const translations = {
    en: {
      dashboard: 'Employer Dashboard',
      welcome: 'Welcome back',
      tasks: 'My Tasks',
      workers: 'Available Workers',
      schedule: 'Schedule Task',
      feedback: 'Worker Feedback',
      createTask: 'Create New Task',
      taskTitle: 'Task Title',
      taskType: 'Task Type',
      selectDate: 'Select Date',
      workersNeeded: 'Workers Needed',
      location: 'Location',
      duration: 'Duration',
      description: 'Description',
      searchWorkers: 'Search for workers',
      selectWorkers: 'Select Workers',
      submitTask: 'Submit Task',
      cancel: 'Cancel',
      activeTasks: 'Active Tasks',
      pendingApproval: 'Pending Approval',
      approved: 'Approved',
      completed: 'Completed',
      cancelled: 'Cancelled',
      pending: 'Pending',
      viewDetails: 'View Details',
      assigned: 'Assigned',
      available: 'Available',
      unavailable: 'Unavailable',
      rating: 'Rating',
      skills: 'Skills',
      group: 'Group',
      age: 'Age',
      taskCreated: 'Task created successfully!',
      fillRequired: 'Please fill all required fields',
      weather: 'Weather Conditions'
    },
    kn: {
      dashboard: 'ಉದ್ಯೋಗದಾತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      welcome: 'ಮರಳಿ ಸ್ವಾಗತ',
      tasks: 'ನನ್ನ ಕಾರ್ಯಗಳು',
      workers: 'ಲಭ್ಯವಿರುವ ಕೆಲಸಗಾರರು',
      schedule: 'ಕಾರ್ಯ ವೇಳಾಪಟ್ಟಿ',
      feedback: 'ಕೆಲಸಗಾರ ಪ್ರತಿಕ್ರಿಯೆ',
      createTask: 'ಹೊಸ ಕಾರ್ಯ ರಚಿಸಿ',
      taskTitle: 'ಕಾರ್ಯದ ಶೀರ್ಷಿಕೆ',
      taskType: 'ಕಾರ್ಯದ ಪ್ರಕಾರ',
      selectDate: 'ದಿನಾಂಕ ಆಯ್ಕೆಮಾಡಿ',
      workersNeeded: 'ಅಗತ್ಯವಿರುವ ಕೆಲಸಗಾರರು',
      location: 'ಸ್ಥಳ',
      duration: 'ಅವಧಿ',
      description: 'ವಿವರಣೆ',
      searchWorkers: 'ಕೆಲಸಗಾರರನ್ನು ಹುಡುಕಿ',
      selectWorkers: 'ಕೆಲಸಗಾರರನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      submitTask: 'ಕಾರ್ಯ ಸಲ್ಲಿಸಿ',
      cancel: 'ರದ್ದುಮಾಡಿ',
      activeTasks: 'ಸಕ್ರಿಯ ಕಾರ್ಯಗಳು',
      pendingApproval: 'ಅನುಮೋದನೆ ಬಾಕಿ',
      approved: 'ಅನುಮೋದಿತ',
      completed: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
      cancelled: 'ರದ್ದುಮಾಡಲಾಗಿದೆ',
      pending: 'ಬಾಕಿ',
      viewDetails: 'ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
      assigned: 'ನಿಯೋಜಿತ',
      available: 'ಲಭ್ಯವಿದೆ',
      unavailable: 'ಲಭ್ಯವಿಲ್ಲ',
      rating: 'ರೇಟಿಂಗ್',
      skills: 'ಕೌಶಲ್ಯಗಳು',
      group: 'ಗುಂಪು',
      age: 'ವಯಸ್ಸು',
      taskCreated: 'ಕಾರ್ಯ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ!',
      fillRequired: 'ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಅಗತ್ಯ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ',
      weather: 'ಹವಾಮಾನ ಪರಿಸ್ಥಿತಿಗಳು'
    }
  }

  const t = translations[language]
  // Use window.sharedFeedback for demo purposes (replace with context/store in real app)
  const allFeedback = window.sharedFeedback ? window.sharedFeedback : mockFeedback

  const taskTypes = [
    'Arecanut Harvesting',
    'Coconut Harvesting',
    'Pepper Vine Support Work',
    'Banana Cultivation Assistance',
    'Arecanut Medicine Spray',
    'General Farm Labor'
  ] as const

  type TaskType = typeof taskTypes[number]

  const filteredWorkers = mockWorkers.filter(worker => 
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const availableWorkers = mockWorkers.filter(w => w.availability)

  const handleCreateTask = () => {
    console.log('📝 Creating new task:', newTask)

    if (!newTask.title || !newTask.type || !newTask.date || !newTask.location) {
      toast.error(t.fillRequired)
      return
    }

    // Create new task
    const taskData: Task = {
      id: (tasks.length + 1).toString(),
      title: newTask.title,
      type: newTask.type as TaskType,
      date: newTask.date,
      workersNeeded: newTask.workersNeeded,
      assignedWorkers: [],
      status: 'pending' as const,
      location: newTask.location,
      duration: newTask.duration,
      description: newTask.description,
      createdBy: user?.name || 'employer',
      createdAt: new Date().toISOString()
    }

    // Update tasks state immutably
    setTasks((prevTasks) => [...prevTasks, taskData])
    toast.success(t.taskCreated)
    setTaskCreatedMessage(t.taskCreated)
    setShowCreateTask(false)
    setNewTask({
      title: '',
      type: '',
      date: '',
      workersNeeded: 1,
      location: '',
      duration: '',
      description: ''
    })
    setSelectedDate(undefined)
  }

  const handleEmployerFeedbackSubmit = () => {
    if (!employerFeedbackForm.subject || !employerFeedbackForm.comment || !employerFeedbackForm.category) {
      toast.error(language === 'en' ? 'Please fill all required fields' : 'ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಅಗತ್ಯ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ')
      return
    }

    addEmployerFeedback({
      subject: employerFeedbackForm.subject,
      comment: employerFeedbackForm.comment,
      category: employerFeedbackForm.category as any,
      priority: employerFeedbackForm.priority as any,
      employerName: user?.name || 'Employer'
    })

    setEmployerFeedbackForm({
      subject: '',
      comment: '',
      category: '',
      priority: 'Medium'
    })
    setShowEmployerFeedbackForm(false)
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

  return (
    <div className="min-h-screen bg-background">
      {/* AI Assistant Floating UI */}
      <React.Suspense fallback={null}>
        {typeof window !== 'undefined' && (
          <AIAssistant appData={{ workers: mockWorkers, tasks, feedback: mockFeedback }} theme={theme} />
        )}
      </React.Suspense>
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">{t.dashboard}</h1>
              <p className="text-sm text-muted-foreground">{t.welcome}, {user?.name}</p>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tasks">{t.tasks}</TabsTrigger>
            <TabsTrigger value="workers">{t.workers}</TabsTrigger>
            <TabsTrigger value="schedule">{t.schedule}</TabsTrigger>
            <TabsTrigger value="feedback">{t.feedback}</TabsTrigger>
          </TabsList>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{t.tasks}</h2>
              <Button onClick={() => {
                setShowCreateTask(true)
                setTaskCreatedMessage('')
              }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ThreeDIcon icon="plus" />
                {t.createTask}
              </Button>
            </div>
            {taskCreatedMessage && (
              <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
                {taskCreatedMessage}
              </div>
            )}

            {/* Create Task Form - Now in Tasks Tab */}
            {showCreateTask && (
              <Card>
                <CardHeader>
                  <CardTitle>{t.createTask}</CardTitle>
                  <CardDescription>
                    {language === 'en' ? 'Schedule a new task for your farm workers' : 'ನಿಮ್ಮ ಫಾರ್ಮ್ ಕೆಲಸಗಾರರಿಗೆ ಹೊಸ ಕಾರ್ಯವನ್ನು ವೇಳಾಪಟ್ಟಿ ಮಾಡಿ'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">{t.taskTitle}</Label>
                      <Input
                        id="title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder={language === 'en' ? 'Enter task title' : 'ಕಾರ್ಯದ ಶೀರ್ಷಿಕೆ ನಮೂದಿಸಿ'}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">{t.taskType}</Label>
                      <Select value={newTask.type} onValueChange={(value) => setNewTask({ ...newTask, type: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'en' ? 'Select task type' : 'ಕಾರ್ಯದ ಪ್ರಕಾರ ಆಯ್ಕೆಮಾಡಿ'} />
                        </SelectTrigger>
                        <SelectContent>
                          {taskTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>{t.selectDate}</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, 'PPP') : language === 'en' ? 'Pick a date' : 'ದಿನಾಂಕ ಆಯ್ಕೆಮಾಡಿ'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                              setSelectedDate(date)
                              setNewTask({ ...newTask, date: date ? format(date, 'yyyy-MM-dd') : '' })
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="workers">{t.workersNeeded}</Label>
                      <Input
                        id="workers"
                        type="number"
                        min="1"
                        value={newTask.workersNeeded}
                        onChange={(e) => setNewTask({ ...newTask, workersNeeded: parseInt(e.target.value) })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">{t.location}</Label>
                      <Input
                        id="location"
                        value={newTask.location}
                        onChange={(e) => setNewTask({ ...newTask, location: e.target.value })}
                        placeholder={language === 'en' ? 'Enter location' : 'ಸ್ಥಳ ನಮೂದಿಸಿ'}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">{t.duration}</Label>
                      <Input
                        id="duration"
                        value={newTask.duration}
                        onChange={(e) => setNewTask({ ...newTask, duration: e.target.value })}
                        placeholder={language === 'en' ? 'e.g., 4 hours' : 'ಉದಾ., 4 ಗಂಟೆಗಳು'}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">{t.description}</Label>
                    <Textarea
                      id="description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder={language === 'en' ? 'Enter task description' : 'ಕಾರ್ಯದ ವಿವರಣೆ ನಮೂದಿಸಿ'}
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleCreateTask} className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {t.submitTask}
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreateTask(false)}>
                      {t.cancel}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats Cards and Live Attendance */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{language === 'en' ? 'Live Attendance' : 'ನೈಜ ಹಾಜರಿ'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {window.liveAttendance && Object.values(window.liveAttendance).length > 0 ? (
                      Object.values(window.liveAttendance).map((att: { name: string; status: string; time: string }, i) => (
                        <div key={i} className="flex justify-between items-center text-sm">
                          <span>{att.name}</span>
                          <span className={att.status === 'present' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                            {att.status === 'present' ? (language === 'en' ? 'Present' : 'ಹಾಜರಿದ್ದೇನೆ') : (language === 'en' ? 'Absent' : 'ಗೈರಾಗಿದ್ದೇನೆ')}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-xs">{language === 'en' ? 'No attendance data yet.' : 'ಇನ್ನೂ ಯಾವುದೇ ಹಾಜರಿ ಡೇಟಾ ಇಲ್ಲ.'}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{t.activeTasks}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tasks.filter(t => t.status === 'approved').length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{t.pendingApproval}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{tasks.filter(t => t.status === 'pending').length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{t.completed}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{tasks.filter(t => t.status === 'completed').length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{t.available} {t.workers}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{availableWorkers.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Weather Widget */}
            <div className="flex items-center gap-2 mb-2">
              <ThreeDIcon icon="weather" />
              <span className="font-semibold">{t.weather}</span>
            </div>
            <WeatherWidget />

            {/* Recent Feedback Panel */}
            <div className="flex items-center gap-2 mb-2">
              <ThreeDIcon icon="feedback" />
              <span className="font-semibold">{t.feedback}</span>
              <span className="text-sm text-muted-foreground">
                {language === 'en' ? '(Recent feedback from workers)' : '(ಕೆಲಸಗಾರರಿಂದ ಇತ್ತೀಚಿನ ಪ್ರತಿಕ್ರಿಯೆ)'}
              </span>
            </div>
            <div className="mb-6">
              <FeedbackDisplay feedback={allFeedback.slice(0, 3)} />
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    // Switch to feedback tab
                    const feedbackTab = document.querySelector('[value="feedback"]') as HTMLElement
                    feedbackTab?.click()
                  }}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  {language === 'en' ? 'View All Feedback' : 'ಎಲ್ಲಾ ಪ್ರತಿಕ್ರಿಯೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ'}
                </Button>
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
              {tasks.map((task) => (
                <Card key={task.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`} />
                        <div>
                          <h3 className="font-semibold">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getStatusColor(task.status)} text-white`}>
                          {t[task.status as keyof typeof t] || task.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {task.assignedWorkers.length}/{task.workersNeeded} {t.assigned}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{task.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{task.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{task.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{task.type}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Workers Tab */}
          <TabsContent value="workers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{t.workers}</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t.searchWorkers}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWorkers.map((worker) => (
                <Card key={worker.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={worker.profilePic} alt={worker.name} />
                        <AvatarFallback>{worker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{worker.name}</h3>
                          <div className={`availability-dot ${worker.availability ? 'available' : 'unavailable'}`} />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {worker.location}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t.age}:</span>
                      <span>{worker.age}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t.group}:</span>
                      <Badge variant="outline">{worker.group}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t.rating}:</span>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span>{worker.rating}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">{t.skills}:</p>
                      <div className="flex flex-wrap gap-1">
                        {worker.skills.slice(0, 2).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill.split(' ')[0]}
                          </Badge>
                        ))}
                        {worker.skills.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{worker.skills.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{t.schedule}</h2>
              <Button onClick={() => {
                setShowCreateTask(true)
                setTaskCreatedMessage('')
              }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ThreeDIcon icon="plus" />
                {t.createTask}
              </Button>
            </div>

            {/* Calendar View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    {language === 'en' ? 'Task Calendar' : 'ಕಾರ್ಯ ಕ್ಯಾಲೆಂಡರ್'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'en'
                      ? 'View and manage your scheduled tasks by date'
                      : 'ದಿನಾಂಕದ ಪ್ರಕಾರ ನಿಮ್ಮ ವೇಳಾಪಟ್ಟಿ ಮಾಡಿದ ಕಾರ್ಯಗಳನ್ನು ವೀಕ್ಷಿಸಿ ಮತ್ತು ನಿರ್ವಹಿಸಿ'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    modifiers={{
                      hasTasks: tasks.map(task => new Date(task.date))
                    }}
                    modifiersStyles={{
                      hasTasks: {
                        backgroundColor: '#e0f7fa',
                        color: '#00796b',
                        fontWeight: 'bold'
                      }
                    }}
                  />
                </CardContent>
              </Card>

              {/* Task List for Selected Date */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {selectedDate
                      ? format(selectedDate, 'MMM dd, yyyy')
                      : (language === 'en' ? 'Select a Date' : 'ದಿನಾಂಕ ಆಯ್ಕೆಮಾಡಿ')
                    }
                  </CardTitle>
                  <CardDescription>
                    {language === 'en'
                      ? 'Tasks scheduled for this date'
                      : 'ಈ ದಿನಾಂಕಕ್ಕೆ ವೇಳಾಪಟ್ಟಿ ಮಾಡಿದ ಕಾರ್ಯಗಳು'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDate ? (
                    <div className="space-y-3">
                      {tasks
                        .filter(task => task.date === format(selectedDate, 'yyyy-MM-dd'))
                        .map((task) => (
                          <div key={task.id} className="border rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">{task.title}</h4>
                              <Badge className={`${getStatusColor(task.status)} text-white text-xs`}>
                                {t[task.status as keyof typeof t] || task.status}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground space-y-1">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{task.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{task.duration}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>{task.workersNeeded} workers needed</span>
                              </div>
                            </div>
                            {task.description && (
                              <p className="text-xs text-muted-foreground mt-2">
                                {task.description}
                              </p>
                            )}
                          </div>
                        ))}
                      {tasks.filter(task => task.date === format(selectedDate, 'yyyy-MM-dd')).length === 0 && (
                        <div className="text-center py-6 text-muted-foreground">
                          <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">
                            {language === 'en'
                              ? 'No tasks scheduled for this date'
                              : 'ಈ ದಿನಾಂಕಕ್ಕೆ ಯಾವುದೇ ಕಾರ್ಯಗಳು ವೇಳಾಪಟ್ಟಿ ಮಾಡಲಾಗಿಲ್ಲ'
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">
                        {language === 'en'
                          ? 'Click on a date to view scheduled tasks'
                          : 'ವೇಳಾಪಟ್ಟಿ ಮಾಡಿದ ಕಾರ್ಯಗಳನ್ನು ವೀಕ್ಷಿಸಲು ದಿನಾಂಕದ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ'
                        }
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Task Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {language === 'en' ? 'This Week' : 'ಈ ವಾರ'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {tasks.filter(task => {
                      const taskDate = new Date(task.date);
                      const weekStart = new Date();
                      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                      const weekEnd = new Date(weekStart);
                      weekEnd.setDate(weekStart.getDate() + 6);
                      return taskDate >= weekStart && taskDate <= weekEnd;
                    }).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {language === 'en' ? 'tasks scheduled' : 'ಕಾರ್ಯಗಳು ವೇಳಾಪಟ್ಟಿ'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {language === 'en' ? 'This Month' : 'ಈ ತಿಂಗಳು'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {tasks.filter(task => {
                      const taskDate = new Date(task.date);
                      const currentMonth = new Date();
                      return taskDate.getMonth() === currentMonth.getMonth() &&
                             taskDate.getFullYear() === currentMonth.getFullYear();
                    }).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {language === 'en' ? 'tasks scheduled' : 'ಕಾರ್ಯಗಳು ವೇಳಾಪಟ್ಟಿ'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {language === 'en' ? 'Pending Approval' : 'ಅನುಮೋದನೆ ಬಾಕಿ'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {tasks.filter(t => t.status === 'pending').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {language === 'en' ? 'awaiting approval' : 'ಅನುಮೋದನೆಗಾಗಿ ಕಾಯುತ್ತಿದೆ'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {language === 'en' ? 'Completed' : 'ಪೂರ್ಣಗೊಂಡಿದೆ'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {tasks.filter(t => t.status === 'completed').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {language === 'en' ? 'tasks finished' : 'ಕಾರ್ಯಗಳು ಮುಗಿದಿವೆ'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Tasks List */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'en' ? 'Upcoming Tasks' : 'ಮುಂಬರುವ ಕಾರ್ಯಗಳು'}
                </CardTitle>
                <CardDescription>
                  {language === 'en'
                    ? 'Tasks scheduled for the next 7 days'
                    : 'ಮುಂದಿನ 7 ದಿನಗಳಲ್ಲಿ ವೇಳಾಪಟ್ಟಿ ಮಾಡಿದ ಕಾರ್ಯಗಳು'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks
                    .filter(task => {
                      const taskDate = new Date(task.date);
                      const today = new Date();
                      const nextWeek = new Date(today);
                      nextWeek.setDate(today.getDate() + 7);
                      return taskDate >= today && taskDate <= nextWeek;
                    })
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`} />
                          <div>
                            <h4 className="font-medium">{task.title}</h4>
                            <p className="text-sm text-muted-foreground">{task.date} • {task.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={`${getStatusColor(task.status)} text-white text-xs mb-1`}>
                            {t[task.status as keyof typeof t] || task.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {task.workersNeeded} workers
                          </p>
                        </div>
                      </div>
                    ))}
                  {tasks.filter(task => {
                    const taskDate = new Date(task.date);
                    const today = new Date();
                    const nextWeek = new Date(today);
                    nextWeek.setDate(today.getDate() + 7);
                    return taskDate >= today && taskDate <= nextWeek;
                  }).length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">
                        {language === 'en'
                          ? 'No upcoming tasks in the next 7 days'
                          : 'ಮುಂದಿನ 7 ದಿನಗಳಲ್ಲಿ ಯಾವುದೇ ಮುಂಬರುವ ಕಾರ್ಯಗಳಿಲ್ಲ'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{t.feedback}</h2>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowEmployerFeedbackForm(true)}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  {language === 'en' ? 'Submit Feedback' : 'ಪ್ರತಿಕ್ರಿಯೆ ಸಲ್ಲಿಸಿ'}
                </Button>
                <ThreeDIcon icon="feedback" />
                <span className="text-sm text-muted-foreground">
                  {language === 'en' ? 'Real-time feedback from workers' : 'ಕೆಲಸಗಾರರಿಂದ ನೈಜ ಸಮಯದ ಪ್ರತಿಕ್ರಿಯೆ'}
                </span>
              </div>
            </div>

            {/* Employer Feedback Form */}
            {showEmployerFeedbackForm && (
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'en' ? 'Submit Feedback to Supervisor' : 'ಸೂಪರ್‌ವೈಸರ್‌ಗೆ ಪ್ರತಿಕ್ರಿಯೆ ಸಲ್ಲಿಸಿ'}</CardTitle>
                  <CardDescription>
                    {language === 'en'
                      ? 'Share your observations, suggestions, or concerns with the supervisor'
                      : 'ಸೂಪರ್‌ವೈಸರ್‌ನೊಂದಿಗೆ ನಿಮ್ಮ ಅವಲೋಕನಗಳು, ಸಲಹೆಗಳು ಅಥವಾ ಆತಂಕಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">{language === 'en' ? 'Subject' : 'ವಿಷಯ'}</Label>
                      <Input
                        id="subject"
                        value={employerFeedbackForm.subject}
                        onChange={(e) => setEmployerFeedbackForm({ ...employerFeedbackForm, subject: e.target.value })}
                        placeholder={language === 'en' ? 'Enter feedback subject' : 'ಪ್ರತಿಕ್ರಿಯೆ ವಿಷಯ ನಮೂದಿಸಿ'}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">{language === 'en' ? 'Category' : 'ವರ್ಗ'}</Label>
                      <Select
                        value={employerFeedbackForm.category}
                        onValueChange={(value) => setEmployerFeedbackForm({ ...employerFeedbackForm, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'en' ? 'Select category' : 'ವರ್ಗ ಆಯ್ಕೆಮಾಡಿ'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Workers">{language === 'en' ? 'Workers' : 'ಕೆಲಸಗಾರರು'}</SelectItem>
                          <SelectItem value="Tasks">{language === 'en' ? 'Tasks' : 'ಕಾರ್ಯಗಳು'}</SelectItem>
                          <SelectItem value="General">{language === 'en' ? 'General' : 'ಸಾಮಾನ್ಯ'}</SelectItem>
                          <SelectItem value="Performance">{language === 'en' ? 'Performance' : 'ಕಾರ್ಯಕ್ಷಮತೆ'}</SelectItem>
                          <SelectItem value="Safety">{language === 'en' ? 'Safety' : 'ಸುರಕ್ಷತೆ'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">{language === 'en' ? 'Priority' : 'ಆದ್ಯತೆ'}</Label>
                      <Select
                        value={employerFeedbackForm.priority}
                        onValueChange={(value) => setEmployerFeedbackForm({ ...employerFeedbackForm, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">{language === 'en' ? 'Low' : 'ಕಡಿಮೆ'}</SelectItem>
                          <SelectItem value="Medium">{language === 'en' ? 'Medium' : 'ಮಧ್ಯಮ'}</SelectItem>
                          <SelectItem value="High">{language === 'en' ? 'High' : 'ಹೆಚ್ಚು'}</SelectItem>
                          <SelectItem value="Urgent">{language === 'en' ? 'Urgent' : 'ಅತ್ಯವಶ್ಯಕ'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comment">{language === 'en' ? 'Comment' : 'ಪ್ರತಿಕ್ರಿಯೆ'}</Label>
                    <Textarea
                      id="comment"
                      value={employerFeedbackForm.comment}
                      onChange={(e) => setEmployerFeedbackForm({ ...employerFeedbackForm, comment: e.target.value })}
                      placeholder={language === 'en' ? 'Enter your feedback or observation' : 'ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ ಅಥವಾ ಅವಲೋಕನವನ್ನು ನಮೂದಿಸಿ'}
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleEmployerFeedbackSubmit} className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Submit Feedback' : 'ಪ್ರತಿಕ್ರಿಯೆ ಸಲ್ಲಿಸಿ'}
                    </Button>
                    <Button variant="outline" onClick={() => setShowEmployerFeedbackForm(false)}>
                      {t.cancel}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <FeedbackDisplay feedback={allFeedback} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default EmployerDashboard
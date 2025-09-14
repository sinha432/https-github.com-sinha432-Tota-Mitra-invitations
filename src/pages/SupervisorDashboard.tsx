import React, { useState } from 'react'
// Extend Window type for liveAttendance
declare global {
  interface Window {
    liveAttendance: Record<string, unknown>;
    sharedFeedback: Feedback[];
  }
}
import '../SupervisorDashboard.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Star,
  Filter,
  Search,
  LogOut,
  Languages,
  Sun,
  CloudRain,
  Thermometer,
  Wind,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  MessageSquare
} from 'lucide-react'
import { useAuth } from '@/App'
import { mockWorkers, mockTasks, mockFeedback, Feedback } from '@/data/mockData'
import FeedbackDisplay from '@/components/FeedbackDisplay'
import WeatherWidget from '@/components/WeatherWidget'
import ThreeDIcon from '../components/ThreeDIcon';
import { toast } from 'sonner'

const SupervisorDashboard = () => {
  // Import AI Assistant
  const AIAssistant = React.lazy(() => import('../components/AIAssistant'));
  console.log('👨‍💼 SupervisorDashboard component rendering...')
  
  const { user, logout, language, setLanguage } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('all')
  const [selectedSkill, setSelectedSkill] = useState('all')
  const [availabilityFilter, setAvailabilityFilter] = useState('all')
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [tasks, setTasks] = useState(mockTasks)
  const [newTask, setNewTask] = useState({
    title: '',
    type: '',
    date: '',
    workersNeeded: 1,
    location: '',
    duration: '',
    description: ''
  })
  const taskTypes = [
    'Arecanut Harvesting',
    'Coconut Harvesting',
    'Pepper Vine Support Work',
    'Banana Cultivation Assistance',
    'Arecanut Medicine Spray',
    'General Farm Labor'
  ]

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.type || !newTask.date || !newTask.location) {
      toast.error('Please fill all required fields')
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
      const taskData = {
        id: (tasks.length + 1).toString(),
        title: newTask.title,
        type: typeValue,
        date: newTask.date,
        workersNeeded: newTask.workersNeeded,
        assignedWorkers: [],
        status: 'pending' as 'pending',
        location: newTask.location,
        duration: newTask.duration,
        description: newTask.description,
        createdBy: user?.name || 'supervisor',
        createdAt: new Date().toISOString()
      }
      setTasks([...tasks, taskData])
    toast.success('Task created successfully!')
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
  }

  const translations = {
    en: {
      dashboard: 'Supervisor Dashboard',
      welcome: 'Welcome back',
      overview: 'Overview',
      workers: 'Workers',
      tasks: 'Tasks',
      analytics: 'Analytics',
      feedback: 'Feedback',
      weather: 'Weather',
      totalWorkers: 'Total Workers',
      availableWorkers: 'Available Workers',
      activeTasks: 'Active Tasks',
      completedTasks: 'Completed Tasks',
      searchPlaceholder: 'Search workers...',
      allGroups: 'All Groups',
      allSkills: 'All Skills',
      availability: 'Availability',
      available: 'Available',
      unavailable: 'Unavailable',
      all: 'All',
      rating: 'Rating',
      location: 'Location',
      skills: 'Skills',
      contact: 'Contact',
      languages: 'Languages',
      age: 'Age',
      group: 'Group',
      taskTitle: 'Task Title',
      type: 'Task Type',
      duration: 'Duration',
      description: 'Description',
      workersNeeded: 'Workers Needed',
      assigned: 'Assigned',
      status: 'Status',
      date: 'Date',
      pending: 'Pending',
      approved: 'Approved',
      completed: 'Completed',
      cancelled: 'Cancelled',
      temperature: 'Temperature',
      humidity: 'Humidity',
      windSpeed: 'Wind Speed',
      createTask: 'Create New Task',
      viewDetails: 'View Details',
      recentFeedback: 'Recent Feedback',
      workerFeedback: 'Worker Feedback'
    },
    kn: {
      dashboard: 'ಮೇಲ್ವಿಚಾರಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      welcome: 'ಮರಳಿ ಸ್ವಾಗತ',
      overview: 'ಅವಲೋಕನ',
      workers: 'ಕೆಲಸಗಾರರು',
      tasks: 'ಕಾರ್ಯಗಳು',
      analytics: 'ವಿಶ್ಲೇಷಣೆ',
      feedback: 'ಪ್ರತಿಕ್ರಿಯೆ',
      weather: 'ಹವಾಮಾನ',
      totalWorkers: 'ಒಟ್ಟು ಕೆಲಸಗಾರರು',
      availableWorkers: 'ಲಭ್ಯವಿರುವ ಕೆಲಸಗಾರರು',
      activeTasks: 'ಸಕ್ರಿಯ ಕಾರ್ಯಗಳು',
      completedTasks: 'ಪೂರ್ಣಗೊಂಡ ಕಾರ್ಯಗಳು',
      searchPlaceholder: 'ಕೆಲಸಗಾರರನ್ನು ಹುಡುಕಿ...',
      allGroups: 'ಎಲ್ಲಾ ಗುಂಪುಗಳು',
      allSkills: 'ಎಲ್ಲಾ ಕೌಶಲ್ಯಗಳು',
      availability: 'ಲಭ್ಯತೆ',
      available: 'ಲಭ್ಯವಿದೆ',
      unavailable: 'ಲಭ್ಯವಿಲ್ಲ',
      all: 'ಎಲ್ಲಾ',
      rating: 'ರೇಟಿಂಗ್',
      location: 'ಸ್ಥಳ',
      skills: 'ಕೌಶಲ್ಯಗಳು',
      contact: 'ಸಂಪರ್ಕ',
      languages: 'ಭಾಷೆಗಳು',
      age: 'ವಯಸ್ಸು',
      group: 'ಗುಂಪು',
      taskTitle: 'ಕಾರ್ಯದ ಶೀರ್ಷಿಕೆ',
      type: 'ಕಾರ್ಯದ ಪ್ರಕಾರ',
      duration: 'ಅವಧಿ',
      description: 'ವಿವರಣೆ',
      workersNeeded: 'ಅಗತ್ಯವಿರುವ ಕೆಲಸಗಾರರು',
      assigned: 'ನಿಯೋಜಿತ',
      status: 'ಸ್ಥಿತಿ',
      date: 'ದಿನಾಂಕ',
      pending: 'ಬಾಕಿ',
      approved: 'ಅನುಮೋದಿತ',
      completed: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
      cancelled: 'ರದ್ದುಮಾಡಲಾಗಿದೆ',
      temperature: 'ತಾಪಮಾನ',
      humidity: 'ಆರ್ದ್ರತೆ',
      windSpeed: 'ಗಾಳಿಯ ವೇಗ',
      createTask: 'ಹೊಸ ಕಾರ್ಯ ರಚಿಸಿ',
      viewDetails: 'ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
      recentFeedback: 'ಇತ್ತೀಚಿನ ಪ್ರತಿಕ್ರಿಯೆ',
      workerFeedback: 'ಕೆಲಸಗಾರರ ಪ್ರತಿಕ್ರಿಯೆ'
    }
  }

  const t = translations[language]
  // Use window.sharedFeedback for demo purposes (replace with context/store in real app)
  const allFeedback = window.sharedFeedback ? window.sharedFeedback : mockFeedback

  // Filter workers based on search and filters
  const filteredWorkers = mockWorkers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worker.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGroup = selectedGroup === 'all' || worker.group === selectedGroup
    const matchesSkill = selectedSkill === 'all' || worker.skills.some(skill => skill === selectedSkill)
    const matchesAvailability = availabilityFilter === 'all' || 
                               (availabilityFilter === 'available' && worker.availability) ||
                               (availabilityFilter === 'unavailable' && !worker.availability)

    return matchesSearch && matchesGroup && matchesSkill && matchesAvailability
  })

  const availableWorkers = mockWorkers.filter(w => w.availability).length
  const activeTasks = mockTasks.filter(t => t.status === 'approved' || t.status === 'pending').length
  const completedTasks = mockTasks.filter(t => t.status === 'completed').length

  const groups = ['all', ...Array.from(new Set(mockWorkers.map(w => w.group)))]
  const skills = ['all', ...Array.from(new Set(mockWorkers.flatMap(w => w.skills)))]

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
      case 'pending': return <Clock className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  // Theme toggle
  const [theme, setTheme] = useState(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // State for modals
  const [selectedWorker, setSelectedWorker] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showContact, setShowContact] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* AI Assistant Floating UI */}
      <React.Suspense fallback={null}>
        <AIAssistant appData={{ workers: mockWorkers, tasks, feedback: mockFeedback }} theme={theme} />
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
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">{t.overview}</TabsTrigger>
            <TabsTrigger value="workers">{t.workers}</TabsTrigger>
            <TabsTrigger value="tasks">{t.tasks}</TabsTrigger>
            <TabsTrigger value="analytics">{t.analytics}</TabsTrigger>
            <TabsTrigger value="feedback">{t.feedback}</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards and Live Attendance */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{language === 'en' ? 'Live Attendance' : 'ನೈಜ ಹಾಜರಿ'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {window.liveAttendance && Object.values(window.liveAttendance).length > 0 ? (
                      Object.values(window.liveAttendance).map((att: any, i) => (
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
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t.totalWorkers}</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockWorkers.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t.availableWorkers}</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{availableWorkers}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t.activeTasks}</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{activeTasks}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t.completedTasks}</CardTitle>
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{completedTasks}</div>
                </CardContent>
              </Card>
            </div>

            {/* Weather Widget */}
            <div className="flex items-center gap-2 mb-2">
              <ThreeDIcon icon="weather" />
              <span className="font-semibold">{t.weather}</span>
            </div>
            <WeatherWidget />

            {/* Recent Tasks */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t.tasks}</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  {t.createTask}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`} />
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-muted-foreground">{task.location} • {task.date}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{task.assignedWorkers.length}/{task.workersNeeded}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Feedback */}
            <FeedbackDisplay feedback={mockFeedback.slice(0, 3)} title={t.recentFeedback} />
          </TabsContent>

          {/* Workers Tab */}
          <TabsContent value="workers" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t.searchPlaceholder}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                    <SelectTrigger>
                      <SelectValue placeholder={t.allGroups} />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group === 'all' ? t.allGroups : group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                    <SelectTrigger>
                      <SelectValue placeholder={t.allSkills} />
                    </SelectTrigger>
                    <SelectContent>
                      {skills.map((skill) => (
                        <SelectItem key={skill} value={skill}>
                          {skill === 'all' ? t.allSkills : skill}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder={t.availability} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.all}</SelectItem>
                      <SelectItem value="available">{t.available}</SelectItem>
                      <SelectItem value="unavailable">{t.unavailable}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Workers Grid */}
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
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
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
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Dialog open={showContact && selectedWorker?.id === worker.id} onOpenChange={v => { setShowContact(v); if (!v) setSelectedWorker(null); }}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => { setSelectedWorker(worker); setShowContact(true); }}>
                            <Phone className="h-3 w-3 mr-1" />
                            {t.contact}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Contact Info</DialogTitle>
                            <DialogDescription>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span>{worker.contact.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <span>{worker.contact.email}</span>
                                </div>
                              </div>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                      <Dialog open={showDetails && selectedWorker?.id === worker.id} onOpenChange={v => { setShowDetails(v); if (!v) setSelectedWorker(null); }}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="flex-1" onClick={() => { setSelectedWorker(worker); setShowDetails(true); }}>
                            {t.viewDetails}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Worker Details</DialogTitle>
                            <DialogDescription>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={worker.profilePic} alt={worker.name} />
                                    <AvatarFallback>{worker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                  </Avatar>
                                  <span className="font-semibold">{worker.name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span>{worker.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Badge variant="outline">{worker.group}</Badge>
                                  <span>Age: {worker.age}</span>
                                  <span>Rating: {worker.rating}</span>
                                </div>
                                <div className="flex flex-wrap gap-1 text-xs">
                                  {worker.skills.map((skill) => (
                                    <Badge key={skill} variant="secondary">{skill}</Badge>
                                  ))}
                                </div>
                                <div className="flex gap-2 text-xs">
                                  {worker.languages.map((lang) => (
                                    <Badge key={lang} variant="secondary">{lang}</Badge>
                                  ))}
                                </div>
                              </div>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{t.tasks}</h2>
              <Button onClick={() => setShowCreateTask(true)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ThreeDIcon icon="plus" />
                {t.createTask}
              </Button>
            </div>

            {/* Create Task Modal */}
            {showCreateTask && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <Card className="w-full max-w-lg mx-auto">
                  <CardHeader>
                    <CardTitle>{t.createTask}</CardTitle>
                    <CardDescription>
                      {language === 'en' ? 'Schedule a new task for your workers' : 'ನಿಮ್ಮ ಕೆಲಸಗಾರರಿಗೆ ಹೊಸ ಕಾರ್ಯವನ್ನು ವೇಳಾಪಟ್ಟಿ ಮಾಡಿ'}
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
                      <label htmlFor="type" className="font-medium">{t.type || 'Task Type'}</label>
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
                      <label htmlFor="date" className="font-medium">{t.date}</label>
                      <input
                        id="date"
                        type="date"
                        className="w-full border rounded px-2 py-1"
                        value={newTask.date}
                        onChange={e => setNewTask({ ...newTask, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="workersNeeded" className="font-medium">{t.workersNeeded}</label>
                      <input
                        id="workersNeeded"
                        type="number"
                        min="1"
                        className="w-full border rounded px-2 py-1"
                        value={newTask.workersNeeded}
                        onChange={e => setNewTask({ ...newTask, workersNeeded: parseInt(e.target.value) })}
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
                      <label htmlFor="duration" className="font-medium">{t.duration || 'Duration'}</label>
                      <input
                        id="duration"
                        className="w-full border rounded px-2 py-1"
                        value={newTask.duration}
                        onChange={e => setNewTask({ ...newTask, duration: e.target.value })}
                        placeholder={language === 'en' ? 'e.g., 4 hours' : 'ಉದಾ., 4 ಗಂಟೆಗಳು'}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="description" className="font-medium">{t.description || 'Description'}</label>
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
                      <Button onClick={handleCreateTask} className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {language === 'en' ? 'Submit Task' : 'ಕಾರ್ಯವನ್ನು ಸಲ್ಲಿಸಿ'}
                      </Button>
                      <Button variant="outline" onClick={() => setShowCreateTask(false)}>
                        {language === 'en' ? 'Cancel' : 'ರದ್ದುಮಾಡಿ'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="space-y-4">
              {tasks.map((task) => (
                <Card key={task.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(task.status)}
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
                      <div>
                        <span className="text-muted-foreground">{t.date}:</span>
                        <p className="font-medium">{task.date}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t.location}:</span>
                        <p className="font-medium">{task.location}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <p className="font-medium">{task.duration}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <p className="font-medium">{task.type}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {t.analytics}
                </CardTitle>
                <CardDescription>
                  {language === 'en' 
                    ? 'Real-time workforce performance and task completion analytics' 
                    : 'ನೈಜ ಸಮಯದ ಕಾರ್ಮಿಕರ ಕೆಲಸದ ದಕ್ಷತೆ ಮತ್ತು ಕಾರ್ಯ ಪೂರ್ಣಗೊಳಿಸುವಿಕೆಯ ವಿಶ್ಲೇಷಣೆ'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">
                      {language === 'en' ? 'Real-time Worker Availability by Group' : 'ಗುಂಪಿನ ಪ್ರಕಾರ ನೈಜ ಸಮಯದ ಕೆಲಸಗಾರರ ಲಭ್ಯತೆ'}
                    </h3>
                    {['Group 1', 'Group 2', 'Group 3', 'Group 4', 'Group 5'].map((group) => {
                      const groupWorkers = mockWorkers.filter(w => w.group === group)
                      const availableInGroup = groupWorkers.filter(w => w.availability).length
                      const percentage = (availableInGroup / groupWorkers.length) * 100
                      
                      const getProgressColor = (percentage: number) => {
                        if (percentage >= 70) return 'bg-green-500'
                        if (percentage >= 40) return 'bg-yellow-500'
                        return 'bg-red-500'
                      }
                      
                      return (
                        <div key={group} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{group}</span>
                            <span className={`font-bold ${
                              percentage >= 70 ? 'text-green-600' :
                              percentage >= 40 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {availableInGroup}/{groupWorkers.length} ({Math.round(percentage)}%)
                            </span>
                          </div>
                          <div className="w-full bg-secondary rounded-full progress-bar">
                            <div 
                              className={`progress-bar ${getProgressColor(percentage)}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">
                      {language === 'en' ? 'Live Task Status Distribution' : 'ನೈಜ ಸಮಯದ ಕಾರ್ಯ ಸ್ಥಿತಿಯ ವಿತರಣೆ'}
                    </h3>
                    <div className="space-y-3">
                      {['pending', 'approved', 'completed', 'cancelled'].map((status) => {
                        const count = mockTasks.filter(t => t.status === status).length
                        const percentage = (count / mockTasks.length) * 100
                        
                        return (
                          <div key={status} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full ${getStatusColor(status)}`} />
                              <span className="capitalize font-medium">{t[status as keyof typeof t] || status}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-lg">{count}</span>
                              <span className="text-sm text-muted-foreground ml-2">({percentage.toFixed(0)}%)</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{t.workerFeedback}</h2>
              <div className="flex items-center gap-2">
                <ThreeDIcon icon="feedback" />
                <span className="text-sm text-muted-foreground">
                  {language === 'en' ? 'Live feedback from workers' : 'ಕೆಲಸಗಾರರಿಂದ ನೈಜ ಸಮಯದ ಪ್ರತಿಕ್ರಿಯೆ'}
                </span>
              </div>
            </div>
            <FeedbackDisplay feedback={allFeedback} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Theme toggle moved to header */}
    </div>
  )
}

export default SupervisorDashboard
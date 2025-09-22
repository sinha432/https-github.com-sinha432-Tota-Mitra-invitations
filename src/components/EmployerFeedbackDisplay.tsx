import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { EmployerFeedback } from '@/data/mockData'
import { format } from 'date-fns'
import { AlertTriangle, Users, Settings, Info, TrendingUp, Shield } from 'lucide-react'

interface EmployerFeedbackDisplayProps {
  feedback: EmployerFeedback[]
  language?: 'en' | 'kn'
}

const EmployerFeedbackDisplay: React.FC<EmployerFeedbackDisplayProps> = ({
  feedback,
  language = 'en'
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Workers':
        return <Users className="h-4 w-4" />
      case 'Tasks':
        return <Settings className="h-4 w-4" />
      case 'General':
        return <Info className="h-4 w-4" />
      case 'Performance':
        return <TrendingUp className="h-4 w-4" />
      case 'Safety':
        return <Shield className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low':
        return 'bg-blue-500'
      case 'Medium':
        return 'bg-yellow-500'
      case 'High':
        return 'bg-orange-500'
      case 'Urgent':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Workers':
        return 'bg-green-100 text-green-800'
      case 'Tasks':
        return 'bg-blue-100 text-blue-800'
      case 'General':
        return 'bg-gray-100 text-gray-800'
      case 'Performance':
        return 'bg-purple-100 text-purple-800'
      case 'Safety':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const translations = {
    en: {
      employerFeedback: 'Employer Feedback',
      noFeedback: 'No employer feedback available',
      subject: 'Subject',
      category: 'Category',
      priority: 'Priority',
      from: 'From',
      submitted: 'Submitted',
      workers: 'Workers',
      tasks: 'Tasks',
      general: 'General',
      performance: 'Performance',
      safety: 'Safety',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      urgent: 'Urgent'
    },
    kn: {
      employerFeedback: 'ಉದ್ಯೋಗದಾತರ ಪ್ರತಿಕ್ರಿಯೆ',
      noFeedback: 'ಯಾವುದೇ ಉದ್ಯೋಗದಾತರ ಪ್ರತಿಕ್ರಿಯೆ ಲಭ್ಯವಿಲ್ಲ',
      subject: 'ವಿಷಯ',
      category: 'ವರ್ಗ',
      priority: 'ಆದ್ಯತೆ',
      from: 'ಇಂದ',
      submitted: 'ಸಲ್ಲಿಸಲಾಗಿದೆ',
      workers: 'ಕೆಲಸಗಾರರು',
      tasks: 'ಕಾರ್ಯಗಳು',
      general: 'ಸಾಮಾನ್ಯ',
      performance: 'ಕಾರ್ಯಕ್ಷಮತೆ',
      safety: 'ಸುರಕ್ಷತೆ',
      low: 'ಕಡಿಮೆ',
      medium: 'ಮಧ್ಯಮ',
      high: 'ಹೆಚ್ಚು',
      urgent: 'ಅತ್ಯವಶ್ಯಕ'
    }
  }

  const t = translations[language]

  const getCategoryTranslation = (category: string) => {
    switch (category) {
      case 'Workers':
        return t.workers
      case 'Tasks':
        return t.tasks
      case 'General':
        return t.general
      case 'Performance':
        return t.performance
      case 'Safety':
        return t.safety
      default:
        return category
    }
  }

  const getPriorityTranslation = (priority: string) => {
    switch (priority) {
      case 'Low':
        return t.low
      case 'Medium':
        return t.medium
      case 'High':
        return t.high
      case 'Urgent':
        return t.urgent
      default:
        return priority
    }
  }

  if (feedback.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">{t.noFeedback}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold">{t.employerFeedback}</h3>
        <Badge variant="outline">{feedback.length}</Badge>
      </div>

      <div className="space-y-4">
        {feedback.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {item.employerName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{item.subject}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span>{t.from} {item.employerName}</span>
                      <span>•</span>
                      <span>{format(new Date(item.createdAt), 'MMM dd, yyyy')}</span>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${getCategoryColor(item.category)} border-0`}>
                    <span className="flex items-center gap-1">
                      {getCategoryIcon(item.category)}
                      {getCategoryTranslation(item.category)}
                    </span>
                  </Badge>
                  <Badge className={`${getPriorityColor(item.priority)} text-white border-0`}>
                    {getPriorityTranslation(item.priority)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.comment}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default EmployerFeedbackDisplay

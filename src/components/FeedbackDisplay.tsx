import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, MessageSquare, Calendar } from 'lucide-react'
import { useAuth } from '@/App'
import { Feedback } from '@/data/mockData'

interface FeedbackDisplayProps {
  feedback: Feedback[]
  title?: string
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback, title }) => {
  console.log('📋 FeedbackDisplay component rendering with', feedback.length, 'feedback items')
  
  const { language } = useAuth()

  const translations = {
    en: {
      recentFeedback: 'Recent Feedback',
      noFeedback: 'No feedback available',
      submitted: 'Submitted',
      excellent: 'Excellent',
      good: 'Good',
      average: 'Average',
      poor: 'Poor',
      terrible: 'Terrible'
    },
    kn: {
      recentFeedback: 'ಇತ್ತೀಚಿನ ಪ್ರತಿಕ್ರಿಯೆ',
      noFeedback: 'ಯಾವುದೇ ಪ್ರತಿಕ್ರಿಯೆ ಲಭ್ಯವಿಲ್ಲ',
      submitted: 'ಸಲ್ಲಿಸಲಾಗಿದೆ',
      excellent: 'ಅತ್ಯುತ್ತಮ',
      good: 'ಉತ್ತಮ',
      average: 'ಸರಾಸರಿ',
      poor: 'ಕಳಪೆ',
      terrible: 'ಭಯಾನಕ'
    }
  }

  const t = translations[language]

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 5: return t.excellent
      case 4: return t.good
      case 3: return t.average
      case 2: return t.poor
      case 1: return t.terrible
      default: return t.average
    }
  }

  const getRatingColor = (rating: number) => {
    switch (rating) {
      case 5: return 'bg-green-500'
      case 4: return 'bg-blue-500'
      case 3: return 'bg-yellow-500'
      case 2: return 'bg-orange-500'
      case 1: return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'kn-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (feedback.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {title || t.recentFeedback}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t.noFeedback}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {title || t.recentFeedback}
        </CardTitle>
        <CardDescription>
          {language === 'en' 
            ? `${feedback.length} feedback submissions from workers`
            : `ಕೆಲಸಗಾರರಿಂದ ${feedback.length} ಪ್ರತಿಕ್ರಿಯೆ ಸಲ್ಲಿಕೆಗಳು`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {feedback.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {item.workerName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{item.workerName}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(item.createdAt)}
                    </div>
                  </div>
                </div>
                <Badge className={`${getRatingColor(item.rating)} text-white`}>
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  {item.rating}/5
                </Badge>
              </div>
              
              <div className="flex items-center gap-1 text-sm">
                <span className="text-muted-foreground">{language === 'en' ? 'Rating:' : 'ರೇಟಿಂಗ್:'}</span>
                <span className="font-medium">{getRatingText(item.rating)}</span>
              </div>
              
              {item.comment && (
                <div className="bg-muted/50 rounded p-3">
                  <p className="text-sm italic">"{item.comment}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default FeedbackDisplay
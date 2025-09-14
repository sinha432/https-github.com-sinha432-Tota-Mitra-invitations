import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Star, Send } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/App'

interface FeedbackFormProps {
  taskId: string
  taskTitle: string
  onSubmit: (feedback: { rating: number; comment: string }) => void
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ taskId, taskTitle, onSubmit }) => {
  console.log('💬 FeedbackForm component rendering for task:', taskId)
  
  const { language } = useAuth()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const translations = {
    en: {
      feedbackTitle: 'Task Feedback',
      feedbackDesc: 'Share your experience about this task',
      ratingLabel: 'Rate your experience',
      commentLabel: 'Additional Comments',
      commentPlaceholder: 'Share your thoughts about the task, work conditions, or suggestions...',
      submitFeedback: 'Submit Feedback',
      submitting: 'Submitting...',
      ratingRequired: 'Please provide a rating',
      thankYou: 'Thank you for your feedback!',
      errorSubmitting: 'Error submitting feedback'
    },
    kn: {
      feedbackTitle: 'ಕಾರ್ಯ ಪ್ರತಿಕ್ರಿಯೆ',
      feedbackDesc: 'ಈ ಕಾರ್ಯದ ಬಗ್ಗೆ ನಿಮ್ಮ ಅನುಭವವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ',
      ratingLabel: 'ನಿಮ್ಮ ಅನುಭವವನ್ನು ರೇಟ್ ಮಾಡಿ',
      commentLabel: 'ಹೆಚ್ಚುವರಿ ಟಿಪ್ಪಣಿಗಳು',
      commentPlaceholder: 'ಕಾರ್ಯ, ಕೆಲಸದ ಪರಿಸ್ಥಿತಿಗಳು ಅಥವಾ ಸಲಹೆಗಳ ಬಗ್ಗೆ ನಿಮ್ಮ ಆಲೋಚನೆಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ...',
      submitFeedback: 'ಪ್ರತಿಕ್ರಿಯೆ ಸಲ್ಲಿಸಿ',
      submitting: 'ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...',
      ratingRequired: 'ದಯವಿಟ್ಟು ರೇಟಿಂಗ್ ನೀಡಿ',
      thankYou: 'ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಗಾಗಿ ಧನ್ಯವಾದಗಳು!',
      errorSubmitting: 'ಪ್ರತಿಕ್ರಿಯೆ ಸಲ್ಲಿಸುವಲ್ಲಿ ದೋಷ'
    }
  }

  const t = translations[language]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('📝 Submitting feedback for task:', taskId, { rating, comment })

    if (rating === 0) {
      toast.error(t.ratingRequired)
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onSubmit({ rating, comment })
      toast.success(t.thankYou)
      
      // Reset form
      setRating(0)
      setComment('')
      
    } catch (error) {
      console.error('❌ Error submitting feedback:', error)
      toast.error(t.errorSubmitting)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t.feedbackTitle}</CardTitle>
        <CardDescription>
          {taskTitle} - {t.feedbackDesc}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t.ratingLabel}</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">{t.commentLabel}</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t.commentPlaceholder}
              rows={3}
              className="resize-none"
            />
          </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || rating === 0} title="Submit feedback">
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? t.submitting : t.submitFeedback}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default FeedbackForm
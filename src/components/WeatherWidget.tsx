import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Sun, 
  CloudRain, 
  Thermometer, 
  Wind, 
  Eye, 
  Droplets,
  MapPin,
  RefreshCw,
  Loader2
} from 'lucide-react'
import { useAuth } from '@/App'
import { toast } from 'sonner'

interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  condition: string
  visibility: number
  location: string
  coordinates?: {
    lat: number
    lon: number
  }
}

const WeatherWidget: React.FC = () => {
  const { language } = useAuth()
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    condition: 'partly-cloudy',
    visibility: 10,
    location: 'Mangalore, Karnataka'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const userSkills = ['Harvesting', 'Medicine Spray', 'General Farm Labor', 'Pepper Vine Support'];
  const userGroup = 'Group 1';
  const [history, setHistory] = useState<Array<{ date: string, condition: string, suggestion: string }>>([]);
  const supervisorMode = false; // Set true to simulate supervisor view
  const allWorkers = [
    { name: 'Ravi', skills: ['Harvesting', 'General Farm Labor'], group: 'Group 1' },
    { name: 'Meena', skills: ['Pepper Vine Support', 'Banana Cultivation'], group: 'Group 2' }
  ];
  const isSevere = weather.condition === 'stormy' || weather.condition === 'rainy';
  const isMounted = React.useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  const askAIForAdvice = () => {
    toast.info(language === 'en' ? 'AI Assistant: Based on current weather, prioritize safe and productive tasks.' : 'AI ಸಹಾಯಕ: ಪ್ರಸ್ತುತ ಹವಾಮಾನ ಆಧರಿಸಿ ಸುರಕ್ಷಿತ ಮತ್ತು ಉತ್ಪಾದಕ ಕಾರ್ಯಗಳನ್ನು ಆದ್ಯತೆ ನೀಡಿ.');
  };
  console.log('🌤️ WeatherWidget component rendering...')

  const translations = {
    en: {
      weather: 'Weather Conditions',
      currentLocation: 'Current Location',
      temperature: 'Temperature',
      humidity: 'Humidity',
      windSpeed: 'Wind Speed',
      visibility: 'Visibility',
      condition: 'Conditions',
      refresh: 'Refresh',
      getLocation: 'Get Current Location',
      locationDenied: 'Location access denied',
      locationError: 'Error getting location',
      weatherUpdated: 'Weather updated',
      lastUpdated: 'Last updated',
      conditions: {
        'partly-cloudy': 'Partly Cloudy',
        'sunny': 'Sunny',
        'cloudy': 'Cloudy',
        'rainy': 'Rainy',
        'stormy': 'Stormy'
      }
    },
    kn: {
      weather: 'ಹವಾಮಾನ ಪರಿಸ್ಥಿತಿಗಳು',
      currentLocation: 'ಪ್ರಸ್ತುತ ಸ್ಥಳ',
      temperature: 'ತಾಪಮಾನ',
      humidity: 'ಆರ್ದ್ರತೆ',
      windSpeed: 'ಗಾಳಿಯ ವೇಗ',
      visibility: 'ದೃಶ್ಯತೆ',
      condition: 'ಪರಿಸ್ಥಿತಿಗಳು',
      refresh: 'ರೀಫ್ರೆಶ್',
      getLocation: 'ಪ್ರಸ್ತುತ ಸ್ಥಳ ಪಡೆಯಿರಿ',
      locationDenied: 'ಸ್ಥಳ ಪ್ರವೇಶ ನಿರಾಕರಿಸಲಾಗಿದೆ',
      locationError: 'ಸ್ಥಳ ಪಡೆಯುವಲ್ಲಿ ದೋಷ',
      weatherUpdated: 'ಹವಾಮಾನ ನವೀಕರಿಸಲಾಗಿದೆ',
      lastUpdated: 'ಕೊನೆಯ ಬಾರಿ ನವೀಕರಿಸಲಾಗಿದೆ',
      conditions: {
        'partly-cloudy': 'ಆಂಶಿಕ ಮೋಡ',
        'sunny': 'ಬಿಸಿಲು',
        'cloudy': 'ಮೋಡ',
        'rainy': 'ಮಳೆ',
        'stormy': 'ಚಂಡಮಾರುತ'
      }
    }
  }


  const t = translations[language]

  const getCurrentLocation = () => {
    console.log('📍 Getting current location...')
    setIsLoading(true)
    if (!navigator.geolocation) {
      toast.error(language === 'en' ? 'Geolocation not supported' : 'ಜಿಯೋಲೊಕೇಶನ್ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ')
      setIsLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!isMounted.current) return;
        console.log('✅ Location obtained:', position.coords)
        const { latitude, longitude } = position.coords
        const mockLocation = `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`
        const mockWeatherData: WeatherData = {
          temperature: Math.round(25 + Math.random() * 10),
          humidity: Math.round(50 + Math.random() * 40),
          windSpeed: Math.round(5 + Math.random() * 15),
          condition: ['sunny', 'partly-cloudy', 'cloudy'][Math.floor(Math.random() * 3)],
          visibility: Math.round(8 + Math.random() * 4),
          location: mockLocation,
          coordinates: { lat: latitude, lon: longitude }
        }
        setWeather(mockWeatherData)
        setLastUpdated(new Date())
        toast.success(t.weatherUpdated)
        setIsLoading(false)
      },
      (error) => {
        if (!isMounted.current) return;
        console.error('❌ Error getting location:', error)
        let errorMessage = t.locationError
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = t.locationDenied
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = language === 'en' ? 'Location unavailable' : 'ಸ್ಥಳ ಲಭ್ಯವಿಲ್ಲ'
            break
          case error.TIMEOUT:
            errorMessage = language === 'en' ? 'Location request timeout' : 'ಸ್ಥಳ ವಿನಂತಿ ಸಮಯ ಮೀರಿದೆ'
            break
        }
        toast.error(errorMessage)
        setIsLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  }

  const refreshWeather = () => {
    console.log('🔄 Refreshing weather data...')
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      if (!isMounted.current) return;
      setWeather(prev => ({
        ...prev,
        temperature: Math.round(25 + Math.random() * 10),
        humidity: Math.round(50 + Math.random() * 40),
        windSpeed: Math.round(5 + Math.random() * 15)
      }))
      setLastUpdated(new Date())
      toast.success(t.weatherUpdated)
      setIsLoading(false)
    }, 1000)
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-5 w-5 text-yellow-500" />
      case 'cloudy': return <CloudRain className="h-5 w-5 text-gray-500" />
      case 'rainy': return <CloudRain className="h-5 w-5 text-blue-500" />
      default: return <Sun className="h-5 w-5 text-yellow-400" />
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'en' ? 'en-US' : 'kn-IN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Suggest tasks based on weather
  const getTaskSuggestion = () => {
    let baseSuggestion = '';
    switch (weather.condition) {
      case 'sunny':
        baseSuggestion = language === 'en'
          ? 'Arecanut/Coconut Harvesting, Medicine Spray, General Farm Labor.'
          : 'ಅರೆಕಡು/ತೆಂಗಿನ ಹಣ್ಣು ಸಂಗ್ರಹ, ಔಷಧಿ ಸ್ಪ್ರೇ, ಸಾಮಾನ್ಯ ಕೃಷಿ ಕೆಲಸ.';
        break;
      case 'partly-cloudy':
        baseSuggestion = language === 'en'
          ? 'Pepper Vine Support, Banana Cultivation, General Farm Labor.'
          : 'ಮೆಣಸು ಬೆಳೆ ಬೆಂಬಲ, ಬಾಳೆ ಬೆಳೆ, ಸಾಮಾನ್ಯ ಕೃಷಿ ಕೆಲಸ.';
        break;
      case 'cloudy':
        baseSuggestion = language === 'en'
          ? 'Indoor/Greenhouse tasks, equipment maintenance.'
          : 'ಒಳಾಂಗಣ/ಹರಿತಗೃಹ ಕೆಲಸಗಳು, ಉಪಕರಣ ನಿರ್ವಹಣೆ.';
        break;
      case 'rainy':
        baseSuggestion = language === 'en'
          ? 'Avoid field work, focus on indoor tasks.'
          : 'ಹೊಲದ ಕೆಲಸ ತಪ್ಪಿಸಿ, ಒಳಾಂಗಣ ಕೆಲಸ ಮಾಡಿ.';
        break;
      case 'stormy':
        baseSuggestion = language === 'en'
          ? 'Suspend outdoor work, ensure safety.'
          : 'ಹೊರಗಿನ ಕೆಲಸ ನಿಲ್ಲಿಸಿ, ಸುರಕ್ಷತೆ ಖಚಿತಪಡಿಸಿ.';
        break;
      default:
        baseSuggestion = language === 'en'
          ? 'General farm tasks.'
          : 'ಸಾಮಾನ್ಯ ಕೃಷಿ ಕೆಲಸ.';
    }
    // Personalize by skills
    const relevant = userSkills.filter(skill => baseSuggestion.toLowerCase().includes(skill.toLowerCase()));
    const personalized = relevant.length > 0
      ? (language === 'en'
          ? `Based on your skills: ${relevant.join(', ')}.`
          : `ನಿಮ್ಮ ಕೌಶಲ್ಯಗಳ ಆಧಾರದಲ್ಲಿ: ${relevant.join(', ')}.`)
      : '';
    // Supervisor view: aggregate for all workers
    let supervisorSuggestions = '';
    if (supervisorMode) {
      supervisorSuggestions = allWorkers.map(w => `${w.name}: ${getTaskSuggestionForWorker(w)}`).join(' | ');
    }
    return [
      (language === 'en' ? 'Recommended: ' : 'ಶಿಫಾರಸು: ') + baseSuggestion,
      personalized,
      supervisorSuggestions
    ].filter(Boolean).join(' ');
  }

  // Move history update to useEffect
  useEffect(() => {
    let baseSuggestion = '';
    switch (weather.condition) {
      case 'sunny':
        baseSuggestion = language === 'en'
          ? 'Arecanut/Coconut Harvesting, Medicine Spray, General Farm Labor.'
          : 'ಅರೆಕಡು/ತೆಂಗಿನ ಹಣ್ಣು ಸಂಗ್ರಹ, ಔಷಧಿ ಸ್ಪ್ರೇ, ಸಾಮಾನ್ಯ ಕೃಷಿ ಕೆಲಸ.';
        break;
      case 'partly-cloudy':
        baseSuggestion = language === 'en'
          ? 'Pepper Vine Support, Banana Cultivation, General Farm Labor.'
          : 'ಮೆಣಸು ಬೆಳೆ ಬೆಂಬಲ, ಬಾಳೆ ಬೆಳೆ, ಸಾಮಾನ್ಯ ಕೃಷಿ ಕೆಲಸ.';
        break;
      case 'cloudy':
        baseSuggestion = language === 'en'
          ? 'Indoor/Greenhouse tasks, equipment maintenance.'
          : 'ಒಳಾಂಗಣ/ಹರಿತಗೃಹ ಕೆಲಸಗಳು, ಉಪಕರಣ ನಿರ್ವಹಣೆ.';
        break;
      case 'rainy':
        baseSuggestion = language === 'en'
          ? 'Avoid field work, focus on indoor tasks.'
          : 'ಹೊಲದ ಕೆಲಸ ತಪ್ಪಿಸಿ, ಒಳಾಂಗಣ ಕೆಲಸ ಮಾಡಿ.';
        break;
      case 'stormy':
        baseSuggestion = language === 'en'
          ? 'Suspend outdoor work, ensure safety.'
          : 'ಹೊರಗಿನ ಕೆಲಸ ನಿಲ್ಲಿಸಿ, ಸುರಕ್ಷತೆ ಖಚಿತಪಡಿಸಿ.';
        break;
      default:
        baseSuggestion = language === 'en'
          ? 'General farm tasks.'
          : 'ಸಾಮಾನ್ಯ ಕೃಷಿ ಕೆಲಸ.';
    }
    if (!isMounted.current) return;
    setHistory(h => [...h, { date: new Date().toLocaleDateString(), condition: weather.condition, suggestion: baseSuggestion }]);
  }, [weather.condition, language]);

  // Helper for supervisor suggestions
  const getTaskSuggestionForWorker = (worker: { name: string, skills: string[], group: string }) => {
    // Simple logic: match skills to base suggestion
    const base = getTaskSuggestion();
    const relevant = worker.skills.filter(skill => base.toLowerCase().includes(skill.toLowerCase()));
    return relevant.length > 0 ? relevant.join(', ') : base;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getWeatherIcon(weather.condition)}
            <CardTitle className="text-lg">{t.weather}</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={getCurrentLocation}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <MapPin className="h-3 w-3" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshWeather}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3" />
              )}
            </Button>
            {/* AI Assistant Action */}
            <Button variant="secondary" size="sm" onClick={askAIForAdvice}>
              {language === 'en' ? 'Ask AI' : 'AIಗೆ ಕೇಳಿ'}
            </Button>
          </div>
        </div>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {weather.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-red-500" />
            <div>
              <p className="text-xs text-muted-foreground">{t.temperature}</p>
              <p className="font-medium">{weather.temperature}°C</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">{t.humidity}</p>
              <p className="font-medium">{weather.humidity}%</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-muted-foreground">{t.windSpeed}</p>
              <p className="font-medium">{weather.windSpeed} km/h</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-purple-500" />
            <div>
              <p className="text-xs text-muted-foreground">{t.visibility}</p>
              <p className="font-medium">{weather.visibility} km</p>
            </div>
          </div>
        </div>
        {/* Real-time task suggestion with customizations */}
        <div className={`mt-2 p-3 rounded border ${isSevere ? 'bg-red-50 text-red-900 border-red-200' : 'bg-blue-50 text-blue-900 border-blue-200'}`}>
          <strong>{language === 'en' ? 'Suggested Tasks:' : 'ಶಿಫಾರಸು ಮಾಡಿದ ಕಾರ್ಯಗಳು:'}</strong>
          <div className="mt-1 text-sm">{getTaskSuggestion()}</div>
          {/* Action buttons for quick scheduling/request */}
          <div className="mt-2 flex gap-2">
            <Button variant="default" size="sm" onClick={() => toast.success(language === 'en' ? 'Task scheduled!' : 'ಕಾರ್ಯವನ್ನು ವೇಳಾಪಟ್ಟಿ ಮಾಡಲಾಗಿದೆ!')}>
              {language === 'en' ? 'Schedule Task' : 'ಕಾರ್ಯವನ್ನು ವೇಳಾಪಟ್ಟಿ ಮಾಡಿ'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success(language === 'en' ? 'Task requested!' : 'ಕಾರ್ಯವನ್ನು ವಿನಂತಿಸಲಾಗಿದೆ!')}>
              {language === 'en' ? 'Request Task' : 'ಕಾರ್ಯವನ್ನು ವಿನಂತಿಸಿ'}
            </Button>
          </div>
          {/* Severity alert */}
          {isSevere && (
            <div className="mt-2 text-xs font-bold text-red-700">
              {language === 'en' ? 'Severe weather! Please ensure safety and avoid risky tasks.' : 'ತೀವ್ರ ಹವಾಮಾನ! ದಯವಿಟ್ಟು ಸುರಕ್ಷತೆ ಖಚಿತಪಡಿಸಿ ಮತ್ತು ಅಪಾಯದ ಕೆಲಸಗಳನ್ನು ತಪ್ಪಿಸಿ.'}
            </div>
          )}
          {/* Supervisor view: show aggregated suggestions */}
          {supervisorMode && (
            <div className="mt-2 text-xs text-blue-700">
              <strong>{language === 'en' ? 'All Workers:' : 'ಎಲ್ಲಾ ಕೆಲಸಗಾರರು:'}</strong> {allWorkers.map(w => `${w.name}: ${getTaskSuggestionForWorker(w)}`).join(' | ')}
            </div>
          )}
          {/* Historical trends */}
          <div className="mt-2 text-xs text-gray-600">
            <strong>{language === 'en' ? 'History:' : 'ಇತಿಹಾಸ:'}</strong> {history.slice(-3).map(h => `${h.date}: ${h.condition} - ${h.suggestion}`).join(' | ')}
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            {getWeatherIcon(weather.condition)}
            <span className="text-sm font-medium">
              {t.conditions[weather.condition as keyof typeof t.conditions] || weather.condition}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {t.lastUpdated}: {formatTime(lastUpdated)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default WeatherWidget
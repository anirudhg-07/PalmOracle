import { useState } from 'react'
import HeroSection from './components/HeroSection.jsx'
import UploadSection from './components/UploadSection.jsx'
import ResultsSection from './components/ResultsSection.jsx'
import './App.css'

const API_URL = 'http://localhost:5001'

export default function App() {
  const [view, setView] = useState('home') // 'home' | 'upload' | 'results'
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleStartReading = () => {
    setView('upload')
    setResult(null)
    setError(null)
  }

  const handleUpload = async (file) => {
    setLoading(true)
    setError(null)
    const formData = new FormData()
    formData.append('image', file)

    try {
      const resp = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData,
      })
      const data = await resp.json()
      if (!resp.ok || !data.success) {
        throw new Error(data.error || 'Prediction failed.')
      }
      setResult(data)
      setView('results')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setView('home')
    setResult(null)
    setError(null)
  }

  return (
    <div className="app">
      {view === 'home' && (
        <HeroSection onStart={handleStartReading} />
      )}
      {view === 'upload' && (
        <UploadSection
          onUpload={handleUpload}
          onBack={handleReset}
          loading={loading}
          error={error}
        />
      )}
      {view === 'results' && result && (
        <ResultsSection
          result={result}
          onReset={handleReset}
        />
      )}
    </div>
  )
}

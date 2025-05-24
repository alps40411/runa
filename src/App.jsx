import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import WelcomePage from './pages/WelcomePage'
import StoneSelectionPage from './pages/StoneSelectionPage'
import ReadingPage from './pages/ReadingPage'
import AnalysisPage from './pages/AnalysisPage'
import { AppProvider } from './context/AppContext'
import LoadingScreen from './components/LoadingScreen'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/stone-selection" element={<StoneSelectionPage />} />
          <Route path="/reading" element={<ReadingPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
        </Routes>
      </Router>
    </AppProvider>
  )
}

export default App
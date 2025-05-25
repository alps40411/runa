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
  const [loadingOpacity, setLoadingOpacity] = useState(1)
  const [welcomeReady, setWelcomeReady] = useState(false)

  useEffect(() => {
    // 預先加載歡迎頁面
    setTimeout(() => {
      setWelcomeReady(true)
      
      // 開始淡出loading頁面
      setTimeout(() => {
        setLoadingOpacity(0)
        
        // 完全移除loading頁面
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      }, 800)
    }, 4000)
  }, [])

  return (
    <AppProvider>
      <div style={{ 
        position: 'relative', 
        minHeight: '100vh', 
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#f8f8f5'
      }}>
        {welcomeReady && (
          <Router>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/stone-selection" element={<StoneSelectionPage />} />
              <Route path="/reading" element={<ReadingPage />} />
              <Route path="/analysis" element={<AnalysisPage />} />
            </Routes>
          </Router>
        )}
        
        {loading && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100vh',
              zIndex: 1000,
              opacity: loadingOpacity,
              transition: 'opacity 0.8s ease'
            }}
          >
            <LoadingScreen />
          </div>
        )}
      </div>
    </AppProvider>
  )
}

export default App
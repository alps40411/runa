import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import WelcomePage from './pages/WelcomePage'
import StoneSelectionPage from './pages/StoneSelectionPage'
import ReadingPage from './pages/ReadingPage'
import AnalysisPage from './pages/AnalysisPage'
import { AppProvider, useAppContext } from './context/AppContext'
import LoadingScreen from './components/LoadingScreen'
import { initLiff } from './utils/liff'

// For LIFF Debugger
import LiffDebugger from './components/LiffDebugger'

// This component wraps our routes with AnimatePresence
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/stone-selection" element={<StoneSelectionPage />} />
        <Route path="/reading" element={<ReadingPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
      </Routes>
    </AnimatePresence>
  );
};

// 將主要邏輯移到這個組件中
const AppContent = () => {
  const [loading, setLoading] = useState(true)
  const [loadingOpacity, setLoadingOpacity] = useState(1)
  const [welcomeReady, setWelcomeReady] = useState(false)
  const { setResult, setRunes } = useAppContext()

  useEffect(() => {
    let isMounted = true;
    let liffId = ''

    // 取得 data
    const fetchData = async () => {
      try {
        const response = await fetch('api/result/?token=test', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`伺服器回應錯誤 (${response.status})`);
        }

        const data = await response.json();
        
        if (isMounted) {
          setResult(data);
          liffId = data.liff_id;

          // Extract all image_s values from data.card and set them at once
          if (data.card && Array.isArray(data.card)) {
            const runeImages = data.card.map(item => item.image_s);
            setRunes(runeImages);
          }
        }
      } catch (error) {
        console.error('解析擷取錯誤:', error);
      }
    };
    fetchData();


    // 初始化 LIFF
    const initializeApp = async () => {
      try {
        await initLiff(liffId);
      } catch (error) {
        console.error('應用程式初始化失敗:', error);
      }
    };

    initializeApp();

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

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      width: '100%',
      overflow: 'hidden',
      backgroundColor: '#f8f8f5'
    }}>
      {welcomeReady && (
        <Router>
          <AnimatedRoutes />
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
      {/* <LiffDebugger /> */}
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App
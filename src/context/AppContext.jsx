import React, { createContext, useState, useContext } from 'react'

const AppContext = createContext()

export const useAppContext = () => useContext(AppContext)

export const AppProvider = ({ children }) => {
  const [userName, setUserName] = useState('')
  const [userQuestion, setUserQuestion] = useState('')
  const [readingResult, setReadingResult] = useState(null)
  const [isLiffReady, setIsLiffReady] = useState(false)
  const [result, setResult] = useState(null)
  
  // This would contain the logic to interact with an API
  // to generate spiritual readings based on user input
  const generateReading = async () => {
    // Simulated API response for now
    // In a real implementation, this would call an actual API
    const simulatedReading = {
      message: `${userName}，你的靈魂正在尋求平衡與智慧。奧丁的神聖符文顯示，接下來的道路將充滿啟示與挑戰，但你將發現內在的力量引導你向前。`,
      symbols: ['tyr', 'ansuz', 'hagalaz'],
      advice: '保持開放的心靈，傾聽內在的聲音。符文的智慧將在你最需要的時刻顯現。'
    }
    
    setReadingResult(simulatedReading)
    return simulatedReading
  }

  const value = {
    userName,
    setUserName,
    userQuestion,
    setUserQuestion,
    readingResult,
    setReadingResult,
    generateReading,
    isLiffReady,
    setIsLiffReady,
    result,
    setResult
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
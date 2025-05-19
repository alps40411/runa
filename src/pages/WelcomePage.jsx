import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppContext } from '../context/AppContext'
import TriangleSymbol from '../components/symbols/TriangleSymbol'
import CircleSymbol from '../components/symbols/CircleSymbol'
import EyeSymbol from '../components/symbols/EyeSymbol'

const PageContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--spacing-xl) var(--spacing-md);
  text-align: center;
  position: relative;
  overflow: hidden;
`

const LogoContainer = styled(motion.div)`
  margin-bottom: var(--spacing-xl);
`

const Title = styled(motion.h1)`
  font-weight: var(--font-weight-medium);
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: var(--spacing-lg);
  letter-spacing: 1px;
`

const Description = styled(motion.p)`
  font-weight: var(--font-weight-light);
  font-size: 0.9rem;
  line-height: 1.8;
  margin-bottom: var(--spacing-xl);
  max-width: 280px;
  letter-spacing: 0.5px;
`

const SectionTitle = styled(motion.h2)`
  font-weight: var(--font-weight-regular);
  font-size: 1rem;
  margin-bottom: var(--spacing-lg);
  letter-spacing: 1px;
`

const InputContainer = styled(motion.div)`
  width: 100%;
  max-width: 320px;
  margin-bottom: var(--spacing-lg);
`

const StyledInput = styled.input`
  width: 100%;
  padding: var(--spacing-md);
  border: 1px solid var(--color-text-secondary);
  background-color: transparent;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: var(--font-weight-light);
  text-align: center;
  color: var(--color-text-primary);
  
  &::placeholder {
    color: var(--color-text-secondary);
    opacity: 0.7;
  }
  
  &:focus {
    outline: none;
    border-color: var(--color-accent);
  }
`

const SubmitButton = styled(motion.button)`
  background-color: var(--color-accent);
  color: white;
  border: none;
  border-radius: 4px;
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: 0.9rem;
  font-weight: var(--font-weight-regular);
  cursor: pointer;
  transition: background-color var(--transition-fast);
  
  &:hover {
    background-color: var(--color-accent-dark);
  }
  
  &:disabled {
    background-color: var(--color-accent-light);
    cursor: not-allowed;
    opacity: 0.7;
  }
`

const SymbolsContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
`

const TopRightSymbol = styled.div`
  position: absolute;
  top: 40px;
  right: 30px;
  opacity: 0.6;
`

const BottomLeftSymbol = styled.div`
  position: absolute;
  bottom: 80px;
  left: 30px;
  opacity: 0.6;
`

const CenterEyeSymbol = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  
  span {
    font-size: 0.8rem;
    margin-top: var(--spacing-sm);
    color: var(--color-text-secondary);
    letter-spacing: 1px;
  }
`

const WelcomePage = () => {
  const navigate = useNavigate()
  const { userQuestion, setUserQuestion } = useAppContext()
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!userQuestion.trim()) return
    
    setIsSubmitting(true)
    
    setTimeout(() => {
      setIsSubmitting(false)
      navigate('/stone-selection')
    }, 1000)
  }
  
  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <SymbolsContainer>
        <TopRightSymbol>
          <CircleSymbol size={32} />
        </TopRightSymbol>
        <BottomLeftSymbol>
          <CircleSymbol size={40} withInnerCircle={false} />
        </BottomLeftSymbol>
      </SymbolsContainer>
      
      <LogoContainer
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <TriangleSymbol size={80} />
      </LogoContainer>
      
      <Title
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        北歐神話靈神之父<br/>奧丁的祝福符文
      </Title>
      
      <Description
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        為我們帶來洞見，讓我們看見真實。<br/>
        用心聆聽源自的訊息。<br/>
        透過符文的智慧，<br/>
        建議將如其所是的呈現。<br/>
        讓直覺符文為我們燃起心中的光，<br/>
        點亮未來之路。
      </Description>
      
      <SectionTitle
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        解惑之路
      </SectionTitle>
      
      <form onSubmit={handleSubmit}>
        <InputContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          whileTap={{ scale: 0.98 }}
        >
          <StyledInput
            type="text"
            placeholder="請輸入您的問題"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
          />
        </InputContainer>
        
        <AnimatePresence>
          {userQuestion.trim() && (
            <SubmitButton
              type="submit"
              disabled={isSubmitting}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? '尋求中...' : '確認'}
            </SubmitButton>
          )}
        </AnimatePresence>
      </form>
      
      <CenterEyeSymbol>
        <EyeSymbol size={30} />
        <span>靈感之眼</span>
      </CenterEyeSymbol>
    </PageContainer>
  )
}

export default WelcomePage
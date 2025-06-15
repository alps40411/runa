import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppContext } from '../context/AppContext'

const PageContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  position: relative;
  overflow: hidden;
  width: 100%;
  background-image: url('/images/stone_bg.png');
  background-size: 100% auto;
  background-position: center;
  padding: 0px 15px;
  box-sizing: border-box;
  background-color: #f8f8f5;
  will-change: opacity, transform;
`

const LogoContainer = styled(motion.div)`
  margin-bottom: var(--spacing-lg);
`

const LogoImage = styled.img`
  width: 60%;
`

const Title = styled(motion.h1)`
  font-weight: var(--font-weight-medium);
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
  letter-spacing: 1px;
  color: #5b5c5b;
`

const Description = styled(motion.p)`
  font-weight: var(--font-weight-medium);
  font-size: 0.9rem;
  line-height: 1.8;
  margin-bottom: var(--spacing-xl);
  max-width: 260px;
  letter-spacing: 0.5px;
  color: #606160;
`

const SectionTitle = styled(motion.h2)`
  font-weight: var(--font-weight-regular);
  font-size: 1rem;
  letter-spacing: 10px;
  color: #b3a392;
  font-weight: 700;
`

const InputContainer = styled(motion.div)`
  width: 100%;
  margin-bottom: var(--spacing-lg);
  margin-top: 5px;
`

const StyledInput = styled.input`
  width: 100%;
  height: 30px;
  padding: var(--spacing-md);
  border: 1px solid rgb(174, 175, 195);
  background-color: transparent;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: var(--font-weight-light);
  letter-spacing: 10px;
  text-align: center;
  
  &::placeholder {
    color: #929292;
    font-weight: 500;
    font-size: 12px;
  }
  
  &:focus {
    outline: none;
    border-color: var(--color-accent);
  }
`

const SubmitButton = styled(motion.button)`
  background-color: rgb(174, 175, 195);
  color: white;
  border: none;
  border-radius: 4px;
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: 0.9rem;
  font-weight: var(--font-weight-regular);
  cursor: pointer;
  transition: background-color var(--transition-fast);
  height: 15px;
  width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: var(--color-accent-dark);
  }
  
  &:disabled {
    background-color: var(--color-accent-light);
    cursor: not-allowed;
    opacity: 0.7;
  }
`

const WelcomePage = () => {
  const navigate = useNavigate()
  const { userQuestion, setUserQuestion } = useAppContext()
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bgLoaded, setBgLoaded] = useState(false)
  
  // 預加載背景圖片
  useEffect(() => {
    const img = new Image();
    img.src = '/images/stone_bg.png';
    img.onload = () => setBgLoaded(true);
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Check if userQuestion is empty or only contains whitespace
    if (!userQuestion.trim()) {
      alert('請輸入心中問題')
      return
    }
    
    setIsSubmitting(true)
    
    // Delay navigation to allow exit animation to complete
    setTimeout(() => {
      navigate('/stone-selection')
    }, 800)
  }
  
  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    > 
      <LogoContainer
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.2 }}
      >
        <LogoImage src="/images/intro_icon.png" alt="Logo" />
      </LogoContainer>
      
      <Title
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2.2, delay: 1, ease: "easeOut" }}
      >
        北歐神話眾神之父<br/>奧丁的祝福符文
      </Title>
      
      <Description
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2.5, delay: 2, ease: "easeOut" }}
      >
        為我們帶來洞見，讓我們看見真實。<br/>
        用心聆聽盧恩的訊息。<br/>
        透過符文的智慧，<br/>
        建議將如其所是的呈現～<br/><br/>
        讓盧恩符文為我們燃起心中的光，<br/>
        點亮未來之路。
      </Description>
      
      <SectionTitle
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 3 }}
      >
        解惑之路
      </SectionTitle>
      
      <form onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <InputContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          whileTap={{ scale: 0.98 }}
        >
          <StyledInput
            type="text"
            placeholder="請輸入心中問題"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
          />
        </InputContainer>
        
        <AnimatePresence>
          <SubmitButton
            type="submit"
            disabled={isSubmitting}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSubmitting ? '尋求中...' : '提交'}
          </SubmitButton>
        </AnimatePresence>
      </form>
    </PageContainer>
  )
}

export default WelcomePage
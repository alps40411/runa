import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

import CircleSymbol from '../components/symbols/CircleSymbol'
import { sendMessageToChat } from '../utils/liff'

const PageContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  text-align: center;
  position: relative;
  overflow: hidden;
  width: 100%;
  background-image: url('/images/stone_bg.png');
  background-size: 100% auto;
  background-position: center;
  padding: 20px 15px;
  box-sizing: border-box;
  background-color: #f8f8f5;
  will-change: opacity, transform;
`;

const BackButton = styled(motion.button)`
  position: absolute;
  top: var(--spacing-lg);
  left: var(--spacing-lg);
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:before {
    content: "←";
    margin-right: var(--spacing-xs);
  }
`;

const Title = styled(motion.h1)`
  font-weight: var(--font-weight-medium);
  font-size: 1.2rem;
  margin-top: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-primary);
`;

const AnalysisContainer = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(200, 188, 167, 0.3);
  border-radius: 8px;
  padding: var(--spacing-xl);
  max-width: 340px;
  width: 100%;
  margin-bottom: var(--spacing-xl);
  position: relative;
  text-align: left;
  max-height: calc(100vh - 300px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(200, 188, 167, 0.3);
    border-radius: 2px;
  }
  
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/src/assets/paper-texture.png');
    background-size: cover;
    opacity: 0.1;
    pointer-events: none;
    z-index: -1;
    border-radius: 8px;
  }
`;

const AnalysisText = styled.div`
  font-size: 0.95rem;
  line-height: 1.8;
  color: var(--color-text-primary);
  white-space: pre-wrap;
  word-break: break-word;
  letter-spacing: 0.5px;
`;

const ErrorText = styled(motion.div)`
  color: #ff6b6b;
  font-size: 0.9rem;
  max-width: 300px;
  text-align: center;
  margin-top: var(--spacing-md);
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
  margin-top: 30%;
`;

const ImagesContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 10px;
  width: 100%;
  perspective: 1000px;
`;

const ImageItem = styled(motion.img)`
  width: 80px;
  height: 80px;
  object-fit: contain;
  background-color: #f9f9f9; /* 卡片背景色 */
  border-radius: 10px; /* 圓角 */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
  transform-style: preserve-3d;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
  }
`;

const SymbolContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LoadingText = styled(motion.div)`
  margin-top: var(--spacing-md);
  font-weight: var(--font-weight-light);
  color: var(--color-text-secondary);
  letter-spacing: 2px;
  text-align: center;
`;

const CirclesWrapper = styled(motion.div)`
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OuterCircle = styled.div`
  position: absolute;
`;

const TypewriterText = ({ htmlContent, delay = 70, onComplete }) => {
  const [displayedHTML, setDisplayedHTML] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const textRef = useRef('');
  const positionRef = useRef(0);
  const htmlWithoutTagsRef = useRef('');
  
  // Extract text without HTML tags on first render
  useEffect(() => {
    // Create a temporary div to handle HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    htmlWithoutTagsRef.current = tempDiv.textContent || '';
    textRef.current = htmlContent;
  }, [htmlContent]);
  
  useEffect(() => {
    if (positionRef.current >= htmlWithoutTagsRef.current.length) {
      setIsComplete(true);
      if (onComplete) onComplete();
      return;
    }
    
    const timer = setTimeout(() => {
      positionRef.current += 1;
      
      // Find the position in the original HTML
      let plainTextPosition = 0;
      let htmlPosition = 0;
      let inTag = false;
      let currentPlainTextPos = 0;
      
      while (currentPlainTextPos < positionRef.current && htmlPosition < textRef.current.length) {
        const char = textRef.current[htmlPosition];
        
        if (char === '<') {
          inTag = true;
        } else if (char === '>') {
          inTag = false;
        } else if (!inTag) {
          currentPlainTextPos++;
        }
        
        htmlPosition++;
      }
      
      setDisplayedHTML(textRef.current.substring(0, htmlPosition));
    }, delay);
    
    return () => clearTimeout(timer);
  }, [displayedHTML, delay, onComplete]);
  
  return <div dangerouslySetInnerHTML={{ __html: displayedHTML }} />;
};

const AnalysisPage = () => {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const { result } = useAppContext();

  const handleImageClick = async (pushText) => {
    try {
      await sendMessageToChat(pushText);
    } catch (error) {
      console.error('測試訊息發送失敗:', error);
    }
  };

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch(`/api/explanation/?ai_token=${result.ai_token}&cdr_pk=${result.cdr_pk}&question=${encodeURIComponent(result.question)}`, {
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
        setAnalysis(data.explanation || '暫無分析結果');
        setIsLoading(false);
      } catch (error) {
        console.error('解析擷取錯誤:', error);
        setError('無法取得分析結果，請稍後再試。');
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <BackButton
        onClick={() => navigate('/reading')}
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.95 }}
      >
        返回
      </BackButton>

      <Title
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        深度解析
      </Title>

      {isLoading ? (
        <LoadingContainer>
          <SymbolContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <CirclesWrapper
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <OuterCircle style={{ transform: 'translate(-50%, -50%) rotate(0deg) translateX(40px)' }}>
                <CircleSymbol size={30} withInnerCircle={false} />
              </OuterCircle>
              <OuterCircle style={{ transform: 'translate(-50%, -50%) rotate(120deg) translateX(40px)' }}>
                <CircleSymbol size={30} withInnerCircle={false} />
              </OuterCircle>
              <OuterCircle style={{ transform: 'translate(-50%, -50%) rotate(240deg) translateX(40px)' }}>
                <CircleSymbol size={30} withInnerCircle={false} />
              </OuterCircle>
              <CircleSymbol size={50} />
            </CirclesWrapper>
            
            <LoadingText
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.8, 1] }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                repeatType: "reverse",
                ease: "easeInOut",
                times: [0, 0.4, 0.7, 1] 
              }}
            >
              解讀神諭中...
            </LoadingText>
          </SymbolContainer>
        </LoadingContainer>
      ) : error ? (
        <>
          <ErrorText
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {error}
          </ErrorText>
          <motion.button
            onClick={() => window.location.reload()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              marginTop: 'var(--spacing-lg)',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              border: '1px solid var(--color-text-secondary)',
              borderRadius: '4px',
              background: 'transparent',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer'
            }}
          >
            重試
          </motion.button>
        </>
      ) : (
        <>
          <AnalysisContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <AnalysisText>
              <TypewriterText 
                htmlContent={analysis} 
                delay={70} 
                onComplete={() => setIsTypingComplete(true)} 
              />
            </AnalysisText>
          </AnalysisContainer>
          
          <AnimatePresence>
            {isTypingComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ width: '100%' }}
              >
                <ImagesContainer>
                  {result.footer && result.footer.length > 0 ? (
                    result.footer.map((image, index) => (
                      <ImageItem 
                        key={index}
                        src={image.image} 
                        alt={image.push_text || 'Image'}
                        onClick={() => handleImageClick(image.push_text)}
                        initial={{ y: 40, opacity: 0, rotateY: -10, rotateX: 5 }}
                        animate={{ 
                          y: 0, 
                          opacity: 1,
                          rotateY: 0,
                          rotateX: 5,
                          z: 20,
                          transition: { 
                            duration: 0.8,
                            delay: 0.1 * (index + 1)
                          }
                        }}
                        whileHover={{ 
                          scale: 1.1, 
                          y: -5,
                          rotateX: 10,
                          boxShadow: "0 20px 30px rgba(0, 0, 0, 0.25)" 
                        }}
                        whileTap={{ scale: 0.95 }}
                      />
                    ))
                  ) : (
                    // Fallback image if API doesn't return any
                    <ImageItem 
                      src="/images/tutor.png" 
                      alt="Tutor"
                      onClick={() => handleImageClick('深度解析結果')}
                      initial={{ y: 40, opacity: 0, rotateY: -10, rotateX: 5 }}
                      animate={{ 
                        y: 0, 
                        opacity: 1,
                        rotateY: 0,
                        rotateX: 5,
                        z: 20,
                        transition: { 
                          duration: 0.8,
                          delay: 0.1
                        }
                      }}
                      whileHover={{ 
                        scale: 1.1, 
                        y: -5,
                        rotateX: 10,
                        boxShadow: "0 20px 30px rgba(0, 0, 0, 0.25)" 
                      }}
                      whileTap={{ scale: 0.95 }}
                    />
                  )}
                </ImagesContainer>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </PageContainer>
  );
};

export default AnalysisPage;
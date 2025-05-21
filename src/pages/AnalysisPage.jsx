import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import TriangleSymbol from '../components/symbols/TriangleSymbol';
import CircleSymbol from '../components/symbols/CircleSymbol';

const PageContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding: var(--spacing-xl) var(--spacing-md);
  text-align: center;
  position: relative;
  overflow: hidden;
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
  margin-top: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
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

const AnalysisText = styled.p`
  font-weight: var(--font-weight-light);
  line-height: 1.8;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
  color: var(--color-text-primary);
  white-space: pre-wrap;
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
`;

const LoadingText = styled(motion.div)`
  color: var(--color-text-secondary);
  font-size: 0.9rem;
`;

const BackgroundSymbols = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
`;

const TopLeftSymbol = styled.div`
  position: absolute;
  top: 100px;
  left: 20px;
  opacity: 0.4;
`;

const BottomRightSymbol = styled.div`
  position: absolute;
  bottom: 100px;
  right: 30px;
  opacity: 0.4;
`;

const AnalysisPage = () => {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch('https://ffsystem.ngrok.io/card/api/gacha/explanation/?ai_token=hIkm8WQ4Vv&cdr_pk=850&stream=false', {
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
        setAnalysis(data.content || '無法取得解析內容');
        setIsLoading(false);
      } catch (error) {
        console.error('解析擷取錯誤:', error);
        setError('無法取得解析，請稍後再試。');
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
      <BackgroundSymbols>
        <TopLeftSymbol>
          <CircleSymbol size={40} animate={false} />
        </TopLeftSymbol>
        <BottomRightSymbol>
          <CircleSymbol size={36} animate={false} />
        </BottomRightSymbol>
      </BackgroundSymbols>

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
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <TriangleSymbol size={60} />
          </motion.div>
          <LoadingText
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            解讀神諭中...
          </LoadingText>
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
        <AnalysisContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <AnalysisText>{analysis}</AnalysisText>
        </AnalysisContainer>
      )}
    </PageContainer>
  );
};

export default AnalysisPage;
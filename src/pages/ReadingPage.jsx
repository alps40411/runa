import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import CircleSymbol from '../components/symbols/CircleSymbol'

const PageContainer = styled(motion.div)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--color-background);
  padding: var(--spacing-xl) var(--spacing-md);
  position: relative;
  width: 100%;
  background-image: url('/images/stone_bg.png');
  background-size: contain;
  background-position: center;
  padding: 40px 20px;
  box-sizing: border-box;
  background-color: #f8f8f5;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-top: 80px;
  margin-bottom: var(--spacing-xl);
  width: 100%;
  max-width: 340px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: var(--spacing-lg);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(200, 188, 167, 0.3);
`;

const Card = styled(motion.div)`
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
`;

const CardImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 1.2s ease-in-out;
  transition-delay: ${props => props.animationDelay}s;
`;

const CardImagePlaceholder = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 4px;
  background-color: rgba(200, 200, 200, 0.3);
  position: absolute;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
`;

const CardInfo = styled.div`
  flex: 1;
`;

const CardTitle = styled.h3`
  font-size: 1.1rem;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
  font-weight: var(--font-weight-medium);
`;

const CardDescription = styled.p`
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.4;
`;

const Question = styled.div`
  font-size: 1.1rem;
  color: #606160;
  margin-bottom: var(--spacing-xl);
  font-weight: var(--font-weight-medium);
`;

const ActionButton = styled(motion.button)`
  background-color: white;
  color: var(--color-text-primary);
  border: none;
  border-radius: 8px;
  padding: var(--spacing-md);
  font-size: 0.9rem;
  width: 100%;
  max-width: 340px;
  margin-bottom: var(--spacing-md);
  cursor: pointer;
  font-weight: var(--font-weight-light);
`;

const AnalysisButton = styled(motion.button)`
  background-color: var(--color-accent);
  color: white;
  border: none;
  border-radius: 8px;
  padding: var(--spacing-md);
  font-size: 0.9rem;
  width: 100%;
  max-width: 340px;
  opacity: 0.8;
  cursor: pointer;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: var(--spacing-md);
`;

const SymbolContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LoadingText = styled(motion.div)`
  margin-top: var(--spacing-lg);
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

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
`;

const ModalContent = styled(motion.div)`
  background: var(--color-background);
  padding: var(--spacing-xl);
  border-radius: 12px;
  max-width: 320px;
  width: 90%;
  text-align: center;
  position: relative;
  border: 1px solid rgba(200, 188, 167, 0.3);
`;

const ModalText = styled.p`
  color: var(--color-text-primary);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: var(--spacing-xl);
`;

const ModalButtonContainer = styled.div`
  display: flex;
  gap: var(--spacing-md);
`;

const ModalButton = styled(motion.button)`
  flex: 1;
  padding: var(--spacing-md);
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  
  ${props => props.primary ? `
    background-color: var(--color-accent);
    color: white;
  ` : `
    background-color: transparent;
    border: 1px solid var(--color-text-secondary);
    color: var(--color-text-secondary);
  `}
`;

// 付款 Modal 樣式
const PaymentModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
  backdrop-filter: blur(5px);
`;

const PaymentModalContent = styled(motion.div)`
  background: white;
  border-radius: 12px;
  max-width: 90vw;
  max-height: 90vh;
  width: 800px;
  height: 600px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const PaymentModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e5e5;
  background: #f8f9fa;
  border-radius: 12px 12px 0 0;
`;

const PaymentModalTitle = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 5px;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background: #e9ecef;
    color: #333;
  }
`;

const PaymentModalBody = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const PaymentIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

// 狀態檢查 Modal 樣式
const StatusCheckModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1002;
  backdrop-filter: blur(3px);
`;

const StatusCheckModalContent = styled(motion.div)`
  background: var(--color-background);
  padding: var(--spacing-xl);
  border-radius: 12px;
  max-width: 320px;
  width: 90%;
  text-align: center;
  position: relative;
  border: 1px solid rgba(200, 188, 167, 0.3);
`;

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const StatusIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 15px;
  
  ${props => {
    if (props.status === 'loading') return 'color: #007bff;';
    if (props.status === 'success') return 'color: #28a745;';
    if (props.status === 'failed') return 'color: #dc3545;';
    return 'color: #6c757d;';
  }}
`;

const StatusText = styled.h3`
  margin: 0 0 10px 0;
  color: var(--color-text-primary);
  font-size: 1.1rem;
`;

const StatusDescription = styled.p`
  margin: 0 0 20px 0;
  color: var(--color-text-secondary);
  text-align: center;
  line-height: 1.5;
  font-size: 0.9rem;
`;

const LoadingSpinner = styled.div`
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const StatusButton = styled.button`
  background: var(--color-accent);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
  
  &:hover {
    opacity: 0.9;
  }
`;

const ReadingPage = () => {
  const navigate = useNavigate();
  const { 
    userQuestion, 
   
    setAiToken,

    result,
  } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const [animationComplete, setAnimationComplete] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  
  // 付款相關狀態
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentHtml, setPaymentHtml] = useState('');
  const [sn, setSn] = useState('');
  
  // 狀態檢查相關
  const [showStatusCheckModal, setShowStatusCheckModal] = useState(false);
  const [statusCheckState, setStatusCheckState] = useState('idle'); // idle, checking, success, failed

  // 預加載圖片
  useEffect(() => {
    if (result?.card) {
      const preloadImages = () => {
        result.card.forEach((card, index) => {
          if (card.image) {
            const img = new Image();
            img.onload = () => {
              setLoadedImages(prev => ({
                ...prev,
                [index]: true
              }));
            };
            img.src = card.image;
          }
        });
      };
      
      preloadImages();
    }
  }, [result]);
  
  const handleAnalysisClick = () => {
    if (hasToken) {
      navigate('/analysis');
    } else {
      setShowModal(true);
    }
  };
  
  // 檢查付款狀態的 API
  const checkPaymentStatus = async () => {
    try {
      setStatusCheckState('checking');
      const response = await fetch(`/api/card/api/gacha/get_ai_token/?cdr_pk=${result.cdr_pk}&sn=${sn}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        setStatusCheckState('failed');
        throw new Error(`Status check failed (${response.status})`);
      } else {
        setStatusCheckState('success');
      }

      const data = await response.json();
      setAiToken(data.data.ai_token);
      return data;
    } catch (error) {
      console.error('Payment status check error:', error);
      setStatusCheckState('failed');
      return null;
    }
  };

  // 主要付款處理函數
  const handlePayment = async () => {
    if (!result?.cdr_pk) {
      alert('系統錯誤：無法取得卡片資訊');
      return;
    }

    try {
      setShowPaymentModal(true);
      setShowModal(false);
      
      // Get payment URL
      const response = await fetch(`/api/card/api/gacha/get_ai_token/?cdr_pk=${result.cdr_pk}&vendor_code=NewebPay`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Payment initiation failed (${response.status})`);
      } 
      
      const data = await response.json();
      setSn(data.data.sn);

      // 處理付款頁面
      if (data.data && data.data.html) {
        setPaymentHtml(data.data.html);
      } else {
        console.error('API 回應中沒有 data 字段:', data);
        throw new Error('無法取得付款頁面資訊');
      }

    } catch (error) {
      console.error('Payment error:', error);
      alert('付款過程發生錯誤，請稍後再試。');
      setShowPaymentModal(false);
    }
  };

  // 關閉付款 modal 並開始狀態檢查
  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    
    // 如果有 sn，表示已經發起付款，需要檢查狀態
    if (sn) {
      setShowStatusCheckModal(true);
      setStatusCheckState('checking'); // 立即設置為檢查中狀態
      checkPaymentStatus();
    }
    
    // 重置付款相關狀態
    setPaymentHtml('');
  };

  // 關閉狀態檢查 modal
  const handleCloseStatusCheckModal = () => {
    setShowStatusCheckModal(false);
    setStatusCheckState('idle');
  };

  // 重新檢查狀態
  const handleRetryStatusCheck = () => {
    setStatusCheckState('idle');
    handleCloseStatusCheckModal();
  };

  // 狀態檢查 Modal 內容
  const getStatusCheckContent = () => {
    switch (statusCheckState) {
      case 'checking':
        return (
          <StatusContainer>
            <LoadingSpinner />
            <StatusText>正在檢查付款狀態...</StatusText>
            <StatusDescription>
              請稍候，正在確認您的付款結果
            </StatusDescription>
          </StatusContainer>
        );
      
      case 'success':
        return (
          <StatusContainer>
            <StatusIcon status="success">✓</StatusIcon>
            <StatusText>付款成功！</StatusText>
            <StatusDescription>
              恭喜您完成付款，正在為您開啟深度解析功能...
            </StatusDescription>
            <StatusButton 
              onClick={() => {
                
                navigate('/analysis');
              }}
              style={{ marginTop: '10px' }}
            >
              前往深度解析
            </StatusButton>
          </StatusContainer>
        );
      
      case 'failed':
        return (
          <StatusContainer>
            <StatusIcon status="failed">✗</StatusIcon>
            <StatusText>未檢測到付款</StatusText>
            <StatusDescription>
              如果您已完成付款，請稍後再檢查，或聯繫客服協助處理
            </StatusDescription>
            <StatusButton onClick={handleRetryStatusCheck}>
              重新檢查
            </StatusButton>
          </StatusContainer>
        );
      
      default:
        return null;
    }
  };
  
  if (loading) {
    return (
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
          解讀符文...
        </LoadingText>
      </SymbolContainer>
      </LoadingContainer>
    );
  }

  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <CardsContainer>
        {result?.card.map((card, index) => (
          <Card
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5,
              delay: index * 0.15,
              ease: "easeOut"
            }}
            onAnimationComplete={() => {
              setAnimationComplete(prev => ({
                ...prev,
                [index]: true
              }));
            }}
          >
            <ImageContainer>
              {!loadedImages[index] && <CardImagePlaceholder />}
              <CardImage 
                src={card.image} 
                alt={card.name} 
                isVisible={loadedImages[index] && animationComplete[index]}
                loading="eager"
                animationDelay={0.3}
                onLoad={() => {
                  setLoadedImages(prev => ({
                    ...prev,
                    [index]: true
                  }));
                }}
              />
            </ImageContainer>
            <CardInfo>
              <CardTitle>[{card.name}]</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardInfo>
          </Card>
        ))}
      </CardsContainer>

      <Question>
        {userQuestion}
      </Question>

      <ActionButton
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        分享好友
      </ActionButton>

      <AnalysisButton
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAnalysisClick}
      >
        深度解析
      </AnalysisButton>

      {/* 原有的充值確認 Modal */}
      <AnimatePresence>
        {showModal && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <ModalText>
                噢噢～目前的 Aiya 幣餘額好像有點不夠耶！是否進行充值，解鎖下一個遊戲任務？
              </ModalText>
              <ModalButtonContainer>
                <ModalButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(false)}
                >
                  我再想想
                </ModalButton>
                <ModalButton
                  primary
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePayment}
                >
                  立即充值
                </ModalButton>
              </ModalButtonContainer>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* 付款 Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <PaymentModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PaymentModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <PaymentModalHeader>
                <PaymentModalTitle>付款頁面</PaymentModalTitle>
                <CloseButton onClick={handleClosePaymentModal}>
                  ×
                </CloseButton>
              </PaymentModalHeader>
              
              <PaymentModalBody>
                {paymentHtml && (
                  <PaymentIframe
                    srcDoc={paymentHtml}
                    title="付款頁面"
                    sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation allow-popups"
                  />
                )}
              </PaymentModalBody>
            </PaymentModalContent>
          </PaymentModalOverlay>
        )}
      </AnimatePresence>

      {/* 狀態檢查 Modal */}
      <AnimatePresence>
        {showStatusCheckModal && (
          <StatusCheckModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <StatusCheckModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {getStatusCheckContent()}
            </StatusCheckModalContent>
          </StatusCheckModalOverlay>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default ReadingPage;
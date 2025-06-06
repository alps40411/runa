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

const ReadingPage = () => {
  const navigate = useNavigate();
  const { 
    userQuestion, 
    result,
  } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const [animationComplete, setAnimationComplete] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [hasToken, setHasToken] = useState(false);

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
  
  const handlePayment = async () => {
    console.log(result);
    if (!result.cdr_pk) {
      alert('系統錯誤：無法取得卡片資訊');
      return;
    }

    try {
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
      // console.log(data);
      
      // 處理付款頁面
      if (data.data) {
        // 嘗試在新視窗中開啟付款頁面
        const newWindow = window.open('', '_blank', 'width=800,height=600');
        
        if (newWindow && !newWindow.closed) {
          // 成功開啟新視窗
          newWindow.document.write(data.data.html);
          newWindow.document.close();
          setShowModal(false);
        } else {
          // 彈出視窗被阻擋，使用當前頁面跳轉
          // console.log('彈出視窗被阻擋，在當前頁面開啟付款頁面');
          
          // 創建臨時的 blob URL
          const blob = new Blob([data.data], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          
          // 在當前頁面跳轉到付款頁面
          window.location.href = url;
          
          // 清理 blob URL（延遲清理以確保跳轉完成）
          setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 1000);
        }
        
      } else {
        console.error('API 回應中沒有 data 字段:', data);
        throw new Error('無法取得付款頁面資訊');
      }

    } catch (error) {
      console.error('Payment error:', error);
      alert('付款過程發生錯誤，請稍後再試。');
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
    </PageContainer>
  );
};

export default ReadingPage;

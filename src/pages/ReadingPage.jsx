import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const PageContainer = styled(motion.div)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--color-background);
  padding: var(--spacing-xl) var(--spacing-md);
  position: relative;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
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

const LoadingText = styled.div`
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  text-align: center;
`;

const LoadingSymbol = styled(motion.div)`
  width: 60px;
  height: 60px;
  border: 2px solid var(--color-symbol);
  border-radius: 50%;
  border-top-color: transparent;
`;

// Modal styles
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
  const { userQuestion } = useAppContext();
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [hasToken, setHasToken] = useState(false); // This would be set based on your token validation logic

  useEffect(() => {
    const staticData = {
      "card": [
        {
          "description": "帶來好運，增加時薪，度過難關，靈性突破，帶來創意",
          "name": "KENAZ",
          "image": "https://react-fflinebot.s3.amazonaws.com/img/Rune/17-4.jpg",
          "main_title": "KENAZ",
          "sub_title": ""
        },
        {
          "description": "增強投資直覺，增強預知能力",
          "name": "ALGIZ",
          "image": "https://react-fflinebot.s3.amazonaws.com/img/Rune/23-1.jpg",
          "main_title": "ALGIZ",
          "sub_title": ""
        },
        {
          "description": "增強靈性成長，強化個人力量",
          "name": "JERA",
          "image": "https://react-fflinebot.s3.amazonaws.com/img/Rune/25-1.jpg",
          "main_title": "JERA",
          "sub_title": ""
        }
      ],
      "question": "本月運勢",
      "ai_token": null // Simulating no token
    };

    setTimeout(() => {
      setReading(staticData);
      setHasToken(!!staticData.ai_token);
      setLoading(false);
    }, 1500);
  }, []);

  const handleAnalysisClick = () => {
    if (hasToken) {
      navigate('/analysis');
    } else {
      setShowModal(true);
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSymbol
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <LoadingText>解讀符文中...</LoadingText>
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
        {reading?.card.map((card, index) => (
          <Card
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <CardImage src={card.image} alt={card.name} />
            <CardInfo>
              <CardTitle>[{card.name}]</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardInfo>
          </Card>
        ))}
      </CardsContainer>

      <ActionButton
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {userQuestion || reading?.question}
      </ActionButton>

      <ActionButton
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/')}
      >
        再次觀問
      </ActionButton>

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
        深度解析（需等約30秒）
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
                  onClick={() => {
                    // Handle recharge logic here
                    setShowModal(false);
                  }}
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
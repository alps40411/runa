import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from 'swiper/modules';
import { useAppContext } from '../context/AppContext';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

const PageContainer = styled(motion.div)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--color-background);
  padding: var(--spacing-xl) var(--spacing-md);
  position: relative;
`;

const Title = styled.h2`
  font-size: 1rem;
  color: var(--color-text-primary);
  text-align: center;
  margin-bottom: var(--spacing-xl);
  font-weight: var(--font-weight-light);
  letter-spacing: 1px;
`;

const SelectedStonesContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: var(--spacing-xl);
`;

const StoneSlot = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${props => props.image ? 'transparent' : 'rgba(200, 188, 167, 0.1)'};
  border: 1px dashed var(--color-text-secondary);
  background-image: ${props => props.image ? `url(${props.image})` : 'none'};
  background-size: cover;
  background-position: center;
`;

const StoneGalleryContainer = styled.div`
  width: 100%;
  height: 400px;
  margin-bottom: var(--spacing-xl);
  overflow: hidden;

  .swiper {
    width: 100%;
    height: 100%;
    padding: 50px 0;
  }

  .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 160px;
    height: 160px;
    transition: transform 0.3s ease;

    &-active {
      transform: scale(1.2);
    }

    &-prev, &-next {
      transform: scale(0.8);
    }
  }
`;

const Stone = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  cursor: pointer;
  opacity: ${props => props.isSelected ? 0.5 : 1};
  transition: all var(--transition-fast);
`;

const QuestionContainer = styled.div`
  width: 100%;
  max-width: 280px;
  text-align: center;
  margin-bottom: var(--spacing-xl);
`;

const QuestionText = styled.div`
  font-size: 0.9rem;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
`;

const ConfirmButton = styled(motion.button)`
  background-color: var(--color-accent);
  color: white;
  border: none;
  border-radius: 4px;
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: 0.9rem;
  width: 100%;
  opacity: ${props => props.disabled ? 0.5 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
`;

const StoneSelectionPage = () => {
  const navigate = useNavigate();
  const { userQuestion } = useAppContext();
  const [selectedStones, setSelectedStones] = useState([]);
  
  const stones = Array.from({ length: 25 }, (_, index) => ({
    id: index + 1,
    image: `/src/assets/stones/stone${(index % 5) + 1}.png`
  }));

  const handleStoneClick = (stoneId) => {
    if (selectedStones.includes(stoneId)) {
      setSelectedStones(prev => prev.filter(id => id !== stoneId));
    } else if (selectedStones.length < 3) {
      setSelectedStones(prev => [...prev, stoneId]);
    }
  };

  const handleConfirm = () => {
    if (selectedStones.length === 3) {
      navigate('/reading');
    }
  };

  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Title>請依直覺點選3張牌</Title>
      
      <SelectedStonesContainer>
        {[0, 1, 2].map((index) => (
          <StoneSlot 
            key={index}
            image={selectedStones[index] ? `/src/assets/stones/stone${(selectedStones[index] % 5) + 1}.png` : null}
          />
        ))}
      </SelectedStonesContainer>

      <StoneGalleryContainer>
        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={3}
          initialSlide={12}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 250,
            modifier: 1.5,
            slideShadows: false,
          }}
          modules={[EffectCoverflow]}
        >
          {stones.map((stone) => (
            <SwiperSlide key={stone.id}>
              <Stone
                image={stone.image}
                isSelected={selectedStones.includes(stone.id)}
                onClick={() => handleStoneClick(stone.id)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </StoneGalleryContainer>

      <QuestionContainer>
        <QuestionText>解惑之路</QuestionText>
        <QuestionText>{userQuestion || '還沒告訴我要問什麼？'}</QuestionText>
        <ConfirmButton
          disabled={selectedStones.length !== 3}
          onClick={handleConfirm}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          確認
        </ConfirmButton>
      </QuestionContainer>
    </PageContainer>
  );
};

export default StoneSelectionPage;
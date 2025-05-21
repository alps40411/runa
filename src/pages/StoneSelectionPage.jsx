import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
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
  justify-content: center;
  position: relative;
  overflow: hidden;
  width: 100%;
  background-image: url('/images/stone_bg.jpg');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  padding: 40px 20px;
  box-sizing: border-box;
  background-color: #f8f8f5;
`;

const Title = styled.h2`
  font-size: 1rem;
  color: var(--color-text-primary);
  text-align: center;
  font-weight: var(--font-weight-light);
  letter-spacing: 1px;
  color: #5b5c5b;
`;

const SelectedStonesContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
`;

const StoneSlot = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: ${props => props.image ? 'transparent' : '#cdcdc9'};
  background-image: ${props => props.image ? `url(${props.image})` : 'none'};
  background-size: cover;
  background-position: center;
  margin-top: 20px;
`;

const StoneGalleryContainer = styled.div`
  width: 100%;
  height: 300px;
  margin-top: 40px;
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
    width: 180px;
    height: 180px;
    transition: transform 0.3s ease;

    &-active {
      transform: scale(1.6);
      z-index: 10;
    }

    &-prev, &-next {
      transform: scale(0.9);
      opacity: 0.7;
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
  outline: none;
  -webkit-tap-highlight-color: transparent;
`;

const SectionTitle = styled(motion.h2)`
  font-weight: var(--font-weight-regular);
  font-size: 1rem;
  letter-spacing: 10px;
  color: #b3a392;
  font-weight: 700;
`

const InputContainer = styled(motion.div)`
  width: 120%;
  margin-bottom: var(--spacing-lg);
  margin-top: 5px;
`

const StyledInput = styled.input`
  width: 100%;
  height: 30px;
  padding: var(--spacing-md);
  border: 1px solid var(--color-text-secondary);
  background-color: transparent;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: var(--font-weight-light);
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
  background-color: var(--color-accent);
  color: white;
  border: none;
  border-radius: 4px;
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: 0.9rem;
  font-weight: var(--font-weight-regular);
  cursor: pointer;
  transition: background-color var(--transition-fast);
  height: 30px;
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

const StoneSelectionPage = () => {
  const navigate = useNavigate();
  const { userQuestion } = useAppContext();
  const [selectedStones, setSelectedStones] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeIndex, setActiveIndex] = useState(12);
  
  const stones = Array.from({ length: 25 }, (_, index) => ({
    id: index + 1,
    image: `/images/stone${(index % 5) + 1}.png`
  }));

  const handleStoneClick = (stoneId) => {
    if (selectedStones.includes(stoneId)) {
      setSelectedStones(prev => prev.filter(id => id !== stoneId));
    } else if (selectedStones.length < 3) {
      setSelectedStones(prev => [...prev, stoneId]);
    }
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (selectedStones.length === 3) {
      navigate('/reading');
    } else {
      alert('請選擇3張牌');
    }
  };

  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <SelectedStonesContainer>
        {[0, 1, 2].map((index) => (
          <StoneSlot 
            key={index}
            image={selectedStones[index] ? `/images/stone${(selectedStones[index] % 5) + 1}.png` : null}
          />
        ))}
      </SelectedStonesContainer>

      <Title>請依直覺點選3張牌</Title>

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
            modifier: 2,
            slideShadows: false,
          }}
          modules={[EffectCoverflow]}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        >
          {stones.map((stone, index) => (
            <SwiperSlide key={stone.id}>
              <Stone
                image={stone.image}
                isSelected={selectedStones.includes(stone.id)}
                isActive={index === activeIndex}
                onClick={() => handleStoneClick(stone.id)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </StoneGalleryContainer>

      <SectionTitle
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        解惑之路
      </SectionTitle>
      
      <form onSubmit={handleConfirm}
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
            placeholder="請輸入心中的問題"
            value={userQuestion}
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
  );
};

export default StoneSelectionPage;
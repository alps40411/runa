import React, { useState, useEffect } from 'react';
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
  background-image: url('/images/stone_bg.png');
  background-size: contain;
  background-position: center;
  padding: 40px 20px;
  box-sizing: border-box;
  background-color: #f8f8f5;
`;

const Title = styled.h1`
  font-weight: var(--font-weight-medium);
  font-size: 1rem;
  line-height: 1.6;
  text-align: center;
  letter-spacing: 4px;
  color: #5b5c5b;
`;

const SelectedStonesContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
`;

const StoneSlot = styled(motion.div)`
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
  margin-bottom: var(--spacing-xl);
  overflow: hidden;
  position: relative;
  
  /* 增加内容区域宽度，确保5颗石头完全显示 */
  padding: 0 5%;
  box-sizing: border-box;

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
    transition: transform 0.3s ease, opacity 0.3s ease, visibility 0s;
    
    /* 所有石头默认设置，即使是隐藏的也预先设置好位置 */
    &:nth-child(odd) {
      margin-top: 100px;
    }
    &:nth-child(even) {
      margin-top: 40px;
    }

    &-active, &[data-position="active"] {
      transform: scale(1.8); /* 保持原始大小 */
      z-index: 10;
      margin-top: 0 !important;
    }

    &-prev, &[data-position="prev"],
    &-next, &[data-position="next"] {
      transform: scale(0.9); /* 保持原始大小 */
      opacity: 0.7;
      margin-top: 40px !important;
    }
    
    &[data-position="prev-prev"],
    &[data-position="next-next"] {
      transform: scale(0.7); /* 保持原始大小 */
      opacity: 0.6;
      margin-top: 100px !important;
    }
    
    /* 隐藏其他石头，但保持位置 */
    &[data-position="hidden"] {
      visibility: hidden;
      /* 保持原始transform，不要改变大小 */
      transform: scale(0.7); 
      opacity: 0;
    }
  }
`;

const Stone = styled.div`
  width: 120%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  opacity: ${props => props.isSelected ? 0.5 : 1};
  transition: all var(--transition-fast);
  outline: none;
  -webkit-tap-highlight-color: transparent;
  overflow: visible;
  
  &::before {
    content: none;
  }
`;

const StoneImage = styled.img`
  width: 120%;
  position: relative;
  z-index: 1;
`;

const SectionTitle = styled(motion.h2)`
  font-weight: var(--font-weight-regular);
  font-size: 1rem;
  letter-spacing: 10px;
  color: #b3a392;
  font-weight: 700;
`

const InputContainer = styled(motion.div)`
  width: 130%;
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

const TypewriterText = ({ text, delay = 70, startDelay = 0 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    let timeout;
    
    if (currentIndex <= text.length) {
      timeout = setTimeout(() => {
        setDisplayText(text.substring(0, currentIndex));
        setCurrentIndex(currentIndex + 1);
      }, currentIndex === 0 ? startDelay : delay);
    }
    
    return () => clearTimeout(timeout);
  }, [currentIndex, text, delay, startDelay]);
  
  return <span>{displayText}</span>;
};

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
            animate={
              selectedStones[index] 
                ? {
                    opacity: [0.7, 1, 0.7],
                    boxShadow: [
                      '0 0 5px rgba(255, 255, 255, 0.3)',
                      '0 0 15px rgba(255, 255, 255, 0.7)',
                      '0 0 5px rgba(255, 255, 255, 0.3)'
                    ]
                  } 
                : {
                    opacity: [0.4, 0.7, 0.4],
                    boxShadow: [
                      '0 0 3px rgba(255, 255, 255, 0.2)',
                      '0 0 8px rgba(255, 255, 255, 0.4)',
                      '0 0 3px rgba(255, 255, 255, 0.2)'
                    ]
                  }
            }
            transition={{
              duration: selectedStones[index] ? 3 : 4,
              ease: "easeInOut",
              times: [0, 0.5, 1],
              repeat: Infinity,
              repeatType: "mirror"
            }}
          />
        ))}
      </SelectedStonesContainer>

      <Title>
        <TypewriterText text="請依直覺點選3張牌" startDelay={500} />
      </Title>

      <StoneGalleryContainer>
        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={3}
          spaceBetween={0}
          initialSlide={12}
          watchSlidesProgress={true}
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
            <SwiperSlide 
              key={stone.id}
              data-position={
                index === activeIndex ? 'active' :
                index === activeIndex - 1 ? 'prev' :
                index === activeIndex + 1 ? 'next' :
                index === activeIndex - 2 ? 'prev-prev' :
                index === activeIndex + 2 ? 'next-next' : 'hidden'
              }
            >
              <Stone
                image={stone.image}
                isSelected={selectedStones.includes(stone.id)}
                isActive={index === activeIndex}
                onClick={() => handleStoneClick(stone.id)}
              >
                <StoneImage src={stone.image} alt="Stone" />
              </Stone>
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
            placeholder="請輸入心中問題"
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
            {isSubmitting ? '尋求中...' : '解答'}
          </SubmitButton>
        </AnimatePresence>
      </form>
    </PageContainer>
  );
};

export default StoneSelectionPage;
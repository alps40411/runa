import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from 'swiper/modules';
import { useAppContext } from '../context/AppContext';
import CircleSymbol from '../components/symbols/CircleSymbol';
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
  background-size: 100% auto;
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
  width: 80px;
  height: 100px;
  border-radius: 50%;
  background-color: white;
  background-size: cover;
  background-position: center;
  margin-top: 20px;
  position: relative;
`;

const RuneImage = styled(motion.img)`
  width: 70%;
  height: 70%;
  object-fit: contain;
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
`;

const StoneGalleryContainer = styled(motion.div)`
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
      margin-top: 40px !important;
    }
    
    &[data-position="prev-prev"],
    &[data-position="next-next"] {
      transform: scale(0.7); /* 保持原始大小 */
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

const LoadingContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(248, 248, 245, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const SymbolContainer = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
`;

const CirclesWrapper = styled(motion.div)`
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OuterCircle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
`;

const LoadingText = styled(motion.p)`
  margin-top: 40px;
  font-size: 1rem;
  color: #5b5c5b;
  font-weight: var(--font-weight-medium);
  letter-spacing: 2px;
`;

const StoneSelectionPage = () => {
  const navigate = useNavigate();
  const { userQuestion, setUserQuestion, result, setResult } = useAppContext();
  const [selectedStones, setSelectedStones] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeIndex, setActiveIndex] = useState(12);
  const [loading, setLoading] = useState(false);
  const [runes, setRunes] = useState([]);
  
  const stones = Array.from({ length: 25 }, (_, index) => ({
    id: index + 1,
    image: `/images/stone${(index % 5) + 1}.png`
  }));

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        const response = await fetch('api/card/api/gacha/result/?token=test', {
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
        
        if (isMounted) {
          setResult(data);
          // Extract all image_s values from data.card and set them at once
          if (data.card && Array.isArray(data.card)) {
            const runeImages = data.card.map(item => item.image_s);
            setRunes(runeImages);
          }
          
          console.log("data: ", data);
        }
      } catch (error) {
        console.error('解析擷取錯誤:', error);
      }
    };
    
    fetchData();
    
    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array means this runs once on mount

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
      setIsSubmitting(true);
      setLoading(true);
      
      // Wait for 5 seconds before navigating
      setTimeout(() => {
        setIsSubmitting(false);
        setLoading(false);
        navigate('/reading');
      }, 5000);
    } else {
      alert('請選擇3張牌');
    }
  };

  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {loading && (
        <LoadingContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
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
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <SelectedStonesContainer>
          {[0, 1, 2].map((index) => (
            <div key={index} style={{ position: 'relative' }}>
              <StoneSlot
                transition={{
                  duration: selectedStones[index] ? 3 : 4,
                  ease: "easeInOut",
                  times: [0, 0.5, 1],
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
              />
              <AnimatePresence>
                {selectedStones[index] && runes[index] && (
                  <RuneImage 
                    src={runes[index]} 
                    alt="Rune" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeIn" }}
                  />
                )}
                {selectedStones[index] && !runes[index] && (
                  <RuneImage 
                    src="https://react-fflinebot.s3.amazonaws.com/img/Rune/14s.png" 
                    alt="Default Rune" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeIn" }}
                  />
                )}
              </AnimatePresence>
            </div>
          ))}
        </SelectedStonesContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.9 }}
      >
      
        <Title>
          左右滑動依直覺點選3張牌
        </Title>
      </motion.div>

      <StoneGalleryContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
      >
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.9 }}
      >
        <SectionTitle>
          解惑之路
        </SectionTitle>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.1 }}
      >
        <form onSubmit={handleConfirm}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <InputContainer
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              exit={{ opacity: 0, y: 10 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? '尋求中...' : '解答'}
            </SubmitButton>
          </AnimatePresence>
        </form>
      </motion.div>
    </PageContainer>
  );
};

export default StoneSelectionPage;
import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const EyeContainer = styled(motion.div)`
  width: ${props => props.size}px;
  height: ${props => props.size * 0.5}px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`

const EyeOutline = styled(motion.div)`
  width: 100%;
  height: 100%;
  border: 1.5px solid var(--color-symbol);
  border-radius: 50%;
  position: absolute;
`

const EyePupil = styled(motion.div)`
  width: ${props => props.size * 0.2}px;
  height: ${props => props.size * 0.2}px;
  background-color: var(--color-symbol);
  border-radius: 50%;
  position: relative;
`

const EyeSymbol = ({ size = 40, animate = true }) => {
  return (
    <EyeContainer
      size={size}
      initial={{ opacity: 0.8 }}
      animate={animate ? { opacity: [0.8, 1, 0.8] } : {}}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <EyeOutline />
      <EyePupil 
        size={size}
        animate={animate ? { 
          scale: [1, 1.1, 1]
        } : {}}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut"
        }}
      />
    </EyeContainer>
  )
}

export default EyeSymbol
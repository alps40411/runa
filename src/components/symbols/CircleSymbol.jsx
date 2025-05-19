import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const CircleContainer = styled(motion.div)`
  position: relative;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
`

const Circle = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 1.5px solid var(--color-symbol);
  border-radius: 50%;
  opacity: ${props => props.opacity || 1};
`

const InnerCircle = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${props => props.size * 0.2}px;
  height: ${props => props.size * 0.2}px;
  background-color: var(--color-symbol);
  border-radius: 50%;
  opacity: 0.8;
`

const CircleSymbol = ({ size = 40, animate = true, withInnerCircle = true }) => {
  return (
    <CircleContainer
      size={size}
      initial={{ opacity: 0.8 }}
      animate={animate ? { opacity: [0.8, 1, 0.8] } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <Circle />
      
      {animate && (
        <Circle 
          initial={{ opacity: 0.3, scale: 0.8 }}
          animate={{ 
            opacity: [0.3, 0, 0.3],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut"
          }}
        />
      )}
      
      {withInnerCircle && (
        <InnerCircle 
          size={size}
          animate={animate ? { 
            scale: [1, 1.2, 1]
          } : {}}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut"
          }}
        />
      )}
    </CircleContainer>
  )
}

export default CircleSymbol
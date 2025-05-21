import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const SymbolWrapper = styled(motion.div)`
  position: relative;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
`

const TriangleGroup = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Triangle = styled(motion.div)`
  width: 0;
  height: 0;
  border-left: ${props => props.size * 0.15}px solid transparent;
  border-right: ${props => props.size * 0.15}px solid transparent;
  border-bottom: ${props => props.size * 0.25}px solid var(--color-symbol);
  position: absolute;
  
  &:nth-child(1) {
    transform: translate(0, -${props => props.size * 0.1}px);
  }
  
  &:nth-child(2) {
    transform: rotate(120deg) translate(0, -${props => props.size * 0.1}px);
  }
  
  &:nth-child(3) {
    transform: rotate(240deg) translate(0, -${props => props.size * 0.1}px);
  }
`

const RayLine = styled(motion.div)`
  position: absolute;
  width: ${props => props.length}px;
  height: 1px;
  background-color: var(--color-symbol);
  opacity: 0.5;
  transform-origin: 0 0;
  transform: rotate(${props => props.angle}deg) translateX(${props => props.size * 0.4}px);
`

const TriangleSymbol = ({ size = 60 }) => {
  // Generate rays around the triangles
  const rays = Array.from({ length: 12 }).map((_, index) => {
    const angle = index * 30
    const length = size * 0.2
    
    return (
      <RayLine 
        key={index} 
        angle={angle} 
        length={length} 
        size={size}
        initial={{ opacity: 0.3, scaleX: 0.8 }}
        animate={{ 
          opacity: [0.3, 0.7, 0.3],
          scaleX: [0.8, 1, 0.8]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: index * 0.2
        }}
      />
    )
  })

  return (
    <SymbolWrapper size={size}>
      {rays}
      <TriangleGroup>
        <Triangle 
          size={size}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <Triangle 
          size={size}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        />
        <Triangle 
          size={size}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        />
      </TriangleGroup>
    </SymbolWrapper>
  )
}

export default TriangleSymbol
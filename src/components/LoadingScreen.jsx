import React, { useEffect } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import TriangleSymbol from './symbols/TriangleSymbol'

const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-background);
  z-index: 1000;
`

const SymbolContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const LoadingText = styled(motion.div)`
  margin-top: var(--spacing-lg);
  font-weight: var(--font-weight-light);
  color: var(--color-text-secondary);
  letter-spacing: 2px;
  text-align: center;
`

const LoadingScreen = () => {
  // Create particle effect
  useEffect(() => {
    const createParticles = () => {
      // This would create floating particles in a production environment
      // Simplified for this implementation
    }
    
    createParticles()
    
    return () => {
      // Cleanup particles
    }
  }, [])

  return (
    <LoadingContainer>
      <SymbolContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <TriangleSymbol size={80} />
        </motion.div>
        
        <LoadingText
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          尋求智慧之光...
        </LoadingText>
      </SymbolContainer>
    </LoadingContainer>
  )
}

export default LoadingScreen
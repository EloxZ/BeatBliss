import { useEffect, useState } from 'react';

const useMousePressed = (): boolean => {
    const [isMousePressed, setIsMousePressed] = useState(false)
  
    useEffect(() => {
      const handleMouseDown = () => setIsMousePressed(true)
      const handleMouseUp = () => setIsMousePressed(false)
  
      window.addEventListener('mousedown', handleMouseDown)
      window.addEventListener('mouseup', handleMouseUp)
  
      // Cleanup event listeners on unmount
      return () => {
        window.removeEventListener('mousedown', handleMouseDown)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }, [])
  
    return isMousePressed
}

export {
    useMousePressed
}
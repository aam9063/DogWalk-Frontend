// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useSpring } from 'motion/react';

const ScrollProgress = () => {
  // Usar useScroll para obtener el progreso de desplazamiento
  const { scrollYProgress } = useScroll();
  
  // Suavizar la animación con un spring
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 80, 
    damping: 25,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-dog-green z-50 opacity-70"
      style={{ scaleX, transformOrigin: "0%" }}
    />
  );
};

export default ScrollProgress; 
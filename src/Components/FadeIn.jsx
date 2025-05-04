import { motion } from "framer-motion";

// Componente de animación reutilizable para efectos de aparición
const FadeIn = ({ 
  children, 
  delay = 0.1,       // Menor delay por defecto
  duration = 0.5,    // Duración más corta para ser más sutil
  direction = null, 
  distance = 30,     // Distancia más corta, menos invasiva
  className = "" 
}) => {
  // Configurar animaciones iniciales y finales basadas en la dirección
  const getInitialPosition = () => {
    switch (direction) {
      case "up": return { opacity: 0, y: distance };
      case "down": return { opacity: 0, y: -distance };
      case "left": return { opacity: 0, x: distance };
      case "right": return { opacity: 0, x: -distance };
      default: return { opacity: 0 }; // Solo fade sin dirección
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      viewport={{ once: true, margin: "-50px" }}  // Margen menos agresivo
      transition={{ 
        duration: duration, 
        delay: delay,
        ease: [0.22, 1, 0.36, 1]  // Curva de ease más natural
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn; 
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';
import FadeIn from './FadeIn';
import TextAnimation from './TextAnimation';

const Support = () => {
  const iconRef = useRef(null);

  useEffect(() => {
    // Animar icono con GSAP - efecto de pulso suave
    const icon = iconRef.current;
    
    if (icon) {
      gsap.to(icon, {
        scale: 1.1,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    }
    
    return () => {
      gsap.killTweensOf(icon);
    };
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        <FadeIn direction="up" delay={0.2}>
          <TextAnimation type="words" trigger="self">
            <h2 className="text-3xl font-adlam mb-4">¿Tienes alguna duda?</h2>
          </TextAnimation>
          
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Nuestro asistente virtual te ayudará en lo que necesites
          </p>
        </FadeIn>
        
        <FadeIn direction="up" delay={0.4}>
          <div className="inline-block mx-auto mb-8">
            <img 
              ref={iconRef}
              src="/icons/chat-comment-oval-speech-bubble-with-text-lines_icon-icons.com_73302.svg" 
              alt="Chat" 
              className="w-20 h-20"
            />
          </div>
        </FadeIn>
        
        <FadeIn direction="up" delay={0.6}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button className="bg-dog-green text-white px-8 py-3 rounded-md hover:bg-dog-light-green transition-colors font-medium">
              Iniciar chat
            </button>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
};

export default Support; 
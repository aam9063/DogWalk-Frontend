// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';
import FadeIn from './FadeIn';

const Benefits = () => {
  const benefitsList = [
    {
      icon: "/icons/person_check_FILL0_wght400_GRAD0_opsz24.svg",
      text: "Miles de opiniones positivas"
    },
    {
      icon: "/icons/verified_FILL0_wght400_GRAD0_opsz24.svg",
      text: "Cancelación gratuita"
    },
    {
      icon: "/icons/stethoscope_check_FILL0_wght400_GRAD0_opsz24.svg",
      text: "Cobertura veterinaria"
    },
    {
      icon: "/icons/sms_FILL0_wght400_GRAD0_opsz24.svg",
      text: "Contacto en todo momento con el cuidador"
    },
    {
      icon: "/icons/credit_score_FILL0_wght400_GRAD0_opsz24.svg",
      text: "Pago seguro con Stripe"
    }
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="container px-4 mx-auto">
        <FadeIn direction="up" distance={20}>
          <h2 className="mb-12 text-3xl text-center font-adlam">Seguridad y Beneficios de Dog Walk</h2>
        </FadeIn>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          {benefitsList.map((benefit, index) => (
            <FadeIn
              key={index}
              delay={0.05 + index * 0.07}
              duration={0.4}
              direction="up"
              distance={15}
            >
              <motion.div 
                className="flex flex-col items-center text-center"
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <motion.div 
                  className="flex items-center justify-center w-16 h-16 mb-4 bg-white border border-gray-300 rounded-full"
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                    borderColor: "#36A269",
                    transition: { duration: 0.2 } 
                  }}
                >
                  <motion.img 
                    src={benefit.icon} 
                    alt={`Beneficio ${index + 1}`} 
                    className="w-8 h-8" 
                    whileHover={{ rotate: [0, -5, 5, -5, 0], transition: { duration: 0.4 } }}
                  />
                </motion.div>
                <p className="text-sm text-gray-600">{benefit.text}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits; 
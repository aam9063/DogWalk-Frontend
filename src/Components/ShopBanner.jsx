import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';
import GSAPAnimation from './GSAPAnimation';
import FadeIn from './FadeIn';

const ShopBanner = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center md:flex-row">
          <FadeIn 
            direction="left" 
            delay={0.2} 
            className="w-full mb-8 md:w-1/2 md:mb-0"
          >
            <GSAPAnimation type="fade" trigger="self" start="top 80%">
              <h2 className="mb-4 text-3xl font-adlam">Visita Nuestra Tienda Online</h2>
              <p className="mb-6 text-gray-600">
                Descubre la gran variedad de productos para tu mascota
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/tienda" 
                  className="inline-block px-6 py-3 text-white transition-colors rounded-md bg-dog-green hover:bg-dog-light-green"
                >
                  Ir a la Tienda
                </Link>
              </motion.div>
            </GSAPAnimation>
          </FadeIn>
          <FadeIn 
            direction="right" 
            delay={0.4} 
            className="w-full md:w-1/2"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <img 
                src="/imgs/malinois-and-border-collie-788032_1280.jpg" 
                alt="Perros jugando" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </motion.div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default ShopBanner; 
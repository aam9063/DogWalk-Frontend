import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const testimonials = [
  {
    id: 1,
    name: 'Patricia',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    text: 'Me gustaría indicar que el tiempo que estuvimos con los padres nos encantó, ella fue fabulosa. Ellos se divirtieron y nosotros recibimos fotos de cada momento. Repetiremos.'
  },
  {
    id: 2,
    name: 'Albert',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    text: 'Me gustaría indicar que el tiempo que estuvimos con los padres nos encantó, ella fue fabulosa. Ellos se divirtieron y nosotros recibimos fotos de cada momento. Repetiremos.'
  },
  {
    id: 3,
    name: 'Pedro',
    image: 'https://randomuser.me/api/portraits/men/67.jpg',
    text: 'Me gustaría indicar que el tiempo que estuvimos con los padres nos encantó, ella fue fabulosa. Ellos se divirtieron y nosotros recibimos fotos de cada momento. Repetiremos.'
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 relative bg-dog-dark text-white"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?q=80&w=2574)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
        backgroundColor: 'rgba(30, 30, 30, 0.7)'
      }}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-adlam text-center mb-12">Opiniones de las familias de Perros</h2>
        
        <Swiper
          modules={[Pagination, Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="testimonials-swiper"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <h3 className="text-xl font-medium">{testimonial.name}</h3>
                </div>
                <p className="text-white/80 italic flex-grow">
                  {testimonial.text}
                </p>
                <p className="mt-4 text-dog-green font-medium">Repetiremos.</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials; 
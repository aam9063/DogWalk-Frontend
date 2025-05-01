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
    <section className="relative py-16 text-white bg-dog-dark"
      style={{
        backgroundImage: 'url(/public/imgs/ai-generated-9131382_1280.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
        backgroundColor: 'rgba(30, 30, 30, 0.7)'
      }}
    >
      <div className="container px-4 mx-auto">
        <h2 className="mb-12 text-3xl text-center font-adlam">Opiniones de las familias de Perros</h2>
        
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
              <div className="flex flex-col h-full p-6 border rounded-lg bg-white/10 backdrop-blur-sm border-white/20">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="object-cover w-16 h-16 mr-4 rounded-full"
                  />
                  <h3 className="text-xl font-medium">{testimonial.name}</h3>
                </div>
                <p className="flex-grow italic text-white/80">
                  {testimonial.text}
                </p>
                <p className="mt-4 font-medium text-dog-green">Repetiremos.</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials; 
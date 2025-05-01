import { Link } from 'react-router-dom';

const ShopBanner = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl font-adlam mb-4">Visita Nuestra Tienda Online</h2>
            <p className="text-gray-600 mb-6">
              Descubre la gran variedad de productos para tu mascota
            </p>
            <Link 
              to="/tienda" 
              className="inline-block bg-dog-green text-white px-6 py-3 rounded-md hover:bg-dog-light-green transition-colors"
            >
              Ir a la Tienda
            </Link>
          </div>
          <div className="w-full md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?q=80&w=2576" 
              alt="Perros jugando" 
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopBanner; 
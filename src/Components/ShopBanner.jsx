import { Link } from 'react-router-dom';

const ShopBanner = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center md:flex-row">
          <div className="w-full mb-8 md:w-1/2 md:mb-0">
            <h2 className="mb-4 text-3xl font-adlam">Visita Nuestra Tienda Online</h2>
            <p className="mb-6 text-gray-600">
              Descubre la gran variedad de productos para tu mascota
            </p>
            <Link 
              to="/tienda" 
              className="inline-block px-6 py-3 text-white transition-colors rounded-md bg-dog-green hover:bg-dog-light-green"
            >
              Ir a la Tienda
            </Link>
          </div>
          <div className="w-full md:w-1/2">
            <img 
              src="/public/imgs/malinois-and-border-collie-788032_1280.jpg" 
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
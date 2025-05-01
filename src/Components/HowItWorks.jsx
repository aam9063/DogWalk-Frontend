const HowItWorks = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container px-4 mx-auto">
        <h2 className="mb-12 text-3xl text-center font-adlam">¿Cómo funciona Dog Walk?</h2>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Paso 1 */}
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 mb-4 text-white rounded-full bg-dog-green">
              <span className="text-xl font-bold">1</span>
            </div>
            <h3 className="mb-2 text-xl font-medium">Busca</h3>
            <p className="text-center text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
            </p>
          </div>
          
          {/* Paso 2 */}
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 mb-4 text-white rounded-full bg-dog-green">
              <span className="text-xl font-bold">2</span>
            </div>
            <h3 className="mb-2 text-xl font-medium">Reserva</h3>
            <p className="text-center text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
            </p>
          </div>
          
          {/* Paso 3 */}
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 mb-4 text-white rounded-full bg-dog-green">
              <span className="text-xl font-bold">3</span>
            </div>
            <h3 className="mb-2 text-xl font-medium">Relájate</h3>
            <p className="text-center text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 
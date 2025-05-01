const Support = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-adlam mb-4">¿Tienes alguna duda?</h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Nuestro asistente virtual te ayudará en lo que necesites
        </p>
        
        <div className="inline-block mx-auto mb-8">
          <img 
            src="/icons/chat-comment-oval-speech-bubble-with-text-lines_icon-icons.com_73302.svg" 
            alt="Chat" 
            className="w-20 h-20"
          />
        </div>
        
        <div>
          <button className="bg-dog-green text-white px-8 py-3 rounded-md hover:bg-dog-light-green transition-colors font-medium">
            Iniciar chat
          </button>
        </div>
      </div>
    </section>
  );
};

export default Support; 
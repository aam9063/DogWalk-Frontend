import { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'motion/react';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
import { toast } from 'react-toastify';
import assistantService from '../Services/assistantService';

const ChatAssistant = ({ externalShowChat, onClose }) => {
  const [showChat, setShowChat] = useState(externalShowChat || false);
  const [messages, setMessages] = useState([
    { type: 'assistant', text: '¡Hola! Soy el asistente virtual de Dog Walk. ¿En qué puedo ayudarte?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef(null);
  
  // Determinar si el componente está siendo controlado externamente
  const isExternallyControlled = externalShowChat !== undefined;
  
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isExternallyControlled) {
      setShowChat(externalShowChat);
    }
  }, [externalShowChat, isExternallyControlled]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    try {
      setIsLoading(true);
      // Agregar mensaje del usuario
      setMessages(prev => [...prev, { type: 'user', text: inputMessage }]);
      
      // Llamar al servicio
      const response = await assistantService.consultarAsistente(
        inputMessage,
        'general',
        { origen: 'chat_widget' }
      );

      // Agregar respuesta del asistente
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        text: response.respuesta,
        sugerencias: response.sugerenciasAccion 
      }]);
      
      setInputMessage('');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    const newState = !showChat;
    setShowChat(newState);
    if (!newState && onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed z-40 bottom-6 right-6 md:bottom-10 md:right-10">
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="mb-4 bg-white rounded-lg shadow-lg w-[300px] md:w-[400px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-dog-green">Asistente Virtual</h3>
              <button
                onClick={toggleChat}
                className="text-gray-400 transition-colors hover:text-gray-600"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Chat Messages */}
            <div 
              ref={chatRef}
              className="flex flex-col gap-3 p-4 overflow-y-auto h-[300px]"
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-dog-green text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    {message.sugerencias && message.sugerencias.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.sugerencias.map((sugerencia, idx) => (
                          <button
                            key={idx}
                            onClick={() => setInputMessage(sugerencia)}
                            className="block w-full p-1 text-xs text-left text-blue-600 transition-colors hover:text-blue-800"
                          >
                            {sugerencia}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <div className="w-12 h-4 space-x-1">
                      <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dog-green"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="p-2 text-white transition-colors rounded-lg bg-dog-green hover:bg-dog-green/90 disabled:opacity-50"
                >
                  <FaPaperPlane />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button - Solo se muestra cuando no hay control externo */}
      {!isExternallyControlled && !showChat && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleChat}
          className="flex items-center justify-center w-12 h-12 p-2 text-xl text-white rounded-full shadow-md md:w-14 md:h-14 md:p-3 md:text-2xl bg-dog-green focus:outline-none"
        >
          <span role="img" aria-label="Asistente">🐶</span>
        </motion.button>
      )}
    </div>
  );
};

export default ChatAssistant; 
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
import ChatService from '../Services/chatService';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';

const ChatModal = ({ isOpen, onClose, recipientId, recipientName, recipientType }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatService] = useState(() => new ChatService());
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const messagesEndRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const maxReconnectAttempts = 3;
  
  const token = localStorage.getItem('token');
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMessageReceived = useCallback((mensaje) => {
    setMessages(prev => {
      // Evitar duplicados
      if (prev.some(m => m.id === mensaje.id)) {
        return prev;
      }
      return [...prev, mensaje];
    });
    scrollToBottom();
  }, []);

  // Memoizar la función de inicialización del chat
  const initializeChat = useCallback(async () => {
    if (!isOpen) {
      return;
    }

    if (!token) {
      setConnectionStatus('error');
      toast.error('No hay sesión activa. Por favor, inicia sesión nuevamente.');
      return;
    }

    if (!isAuthenticated) {
      setConnectionStatus('error');
      toast.error('Sesión no válida. Por favor, inicia sesión nuevamente.');
      return;
    }

    setIsConnecting(true);
    setConnectionStatus('connecting');
    
    try {
      const success = await chatService.connect(token);
      
      if (success) {
        setConnectionStatus('connected');
        setConnectionAttempts(0);
        
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Chat/conversacion/${recipientId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            if (data.mensajes && Array.isArray(data.mensajes)) {
              setMessages(data.mensajes);
              scrollToBottom();
            } else {
              console.warn('No se recibieron mensajes en el formato esperado:', data);
            }
          } else {
            console.error('Error al cargar mensajes:', response.status);
            toast.error('Error al cargar los mensajes anteriores');
          }
        } catch (error) {
          console.error('Error al cargar mensajes:', error);
          toast.error('Error al cargar los mensajes anteriores');
        }

        chatService.onMessageReceived(handleMessageReceived);

        chatService.onMessageRead((messageId) => {
          setMessages(prev => prev.map(m => 
            m.id === messageId ? { ...m, leido: true } : m
          ));
        });

        chatService.onConnectionError((error) => {
          console.error('Error de conexión en el chat:', error);
          setConnectionStatus('error');
          handleReconnect();
        });

        chatService.onConnectionReconnecting(() => {
          setConnectionStatus('reconnecting');
        });

        chatService.onConnectionReconnected(() => {
          setConnectionStatus('connected');
          setConnectionAttempts(0);
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
          }
        });
      } else {
        console.error('No se pudo establecer la conexión inicial');
        setConnectionStatus('error');
        handleReconnect();
      }
    } catch (error) {
      console.error("Error al inicializar el chat:", error);
      setConnectionStatus('error');
      handleReconnect();
    } finally {
      setIsConnecting(false);
    }
  }, [token, isOpen, chatService, recipientId, isAuthenticated, handleMessageReceived]);

  const handleReconnect = useCallback(() => {
    if (connectionAttempts >= maxReconnectAttempts) {
      toast.error('No se pudo establecer la conexión después de varios intentos');
      setConnectionStatus('failed');
      return;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    setConnectionAttempts(prev => prev + 1);
    
    reconnectTimeoutRef.current = setTimeout(() => {
      if (connectionStatus !== 'connected') {
        initializeChat();
      }
    }, Math.min(1000 * Math.pow(2, connectionAttempts), 10000));
  }, [connectionAttempts, connectionStatus, initializeChat, maxReconnectAttempts]);

  // Efecto para inicializar el chat
  useEffect(() => {
    if (isOpen && token && isAuthenticated) {
      initializeChat();
    }
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      chatService.disconnect();
      setConnectionStatus('disconnected');
      setConnectionAttempts(0);
    };
  }, [isOpen, token, isAuthenticated, initializeChat, chatService]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!token || !isAuthenticated) {
      toast.error("No hay sesión activa. Por favor, inicia sesión nuevamente.");
      return;
    }

    if (!recipientId) {
      toast.error("No se puede identificar al destinatario");
      return;
    }

    if (!newMessage.trim()) {
      return;
    }

    setIsConnecting(true);

    try {
      const success = await chatService.sendMessage(
        recipientId,
        recipientType,
        newMessage.trim(),
        token
      );

      if (success) {
        // Agregar el mensaje localmente para feedback inmediato
        const nuevoMensaje = {
          id: Date.now().toString(), // ID temporal
          mensaje: newMessage.trim(),
          enviadorId: user?.userId,
          fechaHora: new Date().toISOString(),
          leido: false
        };
        setMessages(prev => [...prev, nuevoMensaje]);
        setNewMessage('');
        scrollToBottom();
      } else {
        toast.error("No se pudo enviar el mensaje. Por favor, intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      toast.error("Error al enviar el mensaje: " + (error.message || 'Error desconocido'));
    } finally {
      setIsConnecting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between p-4 border-b rounded-t-lg bg-dog-green">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">{recipientName}</h3>
            {connectionStatus === 'connected' && (
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span className="ml-1 text-sm text-white">Conectado</span>
              </div>
            )}
            {connectionStatus === 'reconnecting' && (
              <div className="flex items-center">
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                <span className="ml-1 text-sm text-white">Reconectando...</span>
              </div>
            )}
            {connectionStatus === 'error' && (
              <div className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="ml-1 text-sm text-white">Error de conexión</span>
                <button 
                  onClick={() => initializeChat()}
                  className="px-2 py-1 ml-2 text-xs bg-white rounded text-dog-green hover:bg-gray-100"
                >
                  Reintentar
                </button>
              </div>
            )}
            {connectionStatus === 'failed' && (
              <div className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="ml-1 text-sm text-white">Conexión fallida</span>
                <button 
                  onClick={() => {
                    setConnectionAttempts(0);
                    initializeChat();
                  }}
                  className="px-2 py-1 ml-2 text-xs bg-white rounded text-dog-green hover:bg-gray-100"
                >
                  Reintentar
                </button>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white transition-colors rounded-full hover:bg-dog-light-green"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Área de mensajes */}
        <div className="flex flex-col h-96">
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                No hay mensajes aún
              </div>
            ) : (
              messages.map((message) => {
                const isOwnMessage = message.enviadorId === user?.userId;
                console.log('Renderizando mensaje:', message);
                return (
                  <div
                    key={message.id}
                    className={`flex mb-4 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        isOwnMessage
                          ? 'bg-dog-green text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.mensaje}</p>
                      <span className="flex justify-end mt-1 text-xs opacity-75">
                        {new Date(message.fechaHora).toLocaleTimeString()}
                        {message.leido && <span className="ml-1">✓</span>}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Área de entrada de mensaje */}
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder={
                  connectionStatus === 'connected' 
                    ? "Escribe un mensaje..." 
                    : connectionStatus === 'reconnecting'
                      ? "Reconectando..."
                      : "Sin conexión"
                }
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dog-green"
                disabled={connectionStatus !== 'connected'}
              />
              <button
                type="submit"
                className={`p-2 text-white transition-colors rounded-lg ${
                  isConnecting || !newMessage.trim() || connectionStatus !== 'connected'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-dog-green hover:bg-dog-light-green'
                }`}
                disabled={isConnecting || !newMessage.trim() || connectionStatus !== 'connected'}
              >
                {isConnecting ? (
                  <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                ) : (
                  <FaPaperPlane size={20} />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatModal; 
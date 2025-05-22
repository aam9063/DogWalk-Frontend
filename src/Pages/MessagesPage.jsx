import React, { useState, useEffect, useCallback } from 'react';
import ChatArea from '../Components/ChatArea';
import Navbar from '../Components/Navbar';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore';

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const token = localStorage.getItem('token');
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const fetchConversations = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Chat/conversaciones`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar las conversaciones');
      }

      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('No se pudieron cargar las conversaciones');
    } finally {
      setLoading(false);
    }
  }, [token, isAuthenticated]);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 30000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  const handleChatSelect = (conversation) => {
    const isUserPaseador = user?.rol === 'Paseador';
    setSelectedChat({
      recipientId: isUserPaseador ? conversation.usuarioId : conversation.paseadorId,
      recipientName: conversation.nombreContacto,
      recipientType: isUserPaseador ? 'Usuario' : 'Paseador'
    });
  };

  const formatLastMessageDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Ayer';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'long' });
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-4 rounded-full border-dog-green border-t-transparent animate-spin"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto h-[calc(100vh-64px)]">
        <div className="flex h-full bg-white">
          {/* Lista de conversaciones (izquierda) */}
          <div className="w-1/3 border-r">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold text-dog-green">Mensajes</h2>
            </div>
            
            <div className="overflow-y-auto h-[calc(100%-4rem)]">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No tienes conversaciones activas
                </div>
              ) : (
                conversations.map((conversation) => (
                  <div
                    key={user?.rol === 'Paseador' ? conversation.usuarioId : conversation.paseadorId}
                    onClick={() => handleChatSelect(conversation)}
                    className={`flex items-center p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedChat?.recipientId === (user?.rol === 'Paseador' ? conversation.usuarioId : conversation.paseadorId)
                        ? 'bg-gray-100'
                        : ''
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {conversation.fotoContacto ? (
                        <img
                          src={conversation.fotoContacto}
                          alt={conversation.nombreContacto}
                          className="object-cover w-12 h-12 rounded-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-12 h-12 text-xl text-white rounded-full bg-dog-green">
                          {conversation.nombreContacto.charAt(0)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-grow ml-4">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-gray-900">
                          {conversation.nombreContacto}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {formatLastMessageDate(conversation.fechaUltimoMensaje)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-1">
                        <p className="max-w-xs text-sm text-gray-600 truncate">
                          {conversation.ultimoMensaje || 'No hay mensajes'}
                        </p>
                        {conversation.mensajesNoLeidos > 0 && (
                          <span className="px-2 py-1 text-xs text-white rounded-full bg-dog-green">
                            {conversation.mensajesNoLeidos}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Área de chat (derecha) */}
          <div className="w-2/3 bg-gray-50">
            {selectedChat ? (
              <ChatArea
                recipientId={selectedChat.recipientId}
                recipientName={selectedChat.recipientName}
                recipientType={selectedChat.recipientType}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Selecciona una conversación para comenzar
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MessagesPage; 
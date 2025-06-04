import { useState, useEffect } from 'react';
import ChatService from '../Services/chatService';

const chatService = new ChatService();

const ChatTest = () => {
  const [connected, setConnected] = useState(false);
  const [token, setToken] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [recipientType, setRecipientType] = useState('Usuario');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    chatService.onMessageReceived((mensaje) => {
      setMessages(prev => [...prev, mensaje]);
    });

    chatService.onMessageRead((messageId) => {
      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, leido: true } : m
      ));
    });

    return () => {
      if (connected) {
        chatService.disconnect();
      }
    };
  }, [connected]);

const handleConnect = async () => {
  if (!token) {
    setErrorMsg('Por favor, ingresa un token válido');
    return;
  }

  // Verificar el token
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      setErrorMsg('Token inválido: formato incorrecto');
      return;
    }
    
    const payload = parts[1];
    const decoded = atob(payload);
    const parsed = JSON.parse(decoded);
    
    
    if (!parsed.sub) {
      setErrorMsg('Token inválido: no contiene el claim "sub"');
      return;
    }
  } catch (e) {
    setErrorMsg('Error al decodificar token: ' + e.message);
    return;
  }
  
  try {
    const success = await chatService.connect(token);
    setConnected(success);
    if (!success) {
      setErrorMsg('Error al conectar con SignalR');
    }
  } catch (error) {
    console.error('Error de conexión:', error);
    setErrorMsg('Error al conectar: ' + error.message);
  }
};

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !recipientId) {
      setErrorMsg('Mensaje y destinatario son requeridos');
      return;
    }

    setErrorMsg('');
    try {
      const success = await chatService.sendMessage(recipientId, recipientType, newMessage, token);

      if (success) {
        // Agregar mensaje a la lista local (la respuesta vendrá por SignalR)
        setNewMessage('');
      } else {
        setErrorMsg('Error al enviar mensaje');
      }
    } catch (error) {
      console.error('Error al enviar:', error);
      setErrorMsg('Error al enviar: ' + error.message);
    }
  };

  const handleDisconnect = async () => {
    await chatService.disconnect();
    setConnected(false);
    setMessages([]);
  };

  return (
    <div className="container max-w-2xl p-4 mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-center">Prueba de Chat en Tiempo Real</h1>
      
      {!connected ? (
        <div className="p-4 bg-white shadow-md rounded-xl">
          <h2 className="mb-4 text-xl font-semibold">Conectar al chat</h2>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Token de acceso:</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Pega tu token JWT aquí..."
            />
          </div>
          <button
            onClick={handleConnect}
            className="w-full px-4 py-2 text-white transition-colors rounded-lg bg-primary hover:bg-secondary"
          >
            Conectar
          </button>
        </div>
      ) : (
        <div className="p-4 bg-white shadow-md rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Chat conectado</h2>
            <button
              onClick={handleDisconnect}
              className="px-3 py-1 text-sm text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
            >
              Desconectar
            </button>
          </div>
          
          <div className="mb-4">
            <div className="flex mb-2 space-x-2">
              <div className="flex-1">
                <label className="block mb-1 text-sm font-medium">ID Destinatario:</label>
                <input
                  type="text"
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="ID del destinatario"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Tipo:</label>
                <select
                  value={recipientType}
                  onChange={(e) => setRecipientType(e.target.value)}
                  className="w-full p-2 border rounded-lg h-[42px]"
                >
                  <option value="Usuario">Usuario</option>
                  <option value="Paseador">Paseador</option>
                </select>
              </div>
            </div>
            
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 p-2 border rounded-lg"
                placeholder="Escribe un mensaje..."
              />
              <button
                type="submit"
                className="px-4 py-2 text-white transition-colors rounded-lg bg-primary hover:bg-secondary"
              >
                Enviar
              </button>
            </form>
          </div>
          
          <div className="p-3 overflow-y-auto border rounded-lg h-80">
            <h3 className="mb-2 font-medium text-gray-700">Mensajes:</h3>
            {messages.length === 0 ? (
              <p className="py-10 text-center text-gray-500">No hay mensajes aún</p>
            ) : (
              <div className="space-y-2">
                {messages.map((msg, index) => (
                  <div key={msg.id || index} className="p-2 bg-gray-100 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">
                        {msg.enviadorId} ({msg.tipoEnviador})
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.fechaHora).toLocaleTimeString()}
                        {msg.leido && <span className="ml-1 text-green-500">✓</span>}
                      </span>
                    </div>
                    <p>{msg.mensaje}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {errorMsg && (
        <div className="p-3 mt-4 text-red-700 bg-red-100 border border-red-300 rounded-lg">
          {errorMsg}
        </div>
      )}
      
      <div className="p-3 mt-4 border border-yellow-200 rounded-lg bg-yellow-50">
        <h3 className="font-medium text-yellow-700">Instrucciones:</h3>
        <ol className="mt-2 space-y-1 text-sm text-yellow-800 list-decimal list-inside">
          <li>Pega un token JWT válido y haz clic en "Conectar"</li>
          <li>Introduce el ID del destinatario y selecciona su tipo</li>
          <li>Envía un mensaje y observa la respuesta en tiempo real</li>
        </ol>
      </div>
    </div>
  );
};

export default ChatTest; 
import { useState, useEffect } from 'react';
import ChatService from '../Services/chatService';

const ChatWindow = ({ 
  title, 
  token, 
  onTokenChange, 
  connected, 
  onConnect, 
  onDisconnect,
  recipientId,
  onRecipientIdChange,
  messages,
  onSendMessage
}) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-xl">
      <div className="flex items-center justify-between pb-2 mb-4 border-b">
        <h2 className="text-xl font-semibold">{title}</h2>
        {!connected ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={token}
              onChange={(e) => onTokenChange(e.target.value)}
              className="w-24 p-1 text-sm border rounded"
              placeholder="Token JWT"
            />
            <button
              onClick={onConnect}
              className="px-2 py-1 text-sm text-white transition-colors rounded bg-primary hover:bg-secondary"
            >
              Conectar
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-green-500">Conectado</span>
            <button
              onClick={onDisconnect}
              className="px-2 py-1 text-xs text-white transition-colors bg-red-500 rounded hover:bg-red-600"
            >
              Desconectar
            </button>
          </div>
        )}
      </div>

      {connected && (
        <>
          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium">ID Destinatario:</label>
            <input
              type="text"
              value={recipientId}
              onChange={(e) => onRecipientIdChange(e.target.value)}
              className="w-full p-1.5 border rounded"
              placeholder="ID del destinatario"
            />
          </div>
          
          <div className="h-48 p-2 mb-3 overflow-y-auto border rounded">
            {messages.length === 0 ? (
              <p className="py-8 text-sm text-center text-gray-500">No hay mensajes</p>
            ) : (
              <div className="space-y-2">
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`p-2 rounded text-sm ${
                      msg.isOutgoing ? 'bg-primary text-white ml-4' : 'bg-gray-100 mr-4'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div className="text-xs text-right">
                      {msg.time}
                      {msg.isOutgoing && msg.read && <span className="ml-1">✓</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <form onSubmit={handleSend} className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 p-1.5 border rounded"
              placeholder="Escribe un mensaje..."
            />
            <button
              type="submit"
              className="px-3 py-1 text-white transition-colors rounded bg-primary hover:bg-secondary"
            >
              Enviar
            </button>
          </form>
        </>
      )}
    </div>
  );
};

const ChatDemo = () => {
  // Usuario 1
  const [token1, setToken1] = useState('');
  const [connected1, setConnected1] = useState(false);
  const [recipientId1, setRecipientId1] = useState('');
  const [messages1, setMessages1] = useState([]);
  
  // Usuario 2  
  const [token2, setToken2] = useState('');
  const [connected2, setConnected2] = useState(false);
  const [recipientId2, setRecipientId2] = useState('');
  const [messages2, setMessages2] = useState([]);

  // Estado compartido
  const [chatService1] = useState(() => new ChatService());
  const [chatService2] = useState(() => new ChatService());
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      if (connected1) chatService1.disconnect();
      if (connected2) chatService2.disconnect();
    };
  }, [connected1, connected2, chatService1, chatService2]);

  const fetchMessages = async (token, contactoId, setMessages) => {
    try {
      const response = await fetch(
        `http://localhost:5204/api/Chat/conversacion/${contactoId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setMessages(data.mensajes || []);
    } catch (error) {
      console.error('Error al cargar historial:', error);
    }
  };

  const connectUser1 = async () => {
    if (!token1) {
      setError('Por favor, ingresa un token para Usuario 1');
      return;
    }
    try {
      chatService1.onMessageReceived((mensaje) => {
        setMessages1(prev => [...prev, mensaje]);
      });
      const success = await chatService1.connect(token1);
      setConnected1(success);
      if (success) {
        // Cargar historial
        await fetchMessages(token1, recipientId1, setMessages1);
      }
      if (!success) {
        setError('Error al conectar Usuario 1');
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  const connectUser2 = async () => {
    if (!token2) {
      setError('Por favor, ingresa un token para Usuario 2');
      return;
    }
    
    try {
      // Configurar manejador de mensajes
      chatService2.onMessageReceived((mensaje) => {
        const newMsg = {
          text: mensaje.mensaje,
          time: new Date().toLocaleTimeString(),
          isOutgoing: false,
          read: false
        };
        setMessages2(prev => [...prev, newMsg]);
      });
      
      const success = await chatService2.connect(token2);
      setConnected2(success);
      
      if (success) {
        // Cargar historial
        await fetchMessages(token2, recipientId2, setMessages2);
      }
      
      if (!success) {
        setError('Error al conectar Usuario 2');
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  const disconnectUser1 = async () => {
    await chatService1.disconnect();
    setConnected1(false);
    setMessages1([]);
  };

  const disconnectUser2 = async () => {
    await chatService2.disconnect();
    setConnected2(false);
    setMessages2([]);
  };

  const sendMessageUser1 = async (text) => {
    if (!recipientId1) {
      setError('Ingresa ID del destinatario para Usuario 1');
      return;
    }
    
    try {
      const success = await chatService1.sendMessage(
        recipientId1,
        'Usuario', // Tipo destinatario - ajusta según tu lógica
        text,
        token1
      );
      
      if (success) {
        const newMsg = {
          text,
          time: new Date().toLocaleTimeString(),
          isOutgoing: true,
          read: false
        };
        setMessages1(prev => [...prev, newMsg]);
      } else {
        setError('Error al enviar mensaje desde Usuario 1');
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  const sendMessageUser2 = async (text) => {
    if (!recipientId2) {
      setError('Ingresa ID del destinatario para Usuario 2');
      return;
    }
    
    try {
      const success = await chatService2.sendMessage(
        recipientId2,
        'Usuario', // Tipo destinatario - ajusta según tu lógica
        text,
        token2
      );
      
      if (success) {
        const newMsg = {
          text,
          time: new Date().toLocaleTimeString(),
          isOutgoing: true,
          read: false
        };
        setMessages2(prev => [...prev, newMsg]);
      } else {
        setError('Error al enviar mensaje desde Usuario 2');
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-center">Demostración de Chat en Tiempo Real</h1>
      
      <div className="p-3 mb-6 border border-yellow-200 rounded-lg bg-yellow-50">
        <h3 className="font-medium text-yellow-700">Instrucciones:</h3>
        <ol className="mt-2 space-y-1 text-sm text-yellow-800 list-decimal list-inside">
          <li>Conecta ambas ventanas con diferentes tokens JWT</li>
          <li>En cada ventana, ingresa el ID del otro usuario como destinatario</li>
          <li>Envía mensajes desde ambas ventanas para probar la comunicación bidireccional</li>
          <li>Observa cómo los mensajes aparecen en tiempo real</li>
        </ol>
      </div>
      
      {error && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-300 rounded-lg">
          {error}
          <button 
            onClick={() => setError('')} 
            className="ml-2 font-bold text-red-500"
          >
            ×
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ChatWindow
          title="Usuario 1"
          token={token1}
          onTokenChange={setToken1}
          connected={connected1}
          onConnect={connectUser1}
          onDisconnect={disconnectUser1}
          recipientId={recipientId1}
          onRecipientIdChange={setRecipientId1}
          messages={messages1}
          onSendMessage={sendMessageUser1}
        />
        
        <ChatWindow
          title="Usuario 2"
          token={token2}
          onTokenChange={setToken2}
          connected={connected2}
          onConnect={connectUser2}
          onDisconnect={disconnectUser2}
          recipientId={recipientId2}
          onRecipientIdChange={setRecipientId2}
          messages={messages2}
          onSendMessage={sendMessageUser2}
        />
      </div>
      
      <div className="mt-6 text-sm text-center text-gray-500">
        <p>Nota: Esta demo simula dos clientes diferentes conectados al mismo servidor SignalR.</p>
      </div>
    </div>
  );
};

export default ChatDemo; 
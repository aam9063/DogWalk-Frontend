   // src/components/Chat.jsx
   import React, { useState, useEffect, useRef } from 'react';
   import { useAuth } from '../context/authContext'; // Ajusta según tu implementación de auth
   import chatService from '../services/chatService';
   import axios from 'axios';

   const Chat = ({ contactoId, tipoContacto }) => {
     const { token, userId, userRole } = useAuth();
     const [mensajes, setMensajes] = useState([]);
     const [nuevoMensaje, setNuevoMensaje] = useState('');
     const [cargando, setCargando] = useState(true);
     const [contacto, setContacto] = useState(null);
     const chatEndRef = useRef(null);

     // Cargar mensajes al iniciar
     useEffect(() => {
       const cargarConversacion = async () => {
         try {
           const response = await axios.get(
             `http://localhost:5204/api/Chat/conversacion/${contactoId}`,
             { headers: { Authorization: `Bearer ${token}` } }
           );
           setMensajes(response.data.mensajes);
           setContacto({
             nombre: userRole === 'Usuario' ? response.data.nombrePaseador : response.data.nombreUsuario,
             foto: userRole === 'Usuario' ? response.data.fotoPaseador : response.data.fotoUsuario
           });
           setCargando(false);
         } catch (error) {
           console.error('Error al cargar mensajes:', error);
         }
       };

       if (contactoId && token) {
         cargarConversacion();
       }
     }, [contactoId, token, userRole]);

     // Conectar a SignalR
     useEffect(() => {
       const conectarChat = async () => {
         await chatService.connect(token);
         
         chatService.onMessageReceived((mensaje) => {
           // Verificamos si el mensaje pertenece a esta conversación
           if ((mensaje.enviadorId === userId || mensaje.enviadorId === contactoId) && 
               (mensaje.enviadorId === contactoId || mensaje.tipoEnviador === tipoContacto)) {
             setMensajes(prev => [...prev, mensaje]);
           }
         });
         
         chatService.onMessageRead((mensajeId) => {
           setMensajes(prev => prev.map(m => 
             m.id === mensajeId ? { ...m, leido: true } : m
           ));
         });
       };

       if (token && !cargando) {
         conectarChat();
       }

       return () => {
         chatService.disconnect();
       };
     }, [token, userId, contactoId, tipoContacto, cargando]);

     // Scroll al fondo al recibir nuevos mensajes
     useEffect(() => {
       chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
     }, [mensajes]);

     const enviarMensaje = async (e) => {
       e.preventDefault();
       if (!nuevoMensaje.trim()) return;

       const enviado = await chatService.sendMessage(
         contactoId,
         tipoContacto,
         nuevoMensaje
       );

       if (enviado) {
         setNuevoMensaje('');
       }
     };

     if (cargando) return <div>Cargando chat...</div>;

     return (
       <div className="chat-container">
         <div className="chat-header">
           <img src={contacto?.foto || '/default-avatar.png'} alt="Foto perfil" />
           <h3>{contacto?.nombre || 'Contacto'}</h3>
         </div>
         
         <div className="chat-messages">
           {mensajes.map(mensaje => (
             <div 
               key={mensaje.id} 
               className={`mensaje ${mensaje.enviadorId === userId ? 'mensaje-propio' : 'mensaje-contacto'}`}
             >
               <div className="mensaje-contenido">
                 {mensaje.mensaje}
                 <span className="mensaje-hora">
                   {new Date(mensaje.fechaHora).toLocaleTimeString()}
                   {mensaje.enviadorId === userId && (
                     mensaje.leido 
                       ? <span className="leido">✓✓</span> 
                       : <span className="enviado">✓</span>
                   )}
                 </span>
               </div>
             </div>
           ))}
           <div ref={chatEndRef} />
         </div>
         
         <form className="chat-input" onSubmit={enviarMensaje}>
           <input
             type="text"
             value={nuevoMensaje}
             onChange={(e) => setNuevoMensaje(e.target.value)}
             placeholder="Escribe un mensaje..."
           />
           <button type="submit">Enviar</button>
         </form>
       </div>
     );
   };

   export default Chat;
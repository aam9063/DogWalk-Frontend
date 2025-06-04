   // src/components/ConversacionesList.jsx
   import React, { useState, useEffect } from 'react';
   import { useAuth } from '../context/authContext';
   import axios from 'axios';
   import { Link } from 'react-router-dom';

   const ConversacionesList = () => {
     const { token } = useAuth();
     const [conversaciones, setConversaciones] = useState([]);
     const [cargando, setCargando] = useState(true);

     useEffect(() => {
      const cargarConversaciones = async () => {
        try {
          const response = await axios.get(
            'http://localhost:5204/api/Chat/conversaciones',
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setConversaciones(response.data);
          setCargando(false);
        } catch (error) {
          console.error('Error al cargar conversaciones:', error);
        }
      };
    
      if (token) {
        cargarConversaciones();
      }
    }, [token]);

     if (cargando) return <div>Cargando conversaciones...</div>;

     return (
       <div className="conversaciones-list">
         <h2>Mis conversaciones</h2>
         {conversaciones.length === 0 ? (
           <p>No tienes conversaciones activas</p>
         ) : (
           <ul>
             {conversaciones.map(conv => (
               <li key={conv.usuarioId + conv.paseadorId}>
                 <Link to={`/chat/${conv.paseadorId || conv.usuarioId}`}>
                   <div className="conversacion-item">
                     <img src={conv.fotoContacto || '/default-avatar.png'} alt="Foto" />
                     <div className="conversacion-info">
                       <h4>{conv.nombreContacto}</h4>
                       <p>{conv.ultimoMensaje || 'Sin mensajes'}</p>
                     </div>
                     {conv.mensajesNoLeidos > 0 && (
                       <span className="badge">{conv.mensajesNoLeidos}</span>
                     )}
                   </div>
                 </Link>
               </li>
             ))}
           </ul>
         )}
       </div>
     );
   };

   export default ConversacionesList;
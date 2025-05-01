// src/services/chatService.js
import * as signalR from "@microsoft/signalr";

class ChatService {
  constructor() {
    this.connection = null;
    this.callbacks = {
      messageReceived: () => {},
      messageRead: () => {},
    };
  }

  async connect(token) {
    try {
      console.log("Conectando con token:", token);
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5204/chatHub", {
          accessTokenFactory: () => token,
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 30000]) // Reintentos más agresivos
        .configureLogging(signalR.LogLevel.Debug) // Más información de depuración
        .build();

      // Configura los controladores de eventos
      this.connection.on("RecibirMensaje", (mensaje) => {
        this.callbacks.messageReceived(mensaje);
      });

      this.connection.on("MensajeLeido", (mensajeId) => {
        this.callbacks.messageRead(mensajeId);
      });

      await this.connection.start();
      console.log("Conectado a SignalR");
      return true;
    } catch (error) {
      console.error("Error al conectar con SignalR:", error);
      return false;
    }
  }

  onMessageReceived(callback) {
    this.callbacks.messageReceived = callback;
  }

  onMessageRead(callback) {
    this.callbacks.messageRead = callback;
  }

  async sendMessage(destinatarioId, tipoDestinatario, mensaje, token) {
    if (!token) {
      console.error("No hay token disponible para enviar mensaje");
      return false;
    }
    if (!this.isValidGuid(destinatarioId)) {
      console.error("El destinatarioId no es un GUID válido");
      return false;
    }
    const emisorId = this.getUserIdFromToken(token);
    const tipoEmisor = this.getUserRoleFromToken(token) === 'Usuario' ? 'Usuario' : 'Paseador';
  
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke("EnviarMensaje", {
          enviadorId: emisorId,
          tipoEmisor: tipoEmisor,
          destinatarioId: destinatarioId,
          tipoDestinatario: tipoDestinatario,
          mensaje: mensaje
        });
        return true;
      } catch (error) {
        console.error("Error al enviar mensaje:", error);
        return false;
      }
    }
    return false;
  }

// Función para obtener ID del token
getUserIdFromToken(token) {
  try {
    const parts = token.split('.');
    const payload = parts[1];
    const decoded = atob(payload);
    const parsed = JSON.parse(decoded);
    return parsed.sub;
  } catch (e) {
    console.error("Error al obtener ID del token:", e);
    return null;
  }
}

getUserRoleFromToken(token) {
  try {
    const parts = token.split('.');
    const payload = parts[1];
    const decoded = atob(payload);
    const parsed = JSON.parse(decoded);
    return parsed["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  } catch (e) {
    console.error("Error al obtener rol del token:", e);
    return null;
  }
}

  // Agrega este método a la clase ChatService
  isValidGuid(str) {
    if (!str) return false;
    const guidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return guidRegex.test(str);
  }

  async markAsRead(messageId) {
    if (
      this.connection &&
      this.connection.state === signalR.HubConnectionState.Connected
    ) {
      try {
        await this.connection.invoke("MarcarLeido", messageId);
        return true;
      } catch (error) {
        console.error("Error al marcar como leído:", error);
        return false;
      }
    }
    return false;
  }

  async disconnect() {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log("Desconectado de SignalR");
      } catch (error) {
        console.error("Error al desconectar de SignalR:", error);
      }
    }
  }
}

export default ChatService;

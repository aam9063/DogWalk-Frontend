// src/services/chatService.js
import * as signalR from "@microsoft/signalr";

class ChatService {
  constructor() {
    this.connection = null;
    this.callbacks = {
      messageReceived: () => {},
      messageRead: () => {},
      connectionError: () => {},
      connectionReconnecting: () => {},
      connectionReconnected: () => {},
    };
    this.baseUrl = import.meta.env.VITE_API_URL;
    this.isConnecting = false;
    this.connectionPromise = null;
    this.maxRetries = 3;
    this.currentRetry = 0;
    this.lastToken = null;
  }

  async connect(token) {
    if (!token) {
      console.error("Error: No se proporcionó token para la conexión");
      return false;
    }


    // Si ya hay una conexión activa y está conectada, retornarla
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      return true;
    }

    // Si ya hay un intento de conexión en curso, esperar a que termine
    if (this.isConnecting && this.connectionPromise) {
      return this.connectionPromise;
    }

    try {
      this.isConnecting = true;

      if (this.connection) {
        await this.connection.stop();
        this.connection = null;
      }

      const hubUrl = `${this.baseUrl}/chatHub`;

      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => {
            return token;
          },
          transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
          skipNegotiation: false,
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        .withHubProtocol(new signalR.JsonHubProtocol())
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: retryContext => {
            if (this.currentRetry >= this.maxRetries) {
              return null;
            }
            this.currentRetry++;
            const delay = Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 10000);
            return delay;
          }
        })
        .configureLogging(signalR.LogLevel.Trace)
        .build();

      // Configura los controladores de eventos
      this.setupEventHandlers();

      this.connectionPromise = this.connection.start()
        .then(() => {
          this.currentRetry = 0;
          return true;
        })
        .catch((error) => {
          console.error("Error al conectar con SignalR:", error);
          console.error("Detalles completos del error:", {
            message: error.message,
            stack: error.stack,
            innerError: error.innerError
          });
          this.callbacks.connectionError(error);
          return false;
        })
        .finally(() => {
          this.isConnecting = false;
          this.connectionPromise = null;
        });

      return await this.connectionPromise;
    } catch (error) {
      console.error("Error al conectar con SignalR:", error);
      console.error("Detalles completos del error:", {
        message: error.message,
        stack: error.stack,
        innerError: error.innerError
      });
      this.callbacks.connectionError(error);
      this.isConnecting = false;
      this.connectionPromise = null;
      return false;
    }
  }

  setupEventHandlers() {
    
    this.connection.on("RecibirMensaje", (mensaje) => {
      // Asegurarse de que el mensaje tenga toda la información necesaria
      const mensajeCompleto = {
        ...mensaje,
        fechaHora: mensaje.fechaHora || new Date().toISOString(),
        leido: mensaje.leido || false,
        id: mensaje.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      
      // Asegurar que el callback se ejecute en el siguiente ciclo
      setTimeout(() => {
        this.callbacks.messageReceived(mensajeCompleto);
      }, 0);
    });

    this.connection.on("MensajeLeido", (mensajeId) => {
      this.callbacks.messageRead(mensajeId);
    });

    this.connection.onclose((error) => {
      this.currentRetry = 0;
      this.callbacks.connectionError(error);
      // Intentar reconectar automáticamente
      this.retryConnection();
    });

    this.connection.onreconnecting((error) => {
      this.callbacks.connectionReconnecting(error);
    });

    this.connection.onreconnected((connectionId) => {
      this.currentRetry = 0;
      this.callbacks.connectionReconnected(connectionId);
    });
  }

  async retryConnection() {
    if (this.currentRetry < this.maxRetries) {
      const delay = Math.min(1000 * Math.pow(2, this.currentRetry), 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
      this.currentRetry++;
      await this.connect(this.lastToken);
    }
  }

  onMessageReceived(callback) {
    this.callbacks.messageReceived = callback;
  }

  onMessageRead(callback) {
    this.callbacks.messageRead = callback;
  }

  onConnectionError(callback) {
    this.callbacks.connectionError = callback;
  }

  onConnectionReconnecting(callback) {
    this.callbacks.connectionReconnecting = callback;
  }

  onConnectionReconnected(callback) {
    this.callbacks.connectionReconnected = callback;
  }

  async sendMessage(destinatarioId, tipoDestinatario, mensaje, token) {
    this.lastToken = token;
    
    if (!token) {
      console.error("Error: No hay token disponible para enviar mensaje");
      return false;
    }

    if (!this.isValidGuid(destinatarioId)) {
      console.error("Error: El destinatarioId no es un GUID válido:", destinatarioId);
      return false;
    }

    let retryCount = 0;
    const maxRetries = 2;

    while (retryCount <= maxRetries) {
      try {
        const emisorId = this.getUserIdFromToken(token);
        const tipoEmisor = this.getUserRoleFromToken(token) === 'Usuario' ? 'Usuario' : 'Paseador';

        if (!emisorId) {
          console.error("Error: No se pudo obtener el ID del emisor del token");
          return false;
        }

        // Verificar y reconectar si es necesario
        if (this.connection?.state !== signalR.HubConnectionState.Connected) {
          const connected = await this.connect(token);
          if (!connected) {
            retryCount++;
            if (retryCount <= maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
              continue;
            }
            throw new Error("No se pudo establecer la conexión");
          }
        }

        await this.connection.invoke("EnviarMensaje", {
          enviadorId: emisorId,
          tipoEmisor: tipoEmisor,
          destinatarioId: destinatarioId,
          tipoDestinatario: tipoDestinatario,
          mensaje: mensaje
        });
        
        return true;
      } catch (error) {
        console.error(`Error en intento ${retryCount + 1}:`, error);
        retryCount++;
        
        if (retryCount > maxRetries) {
          console.error("Error detallado al enviar mensaje después de reintentos:", error);
          this.callbacks.connectionError(error);
          return false;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }
    
    return false;
  }

  getUserIdFromToken(token) {
    try {
      const parts = token.split('.');
      const payload = parts[1];
      const decoded = atob(payload);
      const parsed = JSON.parse(decoded);
      return parsed.sub || parsed.nameid; // Intentar ambos claims
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
      return parsed.role || parsed["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    } catch (e) {
      console.error("Error al obtener rol del token:", e);
      return null;
    }
  }

  isValidGuid(str) {
    if (!str) return false;
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return guidRegex.test(str);
  }

  async markAsRead(messageId) {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
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
        this.currentRetry = 0;
        this.connection = null;
      } catch (error) {
        console.error("Error al desconectar de SignalR:", error);
      }
    }
  }
}

export default ChatService;

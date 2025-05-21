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
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5204';
    this.isConnecting = false;
    this.connectionPromise = null;
    this.maxRetries = 3;
    this.currentRetry = 0;
    console.log('ChatService inicializado con URL base:', this.baseUrl);
  }

  async connect(token) {
    if (!token) {
      console.error("Error: No se proporcionó token para la conexión");
      return false;
    }

    console.log('Estado actual de la conexión:', this.connection?.state);

    // Si ya hay una conexión activa y está conectada, retornarla
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      console.log('Reutilizando conexión existente');
      return true;
    }

    // Si ya hay un intento de conexión en curso, esperar a que termine
    if (this.isConnecting && this.connectionPromise) {
      console.log('Esperando intento de conexión en curso...');
      return this.connectionPromise;
    }

    try {
      this.isConnecting = true;
      console.log("Iniciando nueva conexión...");

      if (this.connection) {
        console.log('Deteniendo conexión anterior...');
        await this.connection.stop();
        this.connection = null;
      }

      const hubUrl = `${this.baseUrl}/chatHub`;
      console.log("Intentando conectar a:", hubUrl);
      console.log("Token (primeros 20 caracteres):", token.substring(0, 20));

      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => {
            console.log('Proporcionando token para la conexión');
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
            console.log('Evaluando reintento:', retryContext);
            if (this.currentRetry >= this.maxRetries) {
              console.log("Máximo número de reintentos alcanzado");
              return null;
            }
            this.currentRetry++;
            const delay = Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 10000);
            console.log(`Reintentando conexión en ${delay}ms (intento ${this.currentRetry})`);
            return delay;
          }
        })
        .configureLogging(signalR.LogLevel.Trace)
        .build();

      // Configura los controladores de eventos
      this.setupEventHandlers();

      console.log('Iniciando conexión...');
      this.connectionPromise = this.connection.start()
        .then(() => {
          console.log("Conexión establecida exitosamente");
          console.log("Estado de la conexión:", this.connection.state);
          console.log("ID de la conexión:", this.connection.connectionId);
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
    console.log('Configurando manejadores de eventos...');
    
    this.connection.on("RecibirMensaje", (mensaje) => {
      console.log("Mensaje recibido:", mensaje);
      this.callbacks.messageReceived(mensaje);
    });

    this.connection.on("MensajeLeido", (mensajeId) => {
      console.log("Mensaje marcado como leído:", mensajeId);
      this.callbacks.messageRead(mensajeId);
    });

    this.connection.onclose((error) => {
      console.log("Conexión cerrada:", error);
      this.currentRetry = 0;
      this.callbacks.connectionError(error);
    });

    this.connection.onreconnecting((error) => {
      console.log("Intentando reconectar:", error);
      this.callbacks.connectionReconnecting(error);
    });

    this.connection.onreconnected((connectionId) => {
      console.log("Reconectado con ID:", connectionId);
      this.currentRetry = 0;
      this.callbacks.connectionReconnected(connectionId);
    });
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
    console.log("Intentando enviar mensaje con token:", token ? "presente" : "ausente");
    
    if (!token) {
      console.error("Error: No hay token disponible para enviar mensaje");
      return false;
    }

    if (!this.isValidGuid(destinatarioId)) {
      console.error("Error: El destinatarioId no es un GUID válido:", destinatarioId);
      return false;
    }

    try {
      const emisorId = this.getUserIdFromToken(token);
      const tipoEmisor = this.getUserRoleFromToken(token) === 'Usuario' ? 'Usuario' : 'Paseador';

      if (!emisorId) {
        console.error("Error: No se pudo obtener el ID del emisor del token");
        return false;
      }

      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        if (this.connection?.state === signalR.HubConnectionState.Connected) {
          await this.connection.invoke("EnviarMensaje", {
            enviadorId: emisorId,
            tipoEmisor: tipoEmisor,
            destinatarioId: destinatarioId,
            tipoDestinatario: tipoDestinatario,
            mensaje: mensaje
          });
          console.log("Mensaje enviado exitosamente");
          return true;
        } else {
          console.log(`Intento de reconexión ${retryCount + 1}/${maxRetries}`);
          const connected = await this.connect(token);
          if (!connected) {
            retryCount++;
            if (retryCount < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            }
          }
        }
      }
      
      throw new Error("No se pudo establecer la conexión después de varios intentos");
    } catch (error) {
      console.error("Error detallado al enviar mensaje:", error);
      this.callbacks.connectionError(error);
      return false;
    }
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
        console.log("Desconectado de SignalR");
      } catch (error) {
        console.error("Error al desconectar de SignalR:", error);
      }
    }
  }
}

export default ChatService;

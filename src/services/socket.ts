import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '../config/api';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    this.socket = io(API_BASE_URL, {
      auth: {
        token: token
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  // Connection management
  joinConnection(connectionId: number) {
    if (this.socket) {
      this.socket.emit('join_connection', connectionId);
    }
  }

  // Messaging
  sendMessage(connectionId: number, content: string, messageType: string = 'TEXT') {
    if (this.socket) {
      this.socket.emit('send_message', {
        connectionId,
        content,
        messageType
      });
    }
  }

  // Typing indicators
  startTyping(connectionId: number) {
    if (this.socket) {
      this.socket.emit('typing_start', { connectionId });
    }
  }

  stopTyping(connectionId: number) {
    if (this.socket) {
      this.socket.emit('typing_stop', { connectionId });
    }
  }

  // Event listeners
  onNewMessage(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  onMessageNotification(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('message_notification', callback);
    }
  }

  onMatchNotification(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('match_notification', callback);
    }
  }

  onUserTyping(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  onUserStoppedTyping(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('user_stopped_typing', callback);
    }
  }

  // Remove listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

export default new SocketService();
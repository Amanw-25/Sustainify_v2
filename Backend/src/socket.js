class SocketManager {
  constructor() {
    this.activeUsers = new Map();
    this.userRooms = new Map();
  }

  handleConnection(socket, io) {
    console.log('New socket connection:', socket.id);

    // User authentication/registration
    socket.on('register', (userId) => {
      this.registerUser(socket, userId);
    });

    // Real-time event tracking
    socket.on('join-event', (eventData) => {
      this.joinEvent(socket, eventData);
    });

    // Messaging system
    socket.on('send-message', (messageData) => {
      this.broadcastMessage(io, messageData);
    });

    // Disconnect handling
    socket.on('disconnect', () => {
      this.handleDisconnect(socket);
    });
  }

  registerUser(socket, userId) {
    this.activeUsers.set(socket.id, userId);
    socket.emit('registration-confirmed', { userId });
  }

  joinEvent(socket, eventData) {
    const { eventId, userId } = eventData;
    socket.join(eventId);
    
    if (!this.userRooms.has(userId)) {
      this.userRooms.set(userId, new Set());
    }
    this.userRooms.get(userId).add(eventId);
  }

  broadcastMessage(io, messageData) {
    const { eventId, message, senderId } = messageData;
    io.to(eventId).emit('receive-message', { 
      senderId, 
      message, 
      timestamp: new Date() 
    });
  }

  handleDisconnect(socket) {
    const userId = this.activeUsers.get(socket.id);
    
    if (userId) {
      // Remove user from active users
      this.activeUsers.delete(socket.id);

      // Leave all rooms
      const userRooms = this.userRooms.get(userId);
      if (userRooms) {
        userRooms.forEach(room => {
          socket.leave(room);
        });
        this.userRooms.delete(userId);
      }
    }

    console.log('Socket disconnected:', socket.id);
  }
}

const socketManager = new SocketManager();

export default (socket, io) => {
  socketManager.handleConnection(socket, io);
};
class SocketManager {
  constructor(io) {
    this.io = io;
    this.activeUsers = new Map();
    this.userRooms = new Map();
    this.typingUsers = new Map();

    io.on("connection", (socket) => this.handleConnection(socket));
    console.log("WebSocket Server Initialized");
  }

  handleConnection(socket) {
    console.log("New socket connection:", socket.id);

    socket.on("register", (userId) => {
      this.registerUser(socket, userId);
    });

    socket.on("join-event", (eventData) => {
      this.joinEvent(socket, eventData);
    });

    socket.on("send-message", (messageData) => {
      this.broadcastMessage(messageData);
      
    });

    socket.on("join-community", (userId) => {
      this.joinCommunity(socket, userId);
    });

    socket.on("create-post", (postData) => {
      this.handleNewPost(postData);
    });

    socket.on("like-post", (likeData) => {
      this.handlePostLike(likeData);
    });

    socket.on("add-comment", (commentData) => {
      this.handleNewComment(commentData);
    });

    socket.on("typing-comment", (typingData) => {
      this.handleTypingIndicator(socket, typingData);
    });

    socket.on("disconnect", () => {
      this.handleDisconnect(socket);
    });
  }

  registerUser(socket, userId) {
    this.activeUsers.set(socket.id, userId);
    socket.emit("registration-confirmed", { userId });
  }

  joinEvent(socket, eventData) {
    const { eventId, userId } = eventData;
    socket.join(eventId);
    
    if (!this.userRooms.has(userId)) {
      this.userRooms.set(userId, new Set());
    }
    this.userRooms.get(userId).add(eventId);
  }

  broadcastMessage(messageData) {
    const { eventId, message, senderId } = messageData;
    this.io.to(eventId).emit("receive-message", {
      senderId,
      message,
      timestamp: new Date(),
    });
  }
  
  joinCommunity(socket, userId) {
    socket.join("community");
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined community`);
  }

  handleNewPost(postData) {
    const { post, user } = postData;
    this.io.to("community").emit("new-post", {
      post,
      user,
      timestamp: new Date(),
    });
  }

  handlePostLike(likeData) {
    const { postId, userId, action } = likeData;
    this.io.to("community").emit("post-like-update", {
      postId,
      userId,
      action,
      timestamp: new Date(),
    });
  }

  handleNewComment(commentData) {
    const { postId, comment, user } = commentData;
    this.io.to("community").emit("new-comment", {
      postId,
      comment,
      user,
      timestamp: new Date(),
    });

    if (comment.postAuthorId) {
      this.io.to(`user_${comment.postAuthorId}`).emit("comment-notification", {
        postId,
        comment,
        user,
        timestamp: new Date(),
      });
    }
  }

  handleTypingIndicator(socket, typingData) {
    const { postId, userId, isTyping } = typingData;
    
    const typingKey = `${postId}:${userId}`;
    if (isTyping) {
      this.typingUsers.set(typingKey, Date.now());
    } else {
      this.typingUsers.delete(typingKey);
    }

    socket.broadcast.to("community").emit("typing-indicator", {
      postId,
      userId,
      isTyping,
    });

    if (isTyping) {
      setTimeout(() => {
        const lastTypingTime = this.typingUsers.get(typingKey);
        if (lastTypingTime && Date.now() - lastTypingTime >= 3000) {
          this.typingUsers.delete(typingKey);
          socket.broadcast.to("community").emit("typing-indicator", {
            postId,
            userId,
            isTyping: false,
          });
        }
      }, 3000);
    }
  }

  handleDisconnect(socket) {
    const userId = this.activeUsers.get(socket.id);
    if (userId) {
      this.activeUsers.delete(socket.id);

      const userRooms = this.userRooms.get(userId);
      if (userRooms) {
        userRooms.forEach((room) => {
          socket.leave(room);
        });
        this.userRooms.delete(userId);
      }

      socket.leave("community");
      socket.leave(`user_${userId}`);

      for (const key of this.typingUsers.keys()) {
        if (key.includes(userId)) {
          this.typingUsers.delete(key);
        }
      }
    }

    console.log("Socket disconnected:", socket.id);
  }
}

export default SocketManager;

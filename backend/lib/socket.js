import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

// Create Express app
export const app = express();

// Create HTTP server
export const server = createServer(app);

// Initialize Socket.IO
export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"]
  },
});

// Store online users: userId -> socketId
const onlineUsers = new Map();

// Attach io to app for use in controllers
app.set('io', io);

io.on("connection", (socket) => {
  const { userId, contacts, token } = socket.handshake.auth;

  if (!userId) {
    console.log("⚠️ No userId provided, disconnecting socket");
    socket.disconnect();
    return;
  }

  console.log(`✅ User connected: ${userId} (Socket ID: ${socket.id})`);

  // Add user to online users
  onlineUsers.set(userId, socket.id);

  // Send list of currently online users to the newly connected user
  const onlineUserIds = Array.from(onlineUsers.keys());
  socket.emit("getOnlineUsers", onlineUserIds);

  // Notify all contacts that this user is now online
  if (contacts && Array.isArray(contacts)) {
    contacts.forEach((contactId) => {
      const contactSocketId = onlineUsers.get(contactId);
      if (contactSocketId) {
        io.to(contactSocketId).emit("userOnline", userId);
      }
    });
  }

  // ===========================
  // 📩 SEND MESSAGE
  // ===========================
  socket.on("sendMessage", async (messageData) => {
    console.log("📤 Sending message via socket:", messageData);

    const { receiverId, senderId, contactId } = messageData;

    // Emit to receiver if online
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", messageData);
      console.log(`✅ Message delivered to ${receiverId} (${receiverSocketId})`);
    } else {
      console.log(`⚠️ Receiver ${receiverId} is offline`);
    }

    // Also emit back to sender for confirmation (optional)
    socket.emit("receiveMessage", messageData);
  });

  // ===========================
  // ⌨️ TYPING INDICATOR
  // ===========================
  socket.on("typing", ({ contactId, isTyping }) => {
    console.log(`💬 User ${userId} is ${isTyping ? "typing" : "idle"} to ${contactId}`);

    const contactSocketId = onlineUsers.get(contactId);
    if (contactSocketId) {
      io.to(contactSocketId).emit("userTyping", {
        contactId: userId,
        isTyping,
      });
    }
  });

  // ===========================
  // ✓ MESSAGE STATUS UPDATE (READ/DELIVERED)
  // ===========================
  socket.on("messageStatusUpdate", ({ messageId, status }) => {
    console.log(`✓ Message ${messageId} status update:`, status);

    // Broadcast to all connected users
    io.emit("messageStatusUpdate", { messageId, status });
  });

  // ===========================
  // 🔌 DISCONNECT
  // ===========================
  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${userId} (${socket.id})`);

    // Remove from online users
    onlineUsers.delete(userId);

    // Notify all contacts that user went offline
    if (contacts && Array.isArray(contacts)) {
      contacts.forEach((contactId) => {
        const contactSocketId = onlineUsers.get(contactId);
        if (contactSocketId) {
          io.to(contactSocketId).emit("userOffline", userId);
        }
      });
    }

    // Also broadcast to all users
    io.emit("userOffline", userId);
  });

  // ===========================
  // 🔄 ERROR HANDLING
  // ===========================
  socket.on("error", (error) => {
    console.error(`❌ Socket error for user ${userId}:`, error);
  });
});

console.log("🔌 Socket.IO initialized");
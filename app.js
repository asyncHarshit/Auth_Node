import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static('socket'));

// Store users
const users = new Map(); // socket.id -> username

// Utility function for timestamps
const getTimestamp = () => {
  const now = new Date();
  return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
};

io.on("connection", (socket) => {
  console.log(`\n🔗 ${getTimestamp()} NEW CONNECTION`);
  console.log(`📱 Socket ID: ${socket.id}`);
  console.log(`👥 Total connections: ${io.engine.clientsCount}`);

  // Handle user joining
  socket.on('join', (username) => {
    const trimmedUsername = username.trim();
    
    if (!trimmedUsername || trimmedUsername.length < 2) {
      socket.emit('error', { message: 'Username must be at least 2 characters' });
      return;
    }

    // Check if username exists
    const existingUser = Array.from(users.values()).find(
      user => user.toLowerCase() === trimmedUsername.toLowerCase()
    );
    
    if (existingUser) {
      socket.emit('error', { message: 'Username already taken' });
      return;
    }

    users.set(socket.id, trimmedUsername);
    
    console.log(`\n✅ ${getTimestamp()} USER JOINED`);
    console.log(`👤 Username: ${trimmedUsername}`);
    console.log(`🆔 Socket: ${socket.id}`);
    console.log(`👥 Online users: ${users.size}`);

    // Notify all clients
    socket.broadcast.emit("userJoined", trimmedUsername);
    io.emit("userList", Array.from(users.values()));
  });

  // Handle messages
  socket.on('sendMessage', ({ user, message }) => {
    const userData = users.get(socket.id);
    const trimmedMessage = message.trim();
    
    if (!userData || !trimmedMessage) {
      return;
    }

    console.log(`\n💬 ${getTimestamp()} MESSAGE SENT`);
    console.log(`👤 From: ${userData}`);
    console.log(`📝 Message: "${trimmedMessage}"`);
    console.log(`📡 Broadcasting to ${users.size - 1} users`);

    socket.broadcast.emit("chatMessage", { 
      user: userData, 
      message: trimmedMessage 
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    if (username) {
      users.delete(socket.id);
      socket.broadcast.emit("userLeft", username);
      io.emit("userList", Array.from(users.values()));
      
      console.log(`\n❌ ${getTimestamp()} USER DISCONNECTED`);
      console.log(`👤 Username: ${username}`);
      console.log(`🆔 Socket: ${socket.id}`);
      console.log(`👥 Remaining users: ${users.size}`);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║                        🚀 CHAT SERVER ONLINE                         ║
╠══════════════════════════════════════════════════════════════════════╣
║  🌐 Server URL:   http://localhost:${PORT.toString().padEnd(5)}                             ║
║  ⏰ Time:         ${new Date().toLocaleTimeString().padEnd(12)}                                       ║
║  📅 Started:      ${new Date().toLocaleDateString().padEnd(12)}                                       ║
║  🔧 Environment:  ${(process.env.NODE_ENV || 'development').padEnd(12)}                                       ║
╠══════════════════════════════════════════════════════════════════════╣
║  📊 Status:      Ready to accept connections                         ║
║  🎯 Socket.IO:   Enabled                                             ║
║  📁 Static Dir:  ./socket                                            ║
╚══════════════════════════════════════════════════════════════════════╝
`);
  
  console.log(`\n🎉 ${getTimestamp()} SERVER READY`);
  console.log(`💡 Waiting for connections...`);
});
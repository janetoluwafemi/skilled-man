// Import required modules
const { createServer } = require('http');
const { Server } = require('socket.io');

// Create an HTTP server
const httpServer = createServer();

// Create a socket.io server and enable CORS
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000" // Specify the origin of your client application
  }
});

// Set up event handlers when a client connects or disconnects
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Listen on port 4000
httpServer.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});

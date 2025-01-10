const express = require('express');
const http = require("http");
const { Server } = require("socket.io");
const { sequelize } = require('./models/user');
const authRoutes = require('./routes/auth');
const tutorRoutes = require('./routes/tutor');
const adminRoutes = require('./routes/admin');
const reviewRoutes = require('./routes/rewiews.js');
const filterRoutes = require('./routes/filterTutor.js');
const messageRoutes = require("./routes/messageRoutes.js"); // NEW
const path = require('path');
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST"],
  },
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tutor', tutorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/filterTutor', filterRoutes);
app.use('/api/messages', messageRoutes); // NEW

// Socket.IO for Real-time Messaging
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("send_message", (data) => {
    const { senderId, receiverId, content } = data;

    // Emit message to the receiver
    io.emit("receive_message", {
      senderId,
      receiverId,
      content,
      timestamp: new Date(),
    });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Database Connection
sequelize.sync().then(() => {
  console.log("Database connected");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

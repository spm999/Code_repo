const express = require("express");
const cors = require("cors");
const connectDB = require("./utils/database"); // ✅ Import the connection function
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const codeRoutes = require("./routes/codeRoutes"); // ✅ Import code routes


const app = express();

// ✅ Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// ✅ Mount routes
app.use("/api/users", userRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/code", codeRoutes); // ✅ Mount code routes

// ✅ Health check
app.get("/", (req, res) => {
  res.send("🚀 Centralized Code Repository API running...");
});


// Add to your server.js or routes
app.get('/api/health/storage', async (req, res) => {
  try {
    const health = await checkStorageHealth();
    res.json({ success: true, data: health });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Storage health check failed' });
  }
});


const startServer = async () => {
  try {
    await connectDB(); 
    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    server.timeout = 600000;
    server.keepAliveTimeout = 120000;
    server.headersTimeout = 120000;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};
startServer();


// Add to the very top of server.js
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception thrown:', error);
  // Don't exit the process
});


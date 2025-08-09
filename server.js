import express from "express";
import cors from "cors";

// Import routes
import jsonRoutes from "./routes/routes.js";
import backupRoutes from "./routes/backup-routes.js";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(".")); // Serve static files from current directory

// API Routes
app.use("/api/json", jsonRoutes);
app.use("/api/backups", backupRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    success: false,
    message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
    error: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server กำลังทำงานที่ http://localhost:${PORT}`);
  console.log(
    `📝 JSON Editor: http://localhost:${PORT}/admin/json-editor.html`
  );
  console.log(`🌐 Website: http://localhost:${PORT}/index.html`);
});

export default app;

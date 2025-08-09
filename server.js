const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000; // ใช้แต่พอร์ต 3000 สำหรับเซิร์ฟเวอร์

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(".")); // Serve static files from current directory

// API endpoint สำหรับอ่านไฟล์ JSON
app.get("/api/json/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "data", `${filename}.json`);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(`เกิดข้อผิดพลาดในการอ่านไฟล์ ${filename}:`, err);
      return res.status(500).json({
        success: false,
        message: `ไม่สามารถอ่านไฟล์ ${filename}.json ได้`,
        error: err.message,
      });
    }

    try {
      const jsonData = JSON.parse(data);
      res.json({
        success: true,
        data: jsonData,
        filename: filename,
      });
    } catch (parseErr) {
      console.error(`ข้อผิดพลาดในการแปลง JSON ของไฟล์ ${filename}:`, parseErr);
      res.status(400).json({
        success: false,
        message: `ไฟล์ ${filename}.json มีรูปแบบไม่ถูกต้อง`,
        error: parseErr.message,
      });
    }
  });
});

// API endpoint สำหรับเขียนไฟล์ JSON
app.post("/api/json/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "data", `${filename}.json`);
  const jsonData = req.body;

  // สร้าง backup ก่อนเซฟ
  const backupPath = path.join(
    __dirname,
    "data",
    "backups",
    `${filename}_${Date.now()}.json`
  );

  // สร้างโฟลเดอร์ backup ถ้ายังไม่มี
  const backupDir = path.dirname(backupPath);
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // อ่านไฟล์เดิมเพื่อทำ backup
  fs.readFile(filePath, "utf8", (readErr, oldData) => {
    if (!readErr && oldData) {
      // สร้าง backup ของไฟล์เดิม
      fs.writeFile(backupPath, oldData, (backupErr) => {
        if (backupErr) {
          console.warn(`ไม่สามารถสร้าง backup สำหรับ ${filename}:`, backupErr);
        } else {
          console.log(`สร้าง backup: ${backupPath}`);
        }
      });
    }

    // เขียนไฟล์ใหม่
    const jsonString = JSON.stringify(jsonData, null, 2);
    fs.writeFile(filePath, jsonString, "utf8", (writeErr) => {
      if (writeErr) {
        console.error(`เกิดข้อผิดพลาดในการเขียนไฟล์ ${filename}:`, writeErr);
        return res.status(500).json({
          success: false,
          message: `ไม่สามารถบันทึกไฟล์ ${filename}.json ได้`,
          error: writeErr.message,
        });
      }

      console.log(`ไฟล์ ${filename}.json ถูกอัพเดตเรียบร้อยแล้ว`);
      res.json({
        success: true,
        message: `บันทึกไฟล์ ${filename}.json สำเร็จ`,
        filename: filename,
        timestamp: new Date().toISOString(),
      });
    });
  });
});

// API endpoint สำหรับดูรายการไฟล์ JSON
app.get("/api/json", (req, res) => {
  const dataDir = path.join(__dirname, "data");

  fs.readdir(dataDir, (err, files) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "ไม่สามารถอ่านโฟลเดอร์ data ได้",
        error: err.message,
      });
    }

    const jsonFiles = files
      .filter((file) => file.endsWith(".json"))
      .map((file) => {
        const filename = file.replace(".json", "");
        const filePath = path.join(dataDir, file);
        const stats = fs.statSync(filePath);

        return {
          filename: filename,
          fullname: file,
          size: stats.size,
          modified: stats.mtime,
          created: stats.birthtime,
        };
      });

    res.json({
      success: true,
      files: jsonFiles,
    });
  });
});

// API endpoint สำหรับดู backup files
app.get("/api/backups/:filename?", (req, res) => {
  const filename = req.params.filename;
  const backupDir = path.join(__dirname, "data", "backups");

  if (!fs.existsSync(backupDir)) {
    return res.json({ success: true, backups: [] });
  }

  fs.readdir(backupDir, (err, files) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "ไม่สามารถอ่านโฟลเดอร์ backup ได้",
        error: err.message,
      });
    }

    let backupFiles = files.filter((file) => file.endsWith(".json"));

    if (filename) {
      backupFiles = backupFiles.filter((file) =>
        file.startsWith(filename + "_")
      );
    }

    const backups = backupFiles
      .map((file) => {
        const filePath = path.join(backupDir, file);
        const stats = fs.statSync(filePath);

        return {
          filename: file,
          originalFile: file.split("_")[0],
          size: stats.size,
          created: stats.birthtime,
        };
      })
      .sort((a, b) => new Date(b.created) - new Date(a.created));

    res.json({
      success: true,
      backups: backups,
    });
  });
});

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

module.exports = app;

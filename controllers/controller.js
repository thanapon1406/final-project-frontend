import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Controller {
  // GET /api/json/:filename - อ่านไฟล์ JSON
  static getJsonFile(req, res) {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "..", "data", `${filename}.json`);

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
        console.error(
          `ข้อผิดพลาดในการแปลง JSON ของไฟล์ ${filename}:`,
          parseErr
        );
        res.status(400).json({
          success: false,
          message: `ไฟล์ ${filename}.json มีรูปแบบไม่ถูกต้อง`,
          error: parseErr.message,
        });
      }
    });
  }

  // POST /api/json/:filename - เขียนไฟล์ JSON
  static saveJsonFile(req, res) {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "..", "data", `${filename}.json`);
    const jsonData = req.body;

    // สร้าง backup ก่อนเซฟ
    const backupPath = path.join(
      __dirname,
      "..",
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
            console.warn(
              `ไม่สามารถสร้าง backup สำหรับ ${filename}:`,
              backupErr
            );
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
  }

  // GET /api/json - ดูรายการไฟล์ JSON
  static getJsonFileList(req, res) {
    const dataDir = path.join(__dirname, "..", "data");

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
  }

  // GET /api/backups/:filename? - ดู backup files
  static getBackupFiles(req, res) {
    const filename = req.params.filename;
    const backupDir = path.join(__dirname, "..", "data", "backups");

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
  }
}

export default Controller;

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AuthController {
  // POST /api/auth/login - เข้าสู่ระบบ
  static login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอก username และ password",
      });
    }

    const usersPath = path.join(__dirname, "..", "data", "users.json");

    fs.readFile(usersPath, "utf8", (err, data) => {
      if (err) {
        console.error("เกิดข้อผิดพลาดในการอ่านไฟล์ users:", err);
        return res.status(500).json({
          success: false,
          message: "เกิดข้อผิดพลาดในระบบ",
        });
      }

      try {
        const usersData = JSON.parse(data);
        const user = usersData.users.find(
          (u) => u.username === username && u.password === password && u.active
        );

        if (!user) {
          return res.status(401).json({
            success: false,
            message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
          });
        }

        // อัพเดท lastLogin
        user.lastLogin = new Date().toISOString();

        // บันทึกการอัพเดท lastLogin
        fs.writeFile(
          usersPath,
          JSON.stringify(usersData, null, 2),
          (writeErr) => {
            if (writeErr) {
              console.warn("ไม่สามารถอัพเดท lastLogin ได้:", writeErr);
            }
          }
        );

        // ส่งข้อมูล user กลับ (ไม่รวม password)
        const { password: _, ...userWithoutPassword } = user;

        res.json({
          success: true,
          message: "เข้าสู่ระบบสำเร็จ",
          user: userWithoutPassword,
          token: `session_${user.id}_${Date.now()}`, // Simple token
        });
      } catch (parseErr) {
        console.error("ข้อผิดพลาดในการแปลง JSON users:", parseErr);
        res.status(500).json({
          success: false,
          message: "เกิดข้อผิดพลาดในระบบ",
        });
      }
    });
  }

  // POST /api/auth/logout - ออกจากระบบ
  static logout(req, res) {
    res.json({
      success: true,
      message: "ออกจากระบบสำเร็จ",
    });
  }

  // GET /api/auth/users - ดูรายการผู้ใช้ (สำหรับ admin)
  static getUsers(req, res) {
    const usersPath = path.join(__dirname, "..", "data", "users.json");

    fs.readFile(usersPath, "utf8", (err, data) => {
      if (err) {
        console.error("เกิดข้อผิดพลาดในการอ่านไฟล์ users:", err);
        return res.status(500).json({
          success: false,
          message: "เกิดข้อผิดพลาดในระบบ",
        });
      }

      try {
        const usersData = JSON.parse(data);

        // ลบ password ออกจากข้อมูลที่ส่งกลับ
        const usersWithoutPassword = usersData.users.map((user) => {
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        });

        res.json({
          success: true,
          users: usersWithoutPassword,
        });
      } catch (parseErr) {
        console.error("ข้อผิดพลาดในการแปลง JSON users:", parseErr);
        res.status(500).json({
          success: false,
          message: "เกิดข้อผิดพลาดในระบบ",
        });
      }
    });
  }

  // POST /api/auth/change-password - เปลี่ยนรหัสผ่าน
  static changePassword(req, res) {
    const { username, oldPassword, newPassword } = req.body;

    if (!username || !oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอกข้อมูลให้ครบถ้วน",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร",
      });
    }

    const usersPath = path.join(__dirname, "..", "data", "users.json");

    fs.readFile(usersPath, "utf8", (err, data) => {
      if (err) {
        console.error("เกิดข้อผิดพลาดในการอ่านไฟล์ users:", err);
        return res.status(500).json({
          success: false,
          message: "เกิดข้อผิดพลาดในระบบ",
        });
      }

      try {
        const usersData = JSON.parse(data);
        const userIndex = usersData.users.findIndex(
          (u) =>
            u.username === username && u.password === oldPassword && u.active
        );

        if (userIndex === -1) {
          return res.status(401).json({
            success: false,
            message: "ชื่อผู้ใช้หรือรหัสผ่านเดิมไม่ถูกต้อง",
          });
        }

        // อัพเดทรหัสผ่าน
        usersData.users[userIndex].password = newPassword;

        // บันทึกไฟล์
        fs.writeFile(
          usersPath,
          JSON.stringify(usersData, null, 2),
          (writeErr) => {
            if (writeErr) {
              console.error("เกิดข้อผิดพลาดในการบันทึกไฟล์ users:", writeErr);
              return res.status(500).json({
                success: false,
                message: "ไม่สามารถเปลี่ยนรหัสผ่านได้",
              });
            }

            res.json({
              success: true,
              message: "เปลี่ยนรหัสผ่านสำเร็จ",
            });
          }
        );
      } catch (parseErr) {
        console.error("ข้อผิดพลาดในการแปลง JSON users:", parseErr);
        res.status(500).json({
          success: false,
          message: "เกิดข้อผิดพลาดในระบบ",
        });
      }
    });
  }
}

export default AuthController;

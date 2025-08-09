import express from "express";
import AuthController from "../controllers/AuthController.js";

const router = express.Router();

// POST /api/auth/login - เข้าสู่ระบบ
router.post("/login", AuthController.login);

// POST /api/auth/logout - ออกจากระบบ
router.post("/logout", AuthController.logout);

// GET /api/auth/users - ดูรายการผู้ใช้
router.get("/users", AuthController.getUsers);

// POST /api/auth/change-password - เปลี่ยนรหัสผ่าน
router.post("/change-password", AuthController.changePassword);

export default router;

import express from "express";
import Controller from "../controllers/Controller.js";

const router = express.Router();

// GET /api/json - ดูรายการไฟล์ JSON
router.get("/", Controller.getJsonFileList);

// GET /api/json/:filename - อ่านไฟล์ JSON
router.get("/:filename", Controller.getJsonFile);

// POST /api/json/:filename - เขียนไฟล์ JSON
router.post("/:filename", Controller.saveJsonFile);

export default router;

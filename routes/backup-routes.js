import express from "express";
import Controller from "../controllers/Controller.js";

const router = express.Router();

// GET /api/backups/:filename? - ดู backup files
router.get("/:filename?", Controller.getBackupFiles);

export default router;

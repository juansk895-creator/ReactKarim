import express, { Router } from 'express';
import { verifyToken, requireAdmin } from '../utils/auth.middleware.js';
import { listLogs } from '../controllers/logs.controller.js';

const router = Router();

router.get("/", verifyToken, requireAdmin, listLogs);

export default router;


import express from 'express';
import { getReportByRolePDF, getReportByRoleExcel } from '../controllers/reports.controller.js';
import { verifyToken, requireAdmin } from '../utils/auth.middleware.js';


const router = express.Router();

// Reporte PDF, revisar permisos
router.post('/users/role/:rol_id/pdf', verifyToken, requireAdmin);


// Reporte EXCEL, revisar permisos
router.post('/users/role/:rol_id/excel', verifyToken, requireAdmin);


export default router;



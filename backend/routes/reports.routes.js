import express from 'express';
import { getReportByRolePDF, getReportByStatusPDF, getReportGeneralPDF,
    getReportByRoleExcel, getReportByStatusExcel, getReportGeneralExcel
} from '../controllers/reports.controller.js';
import { verifyToken, requireAdmin } from '../utils/auth.middleware.js';

const router = express.Router();

// Reporte PDF, revisar permisos
router.post('/users/role/:rol_id/pdf', verifyToken, requireAdmin, getReportByRolePDF);
router.post('/users/status/:status_id/pdf', verifyToken, requireAdmin, getReportByStatusPDF);
router.post('/users/general/pdf', verifyToken, requireAdmin, getReportGeneralPDF);

// Reporte EXCEL, revisar permisos
router.post('/users/role/:rol_id/excel', verifyToken, requireAdmin, getReportByRoleExcel);
router.post('/users/status/:status_id/excel', verifyToken, requireAdmin, getReportByStatusExcel);
router.post('/users/general/excel', verifyToken, requireAdmin, getReportGeneralExcel);

export default router;

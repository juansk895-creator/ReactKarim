import express from 'express';
import { getReportByRolePDF, getReportByRoleExcel } from '../controllers/reports.controller.js';
import { verifyToken, requireAdmin } from '../utils/auth.middleware.js';


const router = express.Router();

// Reporte PDF, revisar permisos
//router.post('/users/role/:rol_id/pdf', verifyToken, requireAdmin, (req, res, next) => {
router.post('/users/role/:rol_id/pdf', verifyToken, requireAdmin, getReportByRolePDF); // => {
    //console.log("REPORT PDF HIT -> rol_id =", req.params.rol_id);
    //next();
//});


// Reporte EXCEL, revisar permisos
router.post('/users/role/:rol_id/excel', verifyToken, requireAdmin, getReportByRoleExcel);


export default router;



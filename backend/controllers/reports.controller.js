import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
// Archivos
import { getReportByRole, getReportByStatus,
    getReportAllRoles,
    getReportGeneral } from '../models/users.model.js';
import { generatePDF } from '../utils/pdf.utils.js';
import { generateExcel } from '../utils/excel.utils.js';

const buildChartsArray = (charts) => {
    if (!charts || typeof charts !== "object") {
        return [];
    }

    const ordered = [charts.role, charts.status, charts.age].filter(Boolean);
    return ordered;
};

// PDF
async function getReportByRolePDF(req, res) {
    try {
        const roleId = req.params.rol_id;
        const { includeChart, chartBase64 } = req.body;

        const users = await getReportByRole(roleId);

        /*const doc = new PDFDocument({ margin: 40 });
        res.setHeader('Content-Disposition', `attachment; filename=reporte_rol_${roleId}.pdf`);
        res.setHeader('Content-Type', 'application/pdf');

        doc.pipe(res);

        // Título
        doc.fontSize(20).text(`Reporte de Usuarios por Rol (${roleId})`, { align: 'center' });
        doc.moveDown();

        // Gráfica
        if (includeChart && chartBase64) {
            const chartImage = chartBase64.replace(/^data:image\/png;base64,/, "");
            const imgBuffer = Buffer.from(chartImage, 'base64');
            doc.image(imgBuffer, { fit: [450, 300], align: 'center' });
            doc.moveDown(2);
        }

        // Tabla
        doc.fontSize(14).text("Listado de usuarios:");
        doc.moveDown();

        doc.fontSize(10);

        users.forEach(u => {
            doc.text(
                `${u.id} - ${u.nombre} ${u.apellido_pat || ''} ${u.apellido_mat || ''} | ${u.email} | Estado: ${u.status_id}`
            );
        });
        doc.end();*/

        generatePDF({
            res,
            filename: `reporte_rol_${roleId}.pdf`,
            title: "Reporte de Usuarios por Rol",
            subtitle: `Rol ID: ${roleId}`,
            users,
            includeChart,
            chartBase64,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error generando PDF por rol (backend)' });
    }
}

async function getReportByStatusPDF(req, res) {
    try {
        //const { status_id } = req.params;
        //const data = await getReportByStatus(status_id);

        const statusId = req.params.status_id;
        const { includeChart, chartBase64 } = req.body;

        const users = await getReportByStatus(statusId);

        generatePDF({
            res,
            filename: `reporte_estado_${statusId}.pdf`,
            title: "Reporte de usuarios por Estado",
            subtitle: `Estado ID: ${statusId}`,
            users,
            includeChart,
            chartBase64,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error generando PDF por estado (backend)" });
    }
}

async function getReportGeneralPDF(req, res) {
    try {
        const users = await getReportGeneral();

        console.log("DEBUG getReportGeneralPDF keys:", users?.[0] ? Object.keys(users[0]) : "NO USERS");
        console.log("DEBUG getReportGeneralPDF first row:", users?.[0] || null);

        const { includeChart, charts } = req.body;

        const chartsBase64 = includeChart ? buildChartsArray(charts) : [];

        generatePDF({
            res,
            filename: "Reporte_general_usuarios.pdf",
            title: "Reporte General de Usuarios",
            subtitle: "Este documento muestra todos los usuarios existentes en el sistema. Se han ordenado en base al nivel del tipo de usuario y el estado que tengan", //"Todos los roles y estados",
            users,
            includeChart: !!includeChart,
            chartsBase64,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error generando PDF general (backend)" });
    }
}

// EXCEL
async function getReportByRoleExcel(req, res) {
    try {
        const roleId = req.params.rol_id;
        const users = await getReportByRole(roleId);

        //const workbook = new ExcelJS.Workbook();
        //const sheet = workbook.addWorksheet("Usuarios por rol");

        // Encabezado
        /*sheet.columns = [
            { header: "ID", key: "id", width: 10 },
            { header: "Nombre", key: "nombre", width: 30 },
            { header: "Email", key: "email", width: 30 },
            { header: "Rol", key: "rol", width: 15 },
            { header: "Estado", key: "estado", width: 15 },
            { header: "Fecha de registro", key: "creado", width: 20 },
        ];

        // Filas
        data.forEach(u => {
            sheet.addRow({
                id: u.id,
                nombre: `${u.nombre} ${u.apellido_pat || ""} ${u.apellido_mat || ""}`,
                email: u.email,
                rol: u.rol_id,
                estado: u.status_id === 1 ? "Activo" : "Inactivo",
                creado: u.created_at,
            });
        });

        sheet.getRow(1).font = { bold: true };

        const buffer = await workbook.xlsx.writeBuffer();

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=reporte_rol_${rol_id}.xlsx`);
        res.send(buffer);*/

        await generateExcel({
            res,
            filename: `reporte_rol_${roleId}.xlsx`,
            sheetName: "Usuarios por Rol",
            title: `Reporte de Usuarios por Rol (${roleId})`,
            columns: [
                { header: "ID", key: "id", width: 10 },
                { header: "Nombre", key: "nombre", width: 20 },
                { header: "Apellido Paterno", key: "apellido_pat", width: 20 },
                { header: "Apellido Materno", key: "apellido_mat", width: 20 },
                { header: "Email", key: "email", width: 30 },
                { header: "Estado", key: "estado", width: 15 }
            ],
            rows: users,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: "Error generado Excel por rol (backend)" });
    }
}

async function getReportByStatusExcel(req, res) {
    try {
        const statusId = req.params.status_id;
        const users = await getReportByStatus(statusId);

        await generateExcel({
            res,
            filename: `reporte_estado_${statusId}.xlsx`,
            sheetName: "Usuarios por estado",
            title: `Reporte de Usuarios por Estado (${statusId})`,
            columns: [
                { header: "ID", key: "id", width: 10 },
                { header: "Nombre", key: "nombre", width: 20 },
                { header: "Apellido Paterno", key: "apellido_pat", width: 20 },
                { header: "Apellido Materno", key: "apellido_mat", width: 20 },
                { header: "Email", key: "email", width: 30 },
                { header: "Rol", key: "rol", width: 20 },
            ],
            rows: users,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error generando Excel por estado (backend)" });
    }
}

async function getReportGeneralExcel(req, res) {
    try {
        const users = await getReportGeneral();

        //const workbook = new ExcelJS.Workbook();
        //const sheet = workbook.addWorksheet("Usuarios");

        /*sheet.columns = [
            { header: "ID", key: "id", width: 8 },
            { header: "Nombre", key: "nombre", width: 20 },
            { header: "Apellido Paterno", key: "apellido_pat", width: 20 },
            { header: "Apellido Materno", key: "apellido_mat", width: 20 },
            { header: "Email", key: "email", width: 30 },
            { header: "Rol", key: "rol_nombre", width: 20 },
            { header: "Estado", key: "estado", width: 15 },
        ];

        users.forEach(u => sheet.addRow(u));

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=reporte_general_usuarios.xlsx"
        );
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        await workbook.xlsx.write(res);
        res.end();*/

        await generateExcel({
            res,
            filename: "reporte_general_usuarios.xlsx",
            sheetName: "Reporte General",
            title: "Reporte General de Usuarios",
            columns: [
                { header: "ID", key: "id", width: 10 },
                { header: "Nombre", key: "nombre", width: 20 },
                { header: "Apellido Paterno", key: "apellido_pat", width: 20 },
                { header: "Apellido Materno", key: "apellido_mat", width: 20 },
                { header: "Email", key: "email", width: 30 },
                { header: "Rol", key: "rol_nombre", width: 20 },
                { header: "Estado", key: "estado", width: 15 }
            ],
            rows: users,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error generando Excel general (backend)" });
    }
}

export {
    getReportByRolePDF,
    getReportByStatusPDF,
    getReportGeneralPDF,
    getReportByRoleExcel,
    getReportByStatusExcel,
    getReportGeneralExcel
};

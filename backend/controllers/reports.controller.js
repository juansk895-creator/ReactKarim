import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import { getReportByRole } from '../models/users.model.js';


async function getReportByRolePDF(req, res) {
    try {
        const roleId = req.params.rol_id;
        const { includeChart, chartBase64 } = req.body;

        const users = await getReportByRole(roleId);

        const doc = new PDFDocument({ margin: 40 });
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
        doc.end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error generando PDF' });
    }
}

async function getReportByRoleExcel(req, res) {
    try {
        const rol_id = req.params.rol_id;

        const data = await getReportByRole(rol_id);

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Usuarios por rol");

        // Encabezado
        sheet.columns = [
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
        res.send(buffer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: "Error generado Excel" });
    }
}

export {
    getReportByRolePDF,
    getReportByRoleExcel,
};

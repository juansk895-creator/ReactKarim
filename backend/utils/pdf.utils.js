import PDFDocument from "pdfkit";

export function generatePDF({
    res,
    filename,
    title,
    subtitle,
    users,
    includeChart = false,
    chartBase64 = null
}) {
    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename=${filename}`
    );

    doc.pipe(res);

    doc.fontSize(20).text(title, { align: "center" });
    if (subtitle) {
        doc.moveDown(0.5);
        doc.fontSize(12).text(subtitle, { align: "center" });
    }

    doc.moveDown(2);

    if (includeChart && chartBase64) {
        const image = chartBase64.replace(
            /^data:image\/png;base64,/,
            ""
        );
        const buffer = Buffer.from(image, "base64");
        doc.image(buffer, {
            fit: [450, 300],
            align: "center"
        });
        doc.moveDown(2);
    }

    doc.fontSize(14).text("Listado de usuarios:");
    doc.moveDown(1);

    doc.fontSize(10);

    users.forEach(u => {
        doc.text(
            `${u.id} - ${u.nombre} ${u.apellido_pat || ""} ${u.apellido_mat || ""} |
            ${u.email} | Rol: ${u.rol_nombre || u.rol_id} | Estado: ${u.estado || u.status_id}`
        );
    });
    doc.end();
}


import PDFDocument from "pdfkit";

function stripPngDataUrl(dataUrl) {
    if (!dataUrl || typeof dataUrl !== "string") {
        return null;
    }
    return dataUrl.replace(/^data:image\/png;base64,/, "");
}

function formatDateMX(date = new Date()) {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() +1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}
function formatDateISOShort(value) {
    if (!value) {
        return "";
    }
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) {
        return "";
    }
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

function safeText(v) {
    return v === null || v === undefined ? "" : String(v);
}

function drawFooter(doc, text) {
    const { left, right, bottom } = doc.page.margins;
    const y = doc.page.height - bottom + 10;

    doc
        .fontSize(10)
        .fillColor("#2b2b2b")
        .text(text, left, y, {
            width: doc.page.with - left - right,
            align: "right",
        });
}

function drawTitleBlock(doc, { title, description }) {
    doc
        .font("Helvetica-Bold")
        .fontSize(18)
        .fillColor("#111111")
        .text(title, {
            align: "center"
        });
    
    if (description) {
        doc.moveDown(0.6);
        doc
            .font("Helvetica")
            .fontSize(11)
            .fillColor("#333333")
            .text(description, {
                align: "center",
            });
    }
    doc.moveDown(1.2);
}

function drawTable(doc, { columns, rows, startY }) {
    const pageWidth = doc.page.width;
    const { left, right, top, bottom } = doc.page.margins;
    
    const tableX = left;
    const tableWidth = pageWidth - left - right;
    
    const headerHeight = 24;
    const rowHeightBase = 22;
    const paddingX = 6;
    const paddingY = 6;

    const headerBg = "#7fb3e6"; //"#b7d9ff";
    const headerText = "#06213a"; //"#0b2a4a";
    const rowBgA = "#dbeeff"; //"#edf5ff";
    const rowBgB = "#ffffff"; //sin cambios
    const gridColor = "#5ea4e6"; //"#7fb3e6";

    doc.font("Helvetica").fontSize(10);

    const drawHeader = (y) => {
        doc
            .save()
            .rect(tableX, y, tableWidth, headerHeight)
            .fill(headerBg)
            .restore();
        
        doc
            .save()
            .lineWidth(0.6)
            .strokeColor(gridColor)
            .rect(tableX, y, tableWidth, headerHeight)
            .stroke()
            .restore();
        
        let x = tableX;
        columns.forEach((col, idx) => {
            const w = col.width;

            doc
                .font("Helvetica-Bold")
                .fillColor(headerText)
                .text(safeText(col.header), x + paddingX, y + 7, {
                    width: w - paddingX * 2,
                    align: "left",
                    ellipsis: true,
                });
            
            if (idx < columns.length - 1) {
                doc
                    .save()
                    .lineWidth(0.6)
                    .strokeColor(gridColor)
                    .moveTo(x + w, y)
                    .lineTo(x + w, y + headerHeight)
                    .stroke()
                    .restore()
                ;
            }
            x += w;
        });
        return y + headerHeight;
    };

    const calcRowHeight = (row) => {
        let maxH = rowHeightBase;

        columns.forEach((col) => {
            const text = safeText(row[col.key]);
            const w = col.width - paddingX * 2;

            const h = doc.heightOfString(text, {
                width: w,
                align: "left",
            });

            const cellH = Math.max(rowHeightBase, h + paddingY * 2);
            if (cellH > maxH) {
                maxH = cellH;
            }
        });
        return maxH;
    };

    let y = startY;

    y = drawHeader(y);

    rows.forEach((row, idx) => {
        const rowH = calcRowHeight(row);
        const maxY = doc.page.height - bottom - 25;

        if (y + rowH > maxY) {
            drawFooter(doc, `Reporte generado con fecha: ${formatDateMX(new Date())}`);

            doc.addPage();
            y = top;
            y = drawHeader(y);
        }

        const bg = idx % 2 === 0 ? rowBgA : rowBgB;
        doc.save().rect(tableX, y, tableWidth, rowH).fill(bg).restore();

        doc
            .save()
            .lineWidth(0.4)
            .strokeColor(gridColor)
            .rect(tableX, y, tableWidth, rowH)
            .stroke()
            .restore();
        
        let x = tableX;
        columns.forEach((col, cIdx) => {
            const w = col.width;
            const text = safeText(row[col.key]);

            doc
                .font("Helvetica")
                .fillColor("#111111")
                .text(text, x + paddingX, y + paddingY, {
                    width: w - paddingX * 2,
                    align: "left",
                });
            
            if (cIdx < columns.length - 1) {
                doc
                    .save()
                    .lineWidth(0.4)
                    .strokeColor(gridColor)
                    .moveTo(x + w, y)
                    .lineTo(x + w, y + rowH)
                    .stroke()
                    .restore()
                ;
            }
            x += w;
        });
        y += rowH;
    });
    return y;
}

function drawChart(doc, chartBase64, options = {}) {
    const {
        title = null,
        fit = [450, 300],
        addPageBefore = false,
    } = options;

    if (!chartBase64) {
        return false;
    }

    const image = stripPngDataUrl(chartBase64);
    if (!image) {
        return false;
    }

    if (addPageBefore) {
        doc.addPage();
    }

    if (title) {
        doc.font("Helvetica-Bold").fontSize(14).fillColor("#111111").text(title, {
            align: "center",
        });
        doc.moveDown(1);
    }

    const buffer = Buffer.from(image, "base64");

    const { left, right, top, bottom } = doc.page.margins;
    const boxX = left;
    const boxY = doc.y;
    const boxW = doc.page.width - left - right;
    const boxH = 340;

    doc.image(buffer, boxX, boxY, {
        fit,
        align: "center",
        valign: "center",
    });

    doc.y = boxY + boxH;
    doc.moveDown(1);

    return true;
}

export function generatePDF({
    res,
    filename,
    title,
    subtitle,
    users,
    includeChart = false,

    chartBase64 = null,

    chartsBase64 = [],
}) {
    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    doc.pipe(res);

    const description = subtitle || "Este documento muestra todos los usuarios existentes en el sistema. Se han ordenado en base al nivel del tipo de usuario y el estado que tengan.";

    drawTitleBlock(doc, { title, description });

    if (includeChart) {
        if (Array.isArray(chartsBase64) && chartsBase64.length > 0) {
            const chartTitles = [
                "Gráfica: Usuarios por Rol",
                "Gráfica: Usuarios por Estado",
                "Gráfica: Usuarios por Rango de Edad",
            ];

            chartsBase64.forEach((c, idx) => {
                drawChart(doc, c, {
                    title: chartTitles[idx] || `Gráfica ${idx + 1}`,
                    fit: [500, 320],
                    addPageBefore: idx > 0,
                });
            });

            doc.addPage();
        }

        else if (chartBase64) {
            drawChart(doc, chartBase64, { fit: [500, 320] });
            doc.moveDown(1);
        }
    }

    const columns = [ //width total 610 - width total2 - 550 - 530 - 
        { key: "nombre_completo", header: "Nombre", width: 120 },
        { key: "email", header: "Email", width: 130 },
        { key: "telefono", header: "Teléfono", width: 70 },
        { key: "rol_nombre", header: "Tipo", width: 80 },
        { key: "estado", header: "Status", width: 50 },
        { key: "nacimiento", header: "Nacimiento", width: 80 },
    ];

    const rows = (users || []).map((u) => ({
        nombre_completo: `${safeText(u.nombre)} ${safeText(u.apellido_pat)} ${safeText(u.apellido_mat)}`.replace(
            /\s+/g,
            " "
        ).trim(),
        email: safeText(u.email),
        telefono: safeText(u.num_tel ?? ""),
        rol_nombre: safeText(u.rol_nombre || u.rol || u.rol_id || ""),
        estado: safeText(u.estado || u.status || u.status_id || ""),
        nacimiento: formatDateISOShort(u.fecha_nac ?? ""),
    }));

    const startY = doc.y;
    drawTable(doc, { columns, rows, startY });

    drawFooter(doc, `Reporte generado en fecha: ${formatDateMX(new Date())}`);

    doc.end();
}


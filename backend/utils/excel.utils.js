import ExcelJS from "exceljs";

export async function generateExcel({
    res,
    filename,
    sheetName = "Reporte",
    title,
    columns,
    rows
}) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(sheetName);

    if (title) {
        sheet.mergeCells(1, 1, 1, columns.length);
        const titleCell = sheet.getCell(1, 1);
        titleCell.value = title;
        titleCell.font = { size: 16, bold: true };
        titleCell.alignment = { horizontal: "center" };
        sheet.addRow([]);
    }

    sheet.columns = columns;

    rows.forEach(row => sheet.addRow(row));

    sheet.getRow(sheet.actualRowCount - rows.length).font = { bold: true };

    res.setHeader(
      //"Content-Disposition"
        "Content-Disposition",
        `attachment; filename=${filename}`
    );
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await workbook.xlsx.write(res);
    res.end();
}



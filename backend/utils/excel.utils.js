import ExcelJS from "exceljs";

export async function generateExcel({
    res,
    filename,
    sheetName = "Reporte",
    title,
    columns,
    rows,
}) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(sheetName);

    const headerFill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF8FC2FF" } };
    const headerFont = { bold: true, color: { argb: "FF06213A" } };
    const headerAlignment = { vertical: "middle", horizontal: "center", wrapText: true };
    const zebraA = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDBEEFF" } };
    const zebraB = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } };
    const gridBorder = {
        top: { style: "thin", color: { argb: "FF5EA4E6" } },
        left: { style: "thin", color: { argb: "FF5EA4E6" } },
        bottom: { style: "thin", color: { argb: "FF5EA4E6" } },
        right: { style: "thin", color: { argb: "FF5EA4E6" } },
    };

    let rowCursor = 1;

    if (title) {
        sheet.mergeCells(rowCursor, 1, rowCursor, columns.length);
        const titleCell = sheet.getCell(rowCursor, 1);
        titleCell.value = title;
        titleCell.font = { size: 16, bold: true, color: { argb: "FF111111" } };
        titleCell.alignment = { horizontal: "center", vertical: "middle" };
        sheet.getRow(rowCursor).height = 24;
        rowCursor += 2;
    }

    sheet.columns = columns;

    // Encabezados
    //const headerRowIndex = rowCursor;
    //const headerRow = sheet.getRow(headerRowIndex);
    const headerRowIndex = rowCursor;
    const headerValues = columns.map((c) => c.header);
    sheet.getRow(headerRowIndex).values = headerValues;

    const headerRow = sheet.getRow(headerRowIndex);
    headerRow.height = 20;

    for (let c = 1; c <= columns.length; c++) {
        const cell = sheet.getCell(headerRowIndex, c);
        cell.fill = headerFill;
        cell.font = headerFont;
        cell.alignment = headerAlignment;
        cell.border = gridBorder;
    }

    const firstDataRowIndex = headerRowIndex + 1;

    rows.forEach((r, i) => {
        const rowNumber = firstDataRowIndex + i;

        columns.forEach((col, idx) => {
            sheet.getCell(rowNumber, idx + 1).value = r[col.key];
        });

        const fill = i % 2 === 0 ? zebraA : zebraB;

        for (let c = 1; c <= columns.length; c++) {
            const cell = sheet.getCell(rowNumber, c);
            cell.fill = fill;
            cell.border = gridBorder;
            cell.alignment = { vertical: "top", horizontal: "left", wrapText: true };
        }
        sheet.getRow(rowNumber).height = 18;
    });
    /*rows.forEach((r, i) => {
        const excelRow = sheet.getRow(firstDataRowIndex + i);
        excelRow.values = Object.values(
            columns.reduce((acc, col) => {
                acc[col.key] = r[col.key];
                return acc;
            }, {})
        );

        const fill = i % 2 === 0 ? zebraA : zebraB;

        for (let c = 1; c <= columns.length; c++) {
            const cell = sheet.getCell(firstDataRowIndex + i, c);
            cell.fill = fill;
            cell.border = gridBorder;
            cell.alignment = { vertical: "top", horizontal: "left", wrapText: true };
        }
    });*/

    sheet.views = [{ state: "frozen", ySplit: firstDataRowIndex - 1 }];
    sheet.autoFilter = {
        from: { row: headerRowIndex, column: 1 },
        to: { row: headerRowIndex, column: columns.length }, 
    };

    sheet.eachRow((row, rowNumber) => {
        if (rowNumber >= firstDataRowIndex) row.height = 18;
    });

    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    const dateStr = `${dd}/${mm}/${yyyy}`;

    sheet.headerFooter.oddFooter = `&RReporte generado en fecha: ${dateStr}`;

    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await workbook.xlsx.write(res);
    res.end();
}




    /*
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


*/
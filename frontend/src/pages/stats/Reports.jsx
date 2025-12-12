import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActionIcon, Box, Button, Card, Center, Checkbox, Divider, Group, Loader, Paper, Select, SimpleGrid, Text, Title} from "@mantine/core";
import { notifications } from "@mantine/notifications";
//Íconos
import { IconX, IconArrowBackUp, IconFileTypePdf, IconFileTypeXls } from "@tabler/icons-react";
//Archivos
import { secureFetch } from "../../utils/secureFetch";
//
import '@mantine/dates/styles.css';
import '@mantine/core/styles.css';
import '@mantine/core/styles.layer.css';
//


export default function Reports() {

    const [role, setRole] = useState(null);
    const [includeChart, setIncludeChart] = useState(false);
    const [chartBase64, setChartBase64] = useState("");

    const navigate = useNavigate();

    // Obtener gráfica desde Graphics.jsx, ó considerar su reconstrucción aquí
    //
    const handleGeneratePDF = async () => {

        console.log("CLICK PDF -> role =", role);

        if(!role) {
            alert("Selecciona un rol antes de generar el PDF");
            return;
        }

        console.log("DEBUG role =", role);
        console.log("DEBUG includeChart =", includeChart);
        console.log("DEBUG chartBase64 =", chartBase64?.slice(0, 50));

        try {
            const res = await secureFetch(`/api/reports/users/role/${role}/pdf`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    includeChart,
                    chartBase64
                })
            });

            if (!res || !res.ok) {
                return alert("Error generando reporte PDF (frontend)");
            }

            const blob = await res.blob();

            if (window.showSaveFilePicker) {
                try {
                    const handle = await window.showSaveFilePicker({
                        suggestedName: `reporte_rol_${role}.pdf`,
                        types: [{
                            description: "PDF File",
                            accept: { "application/pdf": [".pdf"] }
                        }]
                    });

                    const writable = await handle.createWritable();
                    await writable.write(blob);
                    await writable.close();

                    console.log("PDF guardado manualmente con FilePicker");
                    return;
                } catch (pickerError) {
                    console.warn("FilePicker cancelado o falló, usando descarga normal", pickerError);
                }
            }

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `reporte_rol_${role}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Error generando reporte en PDF (frontend):", err);
            alert("Error interno al generar PDF");
        }
    };

    // Finalizar
    const handleGenerateExcel = async () => {

        console.log("CLICK EXCEL -> role =", role);

        if (!role) {
            alert("Selecciona un rol para generar el reporte");
            return;
        }

        console.log("DEBUG role =", role);
        console.log("DEBUG includeChart =", includeChart);
        console.log("DEBUG chartBase64 =", chartBase64 ? "OK" : "VACÍO");

        try {
            const res = await secureFetch(`/api/reports/users/role/${role}/excel`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    includeChart,
                    chartBase64
                })
            });

            if (!res || !res.ok) {
                alert("Error generando Excel (frontend)");
                return;
            }

            const blob = await res.blob();

            if (window.showSaveFilePicker) {
                try {
                    const handle = await window.showSaveFilePicker({
                        suggestedName: `reporte_rol_${role}.xlsx`,
                        types: [{
                            description: "Excel File",
                            accept: {
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"]
                            }
                        }]
                    });

                    const writable = await handle.createWritable();
                    await writable.write(blob);
                    await writable.close();

                    console.log("Excel guardado manualmente con FilePicker");
                    return;
                } catch (pickerError) {
                    console.warn("FilePicker cancelado o falló, usando descarga normal", pickerError);
                }
            }

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `reporte_rol_${role}.xlsx`;
            a.click();

            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error("Error generando reporte en Excel (frontend):", err);
            alert("Error interno al generar Excel");
        }
    };
    
    return (
        <Box
            p="md"
            //w="100%"
            style={{
                width: "100%",
                height: "100%",
                //backgroundColor: "darkred",
                display: "flex",
                flexDirection: "column",
    
                //maxWidth: "900px",
                //margin: "0 auto",
            }}
        >

            {/* Regresar & encabezado*/}
            <Box 
            style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
            }}
            >
                <ActionIcon
                    variant="subtle"
                    color="gray"
                    //mb="md"
                    title="Regresar"
                    style={{
                    cursor: "pointer",
                    margintTop: "2px",
                    }}
                    //onClick={{handleBack}}
                    onClick={() => navigate('/dashboard')}
                >
                    <IconArrowBackUp size={20} />
                </ActionIcon>

                {/* Título */}
                <Title
                    order={2}
                    //mb="md"
                    style={{
                    flexGrow: 1,
                    textAlign: "center",
                    margin: 0,
                    }}
                >
                    Reportes
                </Title>
            </Box>
            
            <Divider my="md" />

            <Paper
                p="lg"
                shadow="md"
            >
                <Text
                    fw={700}
                    size="xl"
                    mb="md"
                >
                    Reportes por rol
                </Text>

                <Select
                    label="Selecciona rol"
                    placeholder="Elige un rol"
                    radius="md"
                    data={[
                        { value: "1", label: "Administrador" },
                        { value: "2", label: "Titular" },
                        { value: "3", label: "Analista" },
                    ]}
                    value={role}
                    onChange={setRole}
                />

                <Checkbox
                    label="Incluir gráfica en el PDF"
                    mt="md"
                    checked={includeChart}
                    onChange={(e) => setIncludeChart(e.currentTarget.checked)}
                />

                <Divider my="md" />

                <Group>
                    <Button
                        variant="transparent"
                        color="red"
                        rightSection={<IconFileTypePdf />}
                        //disabled={!role} // Qué roles se les permitirá ?
                        onClick={handleGeneratePDF}
                    >
                        Decargar
                    </Button>
                    <Button
                        variant="transparent"
                        color="green"
                        rightSection={<IconFileTypeXls />}
                        onClick={handleGenerateExcel}
                    >
                        Descargar
                    </Button>
                </Group>

            </Paper>

        </Box>
    );
}


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActionIcon, Box, Button, Card, Center, Checkbox, Divider, Group, Loader, Paper, Select, SimpleGrid, Stack, Text, Title} from "@mantine/core";
import { notifications } from "@mantine/notifications";
//Íconos
import { IconX, IconArrowBackUp, IconFileTypePdf, IconFileTypeXls, IconInfoCircle } from "@tabler/icons-react";
//Archivos
import { secureFetch } from "../../utils/secureFetch";
//
import '@mantine/dates/styles.css';
import '@mantine/core/styles.css';
import '@mantine/core/styles.layer.css';
//


export default function Reports() {

    //const [role, setRole] = useState(null);
    const [reportType, setReportType] = useState(""); // General, Status, Rol
    const [paramValue, setParamValue] = useState("");
    const [includeChart, setIncludeChart] = useState(false);
    const [chartBase64, setChartBase64] = useState(""); // Gráfica

    const navigate = useNavigate();

    // Opciones
    const ROLE_OPTIONS = [
        { value: "1", label: "Administrador" },
        { value: "2", label: "Titular" },
        { value: "3", label: "Analista" },
        { value: "4", label: "Todos" },
    ];

    const STATUS_OPTIONS = [
        { value: "1", label: "Activo" },
        { value: "2", label: "Inactivo" },
        { value: "3", label: "Todos" },
    ];

    const renderPreview = () => {
        if (!reportType) {
            return null;
        }

        if (reportType === "general") {
            return (
                <Card
                    shadow="sm"
                    radius="md"
                    p="lg"
                    withBorder
                >
                    <Text
                        size="sm"
                    >
                        <IconInfoCircle
                            size={16}
                            style={{
                                marginRight: 8
                            }}
                        />
                        El reporte general mostrará:
                    </Text>
                    <Text
                        mt={6}
                        size="sm"
                    >
                        Una lista completa de usuarios ordenados por rol y estado.
                    </Text>
                    {includeChart && (
                        <Text
                            mt={10}
                            size="sm"
                            c="teal"
                        >
                            Se incluirán gráficas en el reporte (gráfica general?)
                        </Text>
                    )}
                </Card>
            );
        }

        /*
        if (reportType === "role") {
            return (
                <Card
                    shadow="sm"
                    radius="md"
                    p="lg"
                    withBorder
                >
                    <Text size="sm">
                        Reporte por rol seleccionado:
                    </Text>
                    <Text mt={6}>
                        Rol ID: {paramValue || "-"}
                    </Text>
                    {includeChart && (
                        <Text
                            mt={10}
                            size="sm"
                            c="teal"
                        >
                            Se incluirá gráfica en el reporte
                        </Text>
                    )}
                </Card>
            );
        }
        */

        /*
        if (reportType === "status") {
            return (
                
                <Card
                    shadow="sm"
                    radius="md"
                    p="lg"
                    withBorder
                >
                    <Text size="sm" >
                        Reporte por estado seleccionado:
                    </Text>
                    <Text mt={6}>
                        Estado ID: {paramValue || "-"}
                    </Text>
                    {includeChart && (
                        <Text
                            mt={10}
                            size="sm"
                            c="teal"
                        >
                            Se incluirá gráfica en el reporte
                        </Text>
                    )}
                </Card>
                
            );
        }
        */

        return null;
    };

    // Validación para botones
    const canGenerate = (() => {
        if (!reportType) {
            return false;
        }
        if (reportType === "general") {
            return true;
        }
        if ((reportType === "role" || reportType === "status") && paramValue) {
            return true;
        }
        return false;
    })();

    // Descarga...
    const downloadFile = (blob, filename) => {
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();

        window.URL.revokeObjectURL(url);
    };    

    // Obtener gráfica desde Graphics.jsx, ó considerar su reconstrucción aquí
    //
    const handleGeneratePDF = async () => {

        if (!canGenerate) {
            return;
        }

        const endpoint = reportType === "general" ?
            `/api/reports/users/general/pdf` : reportType === "role" ?
            `/api/reports/users/role/${paramValue}/pdf` :
            `/api/reports/users/status/${paramValue}/pdf`;

        const response = await secureFetch(endpoint, {
            method: "POST",
            body: JSON.stringify({
                includeChart,
                chartBase64,
            }),
        });

        if (!response.ok) {
            alert("Error generando reporte en pdf (frontend)");
            return;
        }

        const blob = await response.blob();
        downloadFile(blob, `reporte_${reportType}_${paramValue || "general"}.pdf`);
    };

    // Finalizar
    const handleGenerateExcel = async () => {

        if (!canGenerate) {
            return;
        }

        const endpoint = reportType === "general" ?
            `/api/reports/users/general/excel` : reportType === "role" ?
            `/api/reports/users/role/${paramValue}/excel` :
            `/api/reports/users/status/${paramValue}/excel`;

        const response = await secureFetch(endpoint, {
            method: "POST",
            body: JSON.stringify({
                includeChart,
                chartBase64,
            }),
        });

        if (!response.ok) {
            alert("Error generando reporte en excel (frontend)");
            return;
        }

        const blob = await response.blob();
        downloadFile(blob, `reporte_${reportType}_${paramValue || "general"}.xlsx`);
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

            <Stack
                p="xl"
                gap="xl"
            >

                <Select
                    label="Seleccionar tipo de reporte"
                    placeholder="Seleccionar"
                    data={[
                        { value: "role", label: "Por rol" },
                        { value: "status", label: "Por estado" },
                        { value: "general", label: "General" },
                    ]}
                    value={reportType}
                    onChange={(v) => {
                        setReportType(v);
                        setParamValue(""); // Resetear
                    }}
                />

                {reportType === "role" && (
                    <Select
                        label="Seleccionar rol"
                        placeholder="Seleccionar"
                        data={ROLE_OPTIONS}
                        value={paramValue}
                        onChange={setParamValue}
                    />
                )}

                {reportType === "status" && (
                    <Select
                        label="Seleccionar el estado"
                        placeholder="Seleccionar"
                        data={STATUS_OPTIONS}
                        value={paramValue}
                        onChange={setParamValue}
                    />
                )}

                <Checkbox
                    label="Incluir gráfica en el reporte"
                    checked={includeChart}
                    onChange={(e) => setIncludeChart(e.currentTarget.checked)}
                />

                <Divider />

                {renderPreview()}

                <Divider />
                
                <Group>
                    <Button
                        variant="transparent"
                        color="red"
                        rightSection={<IconFileTypePdf />}
                        disabled={!canGenerate}
                        onClick={handleGeneratePDF}
                    >
                        Decargar
                    </Button>
                    <Button
                        variant="transparent"
                        color="green"
                        rightSection={<IconFileTypeXls />}
                        disabled={!canGenerate}
                        onClick={handleGenerateExcel}
                    >
                        Descargar
                    </Button>
                </Group>

            </Stack>
            
            {/* c
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
            */}

        </Box>
    );
}


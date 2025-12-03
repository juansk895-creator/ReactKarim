import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActionIcon, Box, Card, Center, Loader, SimpleGrid, Text, Title} from "@mantine/core";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, Tooltip, XAxis, YAxis } from "recharts";
import { notifications } from "@mantine/notifications";
//Íconos
import { IconX, IconArrowBackUp } from "@tabler/icons-react";
//Archivos
import { secureFetch } from "../../utils/secureFetch";
//
import '@mantine/dates/styles.css';
import '@mantine/core/styles.css';
import '@mantine/core/styles.layer.css';
//


export default function Graphics() {
    const [rolesData, setRolesData] = useState(null);
    const [statusData, setStatusData] = useState(null);
    const [ageData, setAgeData] = useState(null);
    const [loading, setLoading] = useState(true);

    

    const navigate = useNavigate();

    const COLORS = ["#00bcd4", "#ff9800", "#4caf50", "#f44336", "#9c27b0", "#3f51b5"];

    const fetchStats = async () => {
        try {
            const [rolesRes, statusRes, ageRes] = await Promise.all([
                secureFetch("/api/users/stats/roles"),
                secureFetch("/api/users/stats/status"),
                secureFetch("/api/users/stats/age"),
            ]);

            if (!rolesRes.ok || !statusRes.ok || !ageRes.ok) {
                throw new Error("Error en la obtención de estadísticas");
            }

            const rolesJSON = await rolesRes.json();
            const statusJSON = await statusRes.json();
            const ageJSON = await ageRes.json();

            setRolesData(
                rolesJSON.data.map((r) => ({
                    name: `Rol ${r.rol_id}`,
                    value: r.total,
                }))
            );

            setStatusData(
                statusJSON.data.map((s) => ({
                    name: s.status_id === 1 ? "Activo" : "Inactivo",
                    value: s.total,
                }))
            );

            setAgeData(
                ageJSON.data.map((a) => ({
                    name: a.rango,
                    value: a.total,
                }))
            );
        } catch (err) {
            notifications.show({
                title: "Error",
                message: err.message,
                color: "red",
                icon: <IconX />,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return (
            <Center h="60vh">
                <Loader size="xl" />
            </Center>
        );
    }

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
                    Gráficas
                </Title>
            </Box>

            {/* Gráficas */}
            <SimpleGrid
                cols={{ base: 1, md: 2 }}
                spacing="lg"
                p="xl"
            >
                <Card
                    shadow="md"
                    p="lg"
                    radius="md"
                >
                    <Text
                        size="xl"
                        fw={700}
                        mb="md"
                    >
                        Usuarios por Rol
                    </Text>

                    <Center>
                        <PieChart
                            width={350}
                            height={300}
                        >
                            <Pie
                                data={rolesData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={110}
                                fill="#8884d8"
                                dataKey="value"
                                label
                            >
                                {rolesData.map((_, i) => (
                                    <Cell key={`cell-rol-${i}`} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </Center>
                </Card>

                <Card
                    shadow="md"
                    p="lg"
                    radius="md"
                >
                    <Text
                        size="xl"
                        fw={700}
                        mb="md"
                    >
                        Usuarios por Estado
                    </Text>
                    <Center>
                        <PieChart
                            width={350}
                            height={300}
                        >
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={110}
                                fill="#82ca9d"
                                dataKey="value"
                                label
                            >
                                {statusData.map((_, i) => (
                                    <Cell key={`cell-status-${i}`} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </Center>
                </Card>

                <Card
                    shadow="md"
                    p="lg"
                    radius="md"
                    sx={{ gridColumn: "span 2" }}
                >
                    <Text
                        size="xl"
                        fw={700}
                        mb="md"
                    >
                        Usuarios por Edad (Años)
                    </Text>
                    <Center>
                        <BarChart
                            width={600}
                            height={350}
                            data={ageData}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar
                                dataKey="value"
                                fill="#00bcd4"
                            >
                                {ageData.map((_, i) => (
                                    <Cell key={`cell-age-${i}`} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </Center>
                </Card>

            </SimpleGrid>
        </Box>
    );
}







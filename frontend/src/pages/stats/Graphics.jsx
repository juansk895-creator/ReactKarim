import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActionIcon, Box, Card, Center, Loader, SimpleGrid, Text, Title} from "@mantine/core";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Legend, Pie, PieChart, Tooltip, XAxis, YAxis } from "recharts";
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

const COLORS = ["#00bcd4", "#ff9800", "#4caf50", "#f44336", "#9c27b0", "#3f51b5"];

const roleNames = {
    1: "Administrador",
    2: "Titular",
    3: "Analista",
};

const statusNames = {
    1: "Activo",
    2: "Inactivo",
};

export default function Graphics() {
    const [roles, setRoles] = useState(null);
    const [status, setStatus] = useState(null);
    const [ages, setAges] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    
    useEffect(() => {
        async function loadData() {
            try {
                const [r, s, a] = await Promise.all([
                    secureFetch("/api/users/stats/roles"),
                    secureFetch("/api/users/stats/status"),
                    secureFetch("/api/users/stats/age"),
                ]);

                const rolesJson = await r.json();
                const statusJson = await s.json();
                const agesJson = await a.json();

                setRoles(rolesJson.data || []);
                setStatus(statusJson.data || []);
                setAges(agesJson.data || []);
                
            } catch (err) {
                console.error("Error al cargar estadísticas:", err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    const rolesProcessed = (roles ?? []).map(r => ({
        name: roleNames[r.rol_id] || `Rol ${r.rol_id}`,
        value: r.total,
    }));

    const statusProcessed = (status ?? []).map(s => ({
        name: statusNames[s.status_id] || `Estado ${s.status_id}`,
        value: s.total,
    }));

    const totalAges = (ages ?? []).reduce((acc, item) => acc + item.total, 0);

    const agesProcessed = (ages ?? []).map(a => {

        const percent = totalAges > 0 ? ((a.total / totalAges) * 100).toFixed(1) : "0.0";
        
        return {
            range: a.rango,
            usuarios: a.total,
            label: `${a.total} (${percent}%)`,
        };
    });


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
                            margin={{
                                //top: 20,
                                //right: 60,
                                //bottom: 20,
                                //left: 60,
                            }}
                        >
                            <Pie
                                data={rolesProcessed}
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                startAngle={45}
                                endAngle={405}
                                label={({ value, percent }) => 
                                    `${value}-(${(percent * 100).toFixed(1)}%)`
                                }
                                labelLine={false}
                            >
                                {rolesProcessed.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend layout="radial"/>
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
                                data={statusProcessed}
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                fill="#82ca9d"
                                dataKey="value"
                                nameKey="name"
                                label={({ value, percent }) => 
                                    `${value}-(${(percent * 100).toFixed(1)}%)`
                                }
                                labelLine={false}
                            >
                                {statusProcessed.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend layout="radial"/>
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
                            data={agesProcessed}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="range" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar
                                dataKey="usuarios"
                                fill="#00bcd4"

                            >
                                <LabelList
                                    dataKey="label"
                                    position="top"
                                    //formatter={(v, entry) => `${entry.value} (${v}%)`}
                                    style={{ fill: "white", fontSize: "14px" }}
                                />
                            </Bar>
                        </BarChart>
                    </Center>
                </Card>

            </SimpleGrid>
        </Box>
    );
}







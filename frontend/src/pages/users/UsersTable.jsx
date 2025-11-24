import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActionIcon, Badge, Box, Button, Card, Center, Flex, Group, Loader, Pagination, Select, Table, Text, TextInput, Title } from "@mantine/core";
import { IconArrowsSort, IconEdit, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
//
import '@mantine/dates/styles.css';
import '@mantine/core/styles.css';
import '@mantine/core/styles.layer.css';
//
import { AuthContext } from "../../AuthContext";

//
const rolLabel = {
    1: "Administrador",
    2: "Titular",
    3: "Analista",
};

export default function UsersTable() {

    // Valores temporalmente estáticos
    const pageSize = "10";
    const currentPage = 1;

    const { secureFetch } = useContext(AuthContext);
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("nombre");
    const [sortDirection, setSortDirection] = useState("asc");


    const fetchUsers = async () => {
        try {
            console.log("Llamando secureFetch a /api/users ... ");
            const response = await secureFetch("http://localhost:4000/api/users");
            
            if (!response) {
                return;
            }

            if (!response.ok) {
                console.error("Error HTTP:", response.status);
                return;
            }

            const data = await response.json();

            console.log("Data recibido desde el backend:", data);
            console.log("Array.isArray(data):", Array.isArray(data));

            setUsers(data.users || []);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSort = (field) => {
        if (field === sortBy) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortDirection("asc");
        }
    };

    const safeUsers = Array.isArray(users) ? users : [];
    const sortedUsers = [...safeUsers].sort((a, b) => {
        const v1 = a[sortBy]?.toString().toLowerCase() ?? "";
        const v2 = b[sortBy]?.toString().toLowerCase() ?? "";
        return sortDirection === "asc" ? v1.localeCompare(v2) : v2.localeCompare(v1);
        /*if (!v1 || !v2) {
            return 0;
        }*/

        /*if (sortDirection === "asc") {
            return v1.localeCompare(v2);
        }
        return v2.localeCompare(v1);*/
    });

    return (
        <>
            <Group
                justify="space-between"
                mb="md"
            >
                <Title order={3}>Usuarios</Title>
                <Button
                    variant="outline"
                    leftSection={<IconPlus size={18} />}
                >
                    Nuevo usuario
                </Button>
            </Group>
            
            <Table
                striped
                highlightOnHover
                withColumnBorders
                verticalSpacing="md"
                horizontalSpacing="md"
            >
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th
                            onClick={() => handleSort("nombre")}
                            style={{
                                cursor: "pointer"
                            }}
                        >
                            Nombre
                        </Table.Th>
                        <Table.Th
                            onClick={() => handleSort("email")}
                            style={{
                                cursor: "pointer"
                            }}
                        >
                            Email
                        </Table.Th>
                        <Table.Th
                            onClick={() => handleSort("num_tel")}
                            style={{
                                cursor: "pointer"
                            }}
                        >
                            Teléfono
                        </Table.Th>
                        <Table.Th>Rol</Table.Th>
                        <Table.Th>Estado</Table.Th>
                        <Table.Th>Editar</Table.Th>
                        <Table.Th>Eliminar</Table.Th>
                    </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                    {Array.isArray(sortedUsers) && sortedUsers.map((u) => (
                        <Table.Tr key={u.id}>
                            <Table.Td>{u.nombre} {u.apellido_pat} {u.apellido_mat}</Table.Td>
                            <Table.Td>{u.email}</Table.Td>
                            <Table.Td>{u.num_tel}</Table.Td>
                            <Table.Td> {
                                u.rol_id === 1
                                ? "Administrador"
                                : u.rol_id === 2
                                ? "Titular"
                                : "Analista"
                            }
                            </Table.Td>
                            <Table.Td> {
                                u.status_id === 1
                                ? "Activo"
                                : "Inactivo"
                            }
                            </Table.Td>
                            <Table.Td>
                                <ActionIcon
                                    variant="subtle"
                                    color="blue"
                                >
                                    <IconEdit size={18} stroke={2} />
                                </ActionIcon>
                            </Table.Td>

                            <Table.Td>
                                <ActionIcon
                                    variant="subtle"
                                    color="red"
                                >
                                    <IconTrash size={18} stroke={2}/>
                                </ActionIcon>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </>
    );
}




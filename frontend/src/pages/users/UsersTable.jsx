import React, { useContext, useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ActionIcon, Badge, Box, Button, Card, Center, Flex, Group, Loader, Pagination, Select, Table, Text, TextInput, Title, Tooltip } from "@mantine/core";
import { IconArrowsSort, IconEdit, IconPlus, IconSearch, IconTrash, IconArrowBackUp } from "@tabler/icons-react";
//
import '@mantine/dates/styles.css';
import '@mantine/core/styles.css';
import '@mantine/core/styles.layer.css';
//
import { AuthContext } from "../../AuthContext";
//Archivos
import ModalChangeStatus from "../../components/ModalChangeStatus";
import ModalConfirmDeleteUser from "../../components/ModalConfirmDeleteUser";

// Revisar uso
/*const rolLabel = {
    1: "Administrador",
    2: "Titular",
    3: "Analista",
};*/

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
    const [modalStatusOpen, setModalStatusOpen] = useState(false);
    const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);


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

    const handleConfirmStatusChange = async () => {
        try {
            const newStatus = selectedUser.status_id === 1 ? 2 : 1;

            const response = await secureFetch(
                `http://localhost:4000/api/users/${selectedUser.id}/status`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status_id: newStatus }),
                }
            );

            if (!response.ok) {
                console.error("Error al actualizar estado");
            }

            setModalStatusOpen(false);
            fetchUsers();
        } catch (err) {
            console.error("Error:", err);
            setModalStatusOpen(false);
        }
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await secureFetch(
                `http://localhost:4000/api/users/${selectedUser.id}`,
                { method: "DELETE" }
            );

            if (!response.ok) {
                console.error("Error al eliminar usuario");
                return;
            }

            setModalDeleteOpen(false);
            fetchUsers();
        } catch (err) {
            console.error("Error:", err);
            setModalDeleteOpen(false);
        }
    };

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
        <Box
            p="md"
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
        <Group
            justify="space-between"
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
            <Title
                order={3}
                style={{
                flexGrow: 1,
                textAlign: "center",
                margin: 0,
                }}
            >
                Usuarios
            </Title>
            <Button
                variant="outline"
                onClick={() => navigate('/dashboard/usersRegister')}
                leftSection={<IconPlus size={18} />}
            >
                Nuevo usuario
            </Button>
            
            
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
                        <Table.Th
                            onClick={() => handleSort("rol_id")}
                            style={{
                                cursor: "pointer"
                            }}
                        >
                            Rol
                        </Table.Th>
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
                            <Table.Td>
                                <Tooltip
                                    label="Click para cambiar estado"
                                >
                                    <Text
                                        fw={700}
                                        c={u.status_id === 1 ? "green" : "red"}
                                        style={{
                                            cursor: "pointer"
                                        }}
                                        onClick={() => {
                                            setSelectedUser(u);
                                            setModalStatusOpen(true);
                                        }}
                                    >
                                        {u.status_id === 1 ? "Activo" : "Inactivo"}
                                    </Text>
                                </Tooltip>
                            </Table.Td>
                            <Table.Td>
                                <Tooltip
                                    label="Editar usuario"
                                >
                                    <ActionIcon
                                        variant="subtle"
                                        color="blue"
                                        onClick={() => navigate(`/dashboard/usersEdit/${u.id}`)}
                                    >
                                        <IconEdit size={18} stroke={2} />
                                    </ActionIcon>
                                </Tooltip>
                            </Table.Td>

                            <Table.Td>
                                <Tooltip
                                    label="Eliminar usuario"
                                >
                                    <ActionIcon
                                        variant="subtle"
                                        color="red"
                                        label="Eliminar usuario"
                                        onClick={() => {
                                            setSelectedUser(u);
                                            setModalDeleteOpen(true);
                                        }}
                                    >
                                        <IconTrash size={18} stroke={2}/>
                                    </ActionIcon>
                                </Tooltip>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Group>
        
        <ModalChangeStatus
            opened={modalStatusOpen}
            onClose={() => setModalStatusOpen(false)}
            onConfirm={handleConfirmStatusChange}
            userName={selectedUser?.nombre}
            currentStatus={selectedUser?.status_id}
        />
        <ModalConfirmDeleteUser
            opened={modalDeleteOpen}
            onClose={() => setModalDeleteOpen(false)}
            onConfirm={handleConfirmDelete}
            userName={selectedUser?.nombre}
        />
        <Outlet />

        </Box>
    );
}

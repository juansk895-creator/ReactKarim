import React, { useContext, useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ActionIcon, Badge, Box, Button, Card, Center, Flex, Group, Loader, Pagination, Select, Table, Text, TextInput, Title, Tooltip } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconArrowBackUp, IconArrowsSort, IconChevronDown, IconChevronUp, IconEdit, IconPlus, IconSearch, IconSelector, IconTrash } from "@tabler/icons-react";
//
import '@mantine/dates/styles.css';
import '@mantine/core/styles.css';
import '@mantine/core/styles.layer.css';
//Archivos
import { AuthContext } from "../../AuthContext";
import ModalChangeStatus from "../../components/ModalChangeStatus";
import ModalConfirmDeleteUser from "../../components/ModalConfirmDeleteUser";

// Revisar uso
/*const rolLabel = {
    1: "Administrador",
    2: "Titular",
    3: "Analista",
};*/

export default function UsersTable() {

    const isActiveSort = (field) => sortBy === field;
    const getSortIcon = (field) => {
        if (!isActiveSort(field)) {
            return <IconSelector size={14} />;
        }
        return sortDirection === "asc" ? (
            <IconChevronUp size={14} />
        ): (
            <IconChevronDown size={14} />
        );
    };
    const getHeaderStyle = (field) => ({
        cursor: "pointer",
        color: isActiveSort(field) ? "#82c2fa" : undefined,
        fontWeight: isActiveSort(field) ? 700 : undefined,
        backgroundColor: isActiveSort(field) ? "#243b49" : undefined,
        borderRadius: isActiveSort(field) ? 4 : undefined,
        transition: "background-color 0.15s ease",
    });

    const { secureFetch } = useContext(AuthContext);
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("nombre");
    const [sortDirection, setSortDirection] = useState("asc");
    const [modalStatusOpen, setModalStatusOpen] = useState(false);
    const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebouncedValue(search, 300);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const fetchUsers = async () => {
        try {
            setLoading(true);

            const params = new URLSearchParams();
            if (debouncedSearch?.trim()) params.set("q", debouncedSearch.trim());
            params.set("page", String(page));
            params.set("perPage", String(pageSize));
            params.set("sortBy", sortBy);
            params.set("sortDir", sortDirection);

            const url = `http://localhost:4000/api/users?${params.toString()}`;

            const response = await secureFetch(url);
            if (!response) {
                return;
            }

            if (!response.ok) {
                console.error("Error HTTP:", response.status);
                return;
            }

            const data = await response.json();

            setUsers(Array.isArray(data?.users) ? data.users : []);
            //setTotal(Number(data?.pagination?.total ?? 0));
            //setTotalPages(Number(data?.pagination?.totalPages ?? 1));
            setTotal(Number(data?.total ?? 0));
            setTotalPages(Number(data?.totalPages ?? 1));
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [debouncedSearch, page, pageSize, sortBy, sortDirection]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

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

    // Continuar la revisión desde aquí 
    const handleSort = (field) => {
        if (field === sortBy) {
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(field);
            setSortDirection("asc");
        }
        setPage(1);
    };


    const rows = useMemo(() => {
        return (Array.isArray(users) ? users : []).map((u) => (
            <Table.Tr key={u.id}>
                <Table.Td>
                    {u.nombre} {u.apellido_pat} {u.apellido_mat}
                </Table.Td>
                <Table.Td>{u.email}</Table.Td>
                <Table.Td>{u.num_tel}</Table.Td>
                <Table.Td>
                    {u.rol_id === 1 ? "Administrador" : u.rol_id === 2 ? "Titular" : "Analista"}
                </Table.Td>
                <Table.Td>
                    <Tooltip label="Cambiar estado actual del usuario">
                        <Text
                            fw={700}
                            c={u.status_id === 1 ? "green" : "red"}
                            style={{ cursor: "pointer" }}
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
                    <Tooltip label="Editar información del usuario">
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
                    <Tooltip label="Eliminar registro del usuario">
                        <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => {
                                setSelectedUser(u);
                                setModalDeleteOpen(true);
                            }}
                        >
                            <IconTrash size={18} stroke={2} />
                        </ActionIcon>
                    </Tooltip>
                </Table.Td>
            </Table.Tr>
        ));
    }, [navigate, users]);

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
            {/* Header */}
            <Group
                justify="space-between"
                align="center"
                mb="sm"
            >
                <ActionIcon
                    variant="subtle"
                    color="gray"
                    title="Regresar"
                    onClick={() => navigate("/dashboard")}
                >
                    <IconArrowBackUp size={20} />
                </ActionIcon>

                <Title
                    order={3}
                    style={{
                        margin: 0
                    }}
                >
                    Usuarios
                </Title>
                <Group gap="sm">
                    <TextInput
                        value={search}
                        onChange={(e) => setSearch(e.currentTarget.value)}
                        placeholder="Buscar (nombre, email, teléfono, rol, estado)"
                        leftSection={<IconSearch size={16} />}
                        w={340}
                    />
                    <Tooltip label="Registrar nuevo usuario">
                        <Button
                            variant="outline"
                            onClick={() => navigate("/dashboard/usersRegister")}
                            leftSection={<IconPlus size={18} />}
                        >
                            Nuevo Usuario
                        </Button>
                    </Tooltip>
                </Group>
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
                            //style={{ cursor: "pointer" }}
                            style={ getHeaderStyle("nombre") }
                        >
                            <Tooltip label="Reordenar">
                                <Group gap={4} align="center">
                                    Nombre
                                    {getSortIcon("nombre")}
                                </Group>
                            </Tooltip>
                        </Table.Th>
                        <Table.Th
                            onClick={() => handleSort("email")}
                            style={ getHeaderStyle("email") }
                        >
                            <Tooltip label="Reordenar">
                                <Group gap={4} align="center">
                                    Email
                                    {getSortIcon("email")}
                                </Group>
                            </Tooltip>
                        </Table.Th>
                        <Table.Th
                            onClick={() => handleSort("num_tel")}
                            style={ getHeaderStyle("num_tel") }
                        >
                            <Tooltip label="Reordenar">
                                <Group gap={4} align="center">
                                    Teléfono
                                    {getSortIcon("num_tel")}
                                </Group>
                            </Tooltip>
                        </Table.Th>
                        <Table.Th
                            onClick={() => handleSort("rol_id")}
                            style={ getHeaderStyle("rol_id") }
                        >
                            <Tooltip label="Reordenar">
                                <Group gap={4} align="center">
                                    Rol
                                    {getSortIcon("rol_id")}
                                </Group>
                            </Tooltip>
                        </Table.Th>
                        <Table.Th
                            onClick={() => handleSort("status_id")}
                            style={ getHeaderStyle("status_id") }
                        >
                            <Tooltip label="Reordenar">
                                <Group gap={4} align="center">
                                    Estado
                                    {getSortIcon("status_id")}
                                </Group>
                            </Tooltip>
                        </Table.Th>
                        <Table.Th>Editar</Table.Th>
                        <Table.Th>Eliminar</Table.Th>
                    </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                    {loading ? (
                        <Table.Tr>
                            <Table.Td colSpan={7}>
                                <Text c="dimmed">Cargando...</Text>
                            </Table.Td>
                        </Table.Tr>
                    ) : rows.length === 0 ? (
                        <Table.Tr>
                            <Table.Td colSpan={7}>
                                <Text c="dimmed">No se encontraron usuarios</Text>
                            </Table.Td>
                        </Table.Tr>
                    ) : (
                        rows
                    )}
                </Table.Tbody>
            </Table>

            {/* paginación */}
            <Group
                justify="space-between"
                align="center"
                mt="sm"
            >
                <Text
                    c="dimmed"
                    size="sm"
                >
                    Total: {total}
                </Text>

                <Pagination
                    value={page}
                    onChange={setPage}
                    total={Math.max(totalPages, 1)}
                />

                <Text
                    c="dimmed"
                    size="sm"
                >
                    Página {page} / {Math.max(totalPages, 1)}
                </Text>
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

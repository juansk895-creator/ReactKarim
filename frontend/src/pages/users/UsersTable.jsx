import React, { useEffect, useState } from "react";
import { Button, Center, Group, Loader, Table, Text, Pagination } from "@mantine/core";
import { IconPlus, IconSortAscending, IconSortDescending, IconEdit } from "@tabler/icons-react";
import { useNavigate } from 'react-router-dom';

const COLUMNS = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'num_tel', label: 'Teléfono' },
    { key: 'rol_id', label: 'Rol' },
    { key: 'status_id', label: 'Estatus' },
    { key: '', label: 'Edición' },
];

export default function UsersTable() {

    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [page, setPage] = useState();
    const [perPage] = useState(18);
    const [totalPages, setTotalPages] = useState(1);

    const [sortBy, setSortBy] = useState('created_at');
    const [sortDir, setSortDir] = useState('desc');

    async function fetchData() {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({ page, perPage, sortBy, sortDir });
            const res = await fetch(`/api/users?${params.toString()}`, { credentials: 'include' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            setRows(json.data || []);
            setTotalPages(json.totalPages || 1);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    // 
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, sortBy, sortDir]);

    const handleSort = (key) => {
        if (sortBy === key) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(key);
            setSortDir('asc');
        }
    };

    return (
        <div>
            <Group justify="space-between" mb="md">
                <Text size="xl" fw={700} >Usuarios</Text>
                <Button leftSection={<IconPlus size={16} />} onClick={() => navigate('/dashboard/usersRegister')}>
                    Nuevo usuario
                </Button>
            </Group>

            {loading ? (
                <Center py="xl"><Loader /></Center>
            ) : error ? (
                <Text c="red">Error: {error}</Text>
            ) : (
                <Table striped highlightOnHover withTableBorder withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            {COLUMNS.map((col) => (
                                <Table.Th key={col.key} onClick={() => handleSort(col.key)} style={{ cursor: 'pointer' }}>
                                    <Group gap="xs">
                                        <span>{col.label}</span>
                                        {sortBy === col.key ? (
                                            sortDir === 'asc' ? <IconSortAscending size={14} /> : <IconSortDescending size={14} />
                                        ) : null}
                                    </Group>
                                </Table.Th>
                            ))}
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {rows.map((u) => (
                            <Table.Tr key={u.id}>
                                <Table.Td>{u.nombre}</Table.Td>
                                <Table.Td>{u.email}</Table.Td>
                                <Table.Td>{u.num_tel}</Table.Td>
                                <Table.Td>{u.rol_id}</Table.Td>
                                <Table.Td>{u.status_id}</Table.Td>
                                <Table.Td>{<IconEdit stroke={2} />}</Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            )}

            <Group justify="center" mt="md">
                <Pagination total={totalPages} value={page} onChange={setPage} />
            </Group>

        </div>
    );
}




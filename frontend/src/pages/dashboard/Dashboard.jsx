import React, { useContext, useState } from "react";
import { AuthContext } from '../../AuthContext';
import { AppShell, Navbar, Header, Text, Button, Group,
    ScrollArea, NavLink, Title, useMantineTheme } from '@mantine/core';
import { IconHome2, IconUsers, IconCharbar, IconLogout } from '@tabler/icons-react';

export default function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const theme = useMantineTheme();
    const [active, setActive] = useState('home');

    const handleNav= (section) => setActive(section);

    return (
        <AppShell
            padding='md'
            navbar={
                <Navbar
                    width={{ base: 250 }}
                    p='sm'
                    bg={theme.colors.gray[0]}
                    withBorder={false}
                >
                    <Navbar.Section>
                        <Title order={4} ta='center' mb='sm'>
                            Panel de Control ()
                        </Title>
                    </Navbar.Section>

                    <Navbar.Section grow component={ScrollArea} mt='sm'>
                        <NavLink
                            label='Inicio'
                            icon={<IconHome2 size='1rem'/>}
                            active={active === 'home'}
                            onClick={() => handleNav('home')}
                        />
                        <NavLink
                            label='Usuarios'
                            icon={<IconUsers size='1rem'/>}
                            active={active === 'suers'}
                            onClick={() => handleNav('users')}
                        />
                        <NavLink
                            label='Reportes'
                            icon={<IconCharbar size='1rem'/>}
                            active={active === 'reports'}
                            onClick={() => handleNav('reports')}
                        />
                    </Navbar.Section>

                    <Navbar.Section>
                        <Button
                            fullWidth
                            color='red'
                            leftSection={<IconLogout size='1rem'/>}
                            onClick={logout}
                        >
                            Cerrar sesión
                        </Button>
                    </Navbar.Section>
                </Navbar>
            }
            header={
                <Header height={60} p='sm'>
                    <Group justify="space-between" align="center" h='100%'>
                        <Text fw={600} fz='lg'>
                            Bienvenido, {user?.nombre || 'Usuario'}
                        </Text>
                        <Text c='dimmed'>
                            Rol: {user?.rol_id || 'Sin rol'} | Estado:{' '}
                            {user?.status_id === 1 ? 'Activo' : 'Inactivo'}
                        </Text>
                    </Group>
                </Header>
            }
        >
            {/* Contenido dinámico */}
            <div style={{ padding: '1rem' }}>
                {active === 'home' && (
                    <>
                        <Title order={3} mb='sm'>
                            Resumen general
                        </Title>
                        <Text>
                            Aquí se puede consultar métricas, acceder a módulos administrativos, así como ver información relevante del sistema.
                        </Text>
                    </>
                )}
                {active === 'users' && (
                    <>
                        <Title order={3} mb='sm'>
                            Módulo de Usuarios
                        </Title>
                        <Text>Gestión de usuarios del sistema (CRUD)</Text>
                    </>
                )}
                {active === 'reports' && (
                    <>
                        <Title order={3} mb='sm'>
                            Módulo de Reportes
                        </Title>
                        <Text>
                            Estadísticas e informes (generar reportes)
                        </Text>
                    </>
                )}
            </div>
        </AppShell>
    );
}













/*
import React, { useContext } from 'react';
import { AuthContext } from '../../AuthContext';

export default function Dashboard() {
    const { user, logout } = useContext(AuthContext);

    const formatDate = (dateString) => {
        if (!dateString) {
            return 'No disponible';
        }
        return new Date(dateString).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div
            style={{
                display: 'flex',
                height: '100vh',
                backgroundColor: '#f4f6f8',
                fontFamily: 'Arial, sans-serif'
            }}
        >
            //{ Sidebar }
            <aside
                style={{
                    width: '240px',
                    backgroundColor: '#1f2937',
                    color: '#fff',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}
            >
                <div>
                    <h2 style={{ fontSize: '1.3rem', marginBottom: '2rem' }}>
                        Panel de control ()
                    </h2>
                    <nav>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '1rem' }}>
                                <a href='#' style={{ color: '#fff', textDecoration: 'none' }}>
                                    //{ Agregar ícono }
                                    Inicio
                                </a>
                            </li>
                            <li style={{ marginBottom: '1rem' }}>
                                <a href='#' style={{ color: '#fff', textDecoration: 'none' }}>
                                    //{ Agregar ícono }
                                    Usuarios
                                </a>
                            </li>
                            <li>
                                <a href='#' style={{ color: '#fff', textDecoration: 'none' }}>
                                    Reportes
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>

                <button
                    onClick={logout}
                    style={{
                        backgroundColor: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0,6rem',
                        cursor: 'pointer'
                    }}
                >
                    Cerrar sesión
                </button>
            </aside>
            //{ Contenido principal }
            <main style={{ flex: 1, padding: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
                    Bienvenido, {user?.nombre || "Usuario"}
                </h1>
                <p>
                    Rol: <strong>{user?.rol_id || "Asignación pendiente"}</strong>
                </p>
                <p>
                    Estado: <strong>{user?.status_id === 1 ? "Activo" : "Inactivo"}</strong>
                </p>
                <p>
                    Fecha de registro: <strong>{formatDate(user?.fecha_nac)}</strong>
                </p>

                <div
                    style={{
                        marginTop: '2rem',
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        boxShadow: '0 0 8px rgba(0,0,0,0.1)'
                    }}
                >
                    <h2>Resumen general</h2>
                    <p>
                        Espacio para consulta de métricas, módulos administrativos e información relevante del sistema.
                    </p>
                </div>
            </main>
        </div>
    );
}

*/





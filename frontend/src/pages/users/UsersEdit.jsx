import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ActionIcon, Box, Button, Card, Divider, Group, TextInput, Select, Title, Paper, Loader } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconArrowBackUp, IconX, IconDeviceFloppy, IconLock } from "@tabler/icons-react";
//
import '@mantine/dates/styles.css';
import '@mantine/core/styles.css';
import '@mantine/core/styles.layer.css';
//
import { AuthContext } from "../../AuthContext";
//Archivos
import ModalConfirmUpdateUser from "../../components/ModalConfirmUpdateUser";
import ModalChangePassword from "../../components/ModalChangePassword";

export default function UsersEdit() {

    const { id } = useParams();
    const { secureFetch, user } = useContext(AuthContext);

    // Navegación
    const navigate = useNavigate();
    const handleBack = () => { //Necesario ? Revisar
        navigate("/dashboard/usersTable");
    };

    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalPasswordOpen, setModalPasswordOpen] = useState(false);

    //Formulario
    const [form, setForm] = useState({
        nombre: "",
        apellido_pat: "",
        apellido_mat: "",
        email: "",
        num_tel: "",
        fecha_nac: null,
        rol_id: "",
    });

    //Datos del usuario
    const fetchUser = async () => {
        try {
            const response = await secureFetch(`http://localhost:4000/api/users/${id}`);
            if (!response.ok) {
                console.error("Error al obtener usuario");
                return;
            }

            const data = await response.json();

            setForm({
                nombre: data.nombre || "",
                apellido_pat: data.apellido_pat || "",
                apellido_mat: data.apellido_mat || "",
                email: data.email || "",
                num_tel: data.num_tel || "",
                fecha_nac: data.fecha_nac ? new Date(data.fecha_nac) : null,
                rol_id: data.rol_id?.toString() || "",
            });

            setLoading(false);
        } catch (err) {
            console.error("Error:", err);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleConfirmUpdate = async () => {
        try {
            const payload = {
                nombre: form.nombre,
                apellido_pat: form.apellido_pat,
                apellido_mat: form.apellido_mat,
                email: form.email,
                num_tel: form.num_tel,
                fecha_nac: form.fecha_nac,
            };

            //Solo el admin puede editar el rol, validación necesaria ?
            if (user?.rol_id === 1) {
                payload.rol_id = form.rol_id;
            }

            const response = await secureFetch(
                `http://localhost:4000/api/users/${id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                console.error("Error al actualizar usuario");
                return;
            }

            setModalOpen(false);
            navigate("/dashboard/usersTable");
        } catch (err) {
            console.error("Error PUT:", err);
        }
    };

    const handleChangePassword = async () => {};

    if (loading) {
        return (
            <Box
                p="xl"
                style={{
                    textAlign: "center"
                }}
            >
                <Loader size="lg" />
            </Box>
        );
    }

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
                    onClick={() => navigate('/dashboard/usersTable')}
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
                    Edición de usuario
                </Title>
            </Box>
            <Card shadow="sm" p="lg" radius="md" >
                <Group grow mb="md" >
                    <TextInput
                        label="nombre"
                        value={form.nombre}
                        onChange={(e) => handleChange("nombre", e.target.value)}
                    />

                    <TextInput
                        label="Apellido paterno"
                        value={form.apellido_pat}
                        onChange={(e) => handleChange("apellido_pat", e.target.value)}
                    />
                </Group>

                <Group grow mb="md" >
                    <TextInput
                        label="Apellido materno"
                        value={form.apellido_mat}
                        onChange={(e) => handleChange("apellido_mat", e.target.value)}
                    />

                    <TextInput
                        label="Correo electrónico (email)"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                    />
                </Group>

                <Group grow mb="md" >
                    <TextInput
                        label="Teléfono"
                        value={form.num_tel}
                        onChange={(e) => handleChange("num_tel", e.target.value)}
                    />

                    <DateInput
                        label="Fecha de nacimiento"
                        value={form.fecha_nac}
                        onChange={(value) => handleChange("fecha_nac", value)}
                    />
                </Group>

                {user?.rol_id === 1 && (
                    <Select
                        label="Rol"
                        placeholder="Seleccionar rol"
                        radius="md"
                        value={form.rol_id}
                        onChange={(value) => handleChange("rol_id", value)}
                        data={[
                            { value: "0", label: "" },
                            { value: "1", label: "Administrador" },
                            { value: "2", label: "Titular" },
                            { value: "3", label: "Analista" },
                        ]}
                    />
                )}

                <Divider my="md" />

                <Group justify="space-between">
                    <Button
                        color="orange"
                        onClick={() => navigate("/dashboard/usersTable")}
                        variant="transparent"
                        leftSection={<IconX />}
                    >
                        Cancelar
                    </Button>
                    
                    <Button
                        color="cyan"
                        variant="transparent"
                        leftSection={<IconLock />}
                        onClick={() => setModalPasswordOpen(true)}
                    >
                        Cambiar contraseña
                    </Button>
                    
                    <Button
                        //type="submit"
                        color="green"
                        variant="transparent"
                        leftSection={<IconDeviceFloppy />}
                        //loading={isSubmitting}
                        onClick={() => setModalOpen(true)}
                    >
                        Actualizar
                    </Button>
                </Group>
            </Card>

            <ModalConfirmUpdateUser
                opened={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleConfirmUpdate}
                userName={form.nombre}
            />

            <ModalChangePassword
                opened={modalPasswordOpen}
                onClose={() => setModalPasswordOpen(false)}
                userId={id}
            />

        </Box>
    );
}


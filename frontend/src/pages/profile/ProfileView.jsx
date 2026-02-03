import React, { useContext, useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ActionIcon, Box, Button, Divider, Group, Paper, Stack, Text, TextInput, Title } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { IconArrowBackUp, IconCancel, IconDeviceFloppy, IconEdit, IconLock, IconTrash, IconX } from "@tabler/icons-react";
//Archivos
import { AuthContext } from "../../AuthContext";
import ModalChangePasswordProfile from "../../components/ModalChangePasswordProfile";
import ModalDeleteProfile from "../../components/ModalDeleteProfile";
import ModalChangeStatusProfile from "../../components/ModalChangeStatusProfile";

/*
nombre, apellido_pat, apellido_mat,
email, num_tel, password (por separado ?)
fecha_nac, rol_id (#), status_id (#),
created_id (date), updated_id (date)
*/

function RowItem({ label, value }) {
    return (
        <Group
            justify="space-between"
            align="center"
            wrap="nowrap"
        >
            <Text fw={700}>{label}</Text>
            <Text c="dimmed" style={{
                textAlign: "right", maxWidth: 520
            }}>
                {value || "-"}
            </Text>
        </Group>
    );
}


export default function ProfileView() {

    const { secureFetch } = useContext(AuthContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [profile, setProfile] = useState(null);

    //Modales
    const [modalPasswordOpen, setModalPasswordOpen] = useState(false);
    const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
    const [modalStatusOpen, setModalStatusOpen] = useState(false);

    const [loadingPassword, setLoadingPassword] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState(false);

    const currentStatusLabel = profile?.status_id === 1 ? "Activo" : "Inactivo";
    const nextStatusLabel = profile?.status_id === 1 ? "Inactivo" : "Activo";

    const [form, setForm] = useState({
        nombre: "",
        apellido_pat: "",
        apellido_mat: "",
        email: "",
        num_tel: "",
        fecha_nac: null,
    });

    const loadProfile = async () => {
        try {
            setLoading(true);
            const res = await secureFetch("http://localhost:4000/api/users/me");
            if (!res?.ok) {
                throw new Error("Error al cargar el perfil (frontend)");
            }
            const json = await res.json();

            const u = json?.user;
            setProfile(u);

            setForm({
                nombre: u?.nombre ?? "",
                apellido_pat: u?.apellido_pat ?? "",
                apellido_mat: u?.apellido_mat ?? "",
                email: u?.email ?? "",
                num_tel: u?.num_tel ?? "",
                fecha_nac: u?.fecha_nac ? new Date(u.fecha_nac) : null,
            });
        } catch (err) {
            console.error(err);
            notifications.show({
                title: "Error",
                message: "No se pudo cargar el perfil",
                color: "red",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
        //
    }, []);

    const onCancel = () => {
        if (!profile) {
            return;
        }
        setForm({
            nombre: profile?.nombre ?? "",
            apellido_pat: profile?.apellido_pat ?? "",
            apellido_mat: profile?.apellido_mat ?? "",
            email: profile?.email ?? "",
            num_tel: profile?.num_tel ?? "",
            fecha_nac: profile?.fecha_nac ? new Date(profile.fecha_nac) : null,
        });
        setEditing(false);
    };

    const onSave = async () => {
        try {
            const payload = {
                ...form,
                fecha_nac: form.fecha_nac ? form.fecha_nac.toISOString() : null,
            };

            const res = await secureFetch("http://localhost:4000/api/users/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error("No se pudo guardar el cambio (frontend)");
            }

            const json = await res.json();
            setProfile(json?.user);
            setEditing(false);

            notifications.show({
                title: "Listo",
                message: "Perfil actualizado con éxito",
                color: "green",
            });
        } catch (err) {
            console.error(err);
            notifications.show({
                title: "Error",
                message: "No se pudo actualizar el perfil (frontend)",
                color: "red",
            });
        }
    };

    const fullName = useMemo(() => {
        if (!profile) {
            return "";
        }
        return `${profile.nombre ?? ""} ${profile.apellido_pat ?? ""} ${profile.apellido_mat ?? ""}`
        .replace(/\s+/g, " ")
        .trim();
    }, [profile]);

    const handleChangePassword = async ({ currentPassword, newPassword, confirmNewPassword, reset }) => {
        if (!currentPassword || !newPassword) {
            notifications.show({ title: "Error", message: "Completa los campos", color: "red" });
            return;
        }
        if (newPassword !== confirmNewPassword) {
            notifications.show({ title: "Error", message: "La nueva contraseña no coincide", color: "red" });
            return;
        }

        setLoadingPassword(true);
        try {
            const res = await secureFetch("http://localhost:4000/api/users/me/password", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            if (!res.ok) {
                throw new Error();
            }

            notifications.show({ title: "Listo", message: "Contraseña actualizada", color: "green" });
            reset();
            setModalPasswordOpen(false);
        } catch {
            notifications.show({ title: "Error", message: "No se pudo actualizar la contraseña (frontend)", color: "red" });
       } finally {
        setLoadingPassword(false);
       }
    };

    const handleChangeMyStatus = async () => {
        setLoadingStatus(true);
        try {
            const newStatusId = profile?.status_id === 1 ? 2 : 1;

            const res = await secureFetch("http://localhost:4000/api/users/me/status", {
                method: "PATH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status_id: newStatusId }),
            });
            if (!res.ok) {
                throw new Error();
            }
            notifications.show({ title: "Listo", message: "Estado actualizado", color: "green" });
            setModalStatusOpen(false);
            await loadProfile();
        } catch {
            notifications.show({ title: "Error", message: "No se pudo actualizar el estado", color: "red" });
        } finally {
            setLoadingStatus(false);
        }
    };

    const handleDeleteMe = async ({ confirmText, reset }) => {
        if (confirmText !== "ELIMINAR") {
            return;
        }

        setLoadingDelete(true);
        try {
            const res = await secureFetch("http://localhost:4000/api/users/me", {
                method: "DELETE"
            });
            if (!res.ok) {
                throw new Error();
            }

            notifications.show({ title: "Cuenta eliminada", message: "Tu cuenta fue eliminada ", color: "green" });
            reset();
            setModalDeleteOpen(false);
        } catch {
            notifications.show({ title: "Error", message: "No se pudo eliminar la cuenta", color: "red" });
        } finally {
            setLoadingDelete(false);
        }
    };

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
                    onClick={() => navigate("/dashboard")}
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
                    Perfil de usuario
                </Title>
            </Box>

            <Paper
                withBorder
                p="md"
                radius="md"
            >
                {loading ? (
                    <Text c="dimmed">Cargando...</Text>
                ) : !profile ? (
                    <Text c="dimmed">No hay información de perfil</Text>
                ) : !editing ? (
                    <Stack gap="sm">
                        <RowItem label="Nombre" value={fullName} />
                        <Divider />
                        <RowItem label="Email" value={profile.email} />
                        <Divider />
                        <RowItem label="Teléfono" value={profile.num_tel} />
                        <Divider />
                        <RowItem label="Nacimiento" value={profile.fecha_nac ? new Date(profile.fecha_nac).toISOString().slice(0, 10) : ""} />
                    </Stack>
                ) : (
                    <Stack gap="sm">
                        <TextInput
                            label="Nombre"
                            value={form.nombre}
                            onChange={(e) => setForm((p) => ({ ...p, nombre: e.currentTarget.value }))}
                        />
                        <Group grow>
                            <TextInput
                                label="Apellido paterno"
                                value={form.apellido_pat}
                                onChange={(e) => setForm((p) => ({ ...p, apellido_pat: e.currentTarget.value }))}
                            />
                            <TextInput
                                label="Apellido materno"
                                value={form.apellido_mat}
                                onChange={(e) => setForm((p) => ({ ...p, apellido_mat: e.currentTarget.value }))}
                            />
                        </Group>

                        <TextInput
                            label="Email"
                            value={form.email}
                            onChange={(e) => setForm((p) => ({ ...p, email: e.currentTarget.value }))}
                        />
                        <TextInput
                            label="Teléfono"
                            value={form.num_tel}
                            onChange={(e) => setForm((p) => ({ ...p, num_tel: e.currentTarget.value }))}
                        />
                        <DateInput
                            label="Fecha de nacimiento"
                            value={form.fecha_nac}
                            onChange={(val) => setForm((p) => ({ ...p, fecha_nac: val }))}
                            valueFormat="YYYY-MM-DD"
                            clearable
                        />
                    </Stack>
                )}
            </Paper>

            <Divider my="md" />

            <Group justify="space-between">
                {!editing ? (
                    <>
                        <Button
                            variant="transparent"
                            leftSection={<IconEdit size={18} />}
                            onClick={() => setEditing(true)}
                            disabled={loading || !profile}
                        >
                            Editar
                        </Button>

                        <Button
                            variant="transparent"
                            leftSection={<IconLock />}
                            onClick={() => setModalPasswordOpen(true)}
                        >
                            Cambiar contraseña
                        </Button>

                        <Button
                            variant="transparent"
                            leftSection={<IconCancel />}
                            onClick={() => setModalStatusOpen(true)}
                        >
                            Desactivar mi cuenta
                        </Button>

                        <Button
                            color="red"
                            variant="transparent"
                            leftSection={<IconTrash />}
                            onClick={() => setModalDeleteOpen(true)}
                        >
                            Eliminar mi cuenta
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            color="orange"
                            variant="transparent"
                            leftSection={<IconX size={18} />}
                            onClick={onCancel}
                        >
                            Cancelar
                        </Button>

                        <Button
                            color="green"
                            variant="transparent"
                            leftSection={<IconDeviceFloppy size={18} />}
                            onClick={onSave}
                        >
                            Guardar
                        </Button>
                    </>
                )}
            </Group>

            <ModalChangePasswordProfile
                opened={modalPasswordOpen}
                onClose={() => setModalPasswordOpen(false)}
                onConfirm={handleChangePassword}
                loading={loadingPassword}
            />

            <ModalChangeStatusProfile
                opened={modalStatusOpen}
                onClose={() => setModalStatusOpen(false)}
                onConfirm={handleChangeMyStatus}
                loading={loadingStatus}
                currentStatusLabel={currentStatusLabel}
                nextStatusLabel={nextStatusLabel}
            />

            <ModalDeleteProfile
                opened={modalDeleteOpen}
                onClose={() => setModalDeleteOpen(false)}
                onConfirm={handleDeleteMe}
                loading={loadingDelete}
            />
            <Outlet />
        </Box>
    );
}



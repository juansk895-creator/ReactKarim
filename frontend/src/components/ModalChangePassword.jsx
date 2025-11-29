import React, { useContext, useState } from "react";
import { Button, Group, Modal, PasswordInput, Stack, Text } from "@mantine/core";
import { AuthContext } from "../AuthContext";
import { notifications } from "@mantine/notifications";
import { IconXboxX, IconX, IconCheck } from "@tabler/icons-react";



export default function ModalChangePassword({
    opened,
    onClose,
    userId
}) {

    const { secureFetch } = useContext(AuthContext);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentPassword || !newPassword || !confirmPassword) {
            notifications.show({
                title: "Error",
                color: "red",
                message: "Todos los campos son obligatorios",
                icon: <IconX />
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            notifications.show({
                title: "Error",
                color: "red",
                message: "La nueva contraseña no coincide",
                icon: <IconX />
            });
            return;
        }

        setLoading(true);

        try {
            const res = await secureFetch(`/api/users/${userId}/password`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Error al cambiar contraseña");
            }

            notifications.show({
                title: "Contraseña actualizada",
                color: "green",
                message: "Contraseña actualizada correctamente",
                icon: <IconCheck />
            });

            onClose();
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            notifications.show({
                title: "Error interno",
                color: "red",
                message: err.message,
                icon: <IconX />
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            withinPortal //
            title="Cambio de contraseña"
            //centered
            withCloseButton
            closeButtonProps={{
                icon: <IconXboxX size={20} stroke={1.5} />,
            }}
            centered
            transitionProps={{
                transition: "fade",
                duration: 250,
                timingFunction: "ease",
            }}
            overlayProps={{
                backgroundOpacity: 0.75,
                blur: 4,
                //color: "#000",
            }}
            styles={{
                inner: {
                position: "fixed",
                //inset: 0,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 10000,
                },
                overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.7)", // Sombra
                backdropFilter: "blur(3px)", // Desenfoque
                },
                content: {
                //backgroundColor: "#1A1B1E",
                color: "white",
                borderRadius: "12px",
                padding: "1.5rem",
                minWidth: "320px",
                boxShadow: "0 0 25px rgba(0, 0, 0, 0.6)",

                position: "relative",
                },
                title: {
                textAlign: "left",
                marginBottom: "0.5rem",
                marginTop: "0rem",
                },
                close: {
                position: "absolute",
                top: "15px",
                right: "12px",
                //background: "transparent",
                border: "none",
                
                },
            }}
            closeOnClickOutside={false}
            closeOnEscape={true}
            trapFocus
        >

            <Stack>
                <PasswordInput
                    label="Contraseña actual"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />

                <PasswordInput
                    label="Nueva Contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                <PasswordInput
                    label="Confirmar nueva contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

            </Stack>

            <Group
                justify="flex-end"
                mt="lg"
            >
                <Button
                    variant="transparent"
                    color="yellow"
                    onClick={onClose}
                >
                    Cancelar
                </Button>

                <Button
                    variant="transparent"
                    loading={loading}
                    color="cyan"
                    onClick={handleSubmit}
                >
                    Confirmar cambio
                </Button>
            </Group>
            
        </Modal>
    );
}


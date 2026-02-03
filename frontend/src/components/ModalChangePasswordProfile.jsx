import React, { useState } from "react";
import { Button, Group, Modal, PasswordInput, Text } from "@mantine/core";

export default function ModalChangePasswordProfile({ opened, onClose, onConfirm, loading }) {

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const handleClose = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        onClose();
    };

    const handleConfirm = () => {
        onConfirm({ currentPassword, newPassword, confirmNewPassword, reset: handleClose });
    };

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title="Cambiar contraseña"
            centered
        >
            <Text
                c="dimmed"
                size="sm"
                mb="sm"
            >
                Ingresar contraseña actual para poder actualizar por una nueva.
            </Text>

            <PasswordInput
                label="Contraseña actual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.currentTarget.value)}
                mb="sm"
            />

            <PasswordInput
                label="Nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.currentTarget.value)}
                mb="sm"
            />

            <PasswordInput
                label="Confirmar nueva contraseña"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.currentTarget.value)}
            />

            <Group
                justify="space-between"
                mt="md"
            >
                <Button
                    color="orange"
                    variant="transparent"
                    onClick={handleClose}
                >
                    Cancelar
                </Button>
                <Button
                    loading={loading}
                    color="green"
                    variant="transparent"
                    onClick={handleConfirm}
                >
                    Guardar
                </Button>
            </Group>
        </Modal>
    );
}



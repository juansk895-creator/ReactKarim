import React, { useState } from "react";
import { Button, Group, Modal, Text, TextInput } from "@mantine/core";

export default function ModalDeleteProfile({ opened, onClose, onConfirm, loading }) {
    const [confirmText, setConfirmText] = useState("");

    const handleClose = () => {
        setConfirmText("");
        onClose();
    };

    const handleConfirm = () => {
        onConfirm({ confirmText, reset: handleClose });
    };

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title="Eliminar mi cuenta"
            centered
        >
            <Text mb="sm" c="red" fw={700}>
                Eliminar tu cuenta es una acción permanente.
            </Text>

            <Text
                c="dimmed"
                size="sm"
                mb="sm"
            >
                Para poder confirmar, escriba <b>ELIMINAR</b>
            </Text>
            
            <TextInput
                value={confirmText}
                onChange={(e) => setConfirmText(e.currentTarget.value)}
                placeholder="..."
            />

            <Group
                justify="space-between"
                mt="md"
            >
                <Button
                    color="yellow"
                    variant="transparent"
                    onClick={handleClose}
                >
                    Cancelar
                </Button>

                <Button
                    color="red"
                    variant="transparent"
                    loading={loading}
                    onClick={handleConfirm}
                    disabled={confirmText !== "ELIMINAR "}
                >
                    Eliminar
                </Button>
            </Group>
        </Modal>
    );
}




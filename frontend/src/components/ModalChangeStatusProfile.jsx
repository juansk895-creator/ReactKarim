import React from "react";
import { Button, Group, Modal, Text } from "@mantine/core";
import { IconXboxX } from "@tabler/icons-react";

export default function ModalChangeStatusProfile({
    opened,
    onClose,
    onConfirm,
    loading,
    currentStatusLabel,
    nextStatusLabel,
}) {
    return (
        <Modal
            //opened={opened}
            //onClose={onClose}
            //title="Cambiar mi estado"
            //centered
            opened={opened}
            onClose={onClose}
            withinPortal
            title="Cambiar estado"
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
            <Text mb="sm">
                Desactivar tu cuenta hará que no puedas ingresar de nuevo hasta que un Administrador autorice reactivarla.
            </Text>

            <Group
                justify="space-betwen"
                mt="md"
            >
                <Button
                    color="orange"
                    variant="transparent"
                    onClick={onClose}
                >
                    Cancelar
                </Button>

                <Button
                    color="red"
                    loading={loading}
                    variant="transparent"
                    onClick={onConfirm}
                >
                    Confirmar
                </Button>
            </Group>
        </Modal>
    );
}






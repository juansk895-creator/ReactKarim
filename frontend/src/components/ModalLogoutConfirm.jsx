
// Revisar
import { Modal, Button, Group, Text } from "@mantine/core";
import { FocusTrap } from "focus-trap-react";
import { IconXboxX } from "@tabler/icons-react";
//
import '@mantine/dates/styles.css';
import '@mantine/core/styles.css';
import '@mantine/core/styles.layer.css';
//

//Revisar focus trap para mantener funcionalidad solo en el modal
export default function ModalLogoutConfirm({ opened, onClose, onConfirm }) {
  return (
    
    <Modal
      opened={opened}
      onClose={onClose}
      title="Cerrar sesión"
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
      lockScroll      
    >
      <Text size="sm" mb="md">
        ¿Confirma que desea cerrar sesión?
      </Text>

      <Group
        justify="flex-end"
        gap="md"
        style={{
          margintTop: "1rem",
          paddingTop: "2rem",
          paddingLeft: "5rem",
          
        }}
      >
        <Button
          onClick={onClose}
          variant="transparent"
          color="yellow"
        >
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          variant="transparent"
          color="red"
        >
          Cerrar sesión
        </Button>
      </Group>
    </Modal>
  );
}

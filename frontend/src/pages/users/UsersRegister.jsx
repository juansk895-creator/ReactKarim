import React from "react";
import { ActionIcon, Box, Button, Flex, Group, TextInput, Title, SimpleGrid, Select, Space, NativeSelect, } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { IconArrowLeft, IconChevronDown, IconPhone } from "@tabler/icons-react";



export default function UsersRegister() {

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/dashboard/usersTable");
  };

  const iconPhone = <IconPhone size={16} />;

  return (
    <Box
        p="md"
        //w="100%"
        style={{
            width: "100%",
            height: "100%",
            //backgroundColor: "darkred",
            display: "flex",
            flexDirection: "column",

            //maxWidth: "900px",
            //margin: "0 auto",
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
          onClick={() => navigate('/dashboard/usersTable')}
        >
          <IconArrowLeft size={20} />
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
          Registro de nuevo usuario
        </Title>
        
      </Box>
      {/* Formulario */}
      <form style={{ flexGrow: 1 }}>
        {/* Fila 1: Nombre */}
        <TextInput
          label="Nombre"
          placeholder="Nombre del usuario"
          required
          mb="md"
        />
        
        {/* Fila 2: Apellidos */}
        <SimpleGrid
          cols={2}
          spacing="md"
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <TextInput
            label="Apellido paterno"
            placeholder="Apellido paterno"
            required
          />
          <TextInput
            label="Apellido materno"
            placeholder="Apellido materno"
          />
        </SimpleGrid>
        
        {/* Fila 3: Email y Teléfono */}
        <SimpleGrid
          cols={2}
          spacing="md"
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          
          <TextInput
            label="Correo electrónico"
            placeholder="usuario@correo.com"
            required
          />
          <TextInput
            size="xl"
            label="Número telefónico"
            placeholder="10 dígitos"
            leftSectionPointerEvents="none"
            leftSection={iconPhone}
          />   
                 
        </SimpleGrid>
        {/* Fila 4: Contraseña, Fecha de nacimiento, Rol */}
        <SimpleGrid
          cols={3}
          spacing="md"
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "1rem",
          }}
        >
          <TextInput
            type="password"
            label="Contraseña"
            placeholder="********"
            required
          />
          <TextInput
            type="date"
            label="Fecha de nacimiento"
            required
          />
          <Box style={{  position: "relative", zIndex: 1 }}>
          <Select
            label="Rol"
            placeholder="Seleccionar rol"
            //withinPortal={false}
            data={[
              { value: "1", label: "Administrador" },
              { value: "2", label: "Titular" },
              { value: "3", label: "Analista" },
            ]}
            required
            rightSection={<></>}

            position="bottom-start"

            comboboxProps={{
              position: "bottom",
              middlewares: { flip: false, shift: false },
              withinPortal: false,
            }}

            //dropdownPosition="bottom"
            //zIndex={9999}
            
            
            //rightSection={<IconChevronDown size={0} style={{ color: "gray" }} />}
            //rightSectionWidth={36}
            //style={{
            //  input: { height: 36 },
            //}}
          />
          </Box>
        </SimpleGrid>

        {/* Botones finales */}
        <Group justify="flex-end" mt="lg">
          <Button>Limpiar</Button>
          <Button>Aleatorio</Button>
          <Button
            onClick={async () => {
              try {

                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:4000/api/users", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer${token}`,
                   },
                  body: JSON.stringify({
                    nombre: "prueba",
                    email: "prueba@test.com",
                    password: "123654",
                    rol_id: 2
                  }),
                });
                if (!response.ok) {
                  const error = await response.json();
                  alert(`Error: ${error.message}`);
                  return;
                }
                const data = await response.json();
                console.log("Usuario registrado:", data);
                alert("Usuario de prueba registrado con éxito");
              } catch (err) {
                console.error("Error al registrar usuario:", err);
                alert("Error al conectar con el servidor");
              }
            }}
          >
            Registrar
          </Button>
        </Group>
      </form>
    </Box>
  );
}


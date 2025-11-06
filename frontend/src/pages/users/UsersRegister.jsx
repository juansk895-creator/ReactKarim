import React from "react";
import { Box, Button, Group, TextInput, Title } from "@mantine/core";

export default function UsersRegister() {

    return (

        <Box p="md">
            <Title order={2} mb="md">
                Registro de nuevo usuario
            </Title>
            
            <form>
                <TextInput
                    label="Nombre"
                    placeholder="Nombre del usuario"
                    required
                    mb="md"
                />

                <Group
                    justify="flex-end"
                    mt="lg"
                >
                    <Button variant="default">Cancelar</Button>
                    <Button>Guardar</Button>
                </Group>
                
            </form>
        </Box>
    );
}





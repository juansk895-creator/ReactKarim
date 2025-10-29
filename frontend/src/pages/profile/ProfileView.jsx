import React from "react";
import { Card, Title, Text } from "@mantine/core";

export default function ProfileView() {
    return (
        <Card
            shadow="md"
            padding="xl"
            radius="md"
            withBorder
            style={{
                maxWidth: 500,
                margin: "2rem auto",
                background: "#666666ff",
                textAlign: "center",
            }}
        >
            <Title order={3} mb="md" c="darkblue">
                Perfil de usuario (Solo visualización)
            </Title>

            <Title c="dimmed" fz="lg">
                Sección reservada para mostrar los datos del usuario.
            </Title>
        </Card>
    );
}



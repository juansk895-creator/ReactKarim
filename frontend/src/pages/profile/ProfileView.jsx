import React from "react";
import { Card, Text, Title } from "@mantine/core";

export default function ProfileView() {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
            }}
        >
            <Card
                shadow="md"
                padding="xl"
                radius="md"
                withBorder
                style={{
                    maxWidth: 500,
                    //margin: "2rem auto",
                    textAlign: "center",
                }}
            >
                <Title order={3} mb="md">
                    Perfil de usuario (solo visualizamos)
                </Title>

                <Text c="dimmed" fz="lg">
                    Agregar aquí datos del usuario
                </Text>
            </Card>
        </div>
    );
}


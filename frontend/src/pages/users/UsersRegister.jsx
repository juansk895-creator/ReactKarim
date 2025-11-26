import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActionIcon, Box, Button, Card, Divider, Grid, Group, Text, TextInput, Title, PasswordInput, Select } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import '@mantine/dates/styles.css';
import '@mantine/core/styles.css';
import '@mantine/core/styles.layer.css';
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { AuthContext } from "../../AuthContext";
import { IconWand, IconEraser, IconDeviceFloppy, IconArrowBackUp, IconX } from "@tabler/icons-react";
//Archivos
import { secureFetch } from "../../utils/secureFetch";


//Helpers
const nombres = [ "Sofía", "Regina", "María José", "Valentina", "Camila", "Santiago", "Mateo", "Sebastian", "Leonardo", "Matias" ];
const apellidos = [ "Hernández", "García", "Martínez", "López", "González", "Pérez", "Rodríguez", "Sánchez", "Ramírez", "Cruz"];

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomPhone() {
    let num;
    do {
        num = String(Math.floor(9000000000 + Math.random() * 1000000000));
    } while (
        /^(\d)\1{9}$/.test(num) ||
        num === "1234567890" || num === "0123456789"
    );
    return num;
}

function randomBirthdate() {
    const today = new Date();
    const minAge = 18;
    const maxAge = 70;
    const year =
        today.getFullYear() -
        (minAge + Math.floor(Math.random() * (maxAge - minAge)));
    const month = Math.floor(Math.random() * 12);
    const day = Math.floor(Math.random() * 28) + 1;
    return new Date(year, month, day);
}

function randomPassword() {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    const lettersUpper = letters.toUpperCase();
    const digits = "0123456789";

    return (
        randomItem(lettersUpper) +
        randomItem(letters) +
        randomItem(digits) +
        randomItem(letters)
    );
}

function randomEmail(nombre, apellido_pat) {
    //const base = `${nombre}_${apellido_pat}`.toLowerCase();
    //const random = Math.floor(Math.random() * 9999);
    // Distintos dominios ?
    //return `${base}${random}@luck.com`;
    const cleanName = normalizeString(nombre.split(" ")[0]);
    const cleanLast = normalizeString(apellido_pat);
    const random = Math.floor(Math.random() * 9999);
    return `${cleanName}_${cleanLast}${random}@luck.com`;
}

function generateUserTemplate(type = "demo") {
    const nombre = randomItem(nombres);
    const apellido_pat = randomItem(apellidos);
    const apellido_mat = randomItem(apellidos);
    const email = randomEmail(nombre, apellido_pat);
    const num_tel = randomPhone();
    const fecha_nac = randomBirthdate();
    const password = randomPassword();

    let rol_id = "2";
    const allowedRols = ["2", "3"];
    rol_id = randomItem(allowedRols);

    return {
        nombre,
        apellido_pat,
        apellido_mat,
        email,
        num_tel,
        fecha_nac,
        password,
        rol_id,
    };
}

const normalizeName = (value) => {
    if (!value) {
        return "";
    }
    let cleaned = value.trim().replace(/\s+/g, " ");
    return cleaned
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
};

function normalizeString(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ñ/gi, "n")
        .replace(/\s+/g, "_")
        .toLowerCase();
}

const normalizeEmail = (value) => value?.trim().toLowerCase() || "";

const normalizePhone = (value) => value.replace(/\D/g, "").slice(0, 10);

//Validaciones particulares
const validateName = (value) =>
    !value || value.trim().length < 2
    ? "El nombre debe tener al menos 2 caracteres"
    : /^[A-Za-zÁÉÍÓÚáéíóúÑñ' -]+$/.test(value)
    ? null
    : "Nombre inválido"; //Nombre con caracteres inválidos ?

const validateLastName = (value) =>
    !value || value.trim().length < 2
    ? "El apellido debe tener al menos 2 caracteres"
    : /^[A-Za-zÁÉÍÓÚáéíóúÑñ' -]+$/.test(value)
    ? null
    : "Apellido paterno inválido";

const validateSecondLastName = (value) =>
    !value
    ? null
    : /^[A-Za-zÁÉÍÓÚáéíóúÑñ' -]+$/.test(value)
    ? null
    : "Apellido materno inválido";

const validateEmail = (value) => {
    const email = normalizeEmail(value);
    const regex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,10}$/;
    return regex.test(email) ? null : "El correo es inválido";
};

const validatePhone = (value) => {
    const cleaned = normalizePhone(value);
    // Juntar validaciones ?
    if (cleaned.length !== 10) return "El teléfono es inválido";
    if (/^(\d)\1{9}$/.test(cleaned)) return "El teléfono es inválido"
    if (cleaned === "1234567890" || cleaned == "0123456789") {
        return "El teléfono es inválido";
    }
    return null;
};

const validatePassword = (value) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{4,}$/.test(value)
    ? null
    : "La contraseña no es segura"; // Detallar más adelante

const validateBirthdate = (value) => {
    if (!value) return "Es necesario proporcionar fecha de nacimiento";

    const today = new Date();
    const min = new Date(
        today.getFullYear() - 100,
        today.getMonth(),
        today.getDate()
    );
    const max = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
    );

    if (value < min) {
        return "El usuario necesita ser mayor de edad";
    }
    return null;
};

//
export default function UsersRegister() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Password
    const [visible, { toggle }] = useDisclosure(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    // Navegación
    const navigate = useNavigate();
    const handleBack = () => {
        navigate("/dashboard/usersTable");
    };
    //const [modalOpened, setModalOpened] = useState(false); modal confirmación 
    //const [pendingData, setPendingData] = useState(null); modal confirmación

    // datos formulario
    const form = useForm({
        initialValues: {
            nombre: "",
            apellido_pat: "",
            apellido_mat: "",
            email: "",
            num_tel: "",
            fecha_nac: null,
            password: "",
            rol_id: "0",
        },

        validate: {
            nombre: validateName,
            apellido_pat: validateLastName,
            apellido_mat: validateSecondLastName,
            email: validateEmail,
            num_tel: validatePhone,
            fecha_nac: validateBirthdate,
            password: validatePassword,
            rol_id: (value) => (!value ? "Es necesario asignar un rol" : null),
        },
    });

    // Aleatorización de datos
    const handleRandom = () => {
        const tpl = generateUserTemplate("demo");
        form.setValues(tpl);
        setPasswordVisible(true);
    };

    // Limpiar formulario
    const handleClear = () => {
        form.reset();
        setPasswordVisible(false);
    }

    // Registro de usuario por formulario
    const handleSubmit = async (values) => {
        try {

            setIsSubmitting(true);

            const formattedDate = values.fecha_nac.toISOString().split("T")[0];
            const response = await secureFetch(
                "http://localhost:4000/api/users",
                {
                    method: "POST",
                    body: JSON.stringify({
                        ...values,
                        fecha_nac: formattedDate,
                    }),
                }
            );
            if (!response) return;

            const data = await response.json();
            if (!response.ok) {
                //console.warn(data.message);
                notifications.show({
                    title: "Error",
                    message: data.message || "No se pudo completar el registro",
                    color: "red",
                });
                return;
            }

            //alert("Usuario registrado con éxito (UsersRegister.jsx)");
            notifications.show({
                title: "Registro exitoso",
                message: "El usuario ha sido registrado correctamente",
                color: "green",
            });
            form.reset();
            navigate("/dashboard/usersTable");
        } catch (error) {
            //console.error("Error al registrar usuario:", error);
            notifications.show({
                title: "Error inesperado",
                message: "Ocurrió un problema durante el registro",
                color: "red",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    Registro de nuevo usuario
                </Title>
            </Box>

            <Card shadow="sm" p="lg" radius="md" >
                {/* Formulario */}
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Grid>
                        <Grid.Col span={6} >
                            <TextInput
                                label="Nombre"
                                placeholder="Nombre"
                                radius="md"
                                {...form.getInputProps("nombre")}
                                onBlur={() =>
                                    form.setFieldValue(
                                        "nombre",
                                        normalizeName(form.values.nombre)
                                    )
                                }
                            />
                        </Grid.Col>

                        <Grid.Col span={6} >
                            <TextInput
                                label="Apellido paterno"
                                placeholder="Apellido"
                                radius="md"
                                {...form.getInputProps("apellido_pat")}
                                onBlur={() =>
                                    form.setFieldValue(
                                        "apellido_pat",
                                        normalizeName(form.values.apellido_pat)
                                    )
                                }
                            />
                        </Grid.Col>

                        <Grid.Col span={6} >
                            <TextInput
                                label="Apellido materno (opcional)"
                                placeholder="..."
                                radius="md"
                                {...form.getInputProps("apellido_mat")}
                                onBlur={() =>
                                    form.setFieldValue(
                                        "apellido_mat",
                                        normalizeName(form.values.apellido_mat)
                                    )
                                }
                            />
                        </Grid.Col>

                        <Grid.Col span={6} >
                            <TextInput
                                label="Correo electrónico (email)"
                                placeholder="correo13@example.com"
                                radius="md"
                                {...form.getInputProps("email")}
                                onBlur={() =>
                                    form.setFieldValue(
                                        "email",
                                        normalizeEmail(form.values.email)
                                    )
                                }
                            />
                        </Grid.Col>

                        <Grid.Col span={6} >
                            <TextInput
                                label="Teléfono"
                                placeholder="10 dígitos"
                                radius="md"
                                maxLength={10}
                                {...form.getInputProps("num_tel")}

                                onKeyDown={(e) => {
                                    const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
                                    if (!/^\d$/.test(e.key) && !allowed.includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        </Grid.Col>

                        <Grid.Col span={6} >
                            <DateInput
                                label="Fecha de nacimiento"
                                placeholder="Seleccionar fecha"
                                radius="md"
                                {...form.getInputProps("fecha_nac")}
                            />
                        </Grid.Col>

                        <Grid.Col span={6} >
                            <PasswordInput
                                label="Contraseña (password)"
                                placeholder="****"
                                radius="md"
                                visible={passwordVisible}
                                onVisibilityChange={setPasswordVisible}
                                {...form.getInputProps("password")}
                            />
                        </Grid.Col>

                        <Grid.Col span={6} >
                            <Select
                                label="Rol"
                                placeholder="Seleccionar rol"
                                radius="md"
                                data={[
                                    { value: "0", label: "" },
                                    { value: "1", label: "Administrador" },
                                    { value: "2", label: "Titular" },
                                    { value: "3", label: "Analista" },
                                ]}
                                {...form.getInputProps("rol_id")}
                            />
                        </Grid.Col>
                    </Grid>

                    <Divider my="md" />

                    <Group justify="space-between">

                        <Button
                            color="orange"
                            onClick={() => navigate("/dashboard/usersTable")}
                            variant="transparent"
                            leftSection={<IconX />}
                        >
                            Cancelar
                        </Button>

                        <Button
                            onClick={() => handleRandom("demo")}
                            variant="transparent"
                            leftSection={<IconWand />}
                        >
                            Generar
                        </Button>

                        <Button
                            variant="transparent"
                            onClick={handleClear}
                            leftSection={<IconEraser />}
                        >
                            Limpiar
                        </Button>
                        
                        <Button
                            type="submit"
                            color="green"
                            variant="transparent"
                            leftSection={<IconDeviceFloppy />}
                            loading={isSubmitting}
                        >
                            Registrar
                        </Button>
                    </Group>
                </form>

            </Card>
        </Box>
    );
}


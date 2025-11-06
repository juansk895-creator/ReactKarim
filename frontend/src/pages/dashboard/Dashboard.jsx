import React, { useContext, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
//mantine
import { ActionIcon, AppShell, Box, Button, Collapse, Group, Modal, Portal, Text, Tooltip,
  Transition, useMantineTheme } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';  // Revisar si es necesario al final
//Íconos
import { IconLayoutSidebarRightCollapse, IconLayoutSidebarLeftCollapse,
  IconUserCircle, IconUsers, IconFileText, IconChartBar, IconHistory,
  IconChevronRight, IconChartPie, IconLogout2, IconXboxX } from "@tabler/icons-react";
//Archivos
import ProfileView from "../profile/ProfileView";
import { AuthContext } from "../../AuthContext";
import ModalLogoutConfirm from "../../components/ModalLogoutConfirm";
import UsersTable from "../users/UsersTable";
import UsersRegister from "../users/UsersRegister";

// Componente reutilizable para las opciones de la barra lateral
export function SidebarItem({
  icon: Icon, label, collapsed, active, onClick,
  hasSubmenu = false, expanded = false, disableHover = false, })
  {
    const theme = useMantineTheme();
    const [hovered, setHovered] = useState(false);
    const baseColor = theme.colorSchema === "dark" ? theme.colors.gray[0] : theme.colors.gray[9];
    const hoverColor = theme.colorSchema === "dark" ? theme.colors.gray[1] : theme.colors.gray[8];
    const activeColor = theme.colorSchema === "dark" ? theme.colors.gray[2] : theme.colors.gray[7];
    return (
      <ActionIcon
        variant="subtle"
        color="gray"
        size="xl"
        radius="md"
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: collapsed ? 48 : "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center", // "center" : "center" ?
          transition: "all 0.5s ease",
          position: "relative", // "absolute" ?
          backgroundColor: active ? activeColor : hovered ? hoverColor : baseColor,
          cursor: "pointer",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            position: "center",
            left: hasSubmenu ? "-0.4rem" : 0, // realmente compensa ?
          }}
        >
          <Icon stroke={2} size="1.3rem" />
          {!collapsed && <span style={{ fontWeight: 500 }}>{label}</span>}
        </div>
        {!collapsed && hasSubmenu && (
          <IconChevronRight size="1.1rem" stroke={2}
            style={{
              position: "absolute",
              right: "0.8rem",
              top: "30%",
              transition: "transform 0.5s ease",
              transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
            }}
          />
        )}
      </ActionIcon>
    );
  }


// Componente base del Dashboard
export default function Dashboard() {

  // Revisar const innecesarias
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const ToggleIcon = collapsed ? IconLayoutSidebarRightCollapse : IconLayoutSidebarLeftCollapse;

  const { logout } = useContext(AuthContext);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const handleConfirmLogout = () => {
    logout();
    setLogoutOpen(false);
    navigate('/login');
  };

  return (
    <AppShell>
      {/* header*/}
      <AppShell.Section
        component="header"
        style={{
          //backgroundColor: "darkblue",
          height: 69,
          display: "flex",
          alignItems: "center",
          //justifyContent: "center",
          justifyContent: "space-between",
          padding: "0 1rem", //Revisar ajuste
          backgroundColor: theme.colors.dark[7], //Revisar tono
        }}
      >
        <Text fw={500} >
          GESTIÓN DE USUARIOS
        </Text>

        {/* Cerrar <ModalLogoutConfirm /> sesión */}
        <Tooltip
          label="Cerrar sesión"
          //position="bottom-end"
          withinPortal={false}
          style={{ display: "inline-flex" }}
        >
          <ActionIcon
            variant="subtle"
            //size="lg"
            
            onClick={() => setLogoutOpen(true)}
            style={{
              backgroundColor: theme.colors.gray[9],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              const icon = e.currentTarget.querySelector("svg");
              if (icon) icon.style.color = theme.colors.red[9];
            }}
            onMouseLeave={(e) => {
              const icon = e.currentTarget.querySelector("svg");
              if (icon) icon.style.color = theme.colors.red[1];
            }}
          >
            <IconLogout2 stroke={2} />
          </ActionIcon>
        </Tooltip>

      </AppShell.Section>        
          
      {/* navbar & main */}
      <Box
        style={{
          display: "flex",
          flex: 1,
          minHeight: "calc(100vh - 110px)",
        }}
      >
        {/* navbar */}
        <AppShell.Section
          component="nav"
          style={{
            //backgroundColor: "darkred", //Revisar qué área se reserva para cada sección
            width: collapsed ? 64 : 200,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            padding: "1rem 0.5rem",
            gap: "1rem",
          }}
        >
          <Group
            //justify="center"
            mb="md"
            style={{
              //flexShrink: 0,
              //width: "100%",
              //position: "sticky",
              //top: 0,
              //zIndex: 2,
              display: "flex",
              justifyContent: "center", //collapsed ? "flex-end" : "flex-start",
              //padding: "0 0.5rem",
              width: 48,
            }}
          >
            <SidebarItem
              icon={ToggleIcon}
              label={undefined}
              collapsed={collapsed}
              active={false}
              hasSubmenu={false}
              expanded={false}
              disableHover
              onClick={() => setCollapsed((prev) => !prev)}
              style={{
                width: 48,
              }}
            />
          </Group>

          <Group
            //direction="column"
            //gap="sm"
            justify="center"
            style={{
              gap: "1rem",
              
            }}
          >
            <SidebarItem
              icon={IconUserCircle}
              label="Perfil"
              collapsed={collapsed}
              active={activeItem === "perfil"}
              onClick={() => {
                setActiveItem("perfil");
                setShowStats((prev) => false);
              }}
            />

            <SidebarItem
              icon={IconUsers}
              label="Usuarios"
              collapsed={collapsed}
              active={activeItem === "usuarios"}
              onClick={() => {
                setActiveItem("usuarios");
                setShowStats((prev) => false);
              }}
            />

            <SidebarItem
              icon={IconChartBar}
              label="Estadísticas"
              collapsed={collapsed}
              active={activeItem === "estadísticas"}
              hasSubmenu
              expanded={showStats}
              onClick={() => {
                setActiveItem("estadísticas");
                setShowStats((prev) => !prev);
              }}
            />
            {/* submenú */}
            {showStats && !collapsed && (
              <Transition
                mounted={showStats && !collapsed}
                transition="slide-down"
                duration={4000}
                timingFunction="ease"
              >
                {(styles) => (
                  <div style={styles}>
                
                <Group
                  direction="column"
                  gap="sm"
                  pl={collapsed ? 0: "2rem"}
                >
                  <SidebarItem
                    icon={IconChartPie}
                    label="Gráficas"
                    collapsed={collapsed}
                    active={activeItem === "graficas"}
                    onClick={() => setActiveItem("graficas")}
                  />

                  <SidebarItem
                    icon={IconFileText}
                    label="Reportes"
                    collapsed={collapsed}
                    active={activeItem === "reportes"}
                    onClick={() => setActiveItem("reportes")}
                  />
                </Group>
                </div>
                )}
              </Transition>
            )}

            <SidebarItem
              icon={IconHistory}
              label="Historial"
              collapsed={collapsed}
              active={activeItem === "historial"}
              onClick={() => {
                setActiveItem("historial");
                setShowStats((prev) => false);
              }}
            />
          </Group>

        </AppShell.Section>
        {/* main */}
        <AppShell.Section
          component="main"
          style={{
            //backgroundColor: "darkgreen",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column", //cambiar ubicación dentro del main
          }}
        >
          <ModalLogoutConfirm
            opened={logoutOpen}
            onClose={() => setLogoutOpen(false)}
            onConfirm={handleConfirmLogout}
          />
          <Outlet />
          
          
        </AppShell.Section>
      </Box>
      {/* footer */}
      <AppShell.Section
        component="footer"
        style={{
          //backgroundColor: "darkorange",
          height: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Text fw={700} c="white">
          FOOTER
        </Text>
      </AppShell.Section>
      
    </AppShell>    
  );
}


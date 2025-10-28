//Imports
import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"; //Navegación
import { AppShell, Burger, NavLink, ActionIcon, Tooltip, Group, Text, useMantineTheme, Button } from "@mantine/core";
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand, 
  IconUsers, IconUserCircle, IconChartHistogram, IconReport,
  IconChartPie, IconFiles, IconChevronRight } from "@tabler/icons-react";

//Navegación
import ProfileView from "../profile/ProfileView";
//
import { useDisclosure } from "@mantine/hooks";
//

export default function Dashboard() {
  const theme = useMantineTheme();
  //
  const [opened, { toggle }] = useDisclosure();
  //

  return (
    <AppShell
      padding="md"
    >
    </AppShell>
  );
}

/*
import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"; //Navegación
import { AppShell, NavLink, ActionIcon, Tooltip, Group, Text, useMantineTheme, Button } from "@mantine/core";
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand, 
  IconUsers, IconUserCircle, IconChartHistogram, IconReport,
  IconChartPie, IconFiles, IconChevronRight } from "@tabler/icons-react";

//Navegación
import ProfileView from "../profile/ProfileView";

// Versión 2.0 - Creando componente
function SidebarItem({
  //icon: Icon, label, collapsed, active, onClick, hasSubmenu = false, expanded = false }) {
  icon: Icon, label, collapsed, path, hasSubmenu = false, expanded = false }) {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [hovered, setHovered] = useState(false);

  const baseColor = theme.colorSchema === "dark" ?
    theme.colors.gray[0] : theme.colors.gray[9];
  const hoverColor = theme.colorSchema === "dark" ?
    theme.colors.gray[1] : theme.colors.gray[8];
  const activeColor = theme.colorSchema === "dark" ?
    theme.colors.gray[2] : theme.colors.gray[7];

  const isActive = location.pathname === path;

  const handleClick = () => {
    if (hasSubmenu) return; //Completar más adelante
    navigate(path);
  };

  return (
    <ActionIcon
      variant="subtle"
      color="gray"
      size="xl"
      radius="md"
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: collapsed ? 48 : "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center", // "center" : "center" ?
        transition: "all 0.2s ease",
        position: "relative", // "absolute" ?
        backgroundColor: isActive ? activeColor : hovered ? hoverColor : baseColor,
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
        <IconChevronRight
          size="1.1rem"
          stroke={2}
          style={{
            position: "absolute",
            right: "0.8rem",
            top: "25%",
            transition: "transform 0.2a ease",
            transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
          }}
        />
      )}
    </ActionIcon>
  );
}
//

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [showStats, setShowStats] = useState(false);
  // Versión 2.0
  const [activeSection, setActiveSection] = useState("perfil");
  //
  const theme = useMantineTheme();
  // Navegación
  const navigate = useNavigate();
  

  const toggleCollapse = () => setCollapsed((prev) => !prev);
  const ToggleIcon = collapsed ? IconLayoutSidebarLeftExpand : IconLayoutSidebarLeftCollapse;

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: collapsed ? 80 : 240, breakpoint: 'sm' }}
      footer={{ height: 40 }}
      padding="md"
      layout="alt"
    >

      <AppShell.Header p="sm">
        <Group justify="space-between">
          <Text fw={700}>Panel Header</Text>
          <Button variant="subtle" size="xs">Cerrar sesión</Button>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar
        p="sm"
        bg={theme.colors.gray[9]}
        style={{
          width: collapsed ? 80 : 240,
          height: "100vh",
          transition: "width 0.2s ease",
          overflow: "hidden"
          //position: "absolute",
        }}
      >

        <Group
          justify="center"
          mb="md"
          style={{
            flexShrink: 0,
            width: 48,
            position: "sticky",
            top: 0,
            zIndex: 2,
          }}
        >
          
          <SidebarItem
            icon={ToggleIcon}
            label={undefined} // {collapsed ? undefined : "menu"}
            collapsed={collapsed}
            active={false}
            hasSubmenu={false}
            expanded={false}
            onClick={() => setCollapsed(prev => ! prev)}
            
          />
        </Group>

        <Group justify="center">
          
          <SidebarItem
            icon={IconUserCircle}
            label="Perfil"
            collapsed={collapsed}
            path="/dashboard/perfil" // Ruta interna
          />
          
          
          <SidebarItem
            icon={IconUsers}
            label="Usuarios"
            collapsed={collapsed}
            active={activeSection === "usuarios"}
            onClick={() => setActiveSection("usuarios")}
          />
          
          
          <>
            <SidebarItem
              icon={IconChartHistogram}
              label="Estadísticas"
              collapsed={collapsed}
              active={showStats && activeSection === "estadísticas"}
              hasSubmenu
              expanded={showStats}
              onClick={() => {setShowStats((prev) => !prev);
                setActiveSection("estadísticas");
              }}
            />
            {!collapsed && showStats && (
              <div
                style={{
                  borderLeft: `2px solid ${theme.colors.gray[4]}`,
                  marginLeft: "1.5rem",
                  paddingLeft: "0.8rem",
                  marginTop: "0.4rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                <SidebarItem
                  icon={IconChartPie}
                  label="Gráficas"
                  collapsed={collapsed}
                  active={activeSection === "graficas"}
                  onClick={() => setActiveSection("graficas")}
                />

                <SidebarItem
                  icon={IconFiles}
                  label="Reportes"
                  collapsed={collapsed}
                  active={activeSection === "reportes"}
                  onClick={() => setActiveSection("reportes")}
                />
              </div>
            )}
          </>

          
          <SidebarItem
            icon={IconReport}
            label="Historial"
            collapsed={collapsed}
            active={activeSection === "historial"}
            onClick={() => setActiveSection("historial")}
          />

        </Group>
      </AppShell.Navbar>

      <AppShell.Main p="md">
        <Routes>
          <Route path="perfil" element={<ProfileView />} />

        </Routes>
      </AppShell.Main>

      <AppShell.Footer p="sm">
        <Text size="xs" ta="center" c="dimmed">Sistema para gestión de usuario</Text>
      </AppShell.Footer>

    </AppShell>
  );
}
*/

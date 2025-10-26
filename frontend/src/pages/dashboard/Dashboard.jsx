import React, { useState } from "react";
import { AppShell, NavLink, ActionIcon, Tooltip, Group, useMantineTheme } from "@mantine/core";
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand, 
  IconUsers, IconUserCircle, IconChartHistogram, IconReport,
  IconChartPie, IconFiles, IconChevronRight } from "@tabler/icons-react";



export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const theme = useMantineTheme();

  const toggleCollapse = () => setCollapsed((prev) => !prev);

  return (
    <AppShell>
      <AppShell.Navbar
        p="sm"
        bg={theme.colors.gray[0]}
        style={{
          width: collapsed ? 80 : 240,
          height: "100vh",
          transition: "width 0.2s ease",
          overflow: "hidden",
        }}
      >

        <Group justify="center" mb="md">
          <ActionIcon
            variant="light"
            color="gray"
            onClick={toggleCollapse}
            size="lg"
            aria-label="Toggle sidebar"
          >
            {collapsed ? (
              <IconLayoutSidebarLeftExpand size="1.2rem" />
            ) : (
              <IconLayoutSidebarLeftCollapse size="1.2rem" />
            )}
          </ActionIcon>
        </Group>

        <Group justify="center">
          {/* Perfil */}
          <ActionIcon
            variant="subtle"
            color="gray"
            size="xl"
            radius="md"
            onClick={() => console.log("Sección Perfil")}
            style={{
              width: collapsed ? 48 : "100%",
              justifyContent: collapsed ? "center" : "flex-start",
              transition: "all 0.2ease",
              // Resaltar al dar clic
            }}
          >
            <IconUserCircle stroke={2} size="1.3rem" />
            {!collapsed && (
              <span style={{ marginLeft: "10px", fontWeight: 500 }}>Perfil</span>
            )}
          </ActionIcon>
          {/* Usuarios */}
          <ActionIcon
            variant="subtle"
            color="gray"
            size="xl"
            radius="md"
            onClick={() => console.log("Sección Usuarios seleccionada")}
            style={{
              width: collapsed ? 48 : "100%",
              justifyContent: collapsed ? "center" : "flex-start",
              transition: "all 0.2ease",
            }}
          >
            <IconUsers stroke={2} size="1.3rem" />
            {!collapsed && (
              <span style={{ marginLeft: "10px", fontWeight: 500 }}>Usuarios</span>
            )}
          </ActionIcon>
          {/* ESTADÍSTICAS: Gráficas y reportes */}
          <div>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="xl"
              radius="md"
              onClick={() => setShowStats((prev) => !prev)}
              style={{
                width: collapsed ? 48 : "100%",
                //justifyContent: collapsed ? "center" : "flex-start",
                justifyContent: collapsed ? "center" : "center",
                transition: "all 0.2ease",
                //Revisar display & alignItems
                display: "flex",
                alignItems: "center",
                position: "relative",
              }}
            >
              <IconChartHistogram stroke={2} size="1.3rem" />
              {!collapsed && (
                <>
                  <span style={{ marginLeft: "10px", fontWeight: 500 }}>Estadísticas</span>
                  <IconChevronRight
                    size="1.1rem"
                    stroke={2}
                    style={{
                      //marginLeft: "auto",
                      position: "absolute",
                      
                      right: "0.8rem",
                      
                      //marginRight: "0.4rem", //Borrar ?
                      transition: "transform 0.2s ease",
                      transform: showStats ? "rotate(90deg)" : "rotate(0deg)",
                    }}
                  />
                </>
              )}
            </ActionIcon>
            {!collapsed && showStats && (
              <div
                style={{
                  //marginLeft: "2.3rem", marginTop: "0.3rem"
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center", //Centrando subopciones
                  marginTop: "0.4rem",
                  gap: "0.25rem",
                }}
              >
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="lg"
                  radius="sm"
                  onClick={() => console.log("Gráficas")}
                  style={{
                    //width: "100%",
                    width: "85%",
                    justifyContent: "flex-start",
                    transition: "all 0.2s ease",
                  }}
                >
                  <IconChartPie stroke={2} size="1.1rem"/>
                  <span style={{ marginLeft: "10px", fontWeight: 400 }}>Gráficas</span>
                </ActionIcon>
                
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="lg"
                  radius="sm"
                  onClick={() => console.log("Reportes")}
                  style={{
                    //width: "100%",
                    width: "85%",
                    justifyContent: "flex-start",
                    marginTop: "0.25rem",
                    transition: "all 0.2s ease",
                  }}
                >
                  <IconFiles stroke={2} size="1.1rem"/>
                  <span style={{ marginLeft: "10px", fontWeight: 400 }}>Reportes</span>
                </ActionIcon>
              </div>
            )}
          </div>
          {/* Historial */}
          <ActionIcon
            variant="subtle"
            color="gray"
            size="xl"
            radius="md"
            onClick={() => console.log("Sección del historial")}
            style={{
              width: collapsed ? 48 : "100%",
              justifyContent: collapsed ? "center" : "flex-start",
              transition: "all 0.2ease",
            }}
          >
            <IconReport stroke={2} size="1.3rem" />
            {!collapsed && (
              <span style={{ marginLeft: "10px", fontWeight: 500 }}>Historial</span>
            )}
          </ActionIcon>
        </Group>
      </AppShell.Navbar>
    </AppShell>
  );
}

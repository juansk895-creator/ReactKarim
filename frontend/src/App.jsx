
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './AuthContext.jsx';
import { MantineProvider } from '@mantine/core';

//Rutas definidas y testeadas
import Login from "./pages/login";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
//rutas por testear

const PrivateRoute = ({ children }) => {
    const { token } = useContext(AuthContext);
    return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
    return (
        <MantineProvider defaultColorScheme="light">
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* Ruta pública */}
                        <Route path="/login" element={<Login />} />

                        {/* Ruta privada */}
                        <Route
                            path="/dashboard/*"
                            element={
                                //<PrivateRoute>
                                    <Dashboard />
                                //</PrivateRoute>
                            }
                        />
                    </Routes>
                </Router>
            </AuthProvider>
        </MantineProvider>
    );
}

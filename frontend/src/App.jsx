
import React from "react";
//import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-dom';
//import { useAuth } from './context/AuthContext';
//import { useAuth } from './AuthContext.jsx'; // Error en el nombre de la importación, 'useAuth' no existe
import { AuthContext } from './AuthContext.jsx';

//Comprobar
import Login from "./pages/login";

//Componentes base, revisar
const LoginPage = () => {
    const { login } = AuthContext();

    const handleLogin = () => {
        //login temporal, revisar futura llamada al backend
        login({ token: 'fake-jwt-token', user: { nombre:'Juan' } });
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h2>Login</h2>
            <button onClick={handleLogin}>Iniciar sesión</button>
        </div>
    );
};

const DashboardPage = () => {
    const { user, logout } = AuthContext();

    return (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h2>Bienvenido, {user?.nombre}</h2>
            <button onClick={logout}>Cerrar sesión</button>
        </div>
    );
};

const PrivateRoute = ({ children }) => {
    const { token } = AuthContext();
    return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
    return (
        <Router>
            <Routes>
                {/* Ruta pública */}
                <Route path="/login" element={<Login />} />

                {/* Ruta privada */}
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <DashboardPage />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}












import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
//import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-dom';
//import { useAuth } from './context/AuthContext';
//import { useAuth } from './AuthContext.jsx'; // Error en el nombre de la importación, 'useAuth' no existe
import { AuthContext, AuthProvider } from './AuthContext.jsx';

//Rutas definidas y testeadas
import Login from "./pages/login";
//rutas por testear
import Dashboard from "./pages/dashboard/Dashboard.jsx";

//Componentes base, revisar, ya no es necesario, borrar
/*
const LoginPage = () => {
    const { login } = useContext(AuthContext);

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
*/
//const DashboardPage innecesario, borrar
/*
const DashboardPage = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h2>Bienvenido, {user?.nombre}</h2>
            <button onClick={logout}>Cerrar sesión</button>
        </div>
    );
};*/

const PrivateRoute = ({ children }) => {
    const { token } = useContext(AuthContext);
    return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Ruta pública */}
                    <Route path="/login" element={<Login />} />

                    {/* Ruta privada */}
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

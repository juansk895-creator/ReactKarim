
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './AuthContext.jsx';
import { MantineProvider } from '@mantine/core';

//Rutas definidas y testeadas
import Login from "./pages/login";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import UsersTable from "./pages/users/UsersTable.jsx";
import UsersRegister from "./pages/users/UsersRegister.jsx";
import UsersEdit from "./pages/users/UsersEdit.jsx";
//rutas por testear
import ProfileView from "./pages/profile/ProfileView.jsx";
import ProfileEdit from "./pages/profile/ProfileEdit.jsx";
import Graphics from "./pages/stats/Graphics.jsx";

const PrivateRoute = ({ children }) => {
    const { token } = useContext(AuthContext);
    return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
    return (
        <MantineProvider defaultColorScheme="dark">
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* Ruta pública */}
                        <Route path="/login" element={<Login />} />

                        {/* Rutas privada */}
                        <Route path="/dashboard/*" element={ <Dashboard />}>
                            {/* Rutas hija */}
                            <Route path="profile" element={<ProfileView />} />
                            <Route path="profileEdit" element={<ProfileEdit />} />
                            <Route path="usersTable" element={<UsersTable />} />
                            <Route path="usersRegister" element={<UsersRegister />} />
                            <Route path="usersEdit/:id" element={<UsersEdit />} />
                            <Route path="stats/graphics" element={<Graphics />} />
                        </Route>
                    </Routes>
                </Router>
            </AuthProvider>
        </MantineProvider>
    );
}

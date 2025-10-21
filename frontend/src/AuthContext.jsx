import { createContext, useState, useEffect, useCallback } from "react";

//Contexto global
export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    //Cargar sesión desde localStorage para permitir que la sesión se mantenga después de refrescar el navegador

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }

        setLoading(false);
    }, []);

    //Inicio de sesión con los datos del backend, guardado del token y datos de usuario en localStorage
    const login = useCallback((data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setToken(data.token);
    }, []);

    //Cierre de sesión, limpieza de datos
    const logout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
    }, []);

    //Se devuelve el token actual (para fetch/axios)
    const getToken = useCallback(() => token, [token]);
    //el backend debe responder con: { token, user: { id, nombre, email, rol } }
    const value = {
        user,
        token,
        login,
        logout,
        getToken,
        loading,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {/*Evitamos parpadeos mientras se carga la sesión desde localStorage */}
            {!loading && children}
        </AuthContext.Provider>
    )
}






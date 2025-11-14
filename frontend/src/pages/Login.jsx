import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
//import { useNavigate } from 'react-dom';
//import { useAuth } from '../AuthContext'; // Error en el nombre de la importación, 'useAuth' no existe
import { AuthContext } from '../AuthContext';
//import e, { response } from "express"; //express no se usa en frontend

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Credenciales incorrectas ó error de servidor');
            }

            const data = await response.json();

            //el backend debe responder con: { token, user: { id, nombre, email, rol_id } }
            login({ token: data.token, user: data.user });
            //token
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user)); 
            navigate('/dashboard');
        } catch (err) { //err ó error ?
            setError(err.message || 'Error al iniciar sesión');
        }
    };

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'
        }}>
            <form
                onSubmit={handleSubmit}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '320px',
                    gap: '1rem',
                    padding: '2rem',
                    border: '1px solid #ccc',
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
                }}
            >
                <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Iniciar sesión</h2>

                <input 
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                <button
                    type="submit"
                    style={{
                        padding: '0.6rem',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}
                >
                    Ingresar
                </button>
            </form>
        </div>
    );
}

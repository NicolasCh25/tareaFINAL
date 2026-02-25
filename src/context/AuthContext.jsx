import { createContext, useState, useEffect, useContext } from 'react';
import api from '../config/api'; // Importamos la instancia de Axios configurada

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. Al cargar la app, revisamos si hay sesión guardada
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // 2. FUNCIÓN LOGIN REAL (Conectada al Backend)
    const login = async (email, password) => {
        try {
            // Hacemos la petición POST a http://localhost:3000/api/auth/login
            const { data } = await api.post('/auth/login', { email, password });
            
            // Si el backend responde bien, guardamos los datos
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Actualizamos el estado global
            setUser(data.user);
            
            return { success: true };
        } catch (error) {
            console.error("Error en login:", error);
            // Devolvemos el mensaje de error del backend o uno genérico
            return { 
                success: false, 
                message: error.response?.data?.message || 'Credenciales incorrectas o error de servidor.' 
            };
        }
    };

    // 3. FUNCIÓN LOGOUT
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
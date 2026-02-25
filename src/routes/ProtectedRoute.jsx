import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    // 1. Mientras verifica el token, mostramos algo simple (o nada)
    if (loading) return <div>Cargando...</div>;

    // 2. Si NO hay usuario, lo mandamos al Login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. Si SÍ hay usuario, dejamos pasar a las rutas hijas (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Asegúrate de tener tu Navbar aquí

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* 1. EL MARCO: Aquí va el Navbar fijo */}
            <Navbar />

            {/* 2. EL CONTENIDO VARIABLE: Aquí se cargarán las páginas hijas */}
            <main className="container mx-auto p-4">
                <Outlet /> 
            </main>
        </div>
    );
};

export default MainLayout;
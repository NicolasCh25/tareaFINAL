import { useEffect, useState } from 'react';
import api from '../config/api';
import Table from '../components/Table';
import ModalForm from '../components/ModalForm'; // <--- Importamos el Modal

const MODULE_CONFIG = {
    endpoint: '/estudiantes',
    title: 'Gestión de Estudiantes',
    // Columnas para la TABLA
    columns: [
        { header: 'Nombre', accessor: 'nombre' },
        { header: 'Apellido', accessor: 'apellido' },
        { header: 'Cédula', accessor: 'cedula' },
        { header: 'Email', accessor: 'email' }
    ],
    // Campos para el FORMULARIO (Modal)
    formFields: [
        { name: 'nombre', label: 'Nombre', required: true },
        { name: 'apellido', label: 'Apellido', required: true },
        { name: 'cedula', label: 'Cédula', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true }
    ]
};

const Estudiantes = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estados para el Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEditItem, setCurrentEditItem] = useState(null); // Si es null = CREAR, Si tiene datos = EDITAR

    useEffect(() => {
        fetchData();
    }, []);

    // --- LEER (GET) ---
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await api.get(MODULE_CONFIG.endpoint);
            setData(response.data);
        } catch (error) {
            console.error("Error:", error);
            // alert("Error de conexión"); // Descomentar si quieres ver alertas
        } finally {
            setLoading(false);
        }
    };

    // --- ABRIR MODAL (Para Crear o Editar) ---
    const handleOpenModal = (item = null) => {
        setCurrentEditItem(item); // Si item es null, el modal sabe que es "Nuevo"
        setIsModalOpen(true);
    };

    // --- GUARDAR (POST o PUT) ---
    const handleModalSubmit = async (formData) => {
        try {
            if (currentEditItem) {
                // EDITAR (PUT)
                await api.put(`${MODULE_CONFIG.endpoint}/${currentEditItem.id}`, formData);
                alert("Registro actualizado correctamente");
            } else {
                // CREAR (POST)
                await api.post(MODULE_CONFIG.endpoint, formData);
                alert("Nuevo registro creado");
            }
            setIsModalOpen(false); // Cerrar modal
            fetchData(); // Recargar tabla
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Error al guardar los datos.");
        }
    };

    // --- ELIMINAR (DELETE) ---
    const handleDelete = async (id) => {
        if (!confirm("¿Estás seguro de eliminar este registro?")) return;
        try {
            await api.delete(`${MODULE_CONFIG.endpoint}/${id}`);
            fetchData();
        } catch (error) {
            alert("Error al eliminar");
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{MODULE_CONFIG.title}</h1>
                <button 
                    onClick={() => handleOpenModal(null)} // null significa "Crear Nuevo"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow">
                    + Nuevo Estudiante
                </button>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
                {loading ? <p>Cargando...</p> : (
                    <Table 
                        columns={MODULE_CONFIG.columns} 
                        data={data} 
                        onDelete={handleDelete}
                        onEdit={(item) => handleOpenModal(item)} // Pasamos el item para editar
                    />
                )}
            </div>

            {/* Renderizamos el Modal */}
            <ModalForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                title={currentEditItem ? "Editar Estudiante" : "Nuevo Estudiante"}
                fields={MODULE_CONFIG.formFields}
                initialData={currentEditItem}
            />
        </div>
    );
};

export default Estudiantes;
import { useEffect, useState } from 'react';
import api from '../config/api';
import Table from '../components/Table';
import ModalForm from '../components/ModalForm';

// --- CONFIGURACIÓN ESPECÍFICA PARA MATRÍCULAS ---
const MODULE_CONFIG = {
    endpoint: '/matriculas', 
    title: 'Gestión de Matrículas',
    columns: [
        { header: 'ID Estudiante', accessor: 'estudiante_id' },
        { header: 'ID Materia', accessor: 'materia_id' },
        { header: 'Fecha', accessor: 'fecha' }
    ],
    formFields: [
        { name: 'estudiante_id', label: 'ID del Estudiante', type: 'number', required: true },
        { name: 'materia_id', label: 'ID de la Materia', type: 'number', required: true },
        { name: 'fecha', label: 'Fecha de Matrícula', type: 'date', required: true }
    ]
};

const Matriculas = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEditItem, setCurrentEditItem] = useState(null);

    // 1. Cargar datos al entrar
    useEffect(() => {
        fetchData();
    }, []);

    // 2. Función para leer datos (GET)
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await api.get(MODULE_CONFIG.endpoint);
            setData(response.data);
        } catch (error) {
            console.error("Error cargando matrículas:", error);
            // alert("No se pudo conectar con el servidor."); // Descomentar si deseas ver la alerta
        } finally {
            setLoading(false);
        }
    };

    // 3. Función para Guardar (Crear o Editar)
    const handleModalSubmit = async (formData) => {
        try {
            if (currentEditItem) {
                // EDITAR (PUT)
                await api.put(`${MODULE_CONFIG.endpoint}/${currentEditItem.id}`, formData);
                alert("Matrícula actualizada correctamente");
            } else {
                // CREAR (POST)
                await api.post(MODULE_CONFIG.endpoint, formData);
                alert("Matrícula creada correctamente");
            }
            setIsModalOpen(false);
            fetchData(); // Recargar la tabla
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Error al guardar la matrícula.");
        }
    };

    // 4. Función para Eliminar (DELETE)
    const handleDelete = async (id) => {
        if (!confirm("¿Estás seguro de eliminar esta matrícula?")) return;
        try {
            await api.delete(`${MODULE_CONFIG.endpoint}/${id}`);
            fetchData();
        } catch (error) {
            console.error("Error al eliminar:", error);
            alert("Error al eliminar el registro.");
        }
    };

    // 5. Abrir el Modal
    const handleOpenModal = (item = null) => {
        setCurrentEditItem(item);
        setIsModalOpen(true);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{MODULE_CONFIG.title}</h1>
                <button 
                    onClick={() => handleOpenModal(null)} 
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded shadow transition">
                    + Nueva Matrícula
                </button>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                {loading ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500">Cargando datos...</p>
                    </div>
                ) : (
                    <Table 
                        columns={MODULE_CONFIG.columns} 
                        data={data} 
                        onDelete={handleDelete}
                        onEdit={handleOpenModal}
                    />
                )}
            </div>

            <ModalForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                title={currentEditItem ? "Editar Matrícula" : "Nueva Matrícula"}
                fields={MODULE_CONFIG.formFields}
                initialData={currentEditItem}
            />
        </div>
    );
};

export default Matriculas;
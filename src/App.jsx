import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layout/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Estudiantes from './pages/Estudiantes';
import Materias from './pages/Materias';
import Matriculas from './pages/Matriculas';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 1. RUTA PÚBLICA */}
          <Route path="/login" element={<LoginPage />} />
        

          {/* 2. PROTECCIÓN DE RUTAS */}
          <Route element={<ProtectedRoute />}>
              
              {/* 3. DISEÑO PRINCIPAL (LAYOUT) */}
              <Route element={<MainLayout />}>
                  {/* Si el usuario entra aquí, MainLayout pone el Navbar */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/estudiantes" element={<Estudiantes />} />
                  <Route path="/materias" element={<Materias />} />
                  <Route path="/matriculas" element={<Matriculas />} />
              </Route>

          </Route>
          
          {/* 4. REDIRECCIÓN */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
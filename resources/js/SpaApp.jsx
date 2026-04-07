import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ConfirmPassword from './Pages/Auth/ConfirmPassword';
import ForgotPassword from './Pages/Auth/ForgotPassword';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import ResetPassword from './Pages/Auth/ResetPassword';
import VerifyEmail from './Pages/Auth/VerifyEmail';
import Dashboard from './Pages/Dashboard';
import EmpresasIndex from './Pages/Empresas/Index';
import EmpresasCreate from './Pages/Empresas/Create';
import EmpresasShow from './Pages/Empresas/Show';
import EmpresasVinculos from './Pages/Empresas/Vinculos';
import ServicosIndex from './Pages/Servicos/Index';
import ServicosCreate from './Pages/Servicos/Create';
import LancamentoHorasCreate from './Pages/LancamentoHoras/Create';
import ImpedimentosIndex from './Pages/Impedimentos/Index';
import ImpedimentosCreate from './Pages/Impedimentos/Create';
import UsuariosIndex from './Pages/Usuarios/Index';
import UsuariosCreate from './Pages/Usuarios/Create';
import RotacaoIndex from './Pages/Rotacao/Index';
import RelatoriosIndex from './Pages/Relatorios/Index';
import AjudaIndex from './Pages/Ajuda/Index';
import ProfileEdit from './Pages/Profile/Edit';

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
                Carregando…
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function GuestRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
                Carregando…
            </div>
        );
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    return children;
}

function P({ children }) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
            <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
            <Route path="/reset-password/:token" element={<GuestRoute><ResetPassword /></GuestRoute>} />
            <Route path="/verify-email" element={<P><VerifyEmail /></P>} />
            <Route path="/confirm-password" element={<P><ConfirmPassword /></P>} />
            <Route path="/" element={<P><Dashboard /></P>} />
            <Route path="/empresas" element={<P><EmpresasIndex /></P>} />
            <Route path="/empresas/criar" element={<P><EmpresasCreate /></P>} />
            <Route path="/empresas/:id" element={<P><EmpresasShow /></P>} />
            <Route path="/empresas/:id/vinculos" element={<P><EmpresasVinculos /></P>} />
            <Route path="/servicos" element={<P><ServicosIndex /></P>} />
            <Route path="/servicos/criar" element={<P><ServicosCreate /></P>} />
            <Route path="/lancamento-horas/criar" element={<P><LancamentoHorasCreate /></P>} />
            <Route path="/impedimentos" element={<P><ImpedimentosIndex /></P>} />
            <Route path="/impedimentos/criar" element={<P><ImpedimentosCreate /></P>} />
            <Route path="/usuarios" element={<P><UsuariosIndex /></P>} />
            <Route path="/usuarios/criar" element={<P><UsuariosCreate /></P>} />
            <Route path="/rotacao" element={<P><RotacaoIndex /></P>} />
            <Route path="/relatorios" element={<P><RelatoriosIndex /></P>} />
            <Route path="/ajuda" element={<P><AjudaIndex /></P>} />
            <Route path="/profile" element={<P><ProfileEdit /></P>} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default function SpaApp() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}

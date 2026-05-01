import { useAuth } from '@/contexts/AuthContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function UsuariosIndex() {
    const { visitorMode } = useAuth();
    const [usuarios, setUsuarios] = useState([]);
    const [erroAcesso, setErroAcesso] = useState(false);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        document.title = `Usuários — ${import.meta.env.VITE_APP_NAME ?? 'Rotatix'}`;
        axios
            .get('/api/usuarios')
            .then(({ data }) => {
                setUsuarios(data);
                setCarregando(false);
            })
            .catch(() => {
                setErroAcesso(true);
                setUsuarios([]);
                setCarregando(false);
            });
    }, []);

    async function remover(id) {
        if (!confirm('Remover usuário?')) return;
        await axios.delete(`/api/usuarios/${id}`);
        setUsuarios((prev) => prev.filter((u) => u.id !== id));
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-zinc-100">Usuários</h2>
                    {!visitorMode && !erroAcesso && (
                        <Link
                            to="/usuarios/criar"
                            className="rounded-md bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
                        >
                            Novo Usuário
                        </Link>
                    )}
                </div>
            }
        >
            <div className="py-10">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {(visitorMode || erroAcesso) && (
                        <p className="mb-4 rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-400">
                            {visitorMode
                                ? 'Lista de utilizadores disponível apenas com sessão de administrador.'
                                : 'Não foi possível carregar os utilizadores.'}
                        </p>
                    )}
                    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm">
                        {carregando ? (
                            <p className="py-16 text-center text-zinc-500">Carregando…</p>
                        ) : (
                            <table className="min-w-full border-collapse">
                                <thead className="bg-zinc-800/80">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-zinc-400">Nome</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-zinc-400">E-mail</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-zinc-400">Papel</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase text-zinc-400">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800 bg-zinc-900">
                                    {usuarios.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-10 text-center text-zinc-500">
                                                Nenhum usuário cadastrado.
                                            </td>
                                        </tr>
                                    ) : (
                                        usuarios.map((u) => (
                                            <tr key={u.id}>
                                                <td className="px-6 py-4 font-medium text-zinc-100">{u.name}</td>
                                                <td className="px-6 py-4 text-sm text-zinc-400">{u.email}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                            u.papel === 'admin'
                                                                ? 'bg-emerald-500/10 text-emerald-400'
                                                                : 'bg-zinc-700 text-zinc-400'
                                                        }`}
                                                    >
                                                        {u.papel ?? 'usuário'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm">
                                                    {!visitorMode && !erroAcesso && (
                                                        <button
                                                            type="button"
                                                            onClick={() => remover(u.id)}
                                                            className="text-red-400 hover:text-red-300"
                                                        >
                                                            Remover
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

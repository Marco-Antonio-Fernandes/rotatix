import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function ServicosIndex() {
    const [servicos, setServicos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        document.title = `Serviços — ${import.meta.env.VITE_APP_NAME ?? 'Rotatix'}`;
        axios.get('/api/servicos').then(({ data }) => {
            setServicos(data);
            setCarregando(false);
        });
    }, []);

    async function remover(id) {
        if (!confirm('Remover serviço?')) return;
        await axios.delete(`/api/servicos/${id}`);
        setServicos((prev) => prev.filter((s) => s.id !== id));
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-zinc-100">Serviços</h2>
                    <Link
                        to="/servicos/criar"
                        className="rounded-md bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
                    >
                        Novo Serviço
                    </Link>
                </div>
            }
        >
            <div className="py-10">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm">
                        {carregando ? (
                            <p className="py-16 text-center text-zinc-500">Carregando…</p>
                        ) : (
                            <table className="min-w-full border-collapse">
                                <thead className="bg-zinc-800/80">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-zinc-400">Nome</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-zinc-400">Descrição</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-zinc-400">Empresas</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase text-zinc-400">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800 bg-zinc-900">
                                    {servicos.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-10 text-center text-zinc-500">
                                                Nenhum serviço cadastrado.
                                            </td>
                                        </tr>
                                    ) : (
                                        servicos.map((s) => (
                                            <tr key={s.id}>
                                                <td className="px-6 py-4 font-medium text-zinc-100">{s.nome}</td>
                                                <td className="px-6 py-4 text-sm text-zinc-400">{s.descricao ?? '—'}</td>
                                                <td className="px-6 py-4 text-sm text-zinc-400">
                                                    <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs">
                                                        {s.empresas_count ?? 0}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm">
                                                    <button
                                                        type="button"
                                                        onClick={() => remover(s.id)}
                                                        className="text-red-400 hover:text-red-300"
                                                    >
                                                        Remover
                                                    </button>
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

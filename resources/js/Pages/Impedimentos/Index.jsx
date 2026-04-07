import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function ImpedimentosIndex() {
    const [impedimentos, setImpedimentos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [filtro, setFiltro] = useState('pendente');

    useEffect(() => {
        document.title = `Impedimentos — ${import.meta.env.VITE_APP_NAME ?? 'Rotatix'}`;
        axios.get('/api/impedimentos').then(({ data }) => {
            setImpedimentos(data);
            setCarregando(false);
        });
    }, []);

    async function resolver(id) {
        await axios.patch(`/api/impedimentos/${id}`, { resolvido: true });
        setImpedimentos((prev) =>
            prev.map((i) => (i.id === id ? { ...i, resolvido: true } : i)),
        );
    }

    const lista = impedimentos.filter((i) =>
        filtro === 'todos' ? true : filtro === 'pendente' ? !i.resolvido : i.resolvido,
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-zinc-100">Impedimentos</h2>
                    <Link
                        to="/impedimentos/criar"
                        className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                    >
                        Registrar
                    </Link>
                </div>
            }
        >
            <div className="py-10">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* Filtro */}
                    <div className="mb-4 flex gap-2">
                        {['pendente', 'resolvido', 'todos'].map((f) => (
                            <button
                                key={f}
                                type="button"
                                onClick={() => setFiltro(f)}
                                className={`rounded-full px-3 py-1 text-sm capitalize transition ${
                                    filtro === f
                                        ? 'bg-zinc-700 text-zinc-100'
                                        : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm">
                        {carregando ? (
                            <p className="py-16 text-center text-zinc-500">Carregando…</p>
                        ) : lista.length === 0 ? (
                            <p className="py-16 text-center text-zinc-500">Nenhum impedimento {filtro}.</p>
                        ) : (
                            <div className="divide-y divide-zinc-800">
                                {lista.map((imp) => (
                                    <div key={imp.id} className="flex items-start justify-between px-6 py-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-xs ${
                                                        imp.resolvido
                                                            ? 'bg-zinc-700 text-zinc-400'
                                                            : 'bg-red-500/10 text-red-400'
                                                    }`}
                                                >
                                                    {imp.resolvido ? 'Resolvido' : 'Pendente'}
                                                </span>
                                                <span className="text-xs text-zinc-500">{imp.data}</span>
                                            </div>
                                            <p className="mt-2 text-sm text-zinc-200">{imp.descricao}</p>
                                            {imp.empresa && (
                                                <Link
                                                    to={`/empresas/${imp.empresa.id}`}
                                                    className="mt-1 block text-xs text-zinc-500 hover:text-emerald-400"
                                                >
                                                    {imp.empresa.nome_fantasia || imp.empresa.razao_social}
                                                </Link>
                                            )}
                                        </div>
                                        {!imp.resolvido && (
                                            <button
                                                type="button"
                                                onClick={() => resolver(imp.id)}
                                                className="ml-4 shrink-0 rounded-md border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:border-emerald-500/40 hover:text-emerald-400"
                                            >
                                                Resolver
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

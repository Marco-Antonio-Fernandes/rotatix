import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function ImpedimentosIndex() {
    const [impedimentos, setImpedimentos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        document.title = `Impedimentos — ${import.meta.env.VITE_APP_NAME ?? 'Rotatix'}`;
        axios.get('/api/impedimentos').then(({ data }) => {
            setImpedimentos(data);
            setCarregando(false);
        });
    }, []);

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
                    <p className="mb-4 text-sm text-zinc-500">
                        Histórico informativo e auditoria; situações curtas (outro serviço, etc.) não exigem
                        ação nesta tela.
                    </p>

                    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm">
                        {carregando ? (
                            <p className="py-16 text-center text-zinc-500">Carregando…</p>
                        ) : impedimentos.length === 0 ? (
                            <p className="py-16 text-center text-zinc-500">Nenhum impedimento registrado.</p>
                        ) : (
                            <div className="divide-y divide-zinc-800">
                                {impedimentos.map((imp) => (
                                    <div key={imp.id} className="px-6 py-4">
                                        <span className="text-xs text-zinc-500">{imp.data}</span>
                                        <p className="mt-2 text-sm text-zinc-200">{imp.justificativa}</p>
                                        {imp.empresa && (
                                            <Link
                                                to={`/empresas/${imp.empresa.id}`}
                                                className="mt-1 block text-xs text-zinc-500 hover:text-emerald-400"
                                            >
                                                {imp.empresa.nome_fantasia || imp.empresa.razao_social}
                                            </Link>
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

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function EmpresasVinculos() {
    const { id } = useParams();
    const [empresa, setEmpresa] = useState(null);
    const [servicos, setServicos] = useState([]);
    const [vinculados, setVinculados] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(null);

    useEffect(() => {
        Promise.all([
            axios.get(`/api/empresas/${id}`),
            axios.get('/api/servicos'),
            axios.get(`/api/empresas/${id}/servicos`),
        ]).then(([resEmp, resSrv, resVinc]) => {
            setEmpresa(resEmp.data);
            setServicos(resSrv.data);
            setVinculados(resVinc.data.map((s) => s.id));
            setCarregando(false);
        });
    }, [id]);

    async function toggle(servicoId) {
        setSalvando(servicoId);
        const vinculado = vinculados.includes(servicoId);
        try {
            if (vinculado) {
                await axios.delete(`/api/empresas/${id}/servicos/${servicoId}`);
                setVinculados((prev) => prev.filter((v) => v !== servicoId));
            } else {
                await axios.post(`/api/empresas/${id}/servicos`, { servico_id: servicoId });
                setVinculados((prev) => [...prev, servicoId]);
            }
        } finally {
            setSalvando(null);
        }
    }

    if (carregando) {
        return (
            <AuthenticatedLayout>
                <div className="flex items-center justify-center py-24 text-zinc-500">Carregando…</div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-zinc-100">Vínculos de Serviços</h2>
                        <p className="text-sm text-zinc-500">{empresa?.nome_fantasia || empresa?.razao_social}</p>
                    </div>
                    <Link
                        to={`/empresas/${id}`}
                        className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                    >
                        ← Voltar
                    </Link>
                </div>
            }
        >
            <div className="py-10">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm">
                        {servicos.length === 0 ? (
                            <div className="py-16 text-center text-zinc-500">
                                <p>Nenhum serviço cadastrado.</p>
                                <Link to="/servicos/criar" className="mt-2 block text-sm text-emerald-400 hover:text-emerald-300">
                                    Cadastrar serviço
                                </Link>
                            </div>
                        ) : (
                            <ul className="divide-y divide-zinc-800">
                                {servicos.map((s) => {
                                    const ativo = vinculados.includes(s.id);
                                    return (
                                        <li key={s.id} className="flex items-center justify-between px-6 py-4">
                                            <div>
                                                <p className="font-medium text-zinc-100">{s.nome}</p>
                                                {s.descricao && (
                                                    <p className="text-sm text-zinc-500">{s.descricao}</p>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => toggle(s.id)}
                                                disabled={salvando === s.id}
                                                className={`rounded-full px-4 py-1.5 text-sm font-medium transition disabled:opacity-50 ${
                                                    ativo
                                                        ? 'bg-emerald-600/20 text-emerald-400 hover:bg-red-500/20 hover:text-red-400'
                                                        : 'bg-zinc-800 text-zinc-400 hover:bg-emerald-600/20 hover:text-emerald-400'
                                                }`}
                                            >
                                                {salvando === s.id ? '…' : ativo ? 'Vinculado' : 'Vincular'}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

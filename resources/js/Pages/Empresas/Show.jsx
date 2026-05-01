import { useAuth } from '@/contexts/AuthContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const LIMITE_HORAS = 40;

function BarraHoras({ horas }) {
    const pct = Math.min((horas / LIMITE_HORAS) * 100, 100);
    const cor =
        pct >= 100 ? 'bg-red-500'
        : pct >= 75 ? 'bg-yellow-400'
        : 'bg-emerald-500';
    return (
        <div>
            <div className="mb-1 flex justify-between text-xs text-zinc-500">
                <span>{Number(horas).toFixed(1)}h usadas</span>
                <span>{Math.max(0, LIMITE_HORAS - horas).toFixed(1)}h disponíveis</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                <div className={`h-full rounded-full transition-all duration-500 ${cor}`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

export default function EmpresasShow() {
    const { visitorMode } = useAuth();
    const { id } = useParams();
    const [empresa, setEmpresa] = useState(null);
    const [lancamentos, setLancamentos] = useState([]);
    const [impedimentos, setImpedimentos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        Promise.all([
            axios.get(`/api/empresas/${id}`),
            axios.get(`/api/lancamento-horas?empresa_id=${id}`),
            axios.get(`/api/impedimentos?empresa_id=${id}`),
        ]).then(([resEmp, resLanc, resImp]) => {
            setEmpresa(resEmp.data);
            setLancamentos(resLanc.data);
            setImpedimentos(resImp.data);
            setCarregando(false);
        });
    }, [id]);

    if (carregando) {
        return (
            <AuthenticatedLayout>
                <div className="flex items-center justify-center py-24 text-zinc-500">Carregando…</div>
            </AuthenticatedLayout>
        );
    }

    if (!empresa) {
        return (
            <AuthenticatedLayout>
                <div className="flex items-center justify-center py-24 text-zinc-500">Empresa não encontrada.</div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-zinc-100">
                            {empresa.nome_fantasia || empresa.razao_social}
                        </h2>
                        {empresa.nome_fantasia && (
                            <p className="text-sm text-zinc-500">{empresa.razao_social}</p>
                        )}
                    </div>
                    <Link
                        to="/empresas"
                        className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                    >
                        ← Voltar
                    </Link>
                </div>
            }
        >
            <div className="py-10">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">

                    {/* Dados + Barra */}
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 lg:col-span-2">
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">Dados</h3>
                            <dl className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <dt className="text-zinc-500">CNPJ</dt>
                                    <dd className="text-zinc-100">{empresa.cnpj}</dd>
                                </div>
                                <div>
                                    <dt className="text-zinc-500">E-mail</dt>
                                    <dd className="text-zinc-100">{empresa.email ?? '—'}</dd>
                                </div>
                                <div>
                                    <dt className="text-zinc-500">Telefone</dt>
                                    <dd className="text-zinc-100">{empresa.telefone ?? '—'}</dd>
                                </div>
                                <div>
                                    <dt className="text-zinc-500">Responsável</dt>
                                    <dd className="text-zinc-100">{empresa.responsavel_tecnico ?? '—'}</dd>
                                </div>
                            </dl>
                        </div>
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">Horas Semanais</h3>
                            <p className="mb-4 text-3xl font-bold text-zinc-100">
                                {Number(empresa.horas_semanais_acumuladas ?? 0).toFixed(1)}h
                                <span className="ml-1 text-sm font-normal text-zinc-500">/ 40h</span>
                            </p>
                            <BarraHoras horas={empresa.horas_semanais_acumuladas ?? 0} />
                            {!visitorMode && (
                                <Link
                                    to={`/lancamento-horas/criar?empresa_id=${id}`}
                                    className="mt-4 block rounded-md bg-emerald-600 px-4 py-2 text-center text-sm text-white hover:bg-emerald-700"
                                >
                                    Registrar Horas
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Lançamentos */}
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm">
                        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
                            <h3 className="font-medium text-zinc-100">Lançamentos de Horas</h3>
                        </div>
                        <div className="p-6">
                            {lancamentos.length === 0 ? (
                                <p className="text-center text-zinc-500">Nenhum lançamento.</p>
                            ) : (
                                <table className="min-w-full border-collapse text-sm">
                                    <thead>
                                        <tr>
                                            <th className="pb-2 text-left text-xs font-medium uppercase text-zinc-500">Data</th>
                                            <th className="pb-2 text-left text-xs font-medium uppercase text-zinc-500">Horas</th>
                                            <th className="pb-2 text-left text-xs font-medium uppercase text-zinc-500">Serviço</th>
                                            <th className="pb-2 text-left text-xs font-medium uppercase text-zinc-500">Observação</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800">
                                        {lancamentos.map((l) => (
                                            <tr key={l.id}>
                                                <td className="py-3 text-zinc-300">{l.data}</td>
                                                <td className="py-3 text-zinc-100 font-medium">{l.horas}h</td>
                                                <td className="py-3 text-zinc-400">{l.servico?.nome ?? '—'}</td>
                                                <td className="py-3 text-zinc-500">{l.observacao ?? '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Impedimentos */}
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm">
                        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
                            <h3 className="font-medium text-zinc-100">Impedimentos</h3>
                            {!visitorMode && (
                                <Link
                                    to={`/impedimentos/criar?empresa_id=${id}`}
                                    className="rounded-md bg-red-600/80 px-3 py-1.5 text-xs text-white hover:bg-red-600"
                                >
                                    Registrar
                                </Link>
                            )}
                        </div>
                        <div className="p-6">
                            {impedimentos.length === 0 ? (
                                <p className="text-center text-zinc-500">Nenhum impedimento.</p>
                            ) : (
                                <div className="space-y-3">
                                    {impedimentos.map((imp) => (
                                        <div
                                            key={imp.id}
                                            className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4"
                                        >
                                            <p className="text-sm text-zinc-200">{imp.justificativa}</p>
                                            <p className="mt-1 text-xs text-zinc-600">{imp.data}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

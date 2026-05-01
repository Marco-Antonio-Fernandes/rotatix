import { useAuth } from '@/contexts/AuthContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatarCnpjDigitando, formatarTelefoneBrDigitando } from '@/utils/mascaras';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const inputCls =
    'w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none';

function Campo({ label, children, erro }) {
    return (
        <div>
            <label className="mb-1 block text-sm text-zinc-400">{label}</label>
            {children}
            {erro && <p className="mt-1 text-xs text-red-400">{erro}</p>}
        </div>
    );
}

const formEmpresaInicial = {
    razao_social: '',
    nome_fantasia: '',
    cnpj: '',
    email: '',
    telefone: '',
    responsavel_tecnico: '',
    segmento_id: '',
};

export default function Index() {
    const { visitorMode } = useAuth();
    const [empresas, setEmpresas] = useState([]);
    const [segmentos, setSegmentos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [modalEmpresa, setModalEmpresa] = useState(false);
    const [modalSegmento, setModalSegmento] = useState(false);
    const [formEmpresa, setFormEmpresa] = useState(formEmpresaInicial);
    const [nomeSegmento, setNomeSegmento] = useState('');
    const [erros, setErros] = useState({});
    const [salvando, setSalvando] = useState(false);
    const [removendoId, setRemovendoId] = useState(null);
    const [removendoSegmentoId, setRemovendoSegmentoId] = useState(null);

    useEffect(() => {
        document.title = `Empresas — ${import.meta.env.VITE_APP_NAME ?? 'Laravel'}`;
        carregarDados();
    }, []);

    async function carregarDados() {
        setCarregando(true);
        try {
            const [resEmpresas, resSegmentos] = await Promise.all([
                axios.get('/api/empresas'),
                axios.get('/api/segmentos'),
            ]);
            setEmpresas(resEmpresas.data);
            setSegmentos(resSegmentos.data);
        } finally {
            setCarregando(false);
        }
    }

    function abrirModalEmpresa() {
        setFormEmpresa(formEmpresaInicial);
        setErros({});
        setModalEmpresa(true);
    }

    function abrirModalSegmento() {
        setNomeSegmento('');
        setErros({});
        setModalSegmento(true);
    }

    async function criarEmpresa(e) {
        e.preventDefault();
        setSalvando(true);
        setErros({});
        try {
            const payload = {
                razao_social: formEmpresa.razao_social,
                cnpj: formEmpresa.cnpj,
            };
            if (formEmpresa.nome_fantasia) payload.nome_fantasia = formEmpresa.nome_fantasia;
            if (formEmpresa.email) payload.email = formEmpresa.email;
            if (formEmpresa.telefone) payload.telefone = formEmpresa.telefone;
            if (formEmpresa.responsavel_tecnico) payload.responsavel_tecnico = formEmpresa.responsavel_tecnico;
            if (formEmpresa.segmento_id) payload.segmento_id = formEmpresa.segmento_id;

            const { data: empresa } = await axios.post('/api/empresas', payload);
            setEmpresas((prev) => [...prev, empresa]);
            setModalEmpresa(false);
        } catch (err) {
            if (err.response?.data?.errors) setErros(err.response.data.errors);
        } finally {
            setSalvando(false);
        }
    }

    async function criarSegmento(e) {
        e.preventDefault();
        setSalvando(true);
        setErros({});
        try {
            const { data } = await axios.post('/api/segmentos', { nome: nomeSegmento });
            setSegmentos((prev) => [...prev, data]);
            setModalSegmento(false);
        } catch (err) {
            if (err.response?.data?.errors) setErros(err.response.data.errors);
        } finally {
            setSalvando(false);
        }
    }

    function nomeSegmentoDaEmpresa(empresa) {
        const seg = segmentos.find((s) => s.id === empresa.segmento_id);
        return seg?.nome ?? '—';
    }

    async function removerEmpresa(empresa) {
        if (!window.confirm(`Remover "${empresa.razao_social}"? Esta ação não pode ser desfeita.`)) return;
        setRemovendoId(empresa.id);
        try {
            await axios.delete(`/api/empresas/${empresa.id}`);
            setEmpresas((prev) => prev.filter((e) => e.id !== empresa.id));
        } finally {
            setRemovendoId(null);
        }
    }

    async function removerSegmento(seg) {
        const n = (seg.empresas ?? []).length;
        const msg =
            n > 0
                ? `Remover segmento "${seg.nome}"? As ${n} empresa(s) ficam sem segmento.`
                : `Remover segmento "${seg.nome}"?`;
        if (!window.confirm(msg)) return;
        setRemovendoSegmentoId(seg.id);
        try {
            await axios.delete(`/api/segmentos/${seg.id}`);
            setSegmentos((prev) => prev.filter((s) => s.id !== seg.id));
            setEmpresas((prev) =>
                prev.map((e) => (e.segmento_id === seg.id ? { ...e, segmento_id: null } : e)),
            );
        } finally {
            setRemovendoSegmentoId(null);
        }
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-zinc-100">
                    Gestão de Empresas (Rodízio)
                </h2>
            }
        >
            <div className="py-10">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm">
                        <div className="p-6 text-zinc-100">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-medium">Empresas Cadastradas</h3>
                                {!visitorMode && (
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={abrirModalSegmento}
                                            className="rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-200 transition hover:bg-zinc-700"
                                        >
                                            Novo Segmento
                                        </button>
                                        <button
                                            type="button"
                                            onClick={abrirModalEmpresa}
                                            className="rounded-md bg-emerald-600 px-4 py-2 text-sm text-white transition hover:bg-emerald-700"
                                        >
                                            Nova Empresa
                                        </button>
                                    </div>
                                )}
                            </div>

                            {!carregando && segmentos.length > 0 && (
                                <div className="mb-6 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
                                    <p className="mb-2 text-xs font-medium uppercase text-zinc-500">
                                        Segmentos
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {segmentos.map((s) => (
                                            <div
                                                key={s.id}
                                                className="flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-800/80 px-3 py-1.5"
                                            >
                                                <span className="text-sm text-zinc-200">{s.nome}</span>
                                                {!visitorMode && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removerSegmento(s)}
                                                        disabled={removendoSegmentoId === s.id}
                                                        className="rounded border border-red-500/40 bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                                                    >
                                                        {removendoSegmentoId === s.id ? '…' : 'Apagar'}
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {carregando ? (
                                <p className="py-8 text-center text-zinc-500">Carregando…</p>
                            ) : (
                                <table className="min-w-full border-collapse">
                                    <thead className="bg-zinc-800/80">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-zinc-400">
                                                Nome
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-zinc-400">
                                                CNPJ
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-zinc-400">
                                                Segmento
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-zinc-400">
                                                Status (40h)
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium uppercase text-zinc-400">
                                                Ações
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800 bg-zinc-900">
                                        {empresas.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="px-6 py-10 text-center text-zinc-500"
                                                >
                                                    Nenhuma empresa cadastrada.
                                                </td>
                                            </tr>
                                        ) : (
                                            empresas.map((empresa) => (
                                                <tr key={empresa.id}>
                                                    <td className="px-6 py-4 font-medium">
                                                        {empresa.razao_social}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-zinc-400">
                                                        {empresa.cnpj}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-zinc-400">
                                                        {nomeSegmentoDaEmpresa(empresa)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`rounded-full px-2 py-1 text-xs font-bold ${
                                                                empresa.horas_semanais_acumuladas >= 40
                                                                    ? 'bg-red-500/15 text-red-400'
                                                                    : 'bg-emerald-500/15 text-emerald-400'
                                                            }`}
                                                        >
                                                            {empresa.horas_semanais_acumuladas}h / 40h
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-sm">
                                                        <div className="flex flex-wrap items-center justify-end gap-3">
                                                            {!visitorMode && (
                                                                <Link
                                                                    to={`/empresas/${empresa.id}/vinculos`}
                                                                    className="text-zinc-500 hover:text-zinc-300"
                                                                >
                                                                    Vínculos
                                                                </Link>
                                                            )}
                                                            <Link
                                                                to={`/empresas/${empresa.id}`}
                                                                className="text-emerald-400 hover:text-emerald-300"
                                                            >
                                                                Detalhes
                                                            </Link>
                                                            {!visitorMode && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removerEmpresa(empresa)}
                                                                    disabled={removendoId === empresa.id}
                                                                    className="text-red-400/90 hover:text-red-300 disabled:opacity-50"
                                                                >
                                                                    {removendoId === empresa.id ? '…' : 'Remover'}
                                                                </button>
                                                            )}
                                                        </div>
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
            </div>

            {/* ── Modal Nova Empresa ── */}
            {modalEmpresa && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="w-full max-w-lg rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-xl">
                        <h3 className="mb-4 text-lg font-semibold text-zinc-100">Nova Empresa</h3>
                        <form onSubmit={criarEmpresa} className="space-y-3">
                            <Campo label="Razão Social *" erro={erros.razao_social?.[0]}>
                                <input
                                    value={formEmpresa.razao_social}
                                    onChange={(e) =>
                                        setFormEmpresa((p) => ({ ...p, razao_social: e.target.value }))
                                    }
                                    className={inputCls}
                                    required
                                />
                            </Campo>
                            <Campo label="Nome Fantasia" erro={erros.nome_fantasia?.[0]}>
                                <input
                                    value={formEmpresa.nome_fantasia}
                                    onChange={(e) =>
                                        setFormEmpresa((p) => ({ ...p, nome_fantasia: e.target.value }))
                                    }
                                    className={inputCls}
                                />
                            </Campo>
                            <Campo label="CNPJ *" erro={erros.cnpj?.[0]}>
                                <input
                                    value={formEmpresa.cnpj}
                                    onChange={(e) =>
                                        setFormEmpresa((p) => ({
                                            ...p,
                                            cnpj: formatarCnpjDigitando(e.target.value),
                                        }))
                                    }
                                    className={inputCls}
                                    placeholder="00.000.000/0000-00"
                                    inputMode="numeric"
                                    autoComplete="off"
                                    maxLength={18}
                                    required
                                />
                            </Campo>
                            <div className="grid grid-cols-2 gap-3">
                                <Campo label="E-mail" erro={erros.email?.[0]}>
                                    <input
                                        type="email"
                                        value={formEmpresa.email}
                                        onChange={(e) =>
                                            setFormEmpresa((p) => ({ ...p, email: e.target.value }))
                                        }
                                        className={inputCls}
                                    />
                                </Campo>
                                <Campo label="Telefone" erro={erros.telefone?.[0]}>
                                    <input
                                        value={formEmpresa.telefone}
                                        onChange={(e) =>
                                            setFormEmpresa((p) => ({
                                                ...p,
                                                telefone: formatarTelefoneBrDigitando(e.target.value),
                                            }))
                                        }
                                        className={inputCls}
                                        placeholder="(00) 00000-0000"
                                        inputMode="tel"
                                        autoComplete="tel"
                                        maxLength={15}
                                    />
                                </Campo>
                            </div>
                            <Campo label="Responsável Técnico" erro={erros.responsavel_tecnico?.[0]}>
                                <input
                                    value={formEmpresa.responsavel_tecnico}
                                    onChange={(e) =>
                                        setFormEmpresa((p) => ({
                                            ...p,
                                            responsavel_tecnico: e.target.value,
                                        }))
                                    }
                                    className={inputCls}
                                />
                            </Campo>
                            <Campo label="Segmento" erro={erros.segmento_id?.[0]}>
                                <select
                                    value={formEmpresa.segmento_id}
                                    onChange={(e) =>
                                        setFormEmpresa((p) => ({ ...p, segmento_id: e.target.value }))
                                    }
                                    className={inputCls}
                                >
                                    <option value="">Sem segmento</option>
                                    {segmentos.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.nome}
                                        </option>
                                    ))}
                                </select>
                            </Campo>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setModalEmpresa(false)}
                                    className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={salvando}
                                    className="rounded-md bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    {salvando ? 'Salvando…' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Modal Novo Segmento ── */}
            {modalSegmento && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="w-full max-w-sm rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-xl">
                        <h3 className="mb-4 text-lg font-semibold text-zinc-100">Novo Segmento</h3>
                        <form onSubmit={criarSegmento} className="space-y-3">
                            <Campo label="Nome do Segmento *" erro={erros.nome?.[0]}>
                                <input
                                    value={nomeSegmento}
                                    onChange={(e) => setNomeSegmento(e.target.value)}
                                    className={inputCls}
                                    placeholder="Ex: Limpeza, Jardinagem…"
                                    autoFocus
                                    required
                                />
                            </Campo>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setModalSegmento(false)}
                                    className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={salvando}
                                    className="rounded-md bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    {salvando ? 'Salvando…' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

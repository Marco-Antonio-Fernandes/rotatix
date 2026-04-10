import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { compararFila } from '@/utils/chaveFila';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LIMITE_HORAS = 40;

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

export default function LancamentoHorasCreate() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const segmentoIdUrl = searchParams.get('segmento_id') ?? '';
    const empresaIdUrl = searchParams.get('empresa_id') ?? '';

    const [segmentos, setSegmentos] = useState([]);
    const [segmentoId, setSegmentoId] = useState(segmentoIdUrl);
    const [form, setForm] = useState({
        empresa_id: empresaIdUrl,
        servico: '',
        data: new Date().toISOString().split('T')[0],
        horas: '',
        observacao: '',
    });
    const [erros, setErros] = useState({});
    const [erroApi, setErroApi] = useState('');
    const [salvando, setSalvando] = useState(false);
    const [modalIndisp, setModalIndisp] = useState(false);
    const [textoIndisp, setTextoIndisp] = useState('');
    const [erroIndisp, setErroIndisp] = useState('');
    const [pulandoIndisp, setPulandoIndisp] = useState(false);

    async function carregarSegmentos() {
        const { data } = await axios.get('/api/segmentos');
        setSegmentos(data);
        return data;
    }

    useEffect(() => {
        carregarSegmentos();
    }, []);

    useEffect(() => {
        if (!segmentos.length || !empresaIdUrl || segmentoIdUrl) return;
        for (const s of segmentos) {
            if (s.empresas?.some((e) => String(e.id) === String(empresaIdUrl))) {
                setSegmentoId(String(s.id));
                break;
            }
        }
    }, [segmentos, empresaIdUrl, segmentoIdUrl]);

    const empresasDoSegmento = useMemo(() => {
        const seg = segmentos.find((s) => String(s.id) === String(segmentoId));
        return seg?.empresas ?? [];
    }, [segmentos, segmentoId]);

    const primeiraNaFilaId = useMemo(() => {
        const ativas = empresasDoSegmento.filter((e) => e.horas_semanais_acumuladas < LIMITE_HORAS);
        const top = [...ativas].sort(compararFila)[0];
        return top ? String(top.id) : '';
    }, [empresasDoSegmento]);

    useEffect(() => {
        if (!segmentos.length || !segmentoIdUrl || empresaIdUrl) return;
        const seg = segmentos.find((s) => String(s.id) === String(segmentoIdUrl));
        if (!seg) return;
        const ativas = (seg.empresas ?? []).filter((e) => e.horas_semanais_acumuladas < LIMITE_HORAS);
        const top = [...ativas].sort(compararFila)[0];
        if (top) setForm((p) => ({ ...p, empresa_id: String(top.id) }));
    }, [segmentos, segmentoIdUrl, empresaIdUrl]);

    useEffect(() => {
        if (empresaIdUrl) return;
        if (!form.empresa_id || !empresasDoSegmento.length) return;
        const ok = empresasDoSegmento.some((e) => String(e.id) === String(form.empresa_id));
        if (!ok) setForm((p) => ({ ...p, empresa_id: primeiraNaFilaId }));
    }, [empresasDoSegmento, form.empresa_id, primeiraNaFilaId, empresaIdUrl]);

    function set(campo) {
        return (e) => setForm((p) => ({ ...p, [campo]: e.target.value }));
    }

    function aoMudarSegmento(e) {
        const v = e.target.value;
        setSegmentoId(v);
        const seg = segmentos.find((s) => String(s.id) === String(v));
        const ativas = (seg?.empresas ?? []).filter((e) => e.horas_semanais_acumuladas < LIMITE_HORAS);
        const top = [...ativas].sort(compararFila)[0];
        setForm((p) => ({ ...p, empresa_id: top ? String(top.id) : '' }));
    }

    async function confirmarIndisponivel() {
        if (!segmentoId) return;
        const j = textoIndisp.trim();
        if (j.length < 3) {
            setErroIndisp('Mínimo 3 caracteres.');
            return;
        }
        setErroIndisp('');
        setPulandoIndisp(true);
        try {
            await axios.post(`/api/segmentos/${segmentoId}/indisponivel`, { justificativa: j });
            const data = await carregarSegmentos();
            const seg = data.find((s) => String(s.id) === String(segmentoId));
            const ativas = (seg?.empresas ?? []).filter((e) => e.horas_semanais_acumuladas < LIMITE_HORAS);
            const top = [...ativas].sort(compararFila)[0];
            setForm((p) => ({ ...p, empresa_id: top ? String(top.id) : '' }));
            setModalIndisp(false);
            setTextoIndisp('');
        } finally {
            setPulandoIndisp(false);
        }
    }

    async function salvar(e) {
        e.preventDefault();
        setSalvando(true);
        setErros({});
        setErroApi('');
        try {
            const payload = {
                empresa_id: Number(form.empresa_id),
                data: form.data,
                horas: Number(form.horas),
            };
            const srv = form.servico.trim();
            if (srv) payload.servico = srv;
            if (form.observacao) payload.observacao = form.observacao;
            await axios.post('/api/lancamento-horas', payload);
            navigate('/');
        } catch (err) {
            const d = err.response?.data;
            if (d?.errors) setErros(d.errors);
            else if (typeof d?.message === 'string') setErroApi(d.message);
        } finally {
            setSalvando(false);
        }
    }

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold text-zinc-100">Registrar horas</h2>
                    <p className="mt-1 text-sm text-zinc-500">Segmento → empresa → serviço e quantidade</p>
                </div>
            }
        >
            <div className="py-10">
                <div className="mx-auto max-w-lg sm:px-6 lg:px-8">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
                        <form onSubmit={salvar} className="space-y-4">
                            {erroApi && (
                                <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                                    {erroApi}
                                </p>
                            )}
                            <Campo label="Segmento *">
                                <select
                                    value={segmentoId}
                                    onChange={aoMudarSegmento}
                                    className={inputCls}
                                    required
                                >
                                    <option value="">Selecione o segmento…</option>
                                    {segmentos.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.nome}
                                        </option>
                                    ))}
                                </select>
                            </Campo>
                            <Campo label="Empresa *" erro={erros.empresa_id?.[0]}>
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                    <select
                                        value={form.empresa_id}
                                        onChange={set('empresa_id')}
                                        className={inputCls}
                                        required
                                        disabled={!segmentoId}
                                    >
                                        <option value="">
                                            {segmentoId ? 'Selecione a empresa…' : 'Escolha um segmento primeiro'}
                                        </option>
                                        {[...empresasDoSegmento]
                                            .sort(compararFila)
                                            .map((emp) => (
                                                <option key={emp.id} value={emp.id}>
                                                    {emp.nome_fantasia || emp.razao_social}
                                                </option>
                                            ))}
                                    </select>
                                    {segmentoId && primeiraNaFilaId && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setTextoIndisp('');
                                                setErroIndisp('');
                                                setModalIndisp(true);
                                            }}
                                            className="shrink-0 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20"
                                        >
                                            Indisponível
                                        </button>
                                    )}
                                </div>
                            </Campo>
                            <Campo label="Serviço" erro={erros.servico?.[0]}>
                                <input
                                    type="text"
                                    value={form.servico}
                                    onChange={set('servico')}
                                    className={inputCls}
                                    placeholder="Descreva o serviço prestado"
                                    maxLength={255}
                                />
                            </Campo>
                            <div className="grid grid-cols-2 gap-3">
                                <Campo label="Data *" erro={erros.data?.[0]}>
                                    <input type="date" value={form.data} onChange={set('data')} className={inputCls} required />
                                </Campo>
                                <Campo label="Horas *" erro={erros.horas?.[0]}>
                                    <input
                                        type="number"
                                        step="0.5"
                                        min="0.5"
                                        max="24"
                                        value={form.horas}
                                        onChange={set('horas')}
                                        className={inputCls}
                                        placeholder="Ex: 4"
                                        required
                                    />
                                </Campo>
                            </div>
                            <Campo label="Observação" erro={erros.observacao?.[0]}>
                                <textarea value={form.observacao} onChange={set('observacao')} className={inputCls} rows={3} />
                            </Campo>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => navigate('/')}
                                    className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={salvando}
                                    className="rounded-md bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    {salvando ? 'Salvando…' : 'Registrar'}
                                </button>
                            </div>
                        </form>

                        {modalIndisp && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                                <div className="w-full max-w-md rounded-xl border border-zinc-700 bg-zinc-900 p-5 shadow-xl">
                                    <h4 className="text-sm font-semibold text-zinc-100">Indisponível</h4>
                                    <p className="mt-1 text-xs text-zinc-500">
                                        Informe o motivo. A fila passa para a próxima empresa do segmento.
                                    </p>
                                    <textarea
                                        value={textoIndisp}
                                        onChange={(e) => setTextoIndisp(e.target.value)}
                                        className="mt-3 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100"
                                        rows={4}
                                    />
                                    {erroIndisp && <p className="mt-2 text-xs text-red-400">{erroIndisp}</p>}
                                    <div className="mt-4 flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setModalIndisp(false)}
                                            className="rounded-md border border-zinc-600 px-3 py-1.5 text-sm text-zinc-300"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="button"
                                            disabled={pulandoIndisp}
                                            onClick={confirmarIndisponivel}
                                            className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white disabled:opacity-50"
                                        >
                                            {pulandoIndisp ? '…' : 'Confirmar'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

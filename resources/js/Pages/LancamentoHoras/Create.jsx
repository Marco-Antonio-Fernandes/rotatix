import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

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
    const empresaIdInicial = searchParams.get('empresa_id') ?? '';

    const [form, setForm] = useState({
        empresa_id: empresaIdInicial,
        servico_id: '',
        data: new Date().toISOString().split('T')[0],
        horas: '',
        observacao: '',
    });
    const [empresas, setEmpresas] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [erros, setErros] = useState({});
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        Promise.all([
            axios.get('/api/empresas'),
            axios.get('/api/servicos'),
        ]).then(([resEmp, resSrv]) => {
            setEmpresas(resEmp.data);
            setServicos(resSrv.data);
        });
    }, []);

    function set(campo) {
        return (e) => setForm((p) => ({ ...p, [campo]: e.target.value }));
    }

    async function salvar(e) {
        e.preventDefault();
        setSalvando(true);
        setErros({});
        try {
            const payload = {
                empresa_id: form.empresa_id,
                data: form.data,
                horas: form.horas,
            };
            if (form.servico_id) payload.servico_id = form.servico_id;
            if (form.observacao) payload.observacao = form.observacao;
            await axios.post('/api/lancamento-horas', payload);
            const destino = empresaIdInicial ? `/empresas/${empresaIdInicial}` : '/empresas';
            navigate(destino);
        } catch (err) {
            if (err.response?.data?.errors) setErros(err.response.data.errors);
        } finally {
            setSalvando(false);
        }
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-zinc-100">Registrar Horas</h2>}
        >
            <div className="py-10">
                <div className="mx-auto max-w-lg sm:px-6 lg:px-8">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
                        <form onSubmit={salvar} className="space-y-4">
                            <Campo label="Empresa *" erro={erros.empresa_id?.[0]}>
                                <select value={form.empresa_id} onChange={set('empresa_id')} className={inputCls} required>
                                    <option value="">Selecione…</option>
                                    {empresas.map((emp) => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.nome_fantasia || emp.razao_social}
                                        </option>
                                    ))}
                                </select>
                            </Campo>
                            <Campo label="Serviço" erro={erros.servico_id?.[0]}>
                                <select value={form.servico_id} onChange={set('servico_id')} className={inputCls}>
                                    <option value="">Sem serviço específico</option>
                                    {servicos.map((s) => (
                                        <option key={s.id} value={s.id}>{s.nome}</option>
                                    ))}
                                </select>
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
                                    onClick={() => navigate(empresaIdInicial ? `/empresas/${empresaIdInicial}` : '/empresas')}
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
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

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

export default function ImpedimentosCreate() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const empresaIdInicial = searchParams.get('empresa_id') ?? '';

    const [form, setForm] = useState({
        empresa_id: empresaIdInicial,
        descricao: '',
        data: new Date().toISOString().split('T')[0],
    });
    const [empresas, setEmpresas] = useState([]);
    const [erros, setErros] = useState({});
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        axios.get('/api/empresas').then(({ data }) => setEmpresas(data));
    }, []);

    function set(campo) {
        return (e) => setForm((p) => ({ ...p, [campo]: e.target.value }));
    }

    async function salvar(e) {
        e.preventDefault();
        setSalvando(true);
        setErros({});
        try {
            await axios.post('/api/impedimentos', form);
            const destino = empresaIdInicial ? `/empresas/${empresaIdInicial}` : '/impedimentos';
            navigate(destino);
        } catch (err) {
            if (err.response?.data?.errors) setErros(err.response.data.errors);
        } finally {
            setSalvando(false);
        }
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-zinc-100">Registrar Impedimento</h2>}
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
                            <Campo label="Data *" erro={erros.data?.[0]}>
                                <input type="date" value={form.data} onChange={set('data')} className={inputCls} required />
                            </Campo>
                            <Campo label="Descrição *" erro={erros.descricao?.[0]}>
                                <textarea
                                    value={form.descricao}
                                    onChange={set('descricao')}
                                    className={inputCls}
                                    rows={4}
                                    placeholder="Descreva o impedimento…"
                                    required
                                    autoFocus
                                />
                            </Campo>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => navigate(empresaIdInicial ? `/empresas/${empresaIdInicial}` : '/impedimentos')}
                                    className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={salvando}
                                    className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
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

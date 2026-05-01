import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

export default function ServicosCreate() {
    const navigate = useNavigate();
    const [segmentos, setSegmentos] = useState([]);
    const [form, setForm] = useState({ segmento_id: '', nome: '', horas: '' });
    const [erros, setErros] = useState({});
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        axios.get('/api/segmentos').then(({ data }) => setSegmentos(data));
    }, []);

    async function salvar(e) {
        e.preventDefault();
        setSalvando(true);
        setErros({});
        try {
            const payload = {
                segmento_id: Number(form.segmento_id),
                nome: form.nome,
            };
            if (form.horas !== '' && form.horas !== null) {
                payload.horas = Number(form.horas);
            }
            await axios.post('/api/servicos', payload);
            navigate('/servicos');
        } catch (err) {
            if (err.response?.data?.errors) setErros(err.response.data.errors);
        } finally {
            setSalvando(false);
        }
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-zinc-100">Novo Serviço</h2>}
        >
            <div className="py-10">
                <div className="mx-auto max-w-lg sm:px-6 lg:px-8">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
                        <form onSubmit={salvar} className="space-y-4">
                            <Campo label="Segmento *" erro={erros.segmento_id?.[0]}>
                                <select
                                    required
                                    value={form.segmento_id}
                                    onChange={(e) =>
                                        setForm((p) => ({ ...p, segmento_id: e.target.value }))
                                    }
                                    className={inputCls}
                                >
                                    <option value="">Selecione…</option>
                                    {segmentos.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.nome}
                                        </option>
                                    ))}
                                </select>
                            </Campo>
                            <Campo label="Nome *" erro={erros.nome?.[0]}>
                                <input
                                    value={form.nome}
                                    onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
                                    className={inputCls}
                                    autoFocus
                                    required
                                />
                            </Campo>
                            <Campo label="Horas (opcional)" erro={erros.horas?.[0]}>
                                <input
                                    type="number"
                                    min={0}
                                    step={0.5}
                                    value={form.horas}
                                    onChange={(e) => setForm((p) => ({ ...p, horas: e.target.value }))}
                                    className={inputCls}
                                    placeholder="0"
                                />
                            </Campo>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => navigate('/servicos')}
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
            </div>
        </AuthenticatedLayout>
    );
}

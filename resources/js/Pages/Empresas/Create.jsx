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

const formInicial = {
    razao_social: '',
    nome_fantasia: '',
    cnpj: '',
    email: '',
    telefone: '',
    responsavel_tecnico: '',
    segmento_id: '',
};

export default function EmpresasCreate() {
    const navigate = useNavigate();
    const [form, setForm] = useState(formInicial);
    const [segmentos, setSegmentos] = useState([]);
    const [erros, setErros] = useState({});
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        axios.get('/api/segmentos').then(({ data }) => setSegmentos(data));
    }, []);

    function set(campo) {
        return (e) => setForm((p) => ({ ...p, [campo]: e.target.value }));
    }

    async function salvar(e) {
        e.preventDefault();
        setSalvando(true);
        setErros({});
        try {
            const payload = { razao_social: form.razao_social, cnpj: form.cnpj };
            if (form.nome_fantasia) payload.nome_fantasia = form.nome_fantasia;
            if (form.email) payload.email = form.email;
            if (form.telefone) payload.telefone = form.telefone;
            if (form.responsavel_tecnico) payload.responsavel_tecnico = form.responsavel_tecnico;
            if (form.segmento_id) payload.segmento_id = form.segmento_id;
            await axios.post('/api/empresas', payload);
            navigate('/empresas');
        } catch (err) {
            if (err.response?.data?.errors) setErros(err.response.data.errors);
        } finally {
            setSalvando(false);
        }
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-zinc-100">Nova Empresa</h2>}
        >
            <div className="py-10">
                <div className="mx-auto max-w-lg sm:px-6 lg:px-8">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
                        <form onSubmit={salvar} className="space-y-4">
                            <Campo label="Razão Social *" erro={erros.razao_social?.[0]}>
                                <input value={form.razao_social} onChange={set('razao_social')} className={inputCls} required autoFocus />
                            </Campo>
                            <Campo label="Nome Fantasia" erro={erros.nome_fantasia?.[0]}>
                                <input value={form.nome_fantasia} onChange={set('nome_fantasia')} className={inputCls} />
                            </Campo>
                            <Campo label="CNPJ *" erro={erros.cnpj?.[0]}>
                                <input value={form.cnpj} onChange={set('cnpj')} className={inputCls} placeholder="00.000.000/0000-00" required />
                            </Campo>
                            <div className="grid grid-cols-2 gap-3">
                                <Campo label="E-mail" erro={erros.email?.[0]}>
                                    <input type="email" value={form.email} onChange={set('email')} className={inputCls} />
                                </Campo>
                                <Campo label="Telefone" erro={erros.telefone?.[0]}>
                                    <input value={form.telefone} onChange={set('telefone')} className={inputCls} />
                                </Campo>
                            </div>
                            <Campo label="Responsável Técnico" erro={erros.responsavel_tecnico?.[0]}>
                                <input value={form.responsavel_tecnico} onChange={set('responsavel_tecnico')} className={inputCls} />
                            </Campo>
                            <Campo label="Segmento" erro={erros.segmento_id?.[0]}>
                                <select value={form.segmento_id} onChange={set('segmento_id')} className={inputCls}>
                                    <option value="">Sem segmento</option>
                                    {segmentos.map((s) => (
                                        <option key={s.id} value={s.id}>{s.nome}</option>
                                    ))}
                                </select>
                            </Campo>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => navigate('/empresas')}
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

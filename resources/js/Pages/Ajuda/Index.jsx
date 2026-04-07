import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState } from 'react';

const ABAS = [
    { id: 'horas', label: 'Registro de Horas' },
    { id: 'rotacao', label: 'Manual do Rodízio' },
    { id: 'impedimento', label: 'Impedimentos' },
];

function Secao({ titulo, children }) {
    return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <h3 className="mb-4 text-base font-semibold text-emerald-400">{titulo}</h3>
            <div className="space-y-2 text-sm text-zinc-300 leading-relaxed">{children}</div>
        </div>
    );
}

function Passo({ numero, texto }) {
    return (
        <div className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-400">
                {numero}
            </span>
            <p>{texto}</p>
        </div>
    );
}

function Alerta({ texto }) {
    return (
        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-300">
            {texto}
        </div>
    );
}

function GuiaHoras() {
    return (
        <div className="space-y-4">
            <Secao titulo="O que é o Registro de Horas?">
                <p>
                    Cada visita ou serviço prestado a uma empresa deve ser registrado com a quantidade
                    de horas trabalhadas. O sistema acumula essas horas semanalmente e controla o
                    rodízio de acordo com o limite de 40h por empresa.
                </p>
            </Secao>

            <Secao titulo="Como registrar">
                <Passo numero="1" texto='Acesse o menu "Empresas" e clique em "Detalhes" da empresa atendida.' />
                <Passo numero="2" texto='Clique em "Registrar Horas" (ou acesse Empresas → Detalhes → botão verde).' />
                <Passo numero="3" texto="Selecione a empresa (se não foi pré-selecionada), a data e informe as horas." />
                <Passo numero="4" texto='Escolha o serviço realizado (opcional) e preencha a observação se necessário.' />
                <Passo numero="5" texto='Clique em "Registrar". O saldo de horas é atualizado imediatamente.' />
            </Secao>

            <Secao titulo="Regras importantes">
                <Alerta texto="O sistema valida se a empresa está na vez da fila. Registrar horas fora de ordem será bloqueado." />
                <p className="pt-1">
                    Máximo de 24h por lançamento individual. Use múltiplos lançamentos para períodos maiores.
                </p>
                <p>
                    Ao atingir 40h acumuladas, a empresa é marcada como "Ciclo concluído" e sai do rodízio ativo.
                </p>
            </Secao>

            <Secao titulo="Dúvidas frequentes">
                <div className="space-y-3">
                    <div>
                        <p className="font-medium text-zinc-100">Errei as horas. Como corrigir?</p>
                        <p className="text-zinc-400">
                            Entre em contato com o administrador para ajuste manual. Lançamentos não podem ser editados pelo operador.
                        </p>
                    </div>
                    <div>
                        <p className="font-medium text-zinc-100">Posso lançar horas retroativas?</p>
                        <p className="text-zinc-400">
                            Sim. O campo data aceita qualquer data passada. Use a data real do atendimento.
                        </p>
                    </div>
                </div>
            </Secao>
        </div>
    );
}

function GuiaRotacao() {
    return (
        <div className="space-y-4">
            <Secao titulo="O que é o Rodízio?">
                <p>
                    O rodízio é o mecanismo que distribui equitativamente o tempo de serviço entre as
                    empresas cadastradas em um mesmo segmento. Cada empresa tem direito a até{' '}
                    <span className="font-semibold text-zinc-100">40 horas semanais</span>. Ao atingir
                    esse limite, ela sai da fila e a próxima assume.
                </p>
            </Secao>

            <Secao titulo="Como funciona a fila">
                <Passo numero="1" texto="As empresas são ordenadas dentro do segmento por horas acumuladas (menor → maior)." />
                <Passo numero="2" texto='A empresa no topo da fila com menos de 40h é marcada como "Próxima".' />
                <Passo numero="3" texto="Ao registrar horas, o sistema valida se a empresa está na vez. Fora da ordem é bloqueado." />
                <Passo numero="4" texto="Ao atingir 40h, a empresa fica com status Ciclo Concluído e sai da fila ativa." />
                <Passo numero="5" texto="O administrador pode resetar o ciclo manualmente ao início de cada semana." />
            </Secao>

            <Secao titulo="Painel de Rotação">
                <p>
                    Acesse <span className="font-medium text-zinc-100">Rotação</span> no menu para visualizar:
                </p>
                <ul className="list-inside list-disc space-y-1 text-zinc-400">
                    <li>Todas as empresas por segmento com barra de horas</li>
                    <li>Qual empresa está "Próxima" no rodízio</li>
                    <li>Quantas empresas completaram o ciclo</li>
                    <li>Acesso rápido para registrar horas diretamente do painel</li>
                </ul>
            </Secao>

            <Secao titulo="Criando segmentos">
                <p>
                    Segmentos agrupam empresas por área de atuação (ex: Limpeza, Jardinagem, TI).
                    O rodízio é independente por segmento.
                </p>
                <Alerta texto="Remover um segmento remove a associação das empresas. As empresas não são excluídas." />
            </Secao>
        </div>
    );
}

function GuiaImpedimento() {
    return (
        <div className="space-y-4">
            <Secao titulo="O que é um impedimento?">
                <p>
                    Um impedimento é qualquer situação que impossibilite a prestação de serviço a uma
                    empresa na semana corrente — licença, férias coletivas, obras, indisponibilidade
                    do responsável, etc.
                </p>
                <p>
                    Registrar o impedimento evita que a empresa perca sua vez no rodízio sem
                    justificativa e mantém o histórico auditável.
                </p>
            </Secao>

            <Secao titulo="Como registrar um impedimento">
                <Passo numero="1" texto='Acesse "Impedimentos" no menu ou abra os detalhes da empresa e clique em "Registrar".' />
                <Passo numero="2" texto="Selecione a empresa afetada e informe a data do impedimento." />
                <Passo numero="3" texto="Descreva a justificativa com clareza (será registrada em log de auditoria)." />
                <Passo numero="4" texto='Clique em "Registrar". O impedimento fica com status "Pendente".' />
            </Secao>

            <Secao titulo="Resolvendo um impedimento">
                <p>
                    Quando a situação for resolvida, acesse{' '}
                    <span className="font-medium text-zinc-100">Impedimentos</span> e clique em{' '}
                    <span className="font-medium text-zinc-100">Resolver</span> no registro correspondente.
                    Isso altera o status para "Resolvido" e registra a ação no log de auditoria.
                </p>
                <Alerta texto="Impedimentos resolvidos não são excluídos — permanecem no histórico para fins de auditoria." />
            </Secao>

            <Secao titulo="Efeito no rodízio">
                <p>
                    Um impedimento registrado <span className="font-medium text-zinc-100">não</span>{' '}
                    avança automaticamente a fila. O administrador deve avaliar caso a caso se a empresa
                    permanece na posição atual ou é movida para o final do ciclo.
                </p>
            </Secao>
        </div>
    );
}

const CONTEUDO = {
    horas: GuiaHoras,
    rotacao: GuiaRotacao,
    impedimento: GuiaImpedimento,
};

export default function AjudaIndex() {
    const [aba, setAba] = useState('horas');

    useEffect(() => {
        document.title = `Ajuda — ${import.meta.env.VITE_APP_NAME ?? 'Rotatix'}`;
    }, []);

    const Conteudo = CONTEUDO[aba];

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-zinc-100">Ajuda</h2>}
        >
            <div className="py-10">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">

                    <div className="mb-6 flex flex-wrap gap-1 border-b border-zinc-800">
                        {ABAS.map((a) => (
                            <button
                                key={a.id}
                                type="button"
                                onClick={() => setAba(a.id)}
                                className={`rounded-t-md px-4 py-2 text-sm font-medium transition ${
                                    aba === a.id
                                        ? 'border border-b-0 border-zinc-700 bg-zinc-900 text-emerald-400'
                                        : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                            >
                                {a.label}
                            </button>
                        ))}
                    </div>

                    <Conteudo />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

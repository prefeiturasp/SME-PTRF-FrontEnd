import {
    botaoSomeQuandoMesNaoLiberado,
    mesLiberadoParaElaboracao,
    paaVigenteAtendeExigenciaDaProximaVigencia,
    periodoComAtaPendente,
    periodoComPaaEmElaboracao,
    periodoComPaaGerado,
    politicaPeriodoEncerrado } from './condicoes';
import {
    bloqueado,
    bloqueadoComAcessoAosPaasGerados,
    continuar,
    elaborarNovo,
    semBotao } from './resultados';
import type { VigenciaElaboracao, MotivoBloqueio, PeriodoElaboracao, Regra } from './types';

const periodoEncerradoComPoliticaBloqueante = (vigencia: VigenciaElaboracao, periodo: PeriodoElaboracao): boolean =>
    periodo.vigencia === 'ENCERRADO' && politicaPeriodoEncerrado(vigencia, periodo) === 'BLOQUEAR_TUDO';

const iniciarProximaVigenciaSemAtenderExigencia = (vigencia: VigenciaElaboracao, periodo: PeriodoElaboracao): boolean =>
    periodo.vigencia === 'PROXIMA_VIGENCIA' && !paaVigenteAtendeExigenciaDaProximaVigencia(vigencia);

// Bloqueio causado pelo mês: o botão some ou fic desabilitado, conforme a configuração do período
const impedidoPeloMes = (motivo: MotivoBloqueio) => (vigencia: VigenciaElaboracao, periodo: PeriodoElaboracao) =>
    botaoSomeQuandoMesNaoLiberado(periodo)
        ? semBotao(motivo, vigencia, periodo)
        : bloqueado(motivo, vigencia, periodo);

// Regras do botão de um período, em ordem de prioridade
// a primeira que se aplica vence.
// Cada regra tem um id, uma descrição, uma condição e um resultado
export const REGRAS: Regra[] = [
    {
        id: 'PERIODOS_SOBREPOSTOS',
        descricao: 'Há períodos sobrepostos envolvendo o vigente ou a Próxima Vigência: a vigência fica ambígua.',
        aplica: (vigencia) => vigencia.periodosSobrepostos,
        resultado: (vigencia, periodo) => bloqueado('PERIODOS_SOBREPOSTOS', vigencia, periodo),
    },
    {
        id: 'PERIODO_ENCERRADO_BLOQUEADO',
        descricao: 'PAA em elaboração de período encerrado e política que bloqueia tudo.',
        aplica: periodoEncerradoComPoliticaBloqueante,
        resultado: (vigencia, periodo) => bloqueado('PAA_PERIODO_ENCERRADO', vigencia, periodo),
    },
    {
        id: 'CONTINUAR_ELABORACAO',
        descricao: 'Período com PAA em elaboração: continua o PAA, em qualquer mês.',
        aplica: (_, periodo) => periodoComPaaEmElaboracao(periodo),
        resultado: (_, periodo) => continuar(periodo),
    },
    {
        id: 'PAA_COM_ATA_PENDENTE',
        descricao: 'Plano Anual gerado aguardando a ata: bloqueado, o PAA é acessado em "PAA vigente e anteriores".',
        aplica: (_, periodo) => periodoComAtaPendente(periodo),
        resultado: (vigencia, periodo) => bloqueadoComAcessoAosPaasGerados('PAA_ATA_PENDENTE', vigencia, periodo),
    },
    {
        id: 'PAA_JA_ELABORADO',
        descricao: 'PAA Elaborado: bloqueado, acesso em "PAA vigente e anteriores".',
        aplica: (_, periodo) => periodoComPaaGerado(periodo),
        resultado: (vigencia, periodo) => bloqueadoComAcessoAosPaasGerados('PAA_JA_ELABORADO', vigencia, periodo),
    },
    {
        id: 'SEM_PERMISSAO',
        descricao: 'Sem a permissão custom_change_paa não é possível iniciar um PAA.',
        aplica: (vigencia) => !vigencia.podeEditar,
        resultado: (vigencia, periodo) => bloqueado('SEM_PERMISSAO', vigencia, periodo),
    },
    {
        id: 'MES_NAO_LIBERADO',
        descricao: 'O mês atual não é o mês parametrizado para iniciar a elaboração.',
        aplica: (vigencia) => !mesLiberadoParaElaboracao(vigencia),
        resultado: impedidoPeloMes('MES_NAO_LIBERADO'),
    },
    {
        id: 'PAA_VIGENTE_FORA_DA_SITUACAO_EXIGIDA',
        descricao: 'A Próxima Vigência exige o PAA vigente em determinadas situações (parametrizável).',
        aplica: iniciarProximaVigenciaSemAtenderExigencia,
        resultado: (vigencia, periodo) => bloqueado('PAA_VIGENTE_FORA_DA_SITUACAO_EXIGIDA', vigencia, periodo),
    },
    {
        id: 'ELABORAR_NOVO',
        descricao: 'Período sem PAA e sem impedimento: habilita "Elaborar novo PAA".',
        aplica: () => true,
        resultado: (_, periodo) => elaborarNovo(periodo),
    },
]

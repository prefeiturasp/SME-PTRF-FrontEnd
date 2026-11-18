import { calcularEstadoElaboracao } from '../calcularEstadoElaboracao';
import { CONFIG_REGRAS } from '../config';
import type { VigenciaElaboracao, PaaResumo, PeriodoElaboracao, VigenciaPeriodo } from '../types';

type SituacaoPaa = PaaResumo['status_andamento'];

const periodo = (vigencia: VigenciaPeriodo, situacao?: SituacaoPaa, sobrescrever = {}): PeriodoElaboracao => ({
    uuid: `periodo-${vigencia}`,
    referencia: vigencia,
    data_inicial: '2026-05-01',
    data_final: '2027-04-30',
    vigencia,
    paa: situacao ? { uuid: `paa-${vigencia}`, status: 'EM_ELABORACAO', status_andamento: situacao } : null,
    ...sobrescrever,
});

const vigente = (situacao?: SituacaoPaa) => periodo('VIGENTE', situacao);
const proxima = (situacao?: SituacaoPaa) => periodo('PROXIMA_VIGENCIA', situacao);
const encerrado = (situacao?: SituacaoPaa, data_final = '2025-12-31') =>
    periodo('ENCERRADO', situacao, { data_final });

const vigenciaElaboracao = (sobrescrever: Partial<VigenciaElaboracao> = {}): VigenciaElaboracao => ({
    hoje: '2026-10-28',
    mes_elaboracao_paa: 10,
    periodos: [vigente()],
    periodosSobrepostos: false,
    podeEditar: true,
    proximaVigenciaHabilitada: true,
    statusVigenteExigidosParaProximaVigencia: null,
    ...sobrescrever,
});

/** Botões calculados, indexados pela vigência do período. */
const botoes = (ctx: VigenciaElaboracao) =>
    Object.fromEntries(calcularEstadoElaboracao(ctx).secoesPeriodos.map((secao) => [secao.vigencia, secao.botao]));

const ELABORAR = { acao: 'ELABORAR_NOVO', habilitado: true, visivel: true };
const CONTINUAR = { acao: 'CONTINUAR', habilitado: true, visivel: true };
const bloqueio = (motivo: string) => ({ habilitado: false, visivel: true, motivo });
const semBotao = (motivo: string) => ({ visivel: false, habilitado: false, motivo });

type Cenario = [string, string, VigenciaElaboracao, Record<string, Record<string, unknown>>, Partial<typeof CONFIG_REGRAS>?];

const CONFIG_ORIGINAL = { ...CONFIG_REGRAS };

// Linha de base dos testes: não depende dos valores atuais de config.ts
beforeEach(() => {
    Object.assign(CONFIG_REGRAS, {
        modoMesElaboracao: 'IGUAL',
        politicaPeriodoEncerrado: 'PERMITIR_CONTINUAR',
        carenciaPeriodoEncerrado: { unidade: 'MESES', quantidade: null },
        politicaAposCarencia: 'IGNORAR',
    });
});

afterEach(() => {
    Object.assign(CONFIG_REGRAS, CONFIG_ORIGINAL);
});

const CENARIOS: Cenario[] = [
    // ---- período vigente sozinho
    ['V01', 'vigente sem PAA, mês igual → elaborar novo', vigenciaElaboracao(),
        { VIGENTE: { ...ELABORAR, periodoUuid: 'periodo-VIGENTE', regraId: 'ELABORAR_NOVO' } }],
    ['V02', 'vigente sem PAA, mês diferente → bloqueado com a mensagem do mês', vigenciaElaboracao({ mes_elaboracao_paa: 9 }),
        { VIGENTE: bloqueio('MES_NAO_LIBERADO') }],
    ['V03', 'parâmetro de mês nulo → bloqueado', vigenciaElaboracao({ mes_elaboracao_paa: null }),
        { VIGENTE: bloqueio('MES_NAO_LIBERADO') }],
    ['V04', 'vigente em elaboração → continuar', vigenciaElaboracao({ periodos: [vigente('EM_ELABORACAO')] }),
        { VIGENTE: { ...CONTINUAR, paaUuid: 'paa-VIGENTE' } }],
    ['V05', 'vigente em elaboração continua em qualquer mês', vigenciaElaboracao({ mes_elaboracao_paa: 3, periodos: [vigente('EM_ELABORACAO')] }),
        { VIGENTE: CONTINUAR }],
    ['V06', 'vigente com Plano gerado e ata pendente → bloqueado, com link para os PAAs gerados',
        vigenciaElaboracao({ periodos: [vigente('GERADO_PARCIALMENTE')] }),
        { VIGENTE: { ...bloqueio('PAA_ATA_PENDENTE'), acaoSecundaria: { rota: '/paa-vigente-e-anteriores' } } }],
    ['V07', 'vigente GERADO → bloqueado como já elaborado', vigenciaElaboracao({ periodos: [vigente('GERADO')] }),
        { VIGENTE: bloqueio('PAA_JA_ELABORADO') }],
    ['V08', 'vigente em retificação → bloqueado como já elaborado', vigenciaElaboracao({ periodos: [vigente('EM_RETIFICACAO')] }),
        { VIGENTE: bloqueio('PAA_JA_ELABORADO') }],
    ['V09', 'sem permissão e sem PAA → bloqueado', vigenciaElaboracao({ podeEditar: false }),
        { VIGENTE: bloqueio('SEM_PERMISSAO') }],
    ['V10', 'sem permissão mas com PAA em elaboração → continuar', vigenciaElaboracao({ podeEditar: false, periodos: [vigente('EM_ELABORACAO')] }),
        { VIGENTE: CONTINUAR }],
    ['V11', 'modo de mês A_PARTIR_DE libera em mês posterior ao parametrizado', vigenciaElaboracao({ mes_elaboracao_paa: 9 }),
        { VIGENTE: ELABORAR }, { modoMesElaboracao: 'A_PARTIR_DE' }],
    ['V12', 'configuração que esconde o botão do vigente fora do mês', vigenciaElaboracao({ mes_elaboracao_paa: 9 }),
        { VIGENTE: semBotao('MES_NAO_LIBERADO') },
        { ocultaBotaoQuandoMesNaoLiberado: { ...CONFIG_REGRAS.ocultaBotaoQuandoMesNaoLiberado, VIGENTE: true } }],

    // ---- vigente e Próxima Vigência ao mesmo tempo
    ['S01', 'os dois sem PAA, mês igual → cada um com seu "Elaborar novo PAA"',
        vigenciaElaboracao({ periodos: [vigente(), proxima()] }),
        { VIGENTE: { ...ELABORAR, periodoUuid: 'periodo-VIGENTE' }, PROXIMA_VIGENCIA: { ...ELABORAR, periodoUuid: 'periodo-PROXIMA_VIGENCIA' } }],
    ['S02', 'vigente em elaboração e Próxima Vigência sem PAA → continuar o vigente e elaborar a próxima',
        vigenciaElaboracao({ periodos: [vigente('EM_ELABORACAO'), proxima()] }),
        { VIGENTE: CONTINUAR, PROXIMA_VIGENCIA: ELABORAR }],
    ['S03', 'os dois em elaboração → cada um com seu "Continuar elaboração"',
        vigenciaElaboracao({ periodos: [vigente('EM_ELABORACAO'), proxima('EM_ELABORACAO')] }),
        { VIGENTE: { ...CONTINUAR, paaUuid: 'paa-VIGENTE' }, PROXIMA_VIGENCIA: { ...CONTINUAR, paaUuid: 'paa-PROXIMA_VIGENCIA' } }],
    ['S04', 'vigente com ata pendente e próxima em elaboração → vigente bloqueado, próxima continua',
        vigenciaElaboracao({ periodos: [vigente('GERADO_PARCIALMENTE'), proxima('EM_ELABORACAO')] }),
        { VIGENTE: bloqueio('PAA_ATA_PENDENTE'), PROXIMA_VIGENCIA: CONTINUAR }],
    ['S05', 'Próxima Vigência com Plano gerado → bloqueada, com link para os PAAs gerados',
        vigenciaElaboracao({ periodos: [vigente('EM_ELABORACAO'), proxima('GERADO_PARCIALMENTE')] }),
        { VIGENTE: CONTINUAR, PROXIMA_VIGENCIA: { ...bloqueio('PAA_ATA_PENDENTE'), acaoSecundaria: { rota: '/paa-vigente-e-anteriores' } } }],
    ['S06', 'mês diferente: o botão da Próxima Vigência some, o do vigente fica desabilitado',
        vigenciaElaboracao({ mes_elaboracao_paa: 9, periodos: [vigente(), proxima()] }),
        { VIGENTE: bloqueio('MES_NAO_LIBERADO'), PROXIMA_VIGENCIA: semBotao('MES_NAO_LIBERADO') }],
    ['S07', 'mês diferente do parametrizado não impede continuar nenhuma das duas elaborações',
        vigenciaElaboracao({ mes_elaboracao_paa: 9, periodos: [vigente('EM_ELABORACAO'), proxima('EM_ELABORACAO')] }),
        { VIGENTE: CONTINUAR, PROXIMA_VIGENCIA: CONTINUAR }],
    ['S08', 'mês diferente do parametrizado: só a Próxima Vigência sem PAA fica sem botão',
        vigenciaElaboracao({ mes_elaboracao_paa: 9, periodos: [vigente('EM_ELABORACAO'), proxima()] }),
        { VIGENTE: CONTINUAR, PROXIMA_VIGENCIA: semBotao('MES_NAO_LIBERADO') }],
    ['S09', 'funcionalidade da Próxima Vigência desligada → só o cartão do vigente',
        vigenciaElaboracao({ proximaVigenciaHabilitada: false, periodos: [vigente(), proxima()] }),
        { VIGENTE: ELABORAR }],
    ['S10', 'só a Próxima Vigência cadastrada → só o cartão dela',
        vigenciaElaboracao({ periodos: [proxima()] }),
        { PROXIMA_VIGENCIA: ELABORAR }],
    ['S11', 'sem permissão: a Próxima Vigência sem PAA fica bloqueada, a em elaboração continua',
        vigenciaElaboracao({ podeEditar: false, periodos: [vigente('EM_ELABORACAO'), proxima()] }),
        { VIGENTE: CONTINUAR, PROXIMA_VIGENCIA: bloqueio('SEM_PERMISSAO') }],

    // ---- exigência parametrizável sobre o PAA vigente
    ['E01', 'exigindo plano gerado: vigente em elaboração impede iniciar a próxima',
        vigenciaElaboracao({ statusVigenteExigidosParaProximaVigencia: ['GERADO_PARCIALMENTE', 'GERADO'], periodos: [vigente('EM_ELABORACAO'), proxima()] }),
        { VIGENTE: CONTINUAR, PROXIMA_VIGENCIA: bloqueio('PAA_VIGENTE_FORA_DA_SITUACAO_EXIGIDA') }],
    ['E02', 'exigindo plano gerado: vigente com ata pendente libera a próxima',
        vigenciaElaboracao({ statusVigenteExigidosParaProximaVigencia: ['GERADO_PARCIALMENTE', 'GERADO'], periodos: [vigente('GERADO_PARCIALMENTE'), proxima()] }),
        { VIGENTE: bloqueio('PAA_ATA_PENDENTE'), PROXIMA_VIGENCIA: ELABORAR }],
    ['E03', 'exigindo plano gerado: vigente sem PAA impede iniciar a próxima',
        vigenciaElaboracao({ statusVigenteExigidosParaProximaVigencia: ['GERADO'], periodos: [vigente(), proxima()] }),
        { VIGENTE: ELABORAR, PROXIMA_VIGENCIA: bloqueio('PAA_VIGENTE_FORA_DA_SITUACAO_EXIGIDA') }],
    ['E04', 'a exigência vale só para iniciar: próxima já em elaboração continua',
        vigenciaElaboracao({ statusVigenteExigidosParaProximaVigencia: ['GERADO'], periodos: [vigente('EM_ELABORACAO'), proxima('EM_ELABORACAO')] }),
        { VIGENTE: CONTINUAR, PROXIMA_VIGENCIA: CONTINUAR }],
    ['E05', 'sem período vigente e exigindo plano gerado → próxima bloqueada',
        vigenciaElaboracao({ statusVigenteExigidosParaProximaVigencia: ['GERADO'], periodos: [proxima()] }),
        { PROXIMA_VIGENCIA: bloqueio('PAA_VIGENTE_FORA_DA_SITUACAO_EXIGIDA') }],

    // ---- trava de períodos sobrepostos
    ['T01', 'períodos sobrepostos → todos os botões bloqueados, até o de continuar',
        vigenciaElaboracao({ periodosSobrepostos: true, periodos: [vigente('EM_ELABORACAO'), proxima()] }),
        { VIGENTE: bloqueio('PERIODOS_SOBREPOSTOS'), PROXIMA_VIGENCIA: bloqueio('PERIODOS_SOBREPOSTOS') }],

    // ---- PAA de período já encerrado
    ['P01', 'encerrado em elaboração + PERMITIR_CONTINUAR → cartão do encerrado com "Continuar"',
        vigenciaElaboracao({ periodos: [encerrado('EM_ELABORACAO'), vigente()] }),
        { ENCERRADO: { ...CONTINUAR, paaUuid: 'paa-ENCERRADO' }, VIGENTE: ELABORAR }],
    ['P02', 'encerrado em elaboração + IGNORAR → sem cartão do encerrado',
        vigenciaElaboracao({ periodos: [encerrado('EM_ELABORACAO'), vigente()] }),
        { VIGENTE: ELABORAR }, { politicaPeriodoEncerrado: 'IGNORAR' }],
    ['P03', 'encerrado em elaboração + BLOQUEAR_TUDO → cartão bloqueado',
        vigenciaElaboracao({ periodos: [encerrado('EM_ELABORACAO'), vigente()] }),
        { ENCERRADO: bloqueio('PAA_PERIODO_ENCERRADO'), VIGENTE: ELABORAR }, { politicaPeriodoEncerrado: 'BLOQUEAR_TUDO' }],
    ['P04', 'carência vencida + política após carência IGNORAR → sem cartão do encerrado',
        vigenciaElaboracao({ periodos: [encerrado('EM_ELABORACAO', '2026-08-31'), vigente()] }),
        { VIGENTE: ELABORAR }, { carenciaPeriodoEncerrado: { unidade: 'DIAS', quantidade: 30 } }],
    ['P05', 'dentro da carência → continua o PAA do encerrado',
        vigenciaElaboracao({ periodos: [encerrado('EM_ELABORACAO', '2026-10-15'), vigente()] }),
        { ENCERRADO: CONTINUAR, VIGENTE: ELABORAR }, { carenciaPeriodoEncerrado: { unidade: 'DIAS', quantidade: 30 } }],
    ['P05a', 'carência em meses vencida → sem cartão do encerrado',
        vigenciaElaboracao({ periodos: [encerrado('EM_ELABORACAO', '2026-07-31'), vigente()] }),
        { VIGENTE: ELABORAR }, { carenciaPeriodoEncerrado: { unidade: 'MESES', quantidade: 2 } }],
    ['P05b', 'dentro da carência em meses → continua o PAA do encerrado',
        vigenciaElaboracao({ periodos: [encerrado('EM_ELABORACAO', '2026-08-31'), vigente()] }),
        { ENCERRADO: CONTINUAR, VIGENTE: ELABORAR }, { carenciaPeriodoEncerrado: { unidade: 'MESES', quantidade: 2 } }],
    ['P05c', 'último dia da carência em meses ainda permite continuar',
        vigenciaElaboracao({ hoje: '2026-10-31', periodos: [encerrado('EM_ELABORACAO', '2026-08-31'), vigente()] }),
        { ENCERRADO: CONTINUAR, VIGENTE: ELABORAR }, { carenciaPeriodoEncerrado: { unidade: 'MESES', quantidade: 2 } }],
    ['P05d', 'um dia após a carência em meses → carência vencida',
        vigenciaElaboracao({ hoje: '2026-11-01', mes_elaboracao_paa: 11, periodos: [encerrado('EM_ELABORACAO', '2026-08-31'), vigente()] }),
        { VIGENTE: ELABORAR }, { carenciaPeriodoEncerrado: { unidade: 'MESES', quantidade: 2 } }],
    ['P05e', 'carência vencida + BLOQUEAR_TUDO após a carência → cartão bloqueado',
        vigenciaElaboracao({ periodos: [encerrado('EM_ELABORACAO', '2026-07-31'), vigente()] }),
        { ENCERRADO: bloqueio('PAA_PERIODO_ENCERRADO'), VIGENTE: ELABORAR },
        { carenciaPeriodoEncerrado: { unidade: 'MESES', quantidade: 2 }, politicaAposCarencia: 'BLOQUEAR_TUDO' }],
    ['P06', 'encerrado com Plano gerado não ganha cartão', vigenciaElaboracao({ periodos: [encerrado('GERADO_PARCIALMENTE'), vigente()] }),
        { VIGENTE: ELABORAR }],
    ['P07', 'período futuro (depois da Próxima Vigência) não ganha cartão',
        vigenciaElaboracao({ periodos: [vigente(), periodo('FUTURO')] }),
        { VIGENTE: ELABORAR }],
];

describe.each(CENARIOS)('%s - %s', (_id, _descricao, ctx, esperado, config) => {
    it('calcula o botão de cada cartão', () => {
        Object.assign(CONFIG_REGRAS, config);

        const calculado = botoes(ctx);

        expect(Object.keys(calculado).sort()).toEqual(Object.keys(esperado).sort());
        Object.entries(esperado).forEach(([vigencia, parcial]) => {
            expect(calculado[vigencia]).toMatchObject(parcial);
        });
    });
});

describe('estado geral da tela', () => {
    it('sem nenhum período a exibir, informa que não há período cadastrado', () => {
        const estado = calcularEstadoElaboracao(vigenciaElaboracao({ periodos: [] }));

        expect(estado.secoesPeriodos).toEqual([]);
        expect(estado.mensagem).toBe('Não há período de PAA cadastrado para a data atual.');
    });

    it('Próxima Vigência cadastrada com a funcionalidade desligada e sem vigente → avisa que não há período', () => {
        const estado = calcularEstadoElaboracao(vigenciaElaboracao({ proximaVigenciaHabilitada: false, periodos: [proxima()] }));

        expect(estado.secoesPeriodos).toEqual([]);
        expect(estado.mensagem).not.toBe('');
    });

    it('mantém a ordem dos períodos e os dados do cartão', () => {
        const estado = calcularEstadoElaboracao(vigenciaElaboracao({ periodos: [encerrado('EM_ELABORACAO'), vigente(), proxima()] }));

        expect(estado.secoesPeriodos.map((secao) => secao.vigencia)).toEqual(['ENCERRADO', 'VIGENTE', 'PROXIMA_VIGENCIA']);
        expect(estado.secoesPeriodos[1]).toMatchObject({
            periodoUuid: 'periodo-VIGENTE', referencia: 'VIGENTE', dataInicial: '2026-05-01', dataFinal: '2027-04-30',
        });
        expect(estado.mensagem).toBe('');
    });

    it('os cartões de períodos diferentes são independentes: mudar um PAA não altera o botão do outro', () => {
        const antes = botoes(vigenciaElaboracao({ periodos: [vigente('EM_ELABORACAO'), proxima()] }));
        const depois = botoes(vigenciaElaboracao({ periodos: [vigente('GERADO_PARCIALMENTE'), proxima()] }));

        expect(depois.PROXIMA_VIGENCIA).toEqual(antes.PROXIMA_VIGENCIA);
        expect(depois.VIGENTE).not.toEqual(antes.VIGENTE);
    });
});

import { CONFIG_REGRAS } from '../config';
import {
    dataLimiteDaCarencia, mesLiberadoParaElaboracao, somarMeses, paaVigenteAtendeExigenciaDaProximaVigencia, periodoComAtaPendente,
    periodoComPaaEmElaboracao, periodoComPaaGerado, politicaPeriodoEncerrado,
} from '../condicoes';
import type { VigenciaElaboracao, PeriodoElaboracao, VigenciaPeriodo } from '../types';

const periodo = (vigencia: VigenciaPeriodo, situacao?: string, data_final = '2027-04-30'): PeriodoElaboracao => ({
    uuid: `p-${vigencia}`, referencia: vigencia, data_inicial: '2026-05-01', data_final, vigencia,
    paa: situacao ? { uuid: 'paa', status: 'EM_ELABORACAO', status_andamento: situacao as never } : null,
});

const vigenciaElaboracao = (sobrescrever: Partial<VigenciaElaboracao> = {}): VigenciaElaboracao => ({
    hoje: '2026-10-28', mes_elaboracao_paa: 10, periodos: [], periodosSobrepostos: false,
    podeEditar: true, proximaVigenciaHabilitada: true, statusVigenteExigidosParaProximaVigencia: null,
    ...sobrescrever,
});

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

describe('mesLiberadoParaElaboracao', () => {
    it.each([
        ['IGUAL', 10, 10, true],
        ['IGUAL', 9, 10, false],
        ['IGUAL', 11, 10, false],
        ['A_PARTIR_DE', 9, 10, true],
        ['A_PARTIR_DE', 10, 10, true],
        ['A_PARTIR_DE', 11, 10, false],
    ] as const)('modo %s com parâmetro %i e mês atual %i → %s', (modo, parametro, mesAtual, esperado) => {
        CONFIG_REGRAS.modoMesElaboracao = modo;
        const hoje = `2026-${String(mesAtual).padStart(2, '0')}-15`;

        expect(mesLiberadoParaElaboracao(vigenciaElaboracao({ mes_elaboracao_paa: parametro, hoje }))).toBe(esperado);
    });

    it('não libera sem parâmetro', () => {
        expect(mesLiberadoParaElaboracao(vigenciaElaboracao({ mes_elaboracao_paa: null }))).toBe(false);
    });
});

describe('situação do PAA do período', () => {
    it('distingue sem PAA, em elaboração, ata pendente e gerado', () => {
        expect(periodoComPaaEmElaboracao(periodo('VIGENTE', 'EM_ELABORACAO'))).toBe(true);
        expect(periodoComPaaGerado(periodo('VIGENTE', 'EM_ELABORACAO'))).toBe(false);
        expect(periodoComAtaPendente(periodo('VIGENTE', 'GERADO_PARCIALMENTE'))).toBe(true);
        expect(periodoComPaaGerado(periodo('VIGENTE', 'GERADO_PARCIALMENTE'))).toBe(true);
        expect(periodoComPaaGerado(periodo('VIGENTE', 'GERADO'))).toBe(true);
        expect(periodoComPaaGerado(periodo('VIGENTE'))).toBe(false);
        expect(periodoComPaaEmElaboracao(periodo('VIGENTE'))).toBe(false);
    });
});

describe('paaVigenteAtendeExigenciaDaProximaVigencia', () => {
    it('sem exigência, sempre atende (inclusive sem vigente ou sem PAA)', () => {
        expect(paaVigenteAtendeExigenciaDaProximaVigencia(vigenciaElaboracao())).toBe(true);
    });

    it.each([
        ['EM_ELABORACAO', false],
        ['GERADO_PARCIALMENTE', true],
        ['GERADO', true],
        [undefined, false],
    ])('exigindo gerado parcialmente ou gerado, vigente %s → %s', (situacao, esperado) => {
        const ctx = vigenciaElaboracao({
            statusVigenteExigidosParaProximaVigencia: ['GERADO_PARCIALMENTE', 'GERADO'],
            periodos: [periodo('VIGENTE', situacao)],
        });

        expect(paaVigenteAtendeExigenciaDaProximaVigencia(ctx)).toBe(esperado);
    });

    it('exigindo situação sem período vigente, não atende', () => {
        const ctx = vigenciaElaboracao({ statusVigenteExigidosParaProximaVigencia: ['GERADO'] });

        expect(paaVigenteAtendeExigenciaDaProximaVigencia(ctx)).toBe(false);
    });
});

describe('politicaPeriodoEncerrado', () => {
    it('sem carência mantém a política configurada', () => {
        expect(politicaPeriodoEncerrado(vigenciaElaboracao(), periodo('ENCERRADO', 'EM_ELABORACAO', '2025-12-31')))
            .toBe('PERMITIR_CONTINUAR');
    });

    it('após a carência em dias aplica a política seguinte', () => {
        CONFIG_REGRAS.carenciaPeriodoEncerrado = { unidade: 'DIAS', quantidade: 30 };

        expect(politicaPeriodoEncerrado(vigenciaElaboracao(), periodo('ENCERRADO', 'EM_ELABORACAO', '2026-08-31')))
            .toBe('IGNORAR');
        expect(politicaPeriodoEncerrado(vigenciaElaboracao(), periodo('ENCERRADO', 'EM_ELABORACAO', '2026-10-15')))
            .toBe('PERMITIR_CONTINUAR');
    });

    it('após a carência em meses aplica a política seguinte', () => {
        CONFIG_REGRAS.carenciaPeriodoEncerrado = { unidade: 'MESES', quantidade: 2 };

        expect(politicaPeriodoEncerrado(vigenciaElaboracao(), periodo('ENCERRADO', 'EM_ELABORACAO', '2026-07-31')))
            .toBe('IGNORAR');
        expect(politicaPeriodoEncerrado(vigenciaElaboracao(), periodo('ENCERRADO', 'EM_ELABORACAO', '2026-08-31')))
            .toBe('PERMITIR_CONTINUAR');
    });

    it('usa a política configurada após a carência', () => {
        CONFIG_REGRAS.carenciaPeriodoEncerrado = { unidade: 'MESES', quantidade: 1 };
        CONFIG_REGRAS.politicaAposCarencia = 'BLOQUEAR_TUDO';

        expect(politicaPeriodoEncerrado(vigenciaElaboracao(), periodo('ENCERRADO', 'EM_ELABORACAO', '2026-06-30')))
            .toBe('BLOQUEAR_TUDO');
    });

    it('a carência não altera outras políticas', () => {
        CONFIG_REGRAS.carenciaPeriodoEncerrado = { unidade: 'MESES', quantidade: 1 };
        CONFIG_REGRAS.politicaPeriodoEncerrado = 'BLOQUEAR_TUDO';

        expect(politicaPeriodoEncerrado(vigenciaElaboracao(), periodo('ENCERRADO', 'EM_ELABORACAO', '2025-01-31')))
            .toBe('BLOQUEAR_TUDO');
    });
});

describe('somarMeses', () => {
    it.each([
        ['2026-08-31', 2, '2026-10-31'],
        ['2026-12-31', 2, '2027-02-28'],
        ['2027-12-31', 2, '2028-02-29'],
        ['2026-01-31', 1, '2026-02-28'],
        ['2026-11-30', 3, '2027-02-28'],
        ['2026-05-15', 0, '2026-05-15'],
        ['2026-05-15', 12, '2027-05-15'],
    ])('%s + %i meses = %s', (data, meses, esperado) => {
        expect(somarMeses(data, meses)).toBe(esperado);
    });
});

describe('dataLimiteDaCarencia', () => {
    it('sem quantidade não há limite', () => {
        expect(dataLimiteDaCarencia(periodo('ENCERRADO', 'EM_ELABORACAO', '2026-08-31'))).toBeNull();
    });

    it('conta meses de calendário', () => {
        CONFIG_REGRAS.carenciaPeriodoEncerrado = { unidade: 'MESES', quantidade: 6 };

        expect(dataLimiteDaCarencia(periodo('ENCERRADO', 'EM_ELABORACAO', '2026-12-31'))).toBe('2027-06-30');
    });

    it('conta dias corridos', () => {
        CONFIG_REGRAS.carenciaPeriodoEncerrado = { unidade: 'DIAS', quantidade: 30 };

        expect(dataLimiteDaCarencia(periodo('ENCERRADO', 'EM_ELABORACAO', '2026-08-31'))).toBe('2026-09-30');
    });
});

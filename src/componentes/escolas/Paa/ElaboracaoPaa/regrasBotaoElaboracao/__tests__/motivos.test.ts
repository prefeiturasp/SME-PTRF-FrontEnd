import { CONFIG_REGRAS } from '../config';
import { ACAO_SECUNDARIA_PASS_GERADOS, MENSAGENS, MENSAGEM_SEM_PERIODO } from '../motivos';
import type { VigenciaElaboracao, PeriodoElaboracao } from '../types';

const periodo: PeriodoElaboracao = {
    uuid: 'p-1', referencia: '2026', data_inicial: '2026-05-01', data_final: '2027-04-30',
    vigencia: 'VIGENTE', paa: null,
};

const vigencia = (mes: number | null): VigenciaElaboracao => ({
    hoje: '2026-10-28', mes_elaboracao_paa: mes, periodos: [], periodosSobrepostos: false,
    podeEditar: true, proximaVigenciaHabilitada: true, statusVigenteExigidosParaProximaVigencia: null,
});

describe('MENSAGENS', () => {
    it('períodos sobrepostos orienta procurar a SME', () => {
        expect(MENSAGENS.PERIODOS_SOBREPOSTOS(vigencia(10), periodo)).toContain('sobrepostos');
    });

    it('período encerrado cita a referência do período', () => {
        expect(MENSAGENS.PAA_PERIODO_ENCERRADO(vigencia(10), periodo)).toContain('2026');
    });

    it('ata pendente cita a referência e leva a "PAA vigente e anteriores"', () => {
        const mensagem = MENSAGENS.PAA_ATA_PENDENTE(vigencia(10), periodo);

        expect(mensagem).toContain('2026');
        expect(mensagem).toContain('PAA vigente e anteriores');
    });

    it('PAA já elaborado cita a referência', () => {
        expect(MENSAGENS.PAA_JA_ELABORADO(vigencia(10), periodo)).toContain('2026');
    });

    it('sem permissão', () => {
        expect(MENSAGENS.SEM_PERMISSAO(vigencia(10), periodo)).toContain('permissão');
    });

    it('mês não liberado cita o nome do mês parametrizado', () => {
        expect(MENSAGENS.MES_NAO_LIBERADO(vigencia(3), periodo)).toContain('março');
        expect(MENSAGENS.MES_NAO_LIBERADO(vigencia(12), periodo)).toContain('dezembro');
    });

    it('mês não parametrizado avisa que falta a parametrização', () => {
        expect(MENSAGENS.MES_NAO_LIBERADO(vigencia(null), periodo)).toContain('não foi parametrizado');
    });

    it('PAA vigente fora da situação exigida', () => {
        expect(MENSAGENS.PAA_VIGENTE_FORA_DA_SITUACAO_EXIGIDA(vigencia(10), periodo)).toContain('PAA vigente');
    });
});

describe('textos fixos', () => {
    it('aviso de que não há período cadastrado', () => {
        expect(MENSAGEM_SEM_PERIODO).toContain('Não há período');
    });

    it('ação secundária leva à tela dos PAAs gerados, conforme a configuração', () => {
        expect(ACAO_SECUNDARIA_PASS_GERADOS).toEqual({
            rotulo: CONFIG_REGRAS.rotulos.irParaPaasGerados,
            rota: CONFIG_REGRAS.rotaPaasGerados,
        });
    });
});

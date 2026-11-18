// construtores do botão (continuar, elaborar, bloqueado, sem botão)
import { CONFIG_REGRAS } from './config';
import { ACAO_SECUNDARIA_PASS_GERADOS, MENSAGENS } from './motivos';
import type { AcaoSecundaria, VigenciaElaboracao, MotivoBloqueio, PeriodoElaboracao, ResultadoRegra } from './types';

const base = {
    visivel: true,
    habilitado: false,
    motivo: null,
    mensagem: '',
    periodoUuid: null,
    paaUuid: null,
    acaoSecundaria: null,
};

// Botão "Continuar elaboração" habilitado para o PAA do período
export const continuar = (periodo: PeriodoElaboracao): ResultadoRegra => ({
   ...base,
   acao: 'CONTINUAR',
   habilitado: true,
   rotulo: CONFIG_REGRAS.rotulos.continuar,
   paaUuid: periodo.paa!.uuid,
});

// Botão "Elaborar novo PAA" habilitado para criar o PAA do período
export const elaborarNovo = (periodo: PeriodoElaboracao): ResultadoRegra => ({
   ...base,
   acao: 'ELABORAR_NOVO',
   habilitado: true,
   rotulo: CONFIG_REGRAS.rotulos.elaborarNovo,
   periodoUuid: periodo.uuid,
});

// Botão desabilitado, com a mensagem do motivo
export const bloqueado = (
    motivo: MotivoBloqueio,
    vigencia: VigenciaElaboracao,
    periodo: PeriodoElaboracao,
    acaoSecundaria: AcaoSecundaria | null = null): ResultadoRegra => ({

    ...base,
    acao: periodo.paa ? 'CONTINUAR' : 'ELABORAR_NOVO',
    habilitado: false,
    rotulo: periodo.paa ? CONFIG_REGRAS.rotulos.continuar : CONFIG_REGRAS.rotulos.elaborarNovo,
    motivo,
    mensagem: MENSAGENS[motivo](vigencia, periodo),
    acaoSecundaria,
});

// Sem botão: A seção mostra só o período e a mensagem do motivo
export const semBotao = (
    motivo: MotivoBloqueio,
    vigencia: VigenciaElaboracao,
    periodo: PeriodoElaboracao): ResultadoRegra => ({
    ...bloqueado(motivo, vigencia, periodo),
    visivel: false,
});

export const bloqueadoComAcessoAosPaasGerados = (
    motivo: MotivoBloqueio, vigencia: VigenciaElaboracao, periodo: PeriodoElaboracao
): ResultadoRegra => (
    bloqueado(motivo, vigencia, periodo, ACAO_SECUNDARIA_PASS_GERADOS)
)
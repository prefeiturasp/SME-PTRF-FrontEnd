// textos de bloqueio, um por motivo
import { CONFIG_REGRAS } from './config';
import type { VigenciaElaboracao, MotivoBloqueio, PeriodoElaboracao } from './types';
import { NOME_MES } from './../../../../../utils/shared/meses';

const nomeDoMesParametrizado = (vigencia: VigenciaElaboracao): string | null =>
    vigencia.mes_elaboracao_paa ? NOME_MES[vigencia.mes_elaboracao_paa - 1] : null;

const ACESSO_AOS_PAAS_GERADOS = 'Acesse-o em "PAA vigente e anteriores".';

// Textos de bloqueio, um por motivo
export const MENSAGENS: Record<MotivoBloqueio, (vigencia: VigenciaElaboracao, periodo: PeriodoElaboracao) => string> = {
    PERIODOS_SOBREPOSTOS: () =>
        'Há períodos de PAA sobrepostos. Procure a SME para regularizar o cadastro de períodos.',
    PAA_PERIODO_ENCERRADO: (_, periodo) =>
        `O período ${periodo.referencia} foi encerrado e o PAA não foi concluído. Procure SME para regularizar`,
    PAA_ATA_PENDENTE: (_, periodo) =>
        `O Plano Anual do período ${periodo.referencia} já foi gerado e aguarda a ata. ${ACESSO_AOS_PAAS_GERADOS}`,
    PAA_JA_ELABORADO: (_, periodo) =>
        `O Plano Anual do período ${periodo.referencia} foi elaborado.`,
    SEM_PERMISSAO: () => 'Você não tem permissão para iniciar a elaboração do PAA.',
    MES_NAO_LIBERADO: (vigencia) => nomeDoMesParametrizado(vigencia)
        ? `A elaboração do PAA só pode ser iniciada a partir do mês de ${nomeDoMesParametrizado(vigencia)}.`
        : 'O mês de elaboração do PAA não foi parametrizado.',
    PAA_VIGENTE_FORA_DA_SITUACAO_EXIGIDA: () =>
        'O PAA vigente ainda não está na situação exigida para iniciar a próxima vigência.',
};

export const MENSAGEM_SEM_PERIODO = 'Não há período de PAA cadastrado para a data atual.';

export const ACAO_SECUNDARIA_PASS_GERADOS = {
    rotulo: CONFIG_REGRAS.rotulos.irParaPaasGerados,
    rota: CONFIG_REGRAS.rotaPaasGerados,
}

// perguntas nomeadas sobre a vigência e o período
import { CONFIG_REGRAS, PoliticaPeriodoEncerrado } from './config';
import type { VigenciaElaboracao, PeriodoElaboracao } from './types';

const MS_POR_DIA = 86_400_000;

const paraIso = (data: Date): string => data.toISOString().slice(0, 10);

// Soma meses de calendário a uma data ISO; se o dia não existir no mês de destino, usa o último dia dele
export const somarMeses = (dataIso: string, meses: number): string => {
    const [ano, mes, dia] = dataIso.split('-').map(Number);
    const ultimoDiaDoDestino = new Date(Date.UTC(ano, mes - 1 + meses + 1, 0)).getUTCDate();
    return paraIso(new Date(Date.UTC(ano, mes - 1 + meses, Math.min(dia, ultimoDiaDoDestino))));
};

const somarDias = (dataIso: string, dias: number): string =>
    paraIso(new Date(Date.parse(dataIso) + dias * MS_POR_DIA));

// Último dia em que ainda se pode continuar o PAA de um período encerrado (null = sem limite)
export const dataLimiteDaCarencia = (periodo: PeriodoElaboracao): string | null => {
    const { unidade, quantidade } = CONFIG_REGRAS.carenciaPeriodoEncerrado;
    if (quantidade === null) return null;

    return unidade === 'MESES'
        ? somarMeses(periodo.data_final, quantidade)
        : somarDias(periodo.data_final, quantidade);
};

export const mesAtual = (vigencia: VigenciaElaboracao): number => Number(vigencia.hoje.slice(5, 7));

// O mês atual permite iniciar a elaboração, conforme o parâmetro no admin
export const mesLiberadoParaElaboracao = (vigencia: VigenciaElaboracao): boolean => {
    const mesParametro = vigencia.mes_elaboracao_paa;
    if (mesParametro == null) return false;
    
    return CONFIG_REGRAS.modoMesElaboracao === 'IGUAL'
        ? mesAtual(vigencia) === mesParametro
        : mesAtual(vigencia) >= mesParametro;
}

// O período tem PAA em elabnoracao (Sem Plano Gerado)?
export const periodoComPaaEmElaboracao = (periodo: PeriodoElaboracao): boolean =>
    periodo.paa?.status_andamento === 'EM_ELABORACAO';

// O período tem PAA com Plano gerado?
export const periodoComPaaGerado = (periodo: PeriodoElaboracao): boolean =>
    !!periodo.paa && !periodoComPaaEmElaboracao(periodo);

export const periodoComAtaPendente = (periodo: PeriodoElaboracao): boolean =>
    periodo.paa?.status_andamento === 'GERADO_PARCIALMENTE';

export const botaoSomeQuandoMesNaoLiberado = (periodo: PeriodoElaboracao): boolean =>
    // VIGENTE, PROXIMA_VIGENCIA, ENCERRADO, FUTURO
    CONFIG_REGRAS.ocultaBotaoQuandoMesNaoLiberado[periodo.vigencia];

export const periodoVigente = (vigencia: VigenciaElaboracao): PeriodoElaboracao | null =>
    vigencia.periodos.find(periodo => periodo.vigencia === 'VIGENTE') || null;

// O PAA vigente está na situação exigida para a associação iniciar a Próxima Vigência?
export const paaVigenteAtendeExigenciaDaProximaVigencia = (vigencia: VigenciaElaboracao): boolean => {
    const exigidos = vigencia.statusVigenteExigidosParaProximaVigencia;
    if (exigidos == null) return true;

    const situacao = periodoVigente(vigencia)?.paa?.status_andamento;
    return !!situacao && exigidos.includes(situacao);
}

// Política para o período encerrado, considerando a carência
export const politicaPeriodoEncerrado = (
    vigencia: VigenciaElaboracao, periodo: PeriodoElaboracao): PoliticaPeriodoEncerrado => {

    const politica = CONFIG_REGRAS.politicaPeriodoEncerrado;
    const limite = dataLimiteDaCarencia(periodo);
    const dentroDaCarencia = limite === null || vigencia.hoje <= limite;

    const seExcedeuCarencia = politica === 'PERMITIR_CONTINUAR' && !dentroDaCarencia

    return seExcedeuCarencia ? CONFIG_REGRAS.politicaAposCarencia : politica;
}

// junta tudo
/* calcularEstadoElaboracao(vigencia)
    → periodosExibidos escolhe os períodos
        → para cada um, calcularBotaoDoPeriodo percorre REGRAS e usa a
          primeira cuja condição aplica(vigencia, periodo) é verdadeira
            → o resultado vem de resultados.ts.
Nada decide por data no frontend: a vigência de cada período vem pronta do backend.
*/
import { MENSAGEM_SEM_PERIODO } from "./motivos";
import { periodosExibidos } from "./periodosExibidos";
import { REGRAS } from "./regras";
import type {
    SecaoPeriodoElaboracao,
    VigenciaElaboracao,
    EstadoBotao,
    EstadoElaboracao,
    PeriodoElaboracao } from "./types";

export const calcularBotaoDoPeriodo = (vigencia: VigenciaElaboracao, periodo: PeriodoElaboracao): EstadoBotao => {
    const regra = REGRAS.find( candidata => candidata.aplica(vigencia, periodo))!;
    return { ...regra.resultado(vigencia, periodo), regraId: regra.id };
};

const montarSecaoPeriodo = (vigencia: VigenciaElaboracao, periodo: PeriodoElaboracao): SecaoPeriodoElaboracao => ({
    periodoUuid: periodo.uuid,
    referencia: periodo.referencia,
    vigencia: periodo.vigencia,
    dataInicial: periodo.data_inicial,
    dataFinal: periodo.data_final,
    botao: calcularBotaoDoPeriodo(vigencia, periodo),
});

export const calcularEstadoElaboracao = (vigencia: VigenciaElaboracao): EstadoElaboracao => {
    const secoes = periodosExibidos(vigencia).map( periodo => montarSecaoPeriodo(vigencia, periodo) );
    return { secoesPeriodos: secoes, mensagem: secoes.length ? '' : MENSAGEM_SEM_PERIODO };
}
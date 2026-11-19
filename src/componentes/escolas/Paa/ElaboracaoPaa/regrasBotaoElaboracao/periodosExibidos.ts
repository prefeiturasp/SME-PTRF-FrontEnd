import { periodoComPaaEmElaboracao, politicaPeriodoEncerrado } from './condicoes';
import type { VigenciaElaboracao, PeriodoElaboracao } from './types';

//  quais períodos ganham seção na tela
// o vigente, a próima vigência( se habilitada) e encerrados pendentes (PAA não concluído)
export const periodosExibidos = (vigencia: VigenciaElaboracao): PeriodoElaboracao[] =>
    vigencia.periodos.filter( periodo => {
        switch (periodo.vigencia) {
            case 'VIGENTE':
                return true;
            case 'PROXIMA_VIGENCIA':
                return vigencia.proximaVigenciaHabilitada;
            case 'ENCERRADO':
                return periodoComPaaEmElaboracao(periodo)
                    && politicaPeriodoEncerrado(vigencia, periodo) !== 'IGNORAR';
            default:
                return false;
        }
    });

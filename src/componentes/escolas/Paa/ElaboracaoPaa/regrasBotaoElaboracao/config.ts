// parâmetros de negócio (mudar um requisito começa aqui)
import { VigenciaPeriodo } from './types';

export type PoliticaPeriodoEncerrado = 'PERMITIR_CONTINUAR' | 'IGNORAR' | 'BLOQUEAR_TUDO';

export type UnidadeCarencia = 'DIAS' | 'MESES';

type PorVigencia<T> = Record<VigenciaPeriodo, T>;

export const CONFIG_REGRAS = {
    // 'IGUAL': mês atual igual ao mês parametrizado
    // 'A_PARTIR_DE': mês atual maior ou igual ao mês parametrizado
    modoMesElaboracao: 'IGUAL' as 'IGUAL' | 'A_PARTIR_DE',
    // modoMesElaboracao: 'A_PARTIR_DE' as 'A_PARTIR_DE' | 'IGUAL',

    // o mês parametrizado vale apenas para iniciar ("Elaborar novo PAA");
    // continuar uma elaoração não depende do mês

    // Mês não liberado: o obtão some (true) ou fica desabilitado com a mensagem (false)
    ocultaBotaoQuandoMesNaoLiberado: {
        VIGENTE: false,
        PROXIMA_VIGENCIA: true,
        ENCERRADO: false,
        FUTURO: false,
    } as PorVigencia<boolean>,

    // o que fazer com PAA em elaboração já encerrado
    politicaPeriodoEncerrado: 'PERMITIR_CONTINUAR' as PoliticaPeriodoEncerrado,

    // Prazo após o fim do período em que ainda se permite continuar. `quantidade: null` = sem limite.
    // 'MESES' conta meses de calendário (fim em 31/12 + 2 meses = 28/02 ou 29/02); 'DIAS' conta dias corridos.
    carenciaPeriodoEncerrado: {
        unidade: 'MESES' as UnidadeCarencia,
        quantidade: 1 as number | null,
    },

    // Política aplicada depois de venciida a carência
    // politicaAposCarencia: 'IGNORAR' as 'IGNORAR' | 'BLOQUEAR_TUDO',
    politicaAposCarencia: 'BLOQUEAR_TUDO' as 'BLOQUEAR_TUDO' | 'IGNORAR',

    rotulos: {
        elaborarNovo: 'Elaborar novo PAA',
        continuar: 'Continuar elaboração',
        irParaPaasGerados: 'Ir para PAA vigente e anteriores',
    },

    rotaPaasGerados: '/paa-vigente-e-anteriores',

};

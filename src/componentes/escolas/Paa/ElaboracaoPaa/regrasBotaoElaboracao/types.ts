// Enums do status de andamento do PAA no backend
export type StatusAndamentoPaa =
    | 'NAO_INICIADO'
    | 'EM_ELABORACAO'
    | 'GERADO_PARCIALMENTE'
    | 'EM_RETIFICACAO'
    | 'GERADO'
    | 'FORA_FLUXO';

// Classificação da vigência do período
export type VigenciaPeriodo =
    | 'VIGENTE'
    | 'PROXIMA_VIGENCIA'
    | 'ENCERRADO'
    | 'FUTURO';

export interface PaaResumo {
    uuid: string;
    status: string;
    status_andamento: StatusAndamentoPaa;
}

export interface PeriodoElaboracao {
    uuid: string;
    referencia: string;
    data_inicial: string;
    data_final: string;
    vigencia: VigenciaPeriodo;
    paa: PaaResumo | null;
}

// Valores a serem utilizados como critérios de decisão para o botão de elaboração
export interface VigenciaElaboracao {
    hoje: string;
    mes_elaboracao_paa: number | null;
    periodos: PeriodoElaboracao[];
    periodosSobrepostos: boolean;
    podeEditar: boolean;
    proximaVigenciaHabilitada: boolean;
    // Situações que o PAA vigente deve ter para iniciar a Próxima Vigência;
    // O null(Retornado como None no backend) representa sem exigência de status
    statusVigenteExigidosParaProximaVigencia: StatusAndamentoPaa[] | null;
}

export type AcaoBotao = 'ELABORAR_NOVO' | 'CONTINUAR';

export type MotivoBloqueio =
    | 'PERIODOS_SOBREPOSTOS'
    | 'PAA_PERIODO_ENCERRADO'
    | 'PAA_ATA_PENDENTE'
    | 'PAA_JA_ELABORADO'
    | 'SEM_PERMISSAO'
    | 'MES_NAO_LIBERADO'
    | 'PAA_VIGENTE_FORA_DA_SITUACAO_EXIGIDA';

export interface AcaoSecundaria {
    rotulo: string;
    rota: string;
}

export interface EstadoBotao {
    acao: AcaoBotao;
    visivel: boolean;
    habilitado: boolean;
    rotulo: string;
    motivo: MotivoBloqueio | null;
    mensagem: string;
    periodoUuid: string | null;  // Período do PAA a criar
    paaUuid: string | null; // PAA a continuar
    acaoSecundaria: AcaoSecundaria | null;
    regraId: string;
}

// Um período exibido na tela, com o botão segundo sua própria regra de eibição
export interface SecaoPeriodoElaboracao {
    periodoUuid: string;
    referencia: string;
    vigencia: VigenciaPeriodo;
    dataInicial: string;
    dataFinal: string;
    botao: EstadoBotao;
}

export interface EstadoElaboracao {
    secoesPeriodos: SecaoPeriodoElaboracao[];
    mensagem: string;
}

export type ResultadoRegra = Omit<EstadoBotao, 'regraId'>;

export interface Regra {
    id: string;
    descricao: string;
    aplica: (vigencia: VigenciaElaboracao, periodo: PeriodoElaboracao) => boolean;
    resultado: (vigencia: VigenciaElaboracao, periodo: PeriodoElaboracao) => ResultadoRegra;
}
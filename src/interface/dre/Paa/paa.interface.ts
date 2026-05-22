export interface IFiltrosPaa {
    periodo: string[];
    unidade: string;
    tipo_unidade: string;
    status: string[];
}

export interface IParamsUseListaPaa {
    uuidRecurso?: string;
    filtros: IFiltrosPaa;
    pagina: number;
}

export interface IPeriodoPaa {
    uuid: string;
    id: number;
    referencia: string;
    data_inicial: string;
    data_final: string;
    ano_inicial_final: string;
}

export interface IUnidadePaa {
    uuid: string;
    codigo_eol: string;
    nome: string;
    tipo_unidade: string;
    unidade_educacional: string;
}

export interface ITipoUnidadePaa {
    id: string;
    nome: string;
}

export interface IStatusPaa {
    id: string;
    nome: string;
}

export interface ITabelaPaaResponse {
    periodos: IPeriodoPaa[];
    unidades: IUnidadePaa[];
    tipos_unidade: ITipoUnidadePaa[];
    status: IStatusPaa[];
}

export interface IPaaPeriodo {
    uuid: string;
    id: number;
    referencia: string;
    data_inicial: string;
    data_final: string;
    ano_inicial_final: string;
}

export interface IPaaUnidade {
    uuid: string | null;
    unidade_educacional: string;
    codigo_eol: string;
    nome: string;
    tipo_unidade: string;
}

export interface IPaaItem {
    uuid: string | null;
    periodo_paa: IPaaPeriodo;
    unidade: IPaaUnidade;
    saldo_congelado_em: string | null;
    status: string;
    status_display: string;
    tem_documentos: boolean;
}

export interface IPaaLinks {
    next: string | null;
    previous: string | null;
}

export interface IPaaResponse {
    links: IPaaLinks;
    count: number;
    page: number;
    page_size: number;
    total_pages: number;
    results: IPaaItem[];
}

export interface IPaaQueryParams {
    periodo: string;
    unidade: string;
    tipo_unidade: string;
    status: string;
    page: number;
    page_size: number;
}

// Visualizar Documentos
export interface IStatusDocumentoPaa {
    status_geracao: string;
    mensagem: string;
    cor_mensagem: string;
    versao_documento: number;
    retificacao: boolean;
}

export interface IDocumentoPaa {
    uuid: string | null;
    existe_arquivo: boolean;
    status: IStatusDocumentoPaa;
    url: string;
}
export interface IAtaPaa {
    uuid: string | null;
    existe_arquivo: boolean;
    status: IStatusDocumentoPaa;
    justificativa: string;
    pode_gerar_ata: boolean;
    apresenta_botoes_acao: boolean;
    url: string;
    resumo_assembleia: string;
}
export interface IBlocoDocumentosPaa {
    documento: IDocumentoPaa;
    ata: IAtaPaa;
}
export interface IUnidadeVisualizacaoPaa {
    nome: string;
    tipo: string;
    codigo_eol: number;
}
export interface IVigentePaa {
    uuid: string;
    referencia: string;
    pode_retificar: boolean;
    esta_em_retificacao: boolean;
    unidade: IUnidadeVisualizacaoPaa;
    original: IBlocoDocumentosPaa;
    retificacao: IBlocoDocumentosPaa;
}
export interface IVisualizarDocumentosPaaResponse {
    vigente: IVigentePaa;
}

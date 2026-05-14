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

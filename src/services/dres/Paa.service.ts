import api from '../api/index.js';
import { TOKEN_ALIAS } from '../auth.service.js';
import { visoesService } from '../visoes.service.js';
import {
    IPaaQueryParams,
    IPaaResponse,
    ITabelaPaaResponse,
    IVisualizarDocumentosPaaResponse,
} from '../../interface/dre/Paa/paa.interface';

const authHeader = (uuidRecursoSelecionado?: string) => ({
    headers: {
        Authorization: `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json',
        'x-recurso-selecionado': uuidRecursoSelecionado,
    },
});

export const getTabelaPaaDre = async (
    uuidRecursoSelecionado?: string,
): Promise<ITabelaPaaResponse> => {
    const dreUuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid');

    const { data } = await api.get<ITabelaPaaResponse>(
        `/api/paa-dre/${dreUuid}/tabelas/`,
        authHeader(uuidRecursoSelecionado),
    );

    return data;
};

export const getPaaPorDre = async (
    campos: IPaaQueryParams,
    uuidRecursoSelecionado?: string,
): Promise<IPaaResponse> => {
    const dreUuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid');

    const config = {
        ...authHeader(uuidRecursoSelecionado),
        params: campos,
    };

    const { data } = await api.get<IPaaResponse>(`/api/paa-dre/${dreUuid}/`, config);

    return data;
};

export const getVisualizarDocumentosPaa = async (
    uuidDre: string,
    uuidRecursoSelecionado?: string,
): Promise<IVisualizarDocumentosPaaResponse> => {
    const config = {
        ...authHeader(uuidRecursoSelecionado),
    };

    const { data } = await api.get<IVisualizarDocumentosPaaResponse>(
        `/api/paa-dre/${uuidDre}/visualizar-documentos-paa/`,
        config,
    );

    return data;
};

import api from './api';
import {TOKEN_ALIAS} from "./auth.service";

const authHeader = ()=>({
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
});

export const getMandatos = async (filter, currentPage) => {
    const {referencia} = filter;
    return (await api.get(`/api/mandatos/`,{
        ...authHeader(),
        params: {
            referencia: referencia,
            page: currentPage,
        }
    })).data
}

export const postMandato = async (payload) => {
    return (await api.post(`api/mandatos/`, {
            ...payload
        },
        authHeader(),
    ))
};

export const patchMandato = async (uuidMandato, payload) => {
    return (await api.patch(`api/mandatos/${uuidMandato}/`, {
            ...payload
        },
        authHeader(),
    ))
};

export const deleteMandato = async (uuidMandato) => {
    return (await api.delete(`api/mandatos/${uuidMandato}/`, authHeader()))
};

export const getMandatoVigente = async (associacao_uuid) => {
    return (await api.get(`/api/mandatos/mandato-vigente/`,{
        ...authHeader(),
        params: {
            associacao_uuid: associacao_uuid,
        }
    })).data
}

export const getCargosDaComposicao = async (composicao_uuid) => {
    return (await api.get(`/api/cargos-composicao/cargos-da-composicao/`,{
        ...authHeader(),
        params: {
            composicao_uuid: composicao_uuid,
        }
    })).data
}

export const getComposicao = async (composicao_uuid) => {
    return (await api.get(`/api/composicoes/${composicao_uuid}/`,{
        ...authHeader(),
    })).data
}

export const getCargosComposicaoData = async (data, associacao_uuid) => {
    return (await api.get(`/api/cargos-composicao/composicao-por-data/?data=${data}&associacao_uuid=${associacao_uuid}`,{
        ...authHeader(),
    })).data
}

export const getMandatosAnteriores = async () => {
    return (await api.get(`/api/mandatos/mandatos-anteriores/`,{
        ...authHeader(),
    })).data
}

export const getMandatoAnterior = async (mandato_uuid, associacao_uuid) => {
    return (await api.get(`/api/mandatos/${mandato_uuid}/mandato-anterior/`,{
        ...authHeader(),
        params: {
            associacao_uuid: associacao_uuid,
        }
    })).data
}

export const getMandatoMaisRecente = async () => {
    return (await api.get(`/api/mandatos/mandato-mais-recente/`,{
        ...authHeader(),
    })).data
}

export const postCargoComposicao = async (payload) => {
    return (await api.post(`api/cargos-composicao/`, {
            ...payload
        },
        authHeader(),
    ))
};

export const putCargoComposicao = async (uuidCargoComposicao, payload) => {
    return (await api.put(`api/cargos-composicao/${uuidCargoComposicao}/`, {
            ...payload
        },
        authHeader(),
    ))
};

export const consultarCodEolNoSmeIntegracao = async (cod_eol) => {
    return (await api.get(`/api/ocupantes-cargos/codigo-identificacao/?codigo-eol=${cod_eol}`, authHeader()))
};

export const consultarRFNoSmeIntegracao = async (rf) => {
    return (await api.get(`/api/ocupantes-cargos/codigo-identificacao/?rf=${rf}`, authHeader()))
};

export const getCargosDoRFSmeIntegracao = async (rf) => {
    return (await api.get(`/api/ocupantes-cargos/cargos-do-rf/?rf=${rf}`, authHeader()))
};

export const getCargosDaDiretoriaExecutiva = async () => {
    return (await api.get(`/api/cargos-composicao/cargos-diretoria-executiva/`,{
        ...authHeader(),
    })).data
}
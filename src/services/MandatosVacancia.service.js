import api from './api';
import {TOKEN_ALIAS} from "./auth.service";

const authHeader = ()=>({
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
});

const BASE_URL = '/api/cargos-composicao-vacancia';

export const getMandatoVigente = async () => {
    return (await api.get(`/api/mandatos-vacancia/mandato-vigente/`,{
        ...authHeader(),
    })).data
}

export const getMandatosAnterioresVacancia = async () => {
    return (await api.get(`/api/mandatos-vacancia/mandatos-anteriores/`, {
        ...authHeader(),
    })).data
}

export const getComposicaoVigenteVacancia = async (associacao_uuid, mandato_uuid) => {
    return (await api.get(`${BASE_URL}/composicao-vigente/`, {
        ...authHeader(),
        params: {
            associacao_uuid: associacao_uuid,
            mandato_uuid: mandato_uuid
        }
    })).data
}

export const getCargosComposicaoVacanciaPorData = async (composicao_uuid, data) => {
    return (await api.get(`${BASE_URL}/composicao-por-data/`,
    {
        ...authHeader(),
        params: {
            composicao_uuid: composicao_uuid,
            data: data,
        }        
    })).data
}

export const getTimelineCargoComposicaoVacancia = async (composicao_uuid, cargo_associacao) => {
    return (await api.get(`${BASE_URL}/timeline/`, {
        ...authHeader(),
        params: {
            composicao_uuid: composicao_uuid,
            cargo_associacao_uuid: cargo_associacao
        }
    })).data
}

export const postCargoComposicaoVacancia = async (payload) => {
    return (await api.post(`${BASE_URL}/`, {
            ...payload
        },
        authHeader(),
    ))
}

export const postRegistrarSaidaCargoComposicaoVacancia = async (uuid, data_saida) => {
    return (await api.post(`${BASE_URL}/${uuid}/registrar-saida/`, {
            data_saida: data_saida
        },
        authHeader(),
    ))
}

export const patchCancelarSaidaCargoComposicaoVacancia = async (uuid) => {
    return (await api.patch(`${BASE_URL}/${uuid}/cancelar-saida/`, {}, authHeader()))
}

export const patchCorrigirSaidaCargoComposicaoVacancia = async (uuid, data_saida) => {
    return (await api.patch(`${BASE_URL}/${uuid}/corrigir-saida/`, {
            data_saida: data_saida
        },
        authHeader(),
    ))
}

export const getCargosDaComposicaoVacancia = async (composicao_uuid, data) => {
    return (await api.get(`${BASE_URL}/cargos-da-composicao/`, {
        ...authHeader(),
        params: {
            composicao_uuid: composicao_uuid,
            data: data
        }
    })).data
}

export const getDatasDeAlteracaoDaComposicaoVacancia = async (composicao_uuid) => {
    return (await api.get(`${BASE_URL}/datas-de-alteracao/`, {
        ...authHeader(),
        params: {
            composicao_uuid: composicao_uuid
        }
    })).data
}

export const patchEditarOcupanteCargoComposicaoVacancia = async (uuid, payload) => {
    return (await api.patch(`${BASE_URL}/${uuid}/`, {
            ...payload
        },
        authHeader(),
    ))
}

export const consultarCodEolNoSmeIntegracao = async (cod_eol) => {
    return (await api.get(`/api/ocupantes-cargos-vacancia/codigo-identificacao/?codigo-eol=${cod_eol}`, authHeader()))
};

export const consultarRFNoSmeIntegracao = async (rf) => {
    return (await api.get(`/api/ocupantes-cargos-vacancia/codigo-identificacao/?rf=${rf}`, authHeader()))
};

export const getCargosDoRFSmeIntegracao = async (rf) => {
    return (await api.get(`/api/ocupantes-cargos-vacancia/cargos-do-rf/?rf=${rf}`, authHeader()))
};

export const patchCancelarEntradaCargoComposicaoVacancia = async (uuid) => {
    return (await api.patch(`${BASE_URL}/${uuid}/cancelar-entrada/`, {}, authHeader()))
}

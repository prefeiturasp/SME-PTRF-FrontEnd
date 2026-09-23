import api from './api';
import {TOKEN_ALIAS} from "./auth.service";

const authHeader = ()=>({
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
});

const BASE_COMPOSICAO_URL = '/api/cargos-composicao-vacancia';
const BASE_MANDATOS_URL = '/api/mandatos-vacancia';
const BASE_OCUPANTES_URL = '/api/ocupantes-cargos-vacancia';


// Endpoints - Mandatos
export const getMandatosVacancia = async (referencia, page) => {
    return (await api.get(`${BASE_MANDATOS_URL}/`, {
        ...authHeader(),
        params: {
            referencia: referencia,
            page: page,
        }
    })).data
}

export const patchMandatoVacancia = async (uuidMandato, payload) => {
    return (await api.patch(`${BASE_MANDATOS_URL}/${uuidMandato}/`, {
            ...payload
        },
        authHeader(),
    )).data
}

export const postMandatoVacancia = async (payload) => {
    return (await api.post(`${BASE_MANDATOS_URL}/`, {
            ...payload
        },
        authHeader(),
    )).data
}

export const deleteMandatoVacancia = async (uuidMandato) => {
    return (await api.delete(`${BASE_MANDATOS_URL}/${uuidMandato}/`, authHeader()))
}

export const getMandatoMaisRecenteVacancia = async () => {
    return (await api.get(`${BASE_MANDATOS_URL}/mandato-mais-recente/`,{
        ...authHeader(),
    })).data
}

export const getMandatoVigente = async () => {
    return (await api.get(`${BASE_MANDATOS_URL}/mandato-vigente/`,{
        ...authHeader(),
    })).data
}

export const getMandatosAnterioresVacancia = async () => {
    return (await api.get(`${BASE_MANDATOS_URL}/mandatos-anteriores/`, {
        ...authHeader(),
    })).data
}


// Endpoints- Cargo Composição
export const getComposicaoVigenteVacancia = async (associacao_uuid, mandato_uuid) => {
    return (await api.get(`${BASE_COMPOSICAO_URL}/composicao-vigente/`, {
        ...authHeader(),
        params: {
            associacao_uuid: associacao_uuid,
            mandato_uuid: mandato_uuid
        }
    })).data
}

export const getCargosComposicaoVacanciaPorData = async (composicao_uuid, data) => {
    return (await api.get(`${BASE_COMPOSICAO_URL}/composicao-por-data/`,
    {
        ...authHeader(),
        params: {
            composicao_uuid: composicao_uuid,
            data: data,
        }        
    })).data
}

export const getTimelineCargoComposicaoVacancia = async (composicao_uuid, cargo_associacao) => {
    return (await api.get(`${BASE_COMPOSICAO_URL}/timeline/`, {
        ...authHeader(),
        params: {
            composicao_uuid: composicao_uuid,
            cargo_associacao_uuid: cargo_associacao
        }
    })).data
}

export const getTimelineConsolidadaComposicaoVacancia = async (composicao_uuid) => {
    return (await api.get(`${BASE_COMPOSICAO_URL}/timeline-consolidada/`, {
        ...authHeader(),
        params: {
            composicao_uuid: composicao_uuid,
        }
    })).data
}

export const postCargoComposicaoVacancia = async (payload) => {
    return (await api.post(`${BASE_COMPOSICAO_URL}/`, {
            ...payload
        },
        authHeader(),
    ))
}

export const postRegistrarSaidaCargoComposicaoVacancia = async (uuid, data_saida) => {
    return (await api.post(`${BASE_COMPOSICAO_URL}/${uuid}/registrar-saida/`, {
            data_saida: data_saida
        },
        authHeader(),
    ))
}

export const patchCancelarSaidaCargoComposicaoVacancia = async (uuid) => {
    return (await api.patch(`${BASE_COMPOSICAO_URL}/${uuid}/cancelar-saida/`, {}, authHeader()))
}

export const patchCorrigirSaidaCargoComposicaoVacancia = async (uuid, data_saida) => {
    return (await api.patch(`${BASE_COMPOSICAO_URL}/${uuid}/corrigir-saida/`, {
            data_saida: data_saida
        },
        authHeader(),
    ))
}

export const getCargosDaComposicaoVacancia = async (composicao_uuid, data) => {
    return (await api.get(`${BASE_COMPOSICAO_URL}/cargos-da-composicao/`, {
        ...authHeader(),
        params: {
            composicao_uuid: composicao_uuid,
            data: data
        }
    })).data
}

export const getDatasDeAlteracaoDaComposicaoVacancia = async (composicao_uuid) => {
    return (await api.get(`${BASE_COMPOSICAO_URL}/datas-de-alteracao/`, {
        ...authHeader(),
        params: {
            composicao_uuid: composicao_uuid
        }
    })).data
}

export const patchEditarOcupanteCargoComposicaoVacancia = async (uuid, payload) => {
    return (await api.patch(`${BASE_COMPOSICAO_URL}/${uuid}/`, {
            ...payload
        },
        authHeader(),
    ))
}
export const patchCancelarEntradaCargoComposicaoVacancia = async (uuid) => {
    return (await api.patch(`${BASE_COMPOSICAO_URL}/${uuid}/cancelar-entrada/`, {}, authHeader()))
}


// Endpoints - Ocupantes do Cargo

export const consultarCodEolNoSmeIntegracao = async (cod_eol) => {
    return (await api.get(`${BASE_OCUPANTES_URL}/codigo-identificacao/?codigo-eol=${cod_eol}`, authHeader()))
};

export const consultarRFNoSmeIntegracao = async (rf) => {
    return (await api.get(`${BASE_OCUPANTES_URL}/codigo-identificacao/?rf=${rf}`, authHeader()))
};

export const getCargosDoRFSmeIntegracao = async (rf) => {
    return (await api.get(`${BASE_OCUPANTES_URL}/cargos-do-rf/?rf=${rf}`, authHeader()))
};

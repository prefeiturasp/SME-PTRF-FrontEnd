import api from '../api'
import {TOKEN_ALIAS} from '../auth.service.js';
import {ASSOCIACAO_UUID} from "../auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getAssociacao = async () => {
    return (await api.get(`api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}`, authHeader)).data
};

export const getAssociacaoByUUID = async (associacaoUUID) => {
    return (await api.get(`api/associacoes/${associacaoUUID}`, authHeader)).data
};


export const alterarAssociacao = async (payload) => {
    return api.put(`api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/`, payload, authHeader).then(response => {
        return response;
    }).catch(error => {
        return error.response;
    });
};

export const getPeriodoFechado = async (data_verificacao) => {
    return (await api.get(`/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/status-periodo/?data=${data_verificacao}`, authHeader)).data
};

export const getMembrosAssociacao = async () => {
    return (await api.get(`/api/membros-associacao/?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`, authHeader)).data
};


export const criarMembroAssociacao = async (payload) => {
    return (await api.post(`api/membros-associacao/`, payload, authHeader))
};

export const editarMembroAssociacao = async (payload, uuid) => {
    return (await api.put(`/api/membros-associacao/${uuid}/?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`, payload, authHeader))
};


export const deleteMembroAssociacao = async (uuid_membro) => {
    return api.delete(`api/membros-associacao/${uuid_membro}/?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`, authHeader).then(response => {
        return response;
    }).catch(error => {
        return error.response;
    });
};

export const getStatusPresidenteAssociacao = async () => {
    return (await api.get(`/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/status-presidente`, authHeader)).data
};

export const patchStatusPresidenteAssociacao = async (associacao_uuid, payload) => {
    return (await api.patch(`/api/associacoes/${associacao_uuid}/update-status-presidente/`, payload, authHeader)).data
};

export const getCargosDaDiretoriaExecutiva = async () => {
    return (await api.get(`/api/membros-associacao/cargos-diretoria-executiva/`, authHeader)).data
};


export const consultarRF = async (rf) => {
    return (await api.get(`/api/membros-associacao/codigo-identificacao/?rf=${rf}&associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`, authHeader))
};

export const consultarListaCargos = async (rf) => {
    return (await api.get(`/api/membros-associacao/lista-cargos/?rf=${rf}`, authHeader))
};

export const consultarCodEol = async (cod_eol) => {
    return (await api.get(`/api/membros-associacao/codigo-identificacao/?codigo-eol=${cod_eol}&associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`, authHeader))
};

export const consultarCpfResponsavel = async (cpf) => {
    return (await api.get(`/api/membros-associacao/cpf-responsavel/?cpf=${cpf}&associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`, authHeader))
};

export const getContas = async () => {
    return (await api.get(`/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/contas/`, authHeader)).data
};

export const salvarContas = async (payload) => {
    return (await api.post(`/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/contas-update/`, payload, authHeader))
};

export const exportarDadosAssociacao = async () => {
    return api
            .get(`/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/exportar`, {
                responseType: 'blob',
                timeout: 30000,
                headers: {
                    'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
                    'Content-Type': 'application/json'
                }
              })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'associacao.xlsx');
                document.body.appendChild(link);
                link.click();
            }).catch(error => {
                return error.response;
            });
};

export const exportarDadosAssociacaoPdf = async () => {
    return api
            .get(`/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/exportar-pdf`, {
                responseType: 'blob',
                timeout: 30000,
                headers: {
                    'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
                    'Content-Type': 'application/json'
                }
              })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'associacao.pdf');
                document.body.appendChild(link);
                link.click();
            }).catch(error => {
                return error.response;
            });
};

export const getPeriodosDePrestacaoDeContasDaAssociacao = async (ignorar_devolvidas) => {
    return (await api.get(`/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/periodos-para-prestacao-de-contas/?ignorar_devolvidas=${ignorar_devolvidas}`, authHeader)).data
};

export const getUsuarios = async () => {
    return (await api.get(`/api/usuarios/?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`, authHeader)).data
};

export const getUsuarioPeloUsername = async (username) => {
    return (await api.get(`/api/usuarios/?username=${username}`, authHeader)).data
};

export const getDataPreenchimentoPreviaAta = async (uuidPeriodo) => {
    return (await api.get(`/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/previa-ata/?periodo_uuid=${uuidPeriodo}`, authHeader)).data
};

export const getTagInformacaoAssociacao = async () => {
    return (await api.get(`api/associacoes/tags-informacoes/`, authHeader)).data
}

export const getStatusCadastroAssociacao = async () => {
    return (await api.get(`api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/status-cadastro/`, authHeader)).data
};
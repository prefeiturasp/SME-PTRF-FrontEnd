import { criarStoragePorUnidade } from './StoragePorUnidade.service';

export const STORAGE_KEY_RECURSO_SELECIONADO_POR_UNIDADE = 'RECURSO_SELECIONADO_POR_UNIDADE';

const {
    getItem: getRecursoSelecionado,
    getItemWithParameters: getRecursoSelecionadoWithParameters,
    setItem: setRecursoSelecionado,
    removeItem: removeRecursoSelecionado,
    deleteStorage: deleteRecursoSelecionadoStorage,
    clearAutomaticallyDataExpired: clearAutomaticallyDataExpiredRecursoSelecionado
} = criarStoragePorUnidade({ storageKey: STORAGE_KEY_RECURSO_SELECIONADO_POR_UNIDADE});

export const recursoSelecionadoStorageService = {
    getRecursoSelecionado,
    getRecursoSelecionadoWithParameters,
    setRecursoSelecionado,
    removeRecursoSelecionado,
    deleteRecursoSelecionadoStorage,
    clearAutomaticallyDataExpiredRecursoSelecionado
};
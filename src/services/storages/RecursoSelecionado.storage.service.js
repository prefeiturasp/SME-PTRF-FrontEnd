import { criarStoragePorUnidade } from './StoragePorUnidade.service';

export const STORAGE_KEY_RECURSO_SELECIONADO_POR_UNIDADE = 'RECURSO_SELECIONADO_POR_UNIDADE';

const {
    getItem: getRecursoSelecionado,
    setItem: setRecursoSelecionado,
    removeItem: removeRecursoSelecionado,
} = criarStoragePorUnidade({ storageKey: STORAGE_KEY_RECURSO_SELECIONADO_POR_UNIDADE});

export const recursoSelecionadoStorageService = {
    getRecursoSelecionado,
    setRecursoSelecionado,
    removeRecursoSelecionado,
};
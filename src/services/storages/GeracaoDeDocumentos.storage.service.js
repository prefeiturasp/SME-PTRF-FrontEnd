import { criarStoragePorRecurso } from './StoragePorRecurso.service';

export const STORAGE_KEY_PERIODO_CONTA_GERACAO_DOCUMENTOS = 'PERIODO_CONTA_GERACAO_DOCUMENTOS';

const isLegadoGeracaoDocumentos = (parsed) => 'periodoPrestacaoDeConta' in parsed;

const {
    getItem: getGeracaoDocumentos,
    setItem: setGeracaoDocumentos,
    removeItem: removeGeracaoDocumentos,
} = criarStoragePorRecurso({ storageKey: STORAGE_KEY_PERIODO_CONTA_GERACAO_DOCUMENTOS, isLegadoFn: isLegadoGeracaoDocumentos });

export const geracaoDocumentosStorageService = {
    getPeriodo: getGeracaoDocumentos,
    setPeriodo: setGeracaoDocumentos,
    removePeriodo: removeGeracaoDocumentos,
};